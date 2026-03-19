const http = require('http');

function testQuestion(question) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({message: question});
        
        const options = {
            hostname: 'localhost',
            port: 3002,
            path: '/api/v1/chat',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve(json.content);
                } catch (e) {
                    reject(e.message);
                }
            });
        });

        req.on('error', e => reject(e.message));
        req.write(data);
        req.end();
    });
}

async function runTests() {
    const questions = [
        '永济桥在哪里',
        '通津桥有什么历史故事',
        '时敏是什么官职',
        '永济桥的建造工艺有哪些'
    ];

    for (const question of questions) {
        console.log('\n========================================');
        console.log('问题:', question);
        console.log('========================================');
        try {
            const answer = await testQuestion(question);
            console.log('AI回复:', answer);
        } catch (e) {
            console.log('错误:', e);
        }
        // 等待2秒再测试下一个
        await new Promise(r => setTimeout(r, 2000));
    }
}

runTests();
