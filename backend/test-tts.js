import fetch from 'node-fetch';

async function testTTS() {
  try {
    const response = await fetch('http://localhost:3002/api/v1/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: '测试' })
    });
    
    const data = await response.json();
    console.log('TTS API响应:', data);
  } catch (error) {
    console.error('测试TTS API失败:', error);
  }
}

testTTS();