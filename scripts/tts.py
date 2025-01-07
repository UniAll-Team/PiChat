from __future__ import annotations

import os
from typing import List
from pathlib import Path

import fire
import dotenv
from loguru import logger
from openai import OpenAI, DefaultHttpxClient


class MarkdownToSpeech:
    """将 Markdown 文件转换为语音"""

    def __init__(self, proxy: str = 'socks5://localhost:1080'):
        dotenv.load_dotenv(override=True)
        self.client = OpenAI(
            api_key=os.environ['OPENAI_API_KEY'],
            http_client=DefaultHttpxClient(proxy=proxy),
        )

    def read_paragraphs(self, md_file: Path):
        """读取markdown文件并按段落分割"""
        content = md_file.read_text()
        return [p.strip() for p in content.split('\n\n') if p.strip()]

    def convert(
        self,
        markdown_file: str | Path,
        output_dir: str | Path | None = None,
        model: str = 'tts-1',
        voice: str = 'alloy',
    ):
        """转换markdown文件为语音文件"""
        # 准备输入文件
        markdown_file = Path(markdown_file).resolve()

        # 准备输出目录
        if output_dir:
            output_path = Path(output_dir).resolve()
        else:
            output_path = markdown_file.with_suffix('')

        output_path.mkdir(parents=True, exist_ok=True)

        # 读取并处理每个段落
        for i, text in enumerate(self.read_paragraphs(markdown_file), 1):
            output_file = output_path / f'{i:03d}.opus'
            print(f'处理第 {i} 段...')

            try:
                with self.client.audio.speech.with_streaming_response.create(
                    model=model,
                    voice=voice,
                    input=text,
                ) as response:
                    response.stream_to_file(str(output_file))
                logger.info(f'已生成: {output_file}')
            except Exception:
                logger.exception('')


if __name__ == '__main__':
    fire.Fire(MarkdownToSpeech().convert)
