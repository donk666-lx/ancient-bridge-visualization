import express from 'express';
import cors from 'cors';
const app = express();
const port = 3002;

// 启用CORS
app.use(cors());
app.use(express.json());

// 智谱AI GLM-4.5 API 配置
const ZHIPU_API_KEY = 'd3cc1bac879e406f8c5cc89b06ec85a5.qjUWAYILzSeOwigE';
const ZHIPU_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

// 聊天API端点
app.post('/api/v1/chat', async (req, res) => {
    const { message } = req.body;
    
    console.log('========================================');
    console.log('收到消息:', message);
    console.log('使用API Key:', ZHIPU_API_KEY.substring(0, 10) + '...');
    console.log('请求时间:', new Date().toISOString());
    
    try {
        const requestBody = {
            model: 'glm-4.5-air',
            messages: [
                {
                    role: 'system',
                    content: '你是一个友好的私人小导游，善于回答各种问题，语气亲切自然。'
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

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        apiKey: ZHIPU_API_KEY ? '已配置' : '未配置',
        model: 'glm-4.5-air'
    });
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
    console.log('API Key:', ZHIPU_API_KEY ? '已配置 (' + ZHIPU_API_KEY.substring(0, 10) + '...)' : '未配置');
    console.log('使用模型: glm-4.5-air');
});
