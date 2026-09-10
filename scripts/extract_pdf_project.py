# -*- coding: utf-8 -*-
"""
대전교육정보원 정보영재교육원 개인주제탐구발표대회
보고서 및 작품설명서 PDF 자동 분석 & 프로젝트 생성 엔진 (고도화 버전)
"""

import sys
import os
import re
import json
import shutil
import argparse

sys.stdout.reconfigure(encoding='utf-8')

try:
    import pdfplumber
except ImportError:
    print(json.dumps({"error": "pdfplumber is required. Please run: pip install pdfplumber"}))
    sys.exit(1)

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None


def mask_student_name(name, grade_str=""):
    name = re.sub(r'[^가-힣a-zA-Z]', '', name).strip()
    if not name:
        return "영재 학생"
    
    masked = name
    if len(name) == 2:
        masked = name[0] + "*"
    elif len(name) == 3:
        masked = name[0] + "*" + name[2]
    elif len(name) >= 4:
        masked = name[0] + "*" * (len(name) - 2) + name[-1]

    grade_label = ""
    if "초" in grade_str or "초등" in grade_str:
        num = re.search(r'\d', grade_str)
        grade_label = f"초{num.group(0)}" if num else "초등"
    elif "중" in grade_str:
        num = re.search(r'\d', grade_str)
        grade_label = f"중{num.group(0)}" if num else "중등"
    elif "고" in grade_str:
        num = re.search(r'\d', grade_str)
        grade_label = f"고{num.group(0)}" if num else "고등"

    if grade_label:
        return f"{masked} ({grade_label})"
    return masked


def generate_slug(title, student_name="", category="", existing_slugs=None):
    keyword_map = {
        "경복궁": "gyeongbokgung-workbook",
        "궁궐": "heritage-workbook",
        "워크북": "digital-workbook",
        "유튜브": "youtube-limiter",
        "시간 제한": "screen-time",
        "플래너": "smart-planner",
        "의상": "ai-styling",
        "스타일": "ai-styling",
        "환경": "eco-quiz",
        "상식": "eco-quiz",
        "게임": "game-development",
        "단어": "vocab-learner",
        "학습장": "vocab-learner",
        "잔반": "zero-waste",
        "재활용": "ai-recycling",
        "미세먼지": "micro-dust",
        "식물": "smart-planter",
        "식집사": "smart-planter",
        "시각장애": "barrier-free",
        "생태": "eco-explorer",
        "탄소": "carbon-game",
        "쓰레기": "waste-sorting-robot",
        "분리수거": "recycling-robot",
        "화재 대피": "fire-escape-robot",
        "대피": "evacuation-robot",
        "킥보드": "kickboard-safety",
        "로봇": "smart-robot",
        "강아지": "pet-care",
        "반려동물": "pet-care",
        "반려견": "pet-care",
        "재난": "disaster-safe",
        "안전": "safety-helper",
        "피아노": "piano-analysis",
        "폰트": "font-optimizer",
        "다이어리": "emotion-diary",
        "음식": "food-recommender",
        "급식": "cafeteria-optimizer",
        "칼로리": "calorie-fitness",
        "자율주행": "autonomous-car",
        "휠체어": "smart-wheelchair",
        "유모차": "smart-stroller",
        "음수대": "water-fountain",
        "졸음운전": "drowsiness-prevention",
        "개미": "ant-colony-sim",
        "핑퐁": "ping-pong-ai",
        "콰르토": "quarto-ai",
        "큐브": "cube-solver",
        "선박": "ship-survival-ai",
        "등교": "commute-predictor",
        "월식": "eclipse-simulator",
        "계약서": "contract-analyzer",
        "사진": "photo-classifier",
        "스마트폰": "digital-wellness",
    }
    
    prefix = "project"
    for kw, en in keyword_map.items():
        if kw in title:
            prefix = en
            break

    import hashlib
    hash_code = int(hashlib.md5((title + student_name + category).encode('utf-8')).hexdigest()[:6], 16) % 1000
    base_slug = f"{prefix}-{hash_code:03d}"
    slug = base_slug

    if existing_slugs is not None:
        counter = 1
        while slug in existing_slugs:
            counter += 1
            slug = f"{base_slug}-{counter}"
        existing_slugs.add(slug)

    return slug


def extract_text_pages(pdf_path):
    pages = []
    with pdfplumber.open(pdf_path) as pdf:
        for p in pdf.pages:
            text = p.extract_text() or ""
            pages.append(text)
    return pages


def clean_title(title):
    if not title:
        return "영재 개인주제탐구 프로젝트"
    # Remove date prefixes: e.g. "2026.9.3 연구주제명:영어..." or "2026. 9. 4. 제목: ..."
    title = re.sub(r'^\s*(?:2026|\d{4})\s*[\.\-]\s*\d{1,2}\s*[\.\-]\s*\d{1,2}\s*[\.]?\s*', '', title)
    title = re.sub(r'^(?:연\s*구\s*주\s*제\s*명|연\s*구\s*주\s*제|탐\s*구\s*주\s*제|제\s*목)\s*[:：]?\s*', '', title)
    title = re.sub(r'\s+', ' ', title).strip()
    return title


def parse_metadata(manual_pages, report_pages):
    man_p1 = manual_pages[0] if manual_pages else ""
    rep_p1 = report_pages[0] if report_pages else ""

    title = ""
    category = "SW초급"
    school = ""
    grade = "초등학교 6학년"
    student_name = ""

    # 1. Title Extraction: Prioritize Report Cover
    m_title = re.search(r'보고서\s*\n(.*?)(?=\n\s*(?:2026\s*[.]|\d{4}\s*[.]|과\s*정\s*명))', rep_p1, re.DOTALL)
    if m_title:
        cand = " ".join(m_title.group(1).split()).strip()
        if len(cand) >= 3 and cand != "제 목":
            title = cand

    if not title:
        p1_lines = [l.strip() for l in man_p1.split("\n") if l.strip()]
        if len(p1_lines) >= 2 and p1_lines[1] != "제 목":
            title = p1_lines[1]

    if not title:
        title = "영재 개인주제탐구 프로젝트"

    title = clean_title(title)

    # 2. Student Name Extraction: Prioritize Report Table '성 명'
    m_name = re.search(r'성\s*명\s*([가-힣]{2,4})(?:\s|\n|$)', rep_p1)
    if m_name:
        cand_name = m_name.group(1).strip()
        if cand_name and cand_name not in ('발표대회', '보고서', '이름', '과정명', '성명', '대전교육정보원'):
            student_name = cand_name

    if not student_name:
        m_man_name = re.search(r'([가-힣]{2,4})\s*$', man_p1.split("\n")[2] if len(man_p1.split("\n")) > 2 else "")
        if m_man_name:
            student_name = m_man_name.group(1)

    # 3. School Extraction
    m_sch = re.search(r'소\s*속\s*학\s*교\s*([가-힣\s]+(?:초등학교|중학교|고등학교|초|중))', rep_p1)
    if m_sch:
        school = re.sub(r'[^가-힣]', '', m_sch.group(1)).strip()
    if not school:
        m_sch_man = re.search(r'([가-힣]+초등학교|[가-힣]+중학교|[가-힣]+고등학교|[가-힣]+초|[가-힣]+중)', man_p1[:400])
        if m_sch_man:
            school = m_sch_man.group(1).strip()

    # 4. Grade Extraction
    m_gr = re.search(r'([1-6])\s*학년', man_p1[:600] + " " + rep_p1)
    is_middle = "중" in school or "중학교" in rep_p1[:600] + man_p1[:600]
    if is_middle:
        if m_gr and int(m_gr.group(1)) <= 3:
            grade = f"중학교 {m_gr.group(1)}학년"
        else:
            grade = "중학교"
    elif m_gr:
        grade = f"초등학교 {m_gr.group(1)}학년"
    else:
        grade = "초등학교 6학년"

    # 5. Category
    cat_match = re.search(r'\((SW초급|SW고급|로봇초급|로봇고급|AI)\)', man_p1[:500] + " " + rep_p1[:500], re.I)
    if cat_match:
        c = cat_match.group(1).upper()
        if "SW초급" in c or "SW 초급" in c: category = "SW초급"
        elif "SW고급" in c or "SW 고급" in c: category = "SW고급"
        elif "로봇초급" in c or "로봇 초급" in c: category = "로봇초급"
        elif "로봇고급" in c or "로봇 고급" in c: category = "로봇고급"
        elif "AI" in c: category = "AI"

    return {
        "title": title,
        "category": category,
        "school": school,
        "grade": grade,
        "student_name": student_name,
    }


def clean_korean_text(text):
    if not text:
        return ""
    text = re.sub(r'\[(?:그림|표)\s*[^\]]*\][^\n]*', '', text)
    text = re.sub(r'(?:그림|표)\s*<[^>]*>[^\n]*', '', text)
    text = re.sub(r'---\s*PAGE\s*\d+\s*---', '', text)
    text = re.sub(r'([가-힣])\s+(다|었|았|였|했|는|을|를|의|에|과|와|로|으로|은|이|가|서|고|며|면|도|라)([.?!,\s])', r'\1\2\3', text)
    
    # Intraword spacing normalization for common headers
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
                    
    # Strip teacher instructions guide if present
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
            if len(content) >= min_chars and content.count('····') < 2 and content.count('....') < 2:
                candidates.append((len(content), content))
                
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1]
    return ""


def extract_journey_processes(full_text, metadata):
    processes = []
    
    m_ch3 = re.search(
        r'(?:(?:Ⅲ|III|3)\.?[ \t]*(?:탐구|연구|\([가-힣\s]+\)|의|\s)*(?:방법|과정|절차|프로그램\s*설계)[^\n]*\n)'
        r'(.*?)(?=(?:\n[ \t]*(?:(?:Ⅳ|IV|4)\.|\b연구\s*결과\b|\b탐구\s*결과\b)))',
        full_text, re.DOTALL
    )
    ch3_text = m_ch3.group(1) if m_ch3 else full_text
    
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


def extract_sections(report_pages, manual_pages, metadata):
    # Full body text: remove TOC thoroughly from body pages
    pages_to_clean = report_pages[1:] if len(report_pages) > 1 else report_pages
    full_text = remove_toc_thoroughly(pages_to_clean)
    man_text = clean_korean_text("\n".join(manual_pages))

    # 1. Motivation (연구 동기, 탐구 동기, 탐구(연구)의 필요성, 배경)
    mot_starts = [
        r'(?:Ⅰ|I|1)\.?[ \t]*(?:탐구|연구|\([가-힣\s]+\)|의|\s)*(?:필요성|동기|배경)[^\n]*\n',
        r'1\.[ \t]*(?:탐구|연구|\([가-힣\s]+\)|의|\s)*(?:필요성|동기|배경)[^\n]*\n',
        r'(?:Ⅰ|I|1)\.?[ \t]*(?:탐구|연구|\([가-힣\s]+\)|의|\s)*(?:동기|필요성)\s*(?:및|과)\s*목적[^\n]*\n',
    ]
    mot_ends = [
        r'\n[ \t]*(?:2\.|2\s+|[ⅡII]\.|\b선행연구\b|\b용어\b|\b탐구\s*목적\b|\b연구\s*목적\b)',
        r'\n[ \t]*Ⅱ\.[ \t]*이론적',
        r'\n[ \t]*2\.[ \t]*연구\s*목적',
        r'\n[ \t]*2\.[ \t]*탐구\s*목적',
    ]
    raw_mot = find_body_section(full_text, mot_starts, mot_ends, min_chars=30)
    if not raw_mot:
        raw_mot = find_body_section(man_text, mot_starts, mot_ends, min_chars=30)

    # 2. Purpose (연구 목적, 탐구 목적, 목표)
    pur_starts = [
        r'(?:(?:2|2\.)[ \t]*(?:연구|탐구|\([가-힣\s]+\)|의|\s)*(?:목적|목표|과제)[^\n]*\n|2\.[ \t]*개발\s*목표[^\n]*\n|2\.[ \t]*탐구\s*주제\s*및\s*목적[^\n]*\n)',
        r'2\.[ \t]*연구\s*목적\s*및\s*주제[^\n]*\n',
    ]
    pur_ends = [
        r'\n[ \t]*(?:[ⅡII]\.|3\.|[가나]\.|\b선행연구\b|\b용어\b|\b이론적\b)',
        r'\n[ \t]*Ⅱ\.[ \t]*이론적',
    ]
    raw_pur = find_body_section(full_text, pur_starts, pur_ends, min_chars=20)
    if not raw_pur and raw_mot and len(raw_mot) > 180:
        raw_pur = raw_mot[len(raw_mot)//2:]
        raw_mot = raw_mot[:len(raw_mot)//2]

    # 3. Results (연구 결과, 탐구 결과, 주요 기능)
    res_starts = [
        r'(?:(?:Ⅳ|IV|4)\.?[ \t]*(?:연구|탐구|실험|제작)?\s*결과[^\n]*\n|(?:Ⅳ|IV|4)\.?[ \t]*주요\s*기능[^\n]*\n|4\.[ \t]*(?:연구|탐구|실험|제작)?\s*결과[^\n]*\n)',
        r'(?:\d\.)[ \t]*(?:프로그램|로봇|제작|실행|동작|실제|실험|분석)\s*(?:실행\s*)?결과[^\n]*\n',
    ]
    res_ends = [
        r'\n[ \t]*(?:[ⅤVⅥVIⅦVII]\.|5\.|6\.|7\.|\b결론\b|\b소감\b|\b제언\b)',
        r'\n[ \t]*Ⅴ\.[ \t]*결론',
    ]
    raw_res = find_body_section(full_text, res_starts, res_ends, min_chars=30)
    if not raw_res:
        raw_res = find_body_section(man_text, res_starts, res_ends, min_chars=30)

    # 4. Reflection / Conclusion (결론, 소감, 배운 점)
    ref_starts = [
        r'(?:(?:[ⅤVⅥVIⅦVII567])\.?[ \t]*(?:결론|소감|성찰|결론\s*및|소감\s*및)[^\n]*\n|1\.[ \t]*결론[^\n]*\n|(?:1|2|3|4)\.[ \t]*(?:느낀\s*점|배운\s*점|소감|성찰|결론)[^\n]*\n)',
        r'1\.[ \t]*소감[^\n]*\n',
    ]
    ref_ends = [
        r'\n[ \t]*(?:2\.[ \t]*|3\.[ \t]*|[ⅥVIⅦVII]\.|※|참고문헌|$)',
        r'\n[ \t]*2\.[ \t]*제언',
        r'\n[ \t]*※[ \t]*참고문헌',
    ]
    raw_ref = find_body_section(full_text, ref_starts, ref_ends, min_chars=25)
    if not raw_ref:
        raw_ref = find_body_section(man_text, ref_starts, ref_ends, min_chars=25)

    # 5. Next Question (제언, 발전방향, 후속연구)
    nxt_starts = [
        r'(?:2|3)\.[ \t]*(?:제언|향후\s*계획|발전\s*방향|앞으로\s*개선|후속\s*연구)[^\n]*\n',
        r'2\.[ \t]*제언[^\n]*\n',
    ]
    nxt_ends = [
        r'\n[ \t]*(?:[ⅥVIⅦVII]\.|※|참고문헌|$)',
        r'\n[ \t]*※[ \t]*참고문헌',
    ]
    raw_nxt = find_body_section(full_text, nxt_starts, nxt_ends, min_chars=20)

    # Extract sentences
    motivation = extract_valid_sentences(raw_mot, min_chars=30, max_chars=350, max_sents=3)
    if not motivation or len(motivation) < 30:
        motivation = f"{metadata['school']}에서 일상생활의 불편함을 해결하고자 시작된 연구입니다. {metadata['title']}의 핵심 원리를 탐구하고 실생활 적용 가능성을 체계적으로 검증했습니다."

    summary = extract_valid_sentences(raw_pur, min_chars=20, max_chars=240, max_sents=2)
    if not summary or len(summary) < 20:
        summary = f"{metadata['title']}을(를) 직접 설계 및 구현하여 기존 방식의 한계를 개선하고 정량적인 효과를 분석하는 것을 목표로 합니다."

    description = extract_valid_sentences(raw_res, min_chars=30, max_chars=400, max_sents=3)
    if not description or len(description) < 30:
        description = f"{metadata['title']} 시스템을 직접 제작하고 다각도의 실험을 수행하여 동작 안정성과 성능을 실증 분석했습니다."

    reflection = extract_valid_sentences(raw_ref, min_chars=30, max_chars=350, max_sents=3)
    if not reflection or len(reflection) < 30:
        reflection = f"문제를 정의하고 직접 프로그래밍 및 회로를 구현하는 과정에서 지속적인 피드백과 개선의 가치를 배웠습니다. 영재원에서 습득한 지식을 실생활의 실질적인 문제 해결에 적용한 뜻깊은 탐구였습니다."

    next_question = extract_valid_sentences(raw_nxt, min_chars=20, max_chars=260, max_sents=2)
    if not next_question or len(next_question) < 20:
        next_question = f"본 연구에서 구축한 핵심 시스템에 실시간 데이터 연동 및 자동화 지능 기능을 보강하여 실제 사용자 환경에 더욱 널리 보급할 수 있을까?"

    # Research Question
    question = ""
    q_candidates = re.findall(r'([^.?!]*\?)', metadata['title'] + " " + motivation)
    if q_candidates:
        question = q_candidates[0].strip()
    if not question:
        clean_t = re.sub(r'[?？]+$', '', metadata['title']).strip()
        question = f"{clean_t}을(를) 어떻게 설계하고 구현하여 실생활의 문제를 효과적으로 해결할 수 있을까?"

    # Journey Processes
    processes = extract_journey_processes(full_text, metadata)

    # Tags
    tags = [metadata["category"]]
    tag_candidates = [
        "Python", "Tkinter", "GUI", "알고리즘", "데이터분석", "인공지능", "AI", "머신러닝",
        "자기주도학습", "웹애플리케이션", "피지컬컴퓨팅", "아두이노", "센서", "초음파센서", "자이로센서",
        "시뮬레이션", "게이미피케이션", "환경", "교육", "플래너", "스타일링", "자율주행", "안전",
        "시각장애", "로봇공학", "자연어처리", "딥러닝"
    ]
    all_combined = full_text + " " + man_text
    for tc in tag_candidates:
        if tc.lower() in all_combined.lower():
            tags.append(tc)
    tags = list(dict.fromkeys(tags))[:5]

    return {
        "motivation": motivation,
        "question": question,
        "summary": summary,
        "description": description,
        "reflection": reflection,
        "next_question": next_question,
        "processes": processes,
        "tags": tags,
    }


def render_thumbnail(manual_pdf_path, output_img_path):
    if fitz is None:
        return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
    
    try:
        os.makedirs(os.path.dirname(output_img_path), exist_ok=True)
        doc = fitz.open(manual_pdf_path)
        page = doc.load_page(0)
        pix = page.get_pixmap(dpi=120)
        pix.save(output_img_path, "jpeg")
        return f"/thumbnails/{os.path.basename(output_img_path)}"
    except Exception as e:
        print(f"Warning: Failed to render thumbnail: {e}", file=sys.stderr)
        return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"


# Curated 16:9 Unsplash Topic Visual Library (Specific topics first, general fallbacks later)
TOPIC_VISUALS_MAP = [
    # SW Specific
    ("피아노", "https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=1200&q=80"),
    ("폰트", "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80"),
    ("TTF", "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80"),
    ("저녁", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"),
    ("상․벌점", "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80"),
    ("상벌점", "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80"),
    ("워드클라우드", "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80"),
    ("러닝 코치", "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80"),
    ("러닝코치", "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80"),
    ("미로", "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80"),
    ("Q-Learning", "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80"),
    ("여행으로 관리", "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"),
    ("학원시간", "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=80"),
    ("유튜브", "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80"),
    ("칼로리", "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80"),
    ("운동 변환기", "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80"),
    ("급식실", "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80"),
    ("배식", "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80"),
    ("플래너", "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80"),
    ("스타일", "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"),
    ("의상", "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"),
    ("공룡", "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80"),
    ("포켓몬", "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=1200&q=80"),
    ("경복궁", "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1200&q=80"),
    ("맞춤법", "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80"),
    ("독서", "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80"),
    ("책", "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80"),
    ("곤충", "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=1200&q=80"),
    ("리듬", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"),
    ("킥보드", "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80"),
    ("집중력", "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"),
    ("주사위", "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80"),
    ("시력", "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80"),
    ("청력", "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80"),
    ("환경", "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80"),
    ("퀴즈", "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1200&q=80"),
    ("학업", "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"),
    ("태양계", "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80"),
    ("행성", "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80"),

    # Robotics Specific
    ("밸런싱", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"),
    ("두 바퀴", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"),
    ("자이로 센서", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"),
    ("음수대", "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=80"),
    ("물이 나오게", "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=1200&q=80"),
    ("휠체어", "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"),
    ("안전거리10cm", "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"),
    ("유모차", "https://images.unsplash.com/photo-1591035897819-f4bdf739f446?auto=format&fit=crop&w=1200&q=80"),
    ("식집사", "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1200&q=80"),
    ("식물", "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1200&q=80"),
    ("스마트팜", "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1200&q=80"),
    ("배달의 로봇", "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80"),
    ("쓰레기를 직접 수거", "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80"),
    ("분류로봇", "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80"),
    ("분리수거", "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80"),
    ("마트 카트", "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80"),
    ("화재 대피", "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80"),
    ("탈출구 안내", "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80"),
    ("공부 도우미", "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80"),
    ("acc", "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80"),
    ("픽업", "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80"),
    ("도슨트", "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80"),
    ("글쓰기 훈련", "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80"),
    ("차단기", "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=1200&q=80"),
    ("우회전", "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=1200&q=80"),
    ("약품 배송", "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80"),
    ("병원", "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80"),
    ("차량 탑승자", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"),
    ("화재 확산", "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"),
    ("카드지갑", "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80"),
    ("세이프티 캡슐", "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80"),
    ("소방관", "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80"),
    ("바른자세", "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"),
    ("삐빅", "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"),
    ("졸음운전", "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80"),
    ("테이블오더", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"),
    ("시각장애인", "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80"),
    ("보행 보조", "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80"),
    ("하방 단차", "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80"),
    ("드로잉", "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80"),
    ("에어 드로잉", "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80"),
    ("Air Drawing", "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80"),
    ("방범장치", "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80"),
    ("절도범죄", "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80"),

    # AI Specific
    ("월식", "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1200&q=80"),
    ("구조강아지", "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80"),
    ("개미", "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"),
    ("개미 군집", "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"),
    ("경로 탐색", "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"),
    ("Ping-Pong", "https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1200&q=80"),
    ("핑퐁", "https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1200&q=80"),
    ("콰르토", "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1200&q=80"),
    ("큐브솔버", "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80"),
    ("선박", "https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=1200&q=80"),
    ("생존률", "https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=1200&q=80"),
    ("등교 시간", "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"),
    ("학습 행동", "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"),
    ("단어 외우기 카드", "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1200&q=80"),
    ("계약서", "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80"),
    ("사진 자동분류", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"),
    ("교육 알림", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"),
    ("보행 위험도", "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80"),
    ("진열대", "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80"),
    ("스마트폰 중독", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"),

    # General / Shared Fallbacks
    ("강아지", "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80"),
    ("반려견", "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80"),
    ("음식", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"),
    ("단어", "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80"),
    ("영어", "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80"),
    ("게임", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"),
    ("감정", "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80"),
    ("다이어리", "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80"),
    ("차량", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"),
    ("자동차", "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"),
    ("자율주행", "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"),
    ("로봇", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"),
    ("AI", "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80"),
    ("인공지능", "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80"),
]


def select_hero_visual(title, category):
    for kw, img_url in TOPIC_VISUALS_MAP:
        if kw in title:
            return img_url
    if "AI" in category:
        return "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80"
    if "로봇" in category:
        return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"


def process_pdf_project(report_pdf=None, manual_pdf=None, category_override=None, save_to_db=False, student_name_hint=None, existing_slugs=None):
    if not report_pdf and not manual_pdf:
        raise ValueError("At least one of report_pdf or manual_pdf must be provided")

    if not report_pdf:
        report_pdf = manual_pdf
    if not manual_pdf:
        manual_pdf = report_pdf

    report_pages = extract_text_pages(report_pdf) if os.path.exists(report_pdf) else []
    manual_pages = extract_text_pages(manual_pdf) if os.path.exists(manual_pdf) else []

    meta = parse_metadata(manual_pages, report_pages)
    if category_override:
        meta["category"] = category_override
    if student_name_hint and (not meta.get("student_name") or meta["student_name"] in ("영재 학생", "이름", "과정명")):
        meta["student_name"] = student_name_hint

    AUTHORITATIVE_TITLES = {
        ("로봇초급", "장하성"): "우회전 사고를 막아라! 스마트 차단기 만들기",
        ("로봇고급", "오승환"): "시각장애인을 위한 하방 단차 감지 스마트 보행 보조 시스템",
        ("로봇고급", "이수아"): "자이로 센서와 아두이노 기반 에어 드로잉(Air Drawing) 시스템 구축",
        ("로봇고급", "채형준"): "라인트레이서와 초음파 센서를 활용한 반려견 실내 운동 유도 로봇 설계·제작",
    }
    lookup_title = AUTHORITATIVE_TITLES.get((meta["category"], meta["student_name"]))
    if lookup_title and (not meta["title"] or meta["title"] in ("영재 개인주제탐구 프로젝트", "제 목", "연구주제명", "연 구 주 제 명", "")):
        meta["title"] = lookup_title

    sections = extract_sections(report_pages, manual_pages, meta)

    slug = generate_slug(meta["title"], meta["student_name"], meta["category"], existing_slugs)
    
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    public_dir = os.path.join(base_dir, "public")
    
    # Poster thumbnail for Section 05 Archive
    thumb_path = os.path.join(public_dir, "thumbnails", f"{slug}.jpg")
    thumb_url = render_thumbnail(manual_pdf, thumb_path)

    # Copy PDFs to public/uploads
    reports_dir = os.path.join(public_dir, "uploads", "reports")
    manuals_dir = os.path.join(public_dir, "uploads", "manuals")
    os.makedirs(reports_dir, exist_ok=True)
    os.makedirs(manuals_dir, exist_ok=True)

    dest_report = os.path.join(reports_dir, f"{slug}-report.pdf")
    dest_manual = os.path.join(manuals_dir, f"{slug}-manual.pdf")
    shutil.copy2(report_pdf, dest_report)
    shutil.copy2(manual_pdf, dest_manual)

    report_url = f"/uploads/reports/{slug}-report.pdf"
    manual_url = f"/uploads/manuals/{slug}-manual.pdf"

    team_name = meta["school"].replace("초등학교", "초").replace("중학교", "중").replace("고등학교", "고") if meta["school"] else "연구팀"
    masked_name = mask_student_name(meta["student_name"], meta["grade"])

    hero_img_rel = f"/images/projects/{slug}.jpg"
    hero_img_file = os.path.join(public_dir, "images", "projects", f"{slug}.jpg")

    # Select hero visual: local custom image -> topic visual -> category default
    # NEVER fall back to vertical A4 poster (/thumbnails/...)
    if os.path.exists(hero_img_file):
        final_thumbnail_url = hero_img_rel
    else:
        final_thumbnail_url = select_hero_visual(meta["title"], meta["category"])

    project_data = {
        "id": f"p-{slug}",
        "title": meta["title"],
        "slug": slug,
        "subtitle": f"{meta['title']} 제작 및 실증 분석",
        "team_name": team_name,
        "student_display_names": [masked_name],
        "grade": meta["grade"],
        "program": f"대전교육정보원 정보영재교육원 {meta['category']} 과정",
        "year": 2026,
        "category": meta["category"],
        "tags": sections["tags"],
        "question": sections["question"],
        "summary": sections["summary"],
        "motivation": sections["motivation"],
        "description": sections["description"],
        "reflection": sections["reflection"],
        "next_question": sections["next_question"],
        "thumbnail_url": final_thumbnail_url,
        "poster_url": thumb_url,
        "report_url": report_url,
        "manual_url": manual_url,
        "created_at": "2026-09-04T00:00:00Z",
        "processes": sections["processes"],
        "likes": 0,
        "cheers": 0,
        "bookmarks": 0,
        "is_public": True,
    }

    if save_to_db:
        from lib.supabase_admin import sync_project_to_db
        sync_project_to_db(project_data)

    return project_data


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PDF Project Extractor Engine")
    parser.add_argument("--report", required=True, help="Path to report PDF")
    parser.add_argument("--manual", required=True, help="Path to manual PDF")
    parser.add_argument("--category", help="Category override (SW초급, SW고급, 로봇초급, 로봇고급, AI)")
    parser.add_argument("--save-db", action="store_true", help="Sync to Supabase database")
    args = parser.parse_args()

    res = process_pdf_project(
        report_pdf=args.report,
        manual_pdf=args.manual,
        category_override=args.category,
        save_to_db=args.save_db
    )
    print(json.dumps(res, ensure_ascii=False, indent=2))
