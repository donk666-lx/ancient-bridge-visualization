// 测试智谱AI API
const ZHIPU_API_KEY = 'd3cc1bac879e406f8c5cc89b06ec85a5.qjUWAYILzSeOwigE';
const ZHIPU_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

async function testAPI() {
    console.log('开始测试智谱AI API...');
    console.log('API Key:', ZHIPU_API_KEY.substring(0, 10) + '...');
    
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
                    content: '你好'
                }
            ],
            max_tokens: 4096,
            temperature: 0.7
        };
        
        console.log('请求体:', JSON.stringify(requestBody, null, 2));
        console.log('请求URL:', `${ZHIPU_BASE_URL}/chat/completions`);
        
        const response = await fetch(`${ZHIPU_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZHIPU_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('响应状态:', response.status);
        console.log('响应状态文本:', response.statusText);
        
        const responseText = await response.text();
        console.log('原始响应:', responseText);
        
        if (!response.ok) {
            console.error('API请求失败:', response.status, responseText);
            return;
        }
        
        const data = JSON.parse(responseText);
        console.log('解析后的数据:', JSON.stringify(data, null, 2));
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            console.log('AI回复:', data.choices[0].message.content);
        }
        
    } catch (error) {
        console.error('测试失败:', error);
        console.error('错误堆栈:', error.stack);
    }
}

testAPI();
