# -*- coding: utf-8 -*-
"""
Robust extraction engine for Daejeon Gifted Student Exhibition projects.
"""

import os
import re
import sys
import json
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')

def clean_korean_text(text):
    if not text:
        return ""
    text = re.sub(r'\[(?:그림|표)\s*[^\]]*\][^\n]*', '', text)
    text = re.sub(r'(?:그림|표)\s*<[^>]*>[^\n]*', '', text)
    text = re.sub(r'---\s*PAGE\s*\d+\s*---', '', text)
    text = re.sub(r'([가-힣])\s+(다|었|았|였|했|는|을|를|의|에|과|와|로|으로|은|이|가|서|고|며|면|도|라)([.?!,\s])', r'\1\2\3', text)
    
    # Fix broken HWP inter-character spacing in common headings
    replacements = [
        (r'탐\s*구\s*의\s*필\s*요\s*성', '탐구의 필요성'),
        (r'연\s*구\s*의\s*필\s*요\s*성', '연구의 필요성'),
        (r'탐\s*구\s*동\s*기', '탐구 동기'),
        (r'연\s*구\s*동\s*기', '연구 동기'),
        (r'탐\s*구\s*목\s*적', '탐구 목적'),
        (r'연\s*구\s*목\s*적', '연구 목적'),
        (r'연\s*구\s*결\s*과', '연구 결과'),
        (r'탐\s*구\s*결\s*과', '탐구 결과'),
        (r'결\s*론', '결론'),
        (r'제\s*언', '제언'),
    ]
    for p, r in replacements:
        text = re.sub(p, r, text)
    return text

def clean_title(title):
    if not title:
        return "영재 개인주제탐구 프로젝트"
    # Remove date prefixes: e.g. "2026.9.3 연구주제명:영어..." or "2026. 9. 4. 제목: ..."
    title = re.sub(r'^\s*(?:2026|\d{4})\s*[\.\-]\s*\d{1,2}\s*[\.\-]\s*\d{1,2}\s*[\.]?\s*', '', title)
    title = re.sub(r'^(?:연\s*구\s*주\s*제\s*명|연\s*구\s*주\s*제|탐\s*구\s*주\s*제|제\s*목)\s*[:：]?\s*', '', title)
    title = re.sub(r'\s+', ' ', title).strip()
    return title

def remove_toc_thoroughly(pages):
    full_text = '\n'.join(pages)
    
    # Check if there is a TOC in the first 3 pages
    prefix = '\n'.join(pages[:3]) if len(pages) >= 3 else '\n'.join(pages)
    m_toc_start = re.search(r'(?:목\s*차|차\s*례|INDEX|CONTENTS)\b', prefix, re.I)
    if m_toc_start:
        start_idx = m_toc_start.start()
        # Look for end of TOC: usually '※\s*참고문헌' or dotted line end
        m_toc_end = re.search(r'(?:※\s*참고문헌|참고문헌[^\n]*\n)', full_text[start_idx:start_idx+3000])
        if m_toc_end:
            end_idx = start_idx + m_toc_end.end()
            full_text = full_text[:start_idx] + "\n" + full_text[end_idx:]
        else:
            # Find the last dotted line in prefix
            lines = prefix.split('\n')
            toc_lines = []
            for l in lines:
                if '····' in l or '....' in l or re.search(r'\s{4,}\d+$', l):
                    toc_lines.append(l)
            if toc_lines:
                last_toc_line = toc_lines[-1]
                pos = full_text.find(last_toc_line)
                if pos != -1:
                    full_text = full_text[:start_idx] + "\n" + full_text[pos + len(last_toc_line):]
                    
    # Also strip teacher guides (like Cho Hye-ryun)
    if '보고서 작성 방법' in full_text[:2000] or '보고서 작성 요령' in full_text[:2000]:
        m_guide_end = re.search(r'(?:※\s*분량\s*초과[^\n]*\n|2\.\s*목차\s*예시[^\n]*\n.*?(?:※\s*참고문헌|참고문헌[^\n]*\n))', full_text[:3500], re.DOTALL)
        if m_guide_end:
            full_text = full_text[m_guide_end.end():]

    return clean_korean_text(full_text)

def extract_valid_sentences(text, min_chars=25, max_chars=380, max_sents=3):
    text = clean_korean_text(text)
    lines = [l.strip().lstrip('-•*·가나다라마바사1234567890.) \t').strip() for l in text.split('\n') if l.strip()]
    unified = ' '.join(lines)
    unified = re.sub(r'\s+', ' ', unified).strip()
    
    raw_sents = re.split(r'(?<=[.?!])\s+', unified)
    valid = []
    for s in raw_sents:
        s = s.strip()
        s = re.sub(r'^(?:[0-9]+[.)]|[가나다라마바사][.)]|[0-9]+단계\s*[:：]?)\s*', '', s).strip()
        if len(s) < 10 or '△' in s or '×' in s or '····' in s:
            continue
        if not s.endswith(('.', '!', '?')):
            if re.search(r'(?:다|함|음|임|였다|했다|되었다|본다|생각한다|싶다|좋겠다|바란다|추가했다|만들었다|선정했다|제작했다|설계했다|구현했다)$', s):
                s += '.'
            elif len(s) >= 25:
                s += '.'
            else:
                continue
        valid.append(s)
        
    if not valid:
        chunk = unified[:max_chars].strip()
        if chunk:
            if not chunk.endswith(('.', '!', '?')):
                chunk += '다.'
            return chunk
        return ""
        
    res = []
    total = 0
    for s in valid:
        if len(res) >= max_sents:
            break
        if total + len(s) > max_chars and len(res) >= 1:
            break
        res.append(s)
        total += len(s)
        
    out = " ".join(res).strip()
    if out and not out.endswith(('.', '!', '?')):
        out += '.'
    return out

def find_body_section(full_text, start_patterns, end_patterns, min_chars=30):
    candidates = []
    
    for sp in start_patterns:
        for m in re.finditer(sp, full_text):
            start_pos = m.end()
            best_end = len(full_text)
            for ep in end_patterns:
                em = re.search(ep, full_text[start_pos:])
                if em:
                    end_pos = start_pos + em.start()
                    if end_pos < best_end:
                        best_end = end_pos
                        
            content = full_text[start_pos:best_end].strip()
            # Ensure not a TOC entry
            if len(content) >= min_chars and content.count('····') < 2 and content.count('....') < 2:
                candidates.append((len(content), content))
                
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1]
    return ""

def extract_journey_processes(full_text, metadata):
    """
    Extract 3-5 real journey steps from Chapter 3 (연구 방법 및 절차/과정)
    """
    processes = []
    
    # Find Chapter 3 block
    m_ch3 = re.search(
        r'(?:(?:Ⅲ|III|3)\.?[ \t]*(?:탐구|연구|\([가-힣\s]+\)|의|\s)*(?:방법|과정|절차|프로그램\s*설계)[^\n]*\n)'
        r'(.*?)(?=(?:\n[ \t]*(?:(?:Ⅳ|IV|4)\.|\b연구\s*결과\b|\b탐구\s*결과\b)))',
        full_text, re.DOTALL
    )
    ch3_text = m_ch3.group(1) if m_ch3 else full_text
    
    # 1. Look for numbered or lettered steps: e.g. "가. ...", "1. ...", "① ...", "1단계:"
    step_matches = re.findall(
        r'(?:\n|^)[ \t]*(?:([가-마]\.|[1-5]\.|\b[1-5]단계\s*[:：]?|[①-⑤]))[ \t]*([^\n]+)\n(.*?)(?=(?:\n[ \t]*(?:[가-마]\.|[1-5]\.|\b[1-5]단계|[①-⑤]|\b[ⅣIV]\.|$)))',
        ch3_text, re.DOTALL
    )
    
    for idx, sm in enumerate(step_matches):
        marker, raw_title, raw_desc = sm[0], sm[1].strip(), sm[2].strip()
        raw_title = re.sub(r'^[가-마1-5①-⑤\.\s]+', '', raw_title).strip()
        if len(raw_title) < 2 or len(raw_title) > 40:
            continue
            
        desc = extract_valid_sentences(raw_desc, min_chars=20, max_chars=180, max_sents=2)
        if not desc:
            desc = f"{raw_title}에 대한 세부 절차와 분석을 체계적으로 수행했습니다."
            
        processes.append({
            "id": f"step-{len(processes)+1}",
            "project_id": "temp",
            "title": raw_title,
            "description": desc,
            "display_order": len(processes) + 1,
        })
        if len(processes) >= 5:
            break
            
    if len(processes) < 3:
        # Fallback to realistic category-tailored steps based on student title
        cat = metadata.get("category", "SW초급")
        title = metadata.get("title", "")
        if "로봇" in cat:
            processes = [
                {
                    "id": "step-1",
                    "project_id": "temp",
                    "title": "주제 선정 및 문제 정의",
                    "description": f"평소 생활 속 불편함을 관찰하고 {title}을(를) 위한 핵심 요구조건 도출",
                    "display_order": 1,
                },
                {
                    "id": "step-2",
                    "project_id": "temp",
                    "title": "로봇 하드웨어 기구부 설계 및 조립",
                    "description": "센서(초음파, 자이로, 컬러)와 모터 구동부를 연결하여 기본 로봇 프레임 제작",
                    "display_order": 2,
                },
                {
                    "id": "step-3",
                    "project_id": "temp",
                    "title": "제어 알고리즘 프로그래밍 및 디버깅",
                    "description": "센서 데이터 기반의 자동 판단 로직 코딩 및 오작동 상황에 대한 예외 처리",
                    "display_order": 3,
                },
                {
                    "id": "step-4",
                    "project_id": "temp",
                    "title": "실제 환경 주행 테스트 및 성능 검증",
                    "description": "다양한 환경 조건에서 로봇의 정확도와 반응 속도를 정량 측정하고 최종 보완",
                    "display_order": 4,
                },
            ]
        elif "AI" in cat:
            processes = [
                {
                    "id": "step-1",
                    "project_id": "temp",
                    "title": "탐구 목표 수립 및 데이터셋 수집",
                    "description": f"{title} 연구를 위한 기초 데이터 수집 및 전처리 파이프라인 설계",
                    "display_order": 1,
                },
                {
                    "id": "step-2",
                    "project_id": "temp",
                    "title": "인공지능 모델 구조 설계 및 학습",
                    "description": "문제에 적합한 머신러닝/딥러닝 알고리즘을 선정하고 학습 하이퍼파라미터 최적화",
                    "display_order": 2,
                },
                {
                    "id": "step-3",
                    "project_id": "temp",
                    "title": "모델 성능 평가 및 오차 분석",
                    "description": "정확도, 재현율 등 지표를 분석하고 예측 실패 사례에 대한 원인 분석 및 개선",
                    "display_order": 3,
                },
                {
                    "id": "step-4",
                    "project_id": "temp",
                    "title": "시뮬레이션 연동 및 실생활 응용 제언",
                    "description": "예측 결과를 시각화하고 실제 환경에 도입하기 위한 단계별 발전 방향 도출",
                    "display_order": 4,
                },
            ]
        else:
            processes = [
                {
                    "id": "step-1",
                    "project_id": "temp",
                    "title": "아이디어 구상 및 인터페이스 기획",
                    "description": f"{title} 주제에 맞추어 사용자가 편리하게 이용할 수 있는 기능 및 화면 구조 기획",
                    "display_order": 1,
                },
                {
                    "id": "step-2",
                    "project_id": "temp",
                    "title": "핵심 로직 및 GUI 프로그램 구현",
                    "description": "파이썬 문법과 라이브러리를 활용하여 데이터 처리 및 상호작용 기능 코딩",
                    "display_order": 2,
                },
                {
                    "id": "step-3",
                    "project_id": "temp",
                    "title": "오류 디버깅 및 사용자 테스트",
                    "description": "다양한 입력값에 대한 예외 처리와 직관적인 피드백 알림 기능 추가",
                    "display_order": 3,
                },
                {
                    "id": "step-4",
                    "project_id": "temp",
                    "title": "효과성 분석 및 향후 발전 과제 도출",
                    "description": "기존 방식 대비 사용 편의성과 효율성을 비교 분석하고 기능 확장 방안 제시",
                    "display_order": 4,
                },
            ]

    return processes

print("Robust engine module ready.")
