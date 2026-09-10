# -*- coding: utf-8 -*-
"""
Test script to develop and verify robust PDF extraction across all 83 projects.
"""

import os
import re
import sys
import json
import pdfplumber

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DOWNLOAD_DIR = r"C:\Users\mello\Downloads\drive-download-20260909T131445Z-1-001"

def clean_korean_text(text):
    if not text:
        return ""
    # Remove figure/table captions, page markers, and dot leaders (TOC)
    text = re.sub(r'\[(?:그림|표)\s*[^\]]*\][^\n]*', '', text)
    text = re.sub(r'(?:그림|표)\s*<[^>]*>[^\n]*', '', text)
    text = re.sub(r'---\s*PAGE\s*\d+\s*---', '', text)
    text = re.sub(r'[·.]{4,}\s*\d+', '', text) # TOC dot leaders like ······· 12
    text = re.sub(r'([가-힣])\s+(다|었|았|였|했|는|을|를|의|에|과|와|로|으로|은|이|가|서|고|며|면|도|라)([.?!,\s])', r'\1\2\3', text)
    return text

def extract_meaningful_sentences(text, min_chars=50, max_chars=350, max_sentences=3):
    text = clean_korean_text(text)
    lines = [l.strip().lstrip('-•*·가나다라마바사1234567890.) \t').strip() for l in text.split('\n') if l.strip()]
    unified = ' '.join(lines)
    unified = re.sub(r'\s+', ' ', unified).strip()
    
    # Split by Korean sentence endings
    raw_sents = re.split(r'(?<=[.?!])\s+', unified)
    valid_sents = []
    
    for s in raw_sents:
        s = s.strip()
        s = re.sub(r'^(?:[0-9]+[.)]|[가나다라마바사][.)]|[0-9]+단계\s*[:：]?)\s*', '', s).strip()
        if len(s) < 10 or '△' in s or '×' in s or '비교 기준' in s or '····' in s:
            continue
        if not s.endswith(('.', '!', '?')):
            if re.search(r'(?:다|함|음|임|였다|했다|되었다|본다|생각한다|싶다|좋겠다|바란다)$', s):
                s += '.'
            elif len(s) > 25:
                s += '.'
            else:
                continue
        valid_sents.append(s)
        
    if not valid_sents:
        # Fallback to chunk
        chunk = unified[:max_chars].strip()
        if chunk:
            if not chunk.endswith(('.', '!', '?')):
                chunk += '다.'
            return chunk
        return ""
        
    res = []
    total = 0
    for s in valid_sents:
        if len(res) >= max_sentences:
            break
        if total + len(s) > max_chars and len(res) >= 1:
            break
        res.append(s)
        total += len(s)
    
    out = " ".join(res).strip()
    if out and not out.endswith(('.', '!', '?')):
        out += '.'
    return out

def test_extract(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        pages = [p.extract_text() or "" for p in pdf.pages]
    
    if not pages:
        return {}
        
    p0 = pages[0]
    
    # Check if page 1 is TOC
    body_start_idx = 1
    if len(pages) > 1 and ("목 차" in pages[1] or "목차" in pages[1] or pages[1].count("····") > 3):
        body_start_idx = 2
        
    body_text = "\n".join(pages[body_start_idx:])
    all_text = "\n".join(pages[1:])
    
    # Motivation patterns:
    # Ⅰ. 연구 동기 및 목적, 1. 연구 동기, 1. 탐구 동기, 1. 연구의 필요성, 1. 탐구의 필요성 등
    mot_text = ""
    # Look for header to next header
    m_mot = re.search(
        r'(?:Ⅰ\.\s*(?:연구|탐구)?\s*(?:의\s*)?(?:필요성|동기|배경)[^\n]*\n|'
        r'1\.\s*(?:연구|탐구)?\s*(?:의\s*)?(?:필요성|동기|배경)[^\n]*\n)'
        r'(.*?)(?=(?:2\.\s*(?:연구|탐구)?\s*목적|Ⅱ\.\s*|1\.\s*선행연구|2\.\s*용어))',
        body_text, re.DOTALL
    )
    if m_mot:
        mot_text = m_mot.group(1)
        
    # If not found or too short, check for combined: Ⅰ. 연구 동기 및 목적
    if not mot_text or len(mot_text.strip()) < 30:
        m_comb = re.search(
            r'(?:Ⅰ\.\s*(?:연구|탐구)\s*(?:의\s*)?(?:동기|필요성)\s*(?:및|과)\s*목적[^\n]*\n|'
            r'1\.\s*(?:연구|탐구)\s*(?:의\s*)?(?:동기|필요성)\s*(?:및|과)\s*목적[^\n]*\n)'
            r'(.*?)(?=(?:Ⅱ\.\s*|2\.\s*선행연구|선행\s*연구))',
            body_text, re.DOTALL
        )
        if m_comb:
            mot_text = m_comb.group(1)
            
    # Purpose patterns
    pur_text = ""
    m_pur = re.search(
        r'(?:2\.\s*(?:연구|탐구)?\s*(?:의\s*)?목적[^\n]*\n|'
        r'2\.\s*개발\s*목표[^\n]*\n|'
        r'2\.\s*탐구\s*주제\s*및\s*목적[^\n]*\n)'
        r'(.*?)(?=(?:Ⅱ\.\s*|3\.\s*|1\.\s*선행연구))',
        body_text, re.DOTALL
    )
    if m_pur:
        pur_text = m_pur.group(1)
    elif mot_text and len(mot_text) > 150:
        # If combined, use latter part for purpose
        pur_text = mot_text[len(mot_text)//2:]

    # Results patterns
    res_text = ""
    m_res = re.search(
        r'(?:Ⅳ\.\s*(?:연구|탐구|실험|제작)?\s*결과[^\n]*\n|'
        r'4\.\s*(?:연구|탐구|실험|제작)?\s*결과[^\n]*\n|'
        r'Ⅳ\.\s*주요\s*기능[^\n]*\n)'
        r'(.*?)(?=(?:Ⅴ\.\s*|5\.\s*|결론|제언))',
        body_text, re.DOTALL
    )
    if m_res:
        res_text = m_res.group(1)

    # Reflection patterns
    ref_text = ""
    m_ref = re.search(
        r'(?:Ⅴ\.\s*결론[^\n]*\n|'
        r'1\.\s*결론[^\n]*\n|'
        r'3\.\s*(?:느낀\s*점|배운\s*점|소감)[^\n]*\n)'
        r'(.*?)(?=(?:2\.\s*제언|3\.\s*|Ⅵ\.\s*|참고문헌|$))',
        body_text, re.DOTALL
    )
    if m_ref:
        ref_text = m_ref.group(1)

    return {
        "motivation": extract_meaningful_sentences(mot_text, min_chars=30, max_chars=350, max_sentences=3),
        "purpose": extract_meaningful_sentences(pur_text, min_chars=20, max_chars=250, max_sentences=2),
        "results": extract_meaningful_sentences(res_text, min_chars=30, max_chars=400, max_sentences=3),
        "reflection": extract_meaningful_sentences(ref_text, min_chars=30, max_chars=350, max_sentences=3),
    }

if __name__ == "__main__":
    test_files = [
        r"변환(SW초급)\변환\보고서\2026년 개인주제탐구발표대회 보고서(sw초급 강려원).pdf",
        r"변환(SW초급)\변환\보고서\2026년 개인주제탐구발표대회 보고서_김재희.pdf",
        r"변환(SW고급)\변환\보고서\2026년 개인주제탐구발표대회 보고서(SW고급 김주원).pdf",
        r"변환(로봇초급)\변환\보고서\2026년 개인주제탐구발표대회 보고서(로봇초급 강윤재).pdf",
        r"변환(로봇고급)\변환\보고서\05 2026년 개인주제탐구발표대회 보고서(로봇고급 김민찬).pdf",
        r"변환(AI)\변환\보고서\2026년 개인주제탐구발표대회 보고서(AI 권지호).pdf",
    ]
    for tf in test_files:
        full = os.path.join(DOWNLOAD_DIR, tf)
        if os.path.exists(full):
            print("==================================================")
            print("File:", os.path.basename(tf))
            res = test_extract(full)
            for k, v in res.items():
                print(f"  [{k}]: {v[:80]}... (len: {len(v)})")
