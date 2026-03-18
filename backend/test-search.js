// 测试智谱AI联网搜索功能
const ZHIPU_API_KEY = 'd3cc1bac879e406f8c5cc89b06ec85a5.qjUWAYILzSeOwigE';
const ZHIPU_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

async function testWebSearch() {
    console.log('测试智谱AI联网搜索功能...');
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
                    content: '今天是几月几号星期几'
                }
            ],
            max_tokens: 4096,
            temperature: 0.7,
            tools: [
                {
                    type: 'web_search',
                    web_search: {
                        enable: true
                    }
                }
            ]
        };

        console.log('请求体:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${ZHIPU_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZHIPU_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('响应状态:', response.status);

        const responseText = await response.text();
        console.log('原始响应:', responseText.substring(0, 2000));

        if (!response.ok) {
            console.error('API请求失败:', response.status, responseText);
            return;
        }

        const data = JSON.parse(responseText);

        if (data.choices && data.choices[0] && data.choices[0].message) {
            console.log('\nAI回复:', data.choices[0].message.content);

            // 检查是否有工具调用
            if (data.choices[0].message.tool_calls) {
                console.log('\n工具调用:', JSON.stringify(data.choices[0].message.tool_calls, null, 2));
            }
        }

    } catch (error) {
        console.error('测试失败:', error);
    }
}

testWebSearch();
