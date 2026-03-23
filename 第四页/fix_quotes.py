#!/usr/bin/env python3
import json

with open('D:/claude/organized/projects/桥梁总结报告/data/bridges_data_100.json', encoding='utf-8') as f:
    content = f.read()

# 替换中文引号为书名号
content = content.replace('"', '『').replace('"', '」')

# 验证JSON
try:
    data = json.loads(content)
    print(f'验证通过！桥梁总数: {len(data["bridges"])}')

    # 保存修复后的文件
    with open('D:/claude/organized/projects/桥梁总结报告/data/bridges_data_100.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('文件已保存')
except json.JSONDecodeError as e:
    print(f'JSON错误: {e}')
    print(f'位置: 行{e.lineno}, 列{e.colno}')
