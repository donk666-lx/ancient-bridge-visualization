#!/usr/bin/env python3
"""
Edge TTS 语音合成脚本 - 优化版，支持分段并行处理
用法: python edge_tts_service.py <text> <voice> <output_file>
"""
import asyncio
import sys
import edge_tts
import re
import os
import json

# 常用中文语音列表
CHINESE_VOICES = {
    'xiaoxiao': 'zh-CN-XiaoxiaoNeural',      # 晓晓 - 年轻女性，活泼
    'xiaoyi': 'zh-CN-XiaoyiNeural',          # 晓伊 - 年轻女性，温柔
    'yunjian': 'zh-CN-YunjianNeural',        # 云健 - 男性，新闻播报
    'yunxi': 'zh-CN-YunxiNeural',            # 云希 - 男性，年轻活泼
    'xiaochen': 'zh-CN-XiaochenNeural',      # 晓晨 - 年轻女性
    'xiaohan': 'zh-CN-XiaohanNeural',        # 晓涵 - 年轻女性
}

def split_text_into_chunks(text, max_length=50):
    """
    将长文本分割成适合TTS的段落
    按句子分割，确保每段不超过最大长度
    """
    # 清理文本
    text = text.strip()
    if not text:
        return []
    
    # 按句子结束符分割
    sentences = re.split(r'([。！？.!?\n])', text)
    
    chunks = []
    current_chunk = ""
    
    for i in range(0, len(sentences), 2):
        sentence = sentences[i]
        # 添加句末标点（如果有）
        if i + 1 < len(sentences):
            sentence += sentences[i + 1]
        
        sentence = sentence.strip()
        if not sentence:
            continue
        
        # 如果当前句子本身就很长，需要进一步分割
        if len(sentence) > max_length:
            # 先保存当前段落
            if current_chunk:
                chunks.append(current_chunk)
                current_chunk = ""
            
            # 按逗号、分号等分割长句子
            sub_sentences = re.split(r'([，；,;])', sentence)
            temp_chunk = ""
            for j in range(0, len(sub_sentences), 2):
                part = sub_sentences[j]
                if j + 1 < len(sub_sentences):
                    part += sub_sentences[j + 1]
                
                if len(temp_chunk) + len(part) < max_length:
                    temp_chunk += part
                else:
                    if temp_chunk:
                        chunks.append(temp_chunk)
                    temp_chunk = part
            
            if temp_chunk:
                current_chunk = temp_chunk
        else:
            # 检查加入当前句子后是否超过最大长度
            if len(current_chunk) + len(sentence) < max_length:
                current_chunk += sentence
            else:
                if current_chunk:
                    chunks.append(current_chunk)
                current_chunk = sentence
    
    # 添加最后一段
    if current_chunk:
        chunks.append(current_chunk)
    
    return chunks

async def generate_single_tts(text, voice, output_file, chunk_index):
    """生成单个TTS段落"""
    try:
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_file)
        return {"index": chunk_index, "file": output_file, "success": True}
    except Exception as e:
        return {"index": chunk_index, "file": output_file, "success": False, "error": str(e)}

async def generate_tts_parallel(text, voice_key='xiaoxiao', output_file='output.mp3', max_concurrent=3):
    """
    并行生成TTS，加速长文本处理
    """
    voice = CHINESE_VOICES.get(voice_key, CHINESE_VOICES['xiaoxiao'])
    
    # 分割文本
    chunks = split_text_into_chunks(text)
    
    if not chunks:
        # 空文本，生成静音
        communicate = edge_tts.Communicate("", voice)
        await communicate.save(output_file)
        return {"file": output_file, "chunks": 0}
    
    if len(chunks) == 1:
        # 只有一段，直接生成
        communicate = edge_tts.Communicate(chunks[0], voice)
        await communicate.save(output_file)
        return {"file": output_file, "chunks": 1}
    
    # 多段文本，并行生成
    temp_files = []
    tasks = []
    
    # 创建临时文件路径
    base_name = output_file.replace('.mp3', '')
    for i, chunk in enumerate(chunks):
        temp_file = f"{base_name}_chunk_{i}.mp3"
        temp_files.append(temp_file)
        task = generate_single_tts(chunk, voice, temp_file, i)
        tasks.append(task)
    
    # 使用信号量限制并发数
    semaphore = asyncio.Semaphore(max_concurrent)
    
    async def run_with_semaphore(task):
        async with semaphore:
            return await task
    
    # 并行执行所有任务
    results = await asyncio.gather(*[run_with_semaphore(t) for t in tasks])
    
    # 检查结果
    failed = [r for r in results if not r["success"]]
    if failed:
        # 清理临时文件
        for temp_file in temp_files:
            try:
                os.remove(temp_file)
            except:
                pass
        raise Exception(f"部分TTS生成失败: {failed}")
    
    # 合并音频文件
    await merge_audio_files(temp_files, output_file)
    
    # 清理临时文件
    for temp_file in temp_files:
        try:
            os.remove(temp_file)
        except:
            pass
    
    return {"file": output_file, "chunks": len(chunks)}

async def merge_audio_files(input_files, output_file):
    """合并多个MP3文件"""
    # 使用 ffmpeg 合并音频
    import subprocess
    
    # 创建文件列表
    list_file = output_file.replace('.mp3', '_list.txt')
    with open(list_file, 'w', encoding='utf-8') as f:
        for input_file in input_files:
            f.write(f"file '{input_file}'\n")
    
    try:
        # 使用 ffmpeg 合并
        cmd = [
            'ffmpeg', '-y', '-f', 'concat', '-safe', '0',
            '-i', list_file,
            '-acodec', 'copy',
            output_file
        ]
        
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            # ffmpeg 失败，使用备用方案：顺序读取并合并
            await merge_audio_files_fallback(input_files, output_file)
    except Exception as e:
        # ffmpeg 不可用，使用备用方案
        await merge_audio_files_fallback(input_files, output_file)
    finally:
        # 清理列表文件
        try:
            os.remove(list_file)
        except:
            pass

async def merge_audio_files_fallback(input_files, output_file):
    """备用方案：直接合并MP3文件"""
    with open(output_file, 'wb') as outfile:
        for input_file in input_files:
            with open(input_file, 'rb') as infile:
                outfile.write(infile.read())

async def text_to_speech(text, voice_key='xiaoxiao', output_file='output.mp3'):
    """使用 edge-tts 生成语音（优化版）"""
    result = await generate_tts_parallel(text, voice_key, output_file)
    print(f"语音已保存: {output_file}, 分段数: {result['chunks']}")

if __name__ == '__main__':
    import json

    # 尝试从stdin读取JSON输入
    try:
        input_data = sys.stdin.read()
        if input_data:
            params = json.loads(input_data)
            text = params.get('text', '')
            voice = params.get('voice', 'xiaoxiao')
            output = params.get('output', 'output.mp3')
        else:
            # 如果没有stdin输入，使用命令行参数（向后兼容）
            if len(sys.argv) < 2:
                print("用法: python edge_tts_service.py <文本> [语音名称] [输出文件]")
                print("或通过stdin传递JSON: {'text': '...', 'voice': 'xiaoxiao', 'output': '...'}")
                print(f"可用语音: {', '.join(CHINESE_VOICES.keys())}")
                sys.exit(1)
            text = sys.argv[1]
            voice = sys.argv[2] if len(sys.argv) > 2 else 'xiaoxiao'
            output = sys.argv[3] if len(sys.argv) > 3 else 'output.mp3'

        # 如果文本是文件路径，从文件读取
        if text.startswith('file:') and os.path.exists(text[5:]):
            with open(text[5:], 'r', encoding='utf-8') as f:
                text = f.read().strip()

        asyncio.run(text_to_speech(text, voice, output))
    except json.JSONDecodeError:
        # JSON解析失败，尝试使用命令行参数
        if len(sys.argv) < 2:
            print("错误: 无法解析JSON输入且没有提供命令行参数")
            sys.exit(1)
        text = sys.argv[1]
        voice = sys.argv[2] if len(sys.argv) > 2 else 'xiaoxiao'
        output = sys.argv[3] if len(sys.argv) > 3 else 'output.mp3'

        # 如果文本是文件路径，从文件读取
        if text.startswith('file:') and os.path.exists(text[5:]):
            with open(text[5:], 'r', encoding='utf-8') as f:
                text = f.read().strip()

        asyncio.run(text_to_speech(text, voice, output))
