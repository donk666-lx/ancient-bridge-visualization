import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('SERVER STARTUP: __filename =', __filename);
console.log('SERVER STARTUP: __dirname =', __dirname);

const app = express();
const port = 3005;

// 启用CORS
app.use(cors());
app.use(express.json());

// 智谱AI GLM-4.5 API 配置
const ZHIPU_API_KEY = 'd3cc1bac879e406f8c5cc89b06ec85a5.qjUWAYILzSeOwigE';
const ZHIPU_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

// 缓存Word文档内容
let bridgeKnowledgeCache = '';
let bridgeKnowledgePlain = '';

// 读取Word文档内容（Markdown格式）
async function loadBridgeKnowledge() {
    try {
        const docPath = join(__dirname, '..', 'knowledge', 'bridge_knowledge.md');
        bridgeKnowledgeCache = await fs.readFile(docPath, 'utf-8');
        // 转换为纯文本（去除Markdown标记）
        bridgeKnowledgePlain = markdownToPlainText(bridgeKnowledgeCache);
        console.log('✅ 桥梁知识库已加载，Markdown长度:', bridgeKnowledgeCache.length, '字符，纯文本长度:', bridgeKnowledgePlain.length, '字符');
    } catch (error) {
        console.error('❌ 加载桥梁知识库失败:', error.message);
        bridgeKnowledgeCache = '';
        bridgeKnowledgePlain = '';
    }
}

// Markdown转纯文本函数
function markdownToPlainText(markdown) {
    return markdown
        // 移除标题标记
        .replace(/^#{1,6}\s+/gm, '')
        // 移除加粗标记
        .replace(/\*\*(.*?)\*\*/g, '$1')
        // 移除斜体标记
        .replace(/\*(.*?)\*/g, '$1')
        // 移除代码标记
        .replace(/`(.*?)`/g, '$1')
        // 移除链接标记，保留文本
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // 移除图片标记
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
        // 移除水平线
        .replace(/^---$/gm, '')
        // 移除列表标记
        .replace(/^[-*+]\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        // 移除引用标记
        .replace(/^>\s*/gm, '')
        // 移除多余的空行
        .replace(/\n{3,}/g, '\n\n')
        // 移除行首行尾空格
        .trim();
}

// 聊天API端点
app.post('/api/v1/chat', async (req, res) => {
    const { message } = req.body;

    console.log('========================================');
    console.log('收到消息:', message);
    console.log('使用API Key:', ZHIPU_API_KEY.substring(0, 10) + '...');
    console.log('请求时间:', new Date().toISOString());

    try {
        // 构建系统提示词，包含桥梁知识库（使用纯文本格式）
        let systemPrompt = '你是一个友好的私人小导游，善于回答各种问题，语气亲切自然。';
        if (bridgeKnowledgePlain) {
            systemPrompt += '\n\n以下是你需要掌握的桥梁知识库，请基于这些内容回答用户关于古代桥梁的问题。回复时请使用自然语言，不要包含Markdown标记：\n\n' + bridgeKnowledgePlain;
        }

        const requestBody = {
            model: 'glm-4.5-air',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 4096,
            temperature: 0.7
        };

        console.log('请求体:', JSON.stringify(requestBody, null, 2));

        // 调用智谱AI GLM-4.5 API
        const response = await fetch(`${ZHIPU_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZHIPU_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('API响应状态:', response.status);
        console.log('API响应状态文本:', response.statusText);

        const responseText = await response.text();
        console.log('API原始响应:', responseText);

        if (!response.ok) {
            console.error('API请求失败:', response.status, responseText);
            return res.json({
                content: `API请求失败 (${response.status}): ${responseText}`,
                emotion: 'sad'
            });
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON解析错误:', parseError);
            return res.json({
                content: '服务器响应格式错误',
                emotion: 'sad'
            });
        }

        console.log('API响应数据:', JSON.stringify(data, null, 2));

        if (data.error) {
            console.error('智谱AI API错误:', data.error);
            return res.json({
                content: `API错误: ${JSON.stringify(data.error)}`,
                emotion: 'sad'
            });
        }

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('API响应格式错误 - 缺少choices:', data);
            return res.json({
                content: 'API响应格式错误: ' + JSON.stringify(data),
                emotion: 'sad'
            });
        }

        const content = data.choices[0].message.content;

        // 简单的情绪分析
        let emotion = 'happy';
        if (content.includes('抱歉') || content.includes('无法') || content.includes('失败')) {
            emotion = 'sad';
        } else if (content.includes('思考') || content.includes('想想')) {
            emotion = 'thinking';
        } else if (content.includes('高兴') || content.includes('开心') || content.includes('好的')) {
            emotion = 'happy';
        }

        console.log('回复内容:', content);
        console.log('情绪:', emotion);
        console.log('========================================');

        res.json({
            content: content,
            emotion: emotion
        });

    } catch (error) {
        console.error('发送消息失败:', error);
        console.error('错误堆栈:', error.stack);
        console.log('========================================');
        res.json({
            content: '抱歉，发送消息失败了 😅 错误: ' + error.message,
            emotion: 'sad'
        });
    }
});

// 流式聊天API端点 - 实时返回AI回复
app.post('/api/v1/chat/stream', async (req, res) => {
    const { message } = req.body;

    console.log('========================================');
    console.log('收到流式消息:', message);
    console.log('请求时间:', new Date().toISOString());

    try {
        // 构建系统提示词，包含桥梁知识库（使用纯文本格式）
        let systemPrompt = '你是一个友好的私人小导游，善于回答各种问题，语气亲切自然。回复要简洁，适合语音朗读。';
        if (bridgeKnowledgePlain) {
            systemPrompt += '\n\n以下是你需要掌握的桥梁知识库，请基于这些内容回答用户关于古代桥梁的问题。回复时请使用自然语言，不要包含Markdown标记：\n\n' + bridgeKnowledgePlain;
        }

        const requestBody = {
            model: 'glm-4.5-air',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 1024,
            temperature: 0.7,
            stream: true  // 启用流式
        };

        // 调用智谱AI流式API
        const response = await fetch(`${ZHIPU_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZHIPU_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API请求失败:', response.status, errorText);
            return res.json({
                content: `API请求失败 (${response.status})`,
                emotion: 'sad'
            });
        }

        // 读取流
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        let buffer = '';

        // 按句子分割的TTS队列
        let sentenceBuffer = '';
        let sentenceQueue = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // 解析SSE数据
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(data);
                        const delta = parsed.choices?.[0]?.delta?.content;
                        if (delta) {
                            fullContent += delta;
                            sentenceBuffer += delta;

                            // 检测句子结束（。！？）
                            if (/[。！？\.!?]/.test(delta)) {
                                const sentence = sentenceBuffer.trim();
                                if (sentence.length > 5) {
                                    sentenceQueue.push(sentence);
                                    sentenceBuffer = '';
                                }
                            }
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            }
        }

        // 处理剩余的buffer
        if (sentenceBuffer.trim()) {
            sentenceQueue.push(sentenceBuffer.trim());
        }

        // 情绪分析
        let emotion = 'happy';
        if (fullContent.includes('抱歉') || fullContent.includes('无法')) {
            emotion = 'sad';
        } else if (fullContent.includes('思考')) {
            emotion = 'thinking';
        }

        console.log('完整回复:', fullContent);
        console.log('句子队列:', sentenceQueue.length, '个');

        res.json({
            content: fullContent,
            emotion: emotion,
            sentences: sentenceQueue  // 返回分句结果，前端可以逐句播放
        });

    } catch (error) {
        console.error('流式请求失败:', error);
        res.json({
            content: '抱歉，请求失败了: ' + error.message,
            emotion: 'sad'
        });
    }
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        apiKey: ZHIPU_API_KEY ? '已配置' : '未配置',
        model: 'glm-4.5-air'
    });
});

// Edge TTS API端点（使用本地 edge-tts 库）
app.post('/api/v1/tts/edge', async (req, res) => {
    const { text, voice = 'xiaoxiao' } = req.body;

    console.log('========================================');
    console.log('收到 Edge TTS 请求:', { text: text?.substring(0, 50) + '...', voice });
    console.log('请求时间:', new Date().toISOString());

    if (!text || text.trim().length === 0) {
        return res.json({ error: '文本不能为空' });
    }

    const outputFile = join(__dirname, `temp_${uuidv4()}.mp3`);
    const textFile = join(__dirname, `temp_text_${uuidv4()}.txt`);
    const pythonScript = join(__dirname, 'edge_tts_service.py');

    console.log('DEBUG: __dirname =', __dirname);
    console.log('DEBUG: pythonScript =', pythonScript);
    console.log('DEBUG: outputFile =', outputFile);
    console.log('DEBUG: textFile =', textFile);

    try {
        // 将文本写入临时文件，避免编码问题
        await fs.writeFile(textFile, text, 'utf8');
        console.log('DEBUG: 文本已写入文件:', textFile);

        // 调用 Python 脚本生成语音 - 通过文件传递文本
        await new Promise((resolve, reject) => {
            // 使用 file: 前缀传递文本文件路径
            const fileRef = 'file:' + textFile;
            const pythonProcess = spawn('python', [pythonScript, fileRef, voice, outputFile], {
                env: {
                    ...process.env,
                    PYTHONIOENCODING: 'utf-8'
                },
                stdio: ['ignore', 'pipe', 'pipe']
            });

            let stdout = '';
            let stderr = '';
            let timeoutId;

            // 设置超时 - 30秒
            const timeout = setTimeout(() => {
                console.error('Python 脚本执行超时 (30s)');
                pythonProcess.kill('SIGTERM');
                reject(new Error('语音合成超时，请检查网络连接'));
            }, 30000);

            pythonProcess.stdout.on('data', (data) => {
                stdout += data.toString('utf8');
                console.log('Python stdout:', data.toString('utf8').trim());
            });

            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString('utf8');
                console.error('Python stderr:', data.toString('utf8').trim());
            });

            pythonProcess.on('close', (code) => {
                clearTimeout(timeout);
                // 删除临时文本文件
                fs.unlink(textFile).catch(err => console.error('删除临时文本文件失败:', err));

                if (code !== 0) {
                    console.error('Python 脚本执行失败，退出码:', code);
                    console.error('stderr:', stderr);
                    reject(new Error(`Python 脚本执行失败: ${stderr || '未知错误'}`));
                    return;
                }
                console.log('Python 输出:', stdout);
                resolve();
            });

            pythonProcess.on('error', (error) => {
                clearTimeout(timeout);
                // 删除临时文本文件
                fs.unlink(textFile).catch(err => console.error('删除临时文本文件失败:', err));
                console.error('Python 进程启动失败:', error);
                reject(new Error(`Python 进程启动失败: ${error.message}`));
            });
        });

        // 读取生成的音频文件
        const audioBuffer = await fs.readFile(outputFile);
        const audioBase64 = audioBuffer.toString('base64');

        // 删除临时文件
        await fs.unlink(outputFile).catch(err => console.error('删除临时文件失败:', err));

        console.log('Edge TTS 成功，音频大小:', audioBase64.length, '字符');
        console.log('========================================');

        res.json({
            audio: audioBase64,
            format: 'mp3',
            voice: voice
        });

    } catch (error) {
        console.error('Edge TTS 失败:', error);
        console.log('========================================');

        // 清理临时文件
        await fs.unlink(outputFile).catch(() => {});

        res.json({
            error: '语音合成失败: ' + error.message
        });
    }
});

// 流式 Edge TTS API端点 - 分段返回，支持边生成边播放
app.post('/api/v1/tts/edge/stream', async (req, res) => {
    const { text, voice = 'xiaoxiao' } = req.body;

    console.log('========================================');
    console.log('收到流式 Edge TTS 请求:', { text: text?.substring(0, 50) + '...', voice });
    console.log('请求时间:', new Date().toISOString());

    if (!text || text.trim().length === 0) {
        return res.json({ error: '文本不能为空' });
    }

    // 导入Python脚本中的分段函数逻辑
    function splitTextIntoChunks(text, maxLength = 50) {
        const sentences = text.split(/([。！？.!?\n])/);
        const chunks = [];
        let currentChunk = "";

        for (let i = 0; i < sentences.length; i += 2) {
            let sentence = sentences[i];
            if (i + 1 < sentences.length) {
                sentence += sentences[i + 1];
            }

            sentence = sentence.trim();
            if (!sentence) continue;

            if (sentence.length > maxLength) {
                if (currentChunk) {
                    chunks.push(currentChunk);
                    currentChunk = "";
                }

                const parts = sentence.split(/([，；,;])/);
                let tempChunk = "";
                for (let j = 0; j < parts.length; j += 2) {
                    let part = parts[j];
                    if (j + 1 < parts.length) {
                        part += parts[j + 1];
                    }

                    if (tempChunk.length + part.length < maxLength) {
                        tempChunk += part;
                    } else {
                        if (tempChunk) chunks.push(tempChunk);
                        tempChunk = part;
                    }
                }

                if (tempChunk) currentChunk = tempChunk;
            } else {
                if (currentChunk.length + sentence.length < maxLength) {
                    currentChunk += sentence;
                } else {
                    if (currentChunk) chunks.push(currentChunk);
                    currentChunk = sentence;
                }
            }
        }

        if (currentChunk) chunks.push(currentChunk);
        return chunks;
    }

    try {
        const chunks = splitTextIntoChunks(text);
        console.log('文本分段:', chunks.length, '段');

        // 设置响应头，支持流式传输
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Transfer-Encoding', 'chunked');

        // 发送总段数信息
        res.write(JSON.stringify({ type: 'info', totalChunks: chunks.length }) + '\n');

        // 串行生成每段音频（避免并发过多）
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const outputFile = `temp_stream_${uuidv4()}.mp3`;

            try {
                // 调用Python生成单段TTS
                await new Promise((resolve, reject) => {
                    const pythonProcess = spawn('python', [
                        join(__dirname, 'edge_tts_service.py'),
                        chunk,
                        voice,
                        outputFile
                    ], {
                        encoding: 'utf8',
                        env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
                        stdio: ['ignore', 'pipe', 'pipe']
                    });

                    pythonProcess.on('close', (code) => {
                        if (code !== 0) {
                            reject(new Error(`Python 脚本执行失败，退出码: ${code}`));
                        } else {
                            resolve();
                        }
                    });
                });

                // 读取音频文件
                const audioBuffer = await fs.readFile(outputFile);
                const audioBase64 = audioBuffer.toString('base64');

                // 删除临时文件
                await fs.unlink(outputFile).catch(() => {});

                // 发送音频段
                res.write(JSON.stringify({
                    type: 'chunk',
                    index: i,
                    total: chunks.length,
                    audio: audioBase64,
                    text: chunk
                }) + '\n');

                console.log(`第 ${i + 1}/${chunks.length} 段 TTS 完成`);

            } catch (error) {
                console.error(`第 ${i + 1} 段 TTS 失败:`, error);
                res.write(JSON.stringify({
                    type: 'error',
                    index: i,
                    message: error.message
                }) + '\n');
            }
        }

        // 发送完成信号
        res.write(JSON.stringify({ type: 'done' }) + '\n');
        res.end();

        console.log('流式 TTS 完成');
        console.log('========================================');

    } catch (error) {
        console.error('流式 TTS 失败:', error);
        res.write(JSON.stringify({ type: 'error', message: error.message }) + '\n');
        res.end();
    }
});

// 启动服务器
async function startServer() {
    // 先加载桥梁知识库
    await loadBridgeKnowledge();

    app.listen(port, () => {
        console.log(`服务器运行在 http://localhost:${port}`);
        console.log('API Key:', ZHIPU_API_KEY ? '已配置 (' + ZHIPU_API_KEY.substring(0, 10) + '...)' : '未配置');
        console.log('使用模型: glm-4.5-air');
        console.log('Edge TTS: 已配置 (Python)');
        console.log('流式TTS: 已启用 /api/v1/tts/edge/stream');
    });
}

startServer();
