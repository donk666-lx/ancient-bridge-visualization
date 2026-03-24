import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fetch from 'node-fetch';
import WebSocket from 'ws';
import { execFile, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3002;

// 启用CORS
app.use(cors());
app.use(express.json());

// 智谱AI GLM-4.5 API 配置
const ZHIPU_API_KEY = 'd3cc1bac879e406f8c5cc89b06ec85a5.qjUWAYILzSeOwigE';
const ZHIPU_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

// 讯飞TTS API 配置
const XUNFEI_APPID = '30de284a';
const XUNFEI_API_KEY = 'f5330e8b08d8b80908d0f5773e24b40';
const XUNFEI_API_SECRET = 'ZQ2M3D7ciaf0a661a719ub22b67';
const XUNFEI_TTS_URL = 'wss://tts-api.xfyun.cn/v2/tts';

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
        let isProcessingTTS = false;
        
        // 处理句子TTS
        async function processSentenceTTS() {
            if (isProcessingTTS || sentenceQueue.length === 0) return;
            
            isProcessingTTS = true;
            const sentence = sentenceQueue.shift();
            
            try {
                // 调用Edge TTS
                const timestamp = Math.floor(Date.now() / 1000);
                const date = new Date(timestamp * 1000).toUTCString();
                
                const signatureOrigin = `host: tts-api.xfyun.cn\ndate: ${date}\nGET /v2/tts HTTP/1.1`;
                const signatureSha = crypto.createHmac('sha256', XUNFEI_API_SECRET)
                    .update(signatureOrigin)
                    .digest('base64');
                const authorizationOrigin = `api_key="${XUNFEI_API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`;
                const authorization = Buffer.from(authorizationOrigin).toString('base64');
                
                // 这里简化处理，实际应该等完整回复后再批量TTS
                // 流式场景下，建议前端用Web Speech API实时读
                
            } catch (error) {
                console.error('TTS处理错误:', error);
            }
            
            isProcessingTTS = false;
            processSentenceTTS();
        }
        
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
                            if (/[。！？\.\!\?]/.test(delta)) {
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

// 讯飞TTS API端点
app.post('/api/v1/tts', async (req, res) => {
    const { text, voice_name = 'x4_xiaoyan', speed = 50, volume = 50, pitch = 50, format = 'mp3' } = req.body;
    
    console.log('========================================');
    console.log('收到TTS请求:', { text, voice_name, speed, volume, pitch, format });
    console.log('请求时间:', new Date().toISOString());
    
    try {
        // 生成签名
        const timestamp = Math.floor(Date.now() / 1000);
        const date = new Date(timestamp * 1000).toUTCString();
        
        // 1. 生成signature_origin
        const signatureOrigin = `host: tts-api.xfyun.cn\ndate: ${date}\nGET /v2/tts HTTP/1.1`;
        
        // 2. 使用hmac-sha256算法结合apiSecret对signature_origin签名
        const signatureSha = crypto.createHmac('sha256', XUNFEI_API_SECRET)
            .update(signatureOrigin)
            .digest('base64');
        
        // 3. 拼接authorization_origin
        const authorizationOrigin = `api_key="${XUNFEI_API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`;
        
        // 4. 对authorization_origin进行base64编码
        const authorization = Buffer.from(authorizationOrigin).toString('base64');
        
        console.log('签名生成详情:');
        console.log('date:', date);
        console.log('signatureOrigin:', signatureOrigin);
        console.log('signatureSha:', signatureSha);
        console.log('authorizationOrigin:', authorizationOrigin);
        console.log('authorization:', authorization);
        
        // 构建WebSocket连接URL
        const wsUrl = `${XUNFEI_TTS_URL}?host=tts-api.xfyun.cn&date=${encodeURIComponent(date)}&authorization=${encodeURIComponent(authorization)}`;
        
        console.log('WebSocket连接URL:', wsUrl);
        
        // 使用WebSocket与讯飞TTS服务交互
        const ws = new WebSocket(wsUrl);
        
        let audioData = '';
        let isComplete = false;
        let responseSent = false;
        
        ws.on('open', () => {
            console.log('WebSocket连接已建立');
            
            // 构建请求数据
            const requestData = {
                common: {
                    app_id: XUNFEI_APPID
                },
                business: {
                    aue: format === 'mp3' ? 'lame' : format,
                    sfl: format === 'mp3' ? 1 : 0,
                    auf: 'audio/L16;rate=16000',
                    vcn: voice_name,
                    speed: speed,
                    volume: volume,
                    pitch: pitch,
                    engine_type: 'aisound'
                },
                data: {
                    text: Buffer.from(text).toString('base64'),
                    status: 2
                }
            };
            
            console.log('发送TTS请求数据');
            ws.send(JSON.stringify(requestData));
        });
        
        ws.on('message', (message) => {
            const data = JSON.parse(message);
            console.log('收到TTS响应:', JSON.stringify(data, null, 2));
            
            if (data.code !== 0) {
                console.error('讯飞TTS API错误:', data.message);
                if (!responseSent) {
                    responseSent = true;
                    ws.close();
                    return res.json({
                        error: `TTS API错误: ${data.message}`
                    });
                }
                return;
            }
            
            if (data.data && data.data.audio) {
                audioData += data.data.audio;
            }
            
            if (data.data && data.data.status === 2) {
                isComplete = true;
                ws.close();
            }
        });
        
        ws.on('close', () => {
            console.log('WebSocket连接已关闭');
            
            if (!responseSent) {
                if (isComplete && audioData) {
                    console.log('TTS请求成功，音频数据长度:', audioData.length);
                    console.log('========================================');
                    
                    responseSent = true;
                    res.json({
                        audio: audioData,
                        format: format
                    });
                } else {
                    console.error('TTS请求未完成');
                    responseSent = true;
                    res.json({
                        error: 'TTS请求未完成'
                    });
                }
            }
        });
        
        ws.on('error', (error) => {
            console.error('WebSocket错误:', error);
            console.log('========================================');
            if (!responseSent) {
                responseSent = true;
                res.json({
                    error: 'WebSocket连接失败: ' + error.message
                });
            }
        });
        
    } catch (error) {
        console.error('TTS请求失败:', error);
        console.error('错误堆栈:', error.stack);
        console.log('========================================');
        res.json({
            error: '抱歉，TTS请求失败了 😅 错误: ' + error.message
        });
    }
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
    
    const outputFile = `temp_${uuidv4()}.mp3`;
    const pythonScript = join(__dirname, 'edge_tts_service.py');
    
    try {
        // 调用 Python 脚本生成语音
        await new Promise((resolve, reject) => {
            // 使用 spawn 调用 Python 脚本
            const pythonProcess = spawn('python', [pythonScript, text, voice, outputFile], {
                encoding: 'utf8',
                env: {
                    ...process.env,
                    PYTHONIOENCODING: 'utf-8'
                }
            });
            
            let stdout = '';
            let stderr = '';
            
            pythonProcess.stdout.on('data', (data) => {
                stdout += data;
            });
            
            pythonProcess.stderr.on('data', (data) => {
                stderr += data;
            });
            
            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error('Python 脚本执行失败，退出码:', code);
                    console.error('stderr:', stderr);
                    reject(new Error(`Python 脚本执行失败: ${stderr}`));
                    return;
                }
                console.log('Python 输出:', stdout);
                resolve();
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
                        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
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
        console.log('讯飞TTS API:', XUNFEI_APPID ? '已配置' : '未配置');
        console.log('Edge TTS: 已配置 (Python)');
        console.log('流式TTS: 已启用 /api/v1/tts/edge/stream');
    });
}

startServer();