#!/usr/bin/env python3
"""
Edge TTS 语音合成脚本
用法: python edge_tts_service.py <text> <voice> <output_file>
"""
import asyncio
import sys
import edge_tts

# 常用中文语音列表
CHINESE_VOICES = {
    'xiaoxiao': 'zh-CN-XiaoxiaoNeural',      # 晓晓 - 年轻女性，活泼
    'xiaoyi': 'zh-CN-XiaoyiNeural',          # 晓伊 - 年轻女性，温柔
    'yunjian': 'zh-CN-YunjianNeural',        # 云健 - 男性，新闻播报
    'yunxi': 'zh-CN-YunxiNeural',            # 云希 - 男性，年轻活泼
    'xiaochen': 'zh-CN-XiaochenNeural',      # 晓晨 - 年轻女性
    'xiaohan': 'zh-CN-XiaohanNeural',        # 晓涵 - 年轻女性
}

async def text_to_speech(text, voice_key='xiaoxiao', output_file='output.mp3'):
    """使用 edge-tts 生成语音"""
    voice = CHINESE_VOICES.get(voice_key, CHINESE_VOICES['xiaoxiao'])
    
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)
    print(f"语音已保存: {output_file}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("用法: python edge_tts_service.py <文本> [语音名称] [输出文件]")
        print(f"可用语音: {', '.join(CHINESE_VOICES.keys())}")
        sys.exit(1)
    
    text = sys.argv[1]
    voice = sys.argv[2] if len(sys.argv) > 2 else 'xiaoxiao'
    output = sys.argv[3] if len(sys.argv) > 3 else 'output.mp3'
    
    asyncio.run(text_to_speech(text, voice, output))
