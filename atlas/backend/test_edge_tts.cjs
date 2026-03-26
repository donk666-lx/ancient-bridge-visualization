const http = require('http');

const testData = JSON.stringify({
    text: '测试语音合成',
    voice: 'xiaoxiao'
});

const options = {
    hostname: 'localhost',
    port: 3005,
    path: '/api/v1/tts/edge',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const result = JSON.parse(data);
            if (result.audio) {
                console.log('✅ Edge TTS 测试成功！');
                console.log('音频大小:', result.audio.length, '字符');
                console.log('音频格式:', result.format);
            } else if (result.error) {
                console.log('❌ Edge TTS 失败:', result.error);
            } else {
                console.log('⚠️ 未知响应:', result);
            }
        } catch (e) {
            console.log('❌ 解析响应失败:', e.message);
            console.log('原始响应:', data.substring(0, 200));
        }
    });
});

req.on('error', (e) => {
    console.log('❌ 请求失败:', e.message);
});

req.write(testData);
req.end();
