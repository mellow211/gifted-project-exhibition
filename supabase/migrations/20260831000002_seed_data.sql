-- Seed 8 Initial Projects


INSERT INTO public.projects (
  title, slug, subtitle, team_name, student_display_names, grade, program, year,
  category, tags, question, summary, motivation, description, reflection, next_question,
  thumbnail_url, report_pdf_url, presentation_pdf_url, presentation_original_url,
  video_url, external_project_url, featured, published, display_order, badge, created_at, updated_at
) VALUES (
  'AI 다중 센서 분리수거 도우미: 딥러닝 기반 재활용 분류 로봇', 'ai-recycling-assistant', '복합 재질 쓰레기를 이미지와 초음파 센서로 정확하게 분류할 수 없을까?', 'GreenVision',
  ARRAY['김*우 (중2)','박*진 (중2)','이*현 (중3)']::text[], '중학교 2-3학년', '인공지능 & 융합과학 심화과정', 2026,
  'AI & DATA', ARRAY['컴퓨터비전','YOLOv8','환경공학','엣지컴퓨팅']::text[], '투명 페트병과 라벨이 붙은 페트병, 그리고 이물질이 묻은 플라스틱을 인공지능이 0.5초 안에 정확히 구별해 자동 분류할 수 있을까?', '경량화 YOLOv8 모델과 마이크로컨트롤러를 결합하여 복합 재질 플라스틱을 실시간 판별하고 자동 압축·분류하는 친환경 AI 디바이스 개발',
  '학교 분리수거장에서 라벨이 제거되지 않거나 이물질이 묻은 페트병이 그대로 버려져 재활용률이 급감하는 현실을 목격했습니다. 수동 선별의 한계를 극복하고 일상에서 실시간으로 올바른 분리배출을 유도하는 스마트 하드웨어의 필요성을 느껴 연구를 시작했습니다.', '본 연구는 Raspberry Pi 5와 초소형 카메라 모듈을 기반으로 3,500장의 재활용품 이미지 데이터셋을 직접 구축하고 전처리하였습니다. 경량 객체 인식 신경망(YOLOv8-nano)을 엣지 디바이스에 최적화(TensorRT)하여 추론 속도를 28ms로 단축시켰으며, 서보 모터와 솔레노이드 밸브를 제어해 3단 챔버로 자동 분기하는 하드웨어 메커니즘을 완성했습니다.', '처음에는 모델의 정확도(mAP) 수치에만 집착했으나, 실제 현장에서는 조명 변화와 쓰레기의 구겨짐 정도가 판별 성능에 결정적인 영향을 미친다는 점을 배웠습니다. 알고리즘 개발뿐만 아니라 데이터 수집 환경의 다양성과 물리적 기구부의 안정성이 융합 프로젝트의 핵심임을 깊이 깨달았습니다.', '분류 속도를 유지하면서 분광 센서(NIR)를 융합해 눈으로 구별하기 어려운 PLA(생분해 플라스틱)와 일반 PET를 비파괴 방식으로 100% 분별하는 차세대 광학 선별기를 만들 수 있을까?',
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'https://example.com/presentations/ai-recycling.pptx', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://github.com',
  true, true, 1,
  'CURATOR''S PICK', '2026-08-10T09:00:00Z', '2026-08-20T14:30:00Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  team_name = EXCLUDED.team_name,
  student_display_names = EXCLUDED.student_display_names,
  grade = EXCLUDED.grade,
  program = EXCLUDED.program,
  year = EXCLUDED.year,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  question = EXCLUDED.question,
  summary = EXCLUDED.summary,
  motivation = EXCLUDED.motivation,
  description = EXCLUDED.description,
  reflection = EXCLUDED.reflection,
  next_question = EXCLUDED.next_question,
  thumbnail_url = EXCLUDED.thumbnail_url,
  report_pdf_url = EXCLUDED.report_pdf_url,
  presentation_pdf_url = EXCLUDED.presentation_pdf_url,
  presentation_original_url = EXCLUDED.presentation_original_url,
  video_url = EXCLUDED.video_url,
  external_project_url = EXCLUDED.external_project_url,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published,
  display_order = EXCLUDED.display_order,
  badge = EXCLUDED.badge,
  updated_at = now();

-- Processes for ai-recycling-assistant
DELETE FROM public.project_process WHERE project_id = (SELECT id FROM public.projects WHERE slug = 'ai-recycling-assistant');
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'ai-recycling-assistant'),
  '문제 정의 및 선행연구 분석', '국내 재활용 수거율 대비 실제 재활용 선별률 통계를 분석하고, 기존 광학 선별기의 크기·비용적 한계점을 도출하여 소형화 목표 설정', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', 1
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'ai-recycling-assistant'),
  '도메인 데이터셋 구축 (3,500장)', '라벨 유무, 뚜껑 링 잔존, 이물질 오염, 찌그러짐 등 8개 클래스별 다양한 각도 및 조명 조건에서 이미지 직접 촬영 및 라벨링', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80', 2
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'ai-recycling-assistant'),
  'YOLOv8 엣지 모델 최적화', '라즈베리파이 환경에서 실시간 30fps 추론을 달성하기 위해 INT8 양자화 및 TensorRT 변환 적용', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', 3
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'ai-recycling-assistant'),
  '3D 프린팅 스마트 하우징 및 분류 메커니즘 제작', '투입구 진입 감지 적외선 센서, 듀얼 서보 플랩 도어 및 압축 피스톤 기구 설계 완료', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 4
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'ai-recycling-assistant'),
  '교내 2주 실증 테스트 및 알고리즘 2차 개선', '교내 본관 수거함에 2주간 시범 설치 후 오분류 사례 112건을 추가 학습시켜 최종 분류 정확도 94.6% 달성', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 5
);

INSERT INTO public.projects (
  title, slug, subtitle, team_name, student_display_names, grade, program, year,
  category, tags, question, summary, motivation, description, reflection, next_question,
  thumbnail_url, report_pdf_url, presentation_pdf_url, presentation_original_url,
  video_url, external_project_url, featured, published, display_order, badge, created_at, updated_at
) VALUES (
  '우리 동네 미세먼지 수직·수평 데이터 분석 및 국소 기상 예측 모델', 'micro-dust-prediction', '고층 아파트 단지와 학교 주변의 높이별 미세먼지 농도는 어떻게 다를까?', 'AeroDynamics',
  ARRAY['최*아 (고1)','정*민 (고1)']::text[], '고등학교 1학년', '지구과학 & 데이터사이언스 융합', 2026,
  'SCIENCE', ARRAY['대기과학','IoT센서망','시계열분석','LSTM']::text[], '국가 대기측정망이 포착하지 못하는 생활권 1층~15층 높이별 미세먼지 와류 현상을 자체 제작 센서 노드로 측정하고 기계학습으로 3시간 후 국소 농도를 예측할 수 있을까?', '드론 및 층별 IoT 광산란 센서를 활용해 생활권 미세먼지 3차원 분포 지도를 작성하고 LSTM 시계열 신경망으로 골목길 단위 공기질을 예측한 지구과학 탐구',
  '학교 등하굣길 도로변과 옥상 운동장에서 체감하는 공기질이 국가 공공 데이터와 상당한 괴리가 있음을 느꼈습니다. 건축물 밀집도와 도로 폭, 식재 구조에 따라 국소적인 미세먼지 핫스팟이 형성되는 원인을 규명하고자 했습니다.', '광산란 방식 미세먼지 센서(PMS7003) 12대를 교정(Calibration)하여 아파트 1층, 5층, 10층, 15층 및 학교 운동장에 60일간 설치했습니다. 풍향·풍속·습도 복합 데이터를 수집하여 건물 간 협곡 효과(Street Canyon Effect)에 따른 미세먼지 정체 현상을 통계적으로 검증하고 LSTM 모델로 국소 예측 정확도 89.2%를 기록했습니다.', '센서의 습도 보정 계수를 찾는 과정에서 물리적 센서의 오차 한계를 소프트웨어적 알고리즘으로 보정하는 과학 연구 방법론의 가치를 실감했습니다. 데이터 과학이 단순한 숫자 처리가 아닌 실제 환경 문제를 정량화하는 강력한 도구임을 배웠습니다.', '도시 바람길 숲 조성 계획에 본 3D 미세먼지 와류 시뮬레이션 데이터를 접목하여 보행자 보호를 위한 최적의 수목 배치 모델을 수리공학적으로 최적화할 수 있을까?',
  'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'https://example.com/presentations/micro-dust.pptx', NULL, NULL,
  true, true, 2,
  'CREATIVE QUESTION', '2026-08-11T10:00:00Z', '2026-08-21T11:20:00Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  team_name = EXCLUDED.team_name,
  student_display_names = EXCLUDED.student_display_names,
  grade = EXCLUDED.grade,
  program = EXCLUDED.program,
  year = EXCLUDED.year,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  question = EXCLUDED.question,
  summary = EXCLUDED.summary,
  motivation = EXCLUDED.motivation,
  description = EXCLUDED.description,
  reflection = EXCLUDED.reflection,
  next_question = EXCLUDED.next_question,
  thumbnail_url = EXCLUDED.thumbnail_url,
  report_pdf_url = EXCLUDED.report_pdf_url,
  presentation_pdf_url = EXCLUDED.presentation_pdf_url,
  presentation_original_url = EXCLUDED.presentation_original_url,
  video_url = EXCLUDED.video_url,
  external_project_url = EXCLUDED.external_project_url,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published,
  display_order = EXCLUDED.display_order,
  badge = EXCLUDED.badge,
  updated_at = now();

-- Processes for micro-dust-prediction
DELETE FROM public.project_process WHERE project_id = (SELECT id FROM public.projects WHERE slug = 'micro-dust-prediction');
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'micro-dust-prediction'),
  '센서 교정 및 챔버 실험', '12대 PMS7003 센서의 상대 오차를 측정하고 항온항습 챔버에서 교정 회귀식 산출', 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80', 1
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'micro-dust-prediction'),
  '입체 IoT 관측망 배포 및 데이터 로깅', '아파트 4개 층 및 통학로 3개 지점에 LoRa 통신 모듈 탑재 센서 노드 60일 연속 가동', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', 2
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'micro-dust-prediction'),
  '협곡 효과(Street Canyon) CFD 기류 분석', 'OpenFOAM 오픈소스 유체역학 도구로 건물 군락 사이의 미세먼지 와류 정체 구역 컴퓨터 시뮬레이션', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', 3
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'micro-dust-prediction'),
  'LSTM 시계열 예측 모델 학습 및 평가', '과거 24시간 기상 및 농도 데이터로 향후 3시간 농도 예측 모델 완성 (RMSE 4.2㎍/㎥)', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 4
);

INSERT INTO public.projects (
  title, slug, subtitle, team_name, student_display_names, grade, program, year,
  category, tags, question, summary, motivation, description, reflection, next_question,
  thumbnail_url, report_pdf_url, presentation_pdf_url, presentation_original_url,
  video_url, external_project_url, featured, published, display_order, badge, created_at, updated_at
) VALUES (
  '표정과 음성 멀티모달 분석을 통한 청소년 감성 인터랙션 AI', 'emotional-ai-interaction', 'AI는 사람의 미묘한 복합 감정을 진정으로 공감하고 반응할 수 있을까?', 'SentientMind',
  ARRAY['서*준 (중3)','윤*서 (중3)']::text[], '중학교 3학년', '인공지능 & 인지과학 융합', 2026,
  'AI & DATA', ARRAY['멀티모달','음성인식','감정분석','인간-컴퓨터상호작용']::text[], '웹캠을 통한 얼굴 미세 표정(Facial Action Coding)과 마이크로 입력된 음성 피치·발화 속도를 융합하면 청소년의 학업 스트레스 상태를 90% 이상 판별할 수 있을까?', '표정 특징점(MediaPipe)과 음성 스펙트로그램(CNN)을 결합한 멀티모달 감정 인식 파이프라인 및 맞춤형 공감 대화 에이전트 구현',
  '학업과 인간관계로 지친 청소년들이 속마음을 편하게 털어놓지 못하는 심리적 장벽에 주목했습니다. 텍스트 감정 분석의 한계를 넘어 표정과 목소리 톤을 종합 분석해 맞춤형 지지와 호흡 가이드를 제공하는 따뜻한 인터페이스를 만들고 싶었습니다.', 'MediaPipe 468개 페이셜 랜드마크에서 도출된 눈썹, 입꼬리 변위 벡터와 Librosa로 추출한 음성 MFCC 특징을 융합 신경망(Cross-Attention)에 통과시켰습니다. 긍정/평온/불안/피로 4개 감정 상태를 92.4%의 정확도로 분류하고 감정에 따른 반응형 앰비언트 사운드와 대화를 생성합니다.', '인공지능이 인간의 감정을 수치화하는 과정에서 발생할 수 있는 윤리적 문제와 프라이버시 보호(온디바이스 처리 원칙)의 중요성을 깊게 성찰하게 되었습니다. 단순 기능 구현을 넘어 사용자를 존중하는 책임감 있는 AI 설계가 필수적임을 깨달았습니다.', '스마트워치의 광용적맥파(PPG) 심박 변이도(HRV) 데이터를 추가 통합하여 사용자가 자각하기 전의 자율신경계 긴장도를 선제적으로 감지하는 건강 인터랙션 시스템을 만들 수 있을까?',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  NULL, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://github.com',
  true, true, 3,
  'NEW IDEA', '2026-08-12T14:00:00Z', '2026-08-22T09:15:00Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  team_name = EXCLUDED.team_name,
  student_display_names = EXCLUDED.student_display_names,
  grade = EXCLUDED.grade,
  program = EXCLUDED.program,
  year = EXCLUDED.year,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  question = EXCLUDED.question,
  summary = EXCLUDED.summary,
  motivation = EXCLUDED.motivation,
  description = EXCLUDED.description,
  reflection = EXCLUDED.reflection,
  next_question = EXCLUDED.next_question,
  thumbnail_url = EXCLUDED.thumbnail_url,
  report_pdf_url = EXCLUDED.report_pdf_url,
  presentation_pdf_url = EXCLUDED.presentation_pdf_url,
  presentation_original_url = EXCLUDED.presentation_original_url,
  video_url = EXCLUDED.video_url,
  external_project_url = EXCLUDED.external_project_url,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published,
  display_order = EXCLUDED.display_order,
  badge = EXCLUDED.badge,
  updated_at = now();

-- Processes for emotional-ai-interaction
DELETE FROM public.project_process WHERE project_id = (SELECT id FROM public.projects WHERE slug = 'emotional-ai-interaction');
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'emotional-ai-interaction'),
  '심리학 기반 감정 분류 프레임워크 설계', '러셀(Russell)의 정서 원형 모델(Circumplex Model of Affect)을 기반으로 청소년 특화 4대 감정 축 정의', 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80', 1
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'emotional-ai-interaction'),
  'MediaPipe 468 랜드마크 추출 엔진 구축', '실시간 웹캠 영상에서 눈썹 비대칭, 입꼬리 하강 등 미세 표정 근육 움직임 3D 좌표화', 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80', 2
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'emotional-ai-interaction'),
  '음성 스펙트로그램 특징 융합 모델 개발', '음성의 MFCC 및 Mel-Spectrogram을 CNN 레이어로 추출 후 표정 벡터와 Attention 결합', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80', 3
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'emotional-ai-interaction'),
  '반응형 Web App 및 프라이버시 온디바이스 검증', '모든 추론을 클라우드 전송 없이 브라우저 WebGL(ONNX Runtime Web)에서 실행하여 개인정보 완벽 보호', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', 4
);

INSERT INTO public.projects (
  title, slug, subtitle, team_name, student_display_names, grade, program, year,
  category, tags, question, summary, motivation, description, reflection, next_question,
  thumbnail_url, report_pdf_url, presentation_pdf_url, presentation_original_url,
  video_url, external_project_url, featured, published, display_order, badge, created_at, updated_at
) VALUES (
  '식물 전기 신호 분석 기반 자율 생육 관리 스마트 화분', 'smart-iot-planter', '식물도 목이 마르거나 스트레스를 받을 때 전기적 신호로 대화하지 않을까?', 'BioCircuit',
  ARRAY['한*우 (중1)','강*린 (중1)','조*민 (중2)']::text[], '중학교 1-2학년', '피지컬 컴퓨팅 & 생명과학 탐구', 2026,
  'ROBOT & IoT', ARRAY['생체전기신호','ESP32','자동관수','바이오센서']::text[], '식물의 잎과 줄기 사이에 흐르는 마이크로볼트(μV) 단위의 활동 전위를 차동 증폭 회로로 포착하여 수분 부족 및 광 스트레스 상태를 조기에 감지할 수 있을까?', '식물 생체 전위 신호 측정 회로와 정밀 토양 수분·조도 센서를 융합하여 식물의 상태를 LED 감성 표정으로 전달하고 자율 급수하는 지능형 바이오 화분',
  '교실과 가정에서 화분의 물 주는 시기를 놓쳐 식물이 시드는 안타까운 상황이 반복되었습니다. 겉흙이 마르기 전 식물 세포 내부에서 일어나는 신호를 직접 포착하여 식물과 교감하는 기술을 만들고 싶었습니다.', '계측 증폭기(INA128)와 저역통과 능동 필터를 설계하여 노이즈를 차단하고 몬스테라의 생체 전위(10~150μV)를 포착했습니다. 토양 수분 감소 시 활동 전위 피크 주파수가 3.2배 급증하는 패턴을 확인하였으며, ESP32 컨트롤러가 수중 펌프와 조명 스펙트럼을 자율 제어하도록 시스템을 완성했습니다.', '전자 회로의 미세 신호 증폭 과정에서 60Hz 전원 노이즈를 제거하기 위해 쉴딩과 차동 접지를 연구하며 회로 이론의 기초를 탄탄히 다졌습니다. 생명체와 전자기기가 상호작용할 수 있다는 가능성에 매료되었습니다.', '식물 복수 개체의 생체 신호를 네트워크화하여 환경 유해 가스(포름알데히드 등) 유입 시 군집 반응을 보이는 천연 바이오 조기 경보망을 구축할 수 있을까?',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'https://example.com/presentations/smart-planter.pptx', NULL, 'https://github.com',
  true, true, 4,
  'TECH CHALLENGE', '2026-08-13T11:30:00Z', '2026-08-23T16:40:00Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  team_name = EXCLUDED.team_name,
  student_display_names = EXCLUDED.student_display_names,
  grade = EXCLUDED.grade,
  program = EXCLUDED.program,
  year = EXCLUDED.year,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  question = EXCLUDED.question,
  summary = EXCLUDED.summary,
  motivation = EXCLUDED.motivation,
  description = EXCLUDED.description,
  reflection = EXCLUDED.reflection,
  next_question = EXCLUDED.next_question,
  thumbnail_url = EXCLUDED.thumbnail_url,
  report_pdf_url = EXCLUDED.report_pdf_url,
  presentation_pdf_url = EXCLUDED.presentation_pdf_url,
  presentation_original_url = EXCLUDED.presentation_original_url,
  video_url = EXCLUDED.video_url,
  external_project_url = EXCLUDED.external_project_url,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published,
  display_order = EXCLUDED.display_order,
  badge = EXCLUDED.badge,
  updated_at = now();

-- Processes for smart-iot-planter
DELETE FROM public.project_process WHERE project_id = (SELECT id FROM public.projects WHERE slug = 'smart-iot-planter');
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'smart-iot-planter'),
  '식물 생체 신호 문헌 연구 및 전극 선정', '은-염화은(Ag/AgCl) 비분극 전극과 전도성 하이드로겔을 활용한 식물 조직 손상 최소화 부착법 연구', 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80', 1
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'smart-iot-planter'),
  '초정밀 아날로그 프론트엔드 회로 제작', 'Gain 1000배 계측 증폭기 및 50Hz 노치 필터 결합 PCB 기판 자체 에칭 및 테스트', 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80', 2
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'smart-iot-planter'),
  '자율 관수 펌프 및 피지컬 케이스 3D 프린팅', '친환경 PLA 필라멘트로 2중 수조 구조 및 OLED 표정 디스플레이 화분 외형 출력', 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80', 3
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'smart-iot-planter'),
  '30일간의 생육 대조군 실험', '일반 수동 급수 화분 대비 잎 면적 증가율 23% 향상 및 수분 스트레스 노출 시간 80% 단축 입증', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80', 4
);

INSERT INTO public.projects (
  title, slug, subtitle, team_name, student_display_names, grade, program, year,
  category, tags, question, summary, motivation, description, reflection, next_question,
  thumbnail_url, report_pdf_url, presentation_pdf_url, presentation_original_url,
  video_url, external_project_url, featured, published, display_order, badge, created_at, updated_at
) VALUES (
  '급식 잔반 줄이기 게이미피케이션 플랫폼: 식판 스캐너 & 친환경 기부 시스템', 'zero-waste-lunch', '잔반을 남기지 않는 행동을 즐거운 협동 게임과 탄소 절감 기부로 바꿀 수 있을까?', 'EcoPlates',
  ARRAY['임*원 (중2)','배*준 (중2)','송*은 (중3)']::text[], '중학교 2-3학년', '소프트웨어 & 사회문제 해결 프로젝트', 2026,
  'SOFTWARE', ARRAY['웹애플리케이션','게이미피케이션','컴퓨터비전','탄소중립']::text[], '급식 퇴식구에 설치된 초고속 카메라와 이미지 분할 AI로 1초 만에 식판 잔반량을 측정하고, 반별 탄소 포인트 랭킹 및 멸종위기 동물 기부로 연동하면 잔반 발생량을 40% 감축할 수 있을까?', '급식 식판 잔반량을 AI로 신속 분석하여 학생들의 환경 실천을 게이미피케이션 랭킹 및 기부 캠페인으로 전환하는 풀스택 웹 플랫폼',
  '매일 학교 급식실에서 버려지는 엄청난 양의 음식물 쓰레기와 이를 처리하기 위해 발생하는 온실가스 문제를 체감했습니다. 의무적인 강요 대신 학생 스스로 즐겁게 참여할 수 있는 디지털 보상 메커니즘을 설계하고자 했습니다.', '퇴식구 레일에 설치된 카메라로 식사 전후 식판 이미지를 촬영하여 세그멘테이션(Segment Anything Model 경량화)으로 잔반 면적 및 부피를 추정합니다. 학생 개별 NFC 태그로 0.8초 내 인증되며, 클래스별 누적 탄소 절감량이 학교 로비 대시보드에 실시간 인터랙티브 숲 그래픽으로 시각화됩니다.', '사용자 경험(UX) 설계가 행동 변화에 얼마나 지대한 영향을 주는지 배웠습니다. 단순히 ''잔반을 남기지 마세요''라는 텍스트 경고보다 반별 실시간 나무 심기 게이미피케이션이 학생들의 자발적 참여를 4배 이상 높인다는 통계적 유의성을 검증했습니다.', '학생들의 영양 섭취 패턴 데이터를 역분석하여 학생별 선호 식단과 영양 균형을 맞춘 최적 급식 발주 AI 알고리즘을 구축할 수 있을까?',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  NULL, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://github.com',
  false, true, 5,
  'NEW IDEA', '2026-08-14T15:20:00Z', '2026-08-24T10:00:00Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  team_name = EXCLUDED.team_name,
  student_display_names = EXCLUDED.student_display_names,
  grade = EXCLUDED.grade,
  program = EXCLUDED.program,
  year = EXCLUDED.year,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  question = EXCLUDED.question,
  summary = EXCLUDED.summary,
  motivation = EXCLUDED.motivation,
  description = EXCLUDED.description,
  reflection = EXCLUDED.reflection,
  next_question = EXCLUDED.next_question,
  thumbnail_url = EXCLUDED.thumbnail_url,
  report_pdf_url = EXCLUDED.report_pdf_url,
  presentation_pdf_url = EXCLUDED.presentation_pdf_url,
  presentation_original_url = EXCLUDED.presentation_original_url,
  video_url = EXCLUDED.video_url,
  external_project_url = EXCLUDED.external_project_url,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published,
  display_order = EXCLUDED.display_order,
  badge = EXCLUDED.badge,
  updated_at = now();

-- Processes for zero-waste-lunch
DELETE FROM public.project_process WHERE project_id = (SELECT id FROM public.projects WHERE slug = 'zero-waste-lunch');
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'zero-waste-lunch'),
  '교내 급식 잔반 실태 조사 및 인터뷰', '전교생 450명 설문조사 및 영양사 선생님 인터뷰를 통해 잔반의 68%가 국과 나물류에 집중됨을 발견', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80', 1
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'zero-waste-lunch'),
  '식판 6구 영역 분할 AI 모델 구축', '밥, 국, 메인반찬, 서브반찬 3종 구획을 자동 분할하고 음식 잔여 픽셀 비율을 계산하는 알고리즘 작성', 'https://images.unsplash.com/photo-1555949963-aa79dcee02e1?auto=format&fit=crop&w=800&q=80', 2
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'zero-waste-lunch'),
  'Next.js 풀스택 대시보드 & NFC 키오스크 개발', '퇴식구 전용 고속 스캔 키오스크 소프트웨어 및 실시간 반별 경쟁 랭킹 웹 대시보드 배포', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', 3
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'zero-waste-lunch'),
  '1개월 교내 적용 실증 및 잔반 42% 감축 달성', '1개월간 일평균 잔반량 128kg에서 74kg으로 42.1% 대폭 감축 확인 및 탄소 절감 3.2톤 달성', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80', 4
);

INSERT INTO public.projects (
  title, slug, subtitle, team_name, student_display_names, grade, program, year,
  category, tags, question, summary, motivation, description, reflection, next_question,
  thumbnail_url, report_pdf_url, presentation_pdf_url, presentation_original_url,
  video_url, external_project_url, featured, published, display_order, badge, created_at, updated_at
) VALUES (
  '시각장애인을 위한 3D LiDAR & 초음파 햅틱 웨어러블 안전 알리미', 'haptic-safety-guide', '지팡이가 닿지 않는 머리와 가슴 높이의 공중 장애물을 어떻게 안전하게 피할 수 있을까?', 'SafePath',
  ARRAY['오*현 (고2)','문*준 (고2)']::text[], '고등학교 2학년', '로봇공학 & 의공학 융합과정', 2026,
  'ROBOT & IoT', ARRAY['LiDAR','햅틱피드백','배리어프리','웨어러블']::text[], '초경량 솔리드스테이트 LiDAR와 초음파 센서 어레이를 조끼형 웨어러블 디바이스로 구성하여 상체 높이(1.2m~1.8m) 돌출 장애물의 거리와 방향을 16채널 진동 패턴으로 직관적으로 인지시킬 수 있을까?', '기존 흰 지팡이의 사각지대인 상체·안면 높이의 간판, 나뭇가지, 트럭 적재함 등을 레이저/초음파 융합으로 감지해 촉각 매핑으로 안내하는 보조공학 디바이스',
  '시각장애인 복지관 봉사활동 중 지팡이가 바닥 장애물만 감지할 수 있어 상체 돌출물에 부딪혀 부상을 입는 사례가 빈번하다는 것을 알게 되었습니다. 비장애인 중심의 보행 인프라 한계를 첨단 센서 융합으로 개선하고자 했습니다.', '시야각 120도의 소형 ToF LiDAR 센서와 4개의 초음파 트랜스듀서를 가슴 벨트에 결합했습니다. 장애물과의 거리에 따라 진동 모터의 펄스 폭 변조(PWM) 빈도를 5단계로 가변하고, 접근 방향에 따라 좌우 4개 그리드의 진동 순서를 직관적인 파동 형태로 피드백하도록 햅틱 인터페이스 알고리즘을 설계했습니다.', '기술의 완성이 사용자의 편리함과 직결되지 않는다는 것을 배웠습니다. 초기 프로토타입은 진동이 너무 잦아 촉각 피로(Sensory Fatigue)를 유발했으나, 피드백 임계치를 지능적으로 조절하는 필터를 추가하면서 진정한 사용자 중심 설계의 중요성을 깨달았습니다.', '골전도 오디오와 비전 AI를 결합하여 장애물 회피뿐 아니라 버스 번호판 판독 및 횡단보도 신호등 색상을 음성으로 동시 안내하는 일체형 스마트 안경으로 고도화할 수 있을까?',
  'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'https://example.com/presentations/haptic-safety.pptx', NULL, 'https://github.com',
  false, true, 6,
  'TECH CHALLENGE', '2026-08-15T13:40:00Z', '2026-08-25T14:10:00Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  team_name = EXCLUDED.team_name,
  student_display_names = EXCLUDED.student_display_names,
  grade = EXCLUDED.grade,
  program = EXCLUDED.program,
  year = EXCLUDED.year,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  question = EXCLUDED.question,
  summary = EXCLUDED.summary,
  motivation = EXCLUDED.motivation,
  description = EXCLUDED.description,
  reflection = EXCLUDED.reflection,
  next_question = EXCLUDED.next_question,
  thumbnail_url = EXCLUDED.thumbnail_url,
  report_pdf_url = EXCLUDED.report_pdf_url,
  presentation_pdf_url = EXCLUDED.presentation_pdf_url,
  presentation_original_url = EXCLUDED.presentation_original_url,
  video_url = EXCLUDED.video_url,
  external_project_url = EXCLUDED.external_project_url,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published,
  display_order = EXCLUDED.display_order,
  badge = EXCLUDED.badge,
  updated_at = now();

-- Processes for haptic-safety-guide
DELETE FROM public.project_process WHERE project_id = (SELECT id FROM public.projects WHERE slug = 'haptic-safety-guide');
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'haptic-safety-guide'),
  '시각장애인 보행 사각지대 분석', '흰 지팡이 보행 시 지면 45도 상향 영역의 간판, 차양막, 볼라드 충돌 위험도 데이터 수집', 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80', 1
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'haptic-safety-guide'),
  'LiDAR & 초음파 센서 퓨전 알고리즘 설계', '투명 유리창 및 검은색 물체 반사율 저하를 상호 보완하는 센서 퓨전 칼만 필터 구현', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', 2
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'haptic-safety-guide'),
  '16채널 햅틱 액추에이터 어레이 제작', '인체 피부 접촉면의 촉각 공간 해상도를 고려한 최적 간격(35mm) 배치 및 통기성 웨어러블 하네스 설계', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 3
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'haptic-safety-guide'),
  '블라인드 장애물 코스 보행 평가', '안대 착용 20명 대상 모의 장애물 회피 테스트 결과 충돌 발생률 91% 감소 입증', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 4
);

INSERT INTO public.projects (
  title, slug, subtitle, team_name, student_display_names, grade, program, year,
  category, tags, question, summary, motivation, description, reflection, next_question,
  thumbnail_url, report_pdf_url, presentation_pdf_url, presentation_original_url,
  video_url, external_project_url, featured, published, display_order, badge, created_at, updated_at
) VALUES (
  '생성형 AI 기반 맞춤형 지역 생태계 인터랙티브 탐사 도감', 'ai-eco-explorer', '내가 발견한 작은 곤충과 식물이 어떻게 생태계 그물망으로 연결되어 있을까?', 'EcoGraph',
  ARRAY['류*아 (중1)','장*우 (중2)']::text[], '중학교 1-2학년', '생태과학 & 창의융합 소프트웨어', 2026,
  'CREATIVE', ARRAY['지식그래프','생태도감','LLM','인터랙티브시각화']::text[], '스마트폰 카메라로 촬영한 지역 생물 사진을 기반으로 종 식별뿐만 아니라 포식·피식·공생 관계를 3차원 동적 지식 그래프로 자동 생성하여 생태적 감수성을 키울 수 있을까?', '지역 하천과 숲 생태계의 생물종을 사진으로 탐색하고 먹이사슬과 생태계 연결망을 시각적 지식 그래프로 탐험하는 교육용 웹 플랫폼',
  '단순히 생물의 이름을 외우는 기존 도감의 정형화된 방식에서 벗어나, 발견한 생물이 우리 지역 환경에서 어떤 역할을 담당하는지 유기적인 관계를 시각적으로 이해할 수 있는 살아있는 생태 교육을 만들고 싶었습니다.', '생물 사진을 입력하면 백엔드 비전 모델이 곤충/식물 종을 96% 정밀도로 분류하고, 국립생물자원관 오픈 API 및 LLM 지식 베이스를 조합해 해당 생물의 서식 환경, 천적, 먹이, 계절별 변화를 D3.js 기반의 동적 네트워크 노드로 렌더링합니다.', '과학적 사실 데이터(Fact)와 예술적 인터랙션(Design)이 융합되었을 때 학습자의 몰입도가 극대화된다는 것을 경험했습니다. 융합(STEAM) 교육의 진정한 매력은 이질적인 분야가 하나의 멋진 작품으로 조화되는 데 있음을 깨달았습니다.', '계절별 사용자 관측 데이터를 축적하여 기후변화에 따른 지역 생물 계절학(Phenology) 변화 추이를 시민과학 형태로 모니터링하는 오픈 생태 플랫폼으로 확장할 수 있을까?',
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  NULL, NULL, 'https://github.com',
  false, true, 7,
  'CREATIVE QUESTION', '2026-08-16T16:00:00Z', '2026-08-26T11:00:00Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  team_name = EXCLUDED.team_name,
  student_display_names = EXCLUDED.student_display_names,
  grade = EXCLUDED.grade,
  program = EXCLUDED.program,
  year = EXCLUDED.year,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  question = EXCLUDED.question,
  summary = EXCLUDED.summary,
  motivation = EXCLUDED.motivation,
  description = EXCLUDED.description,
  reflection = EXCLUDED.reflection,
  next_question = EXCLUDED.next_question,
  thumbnail_url = EXCLUDED.thumbnail_url,
  report_pdf_url = EXCLUDED.report_pdf_url,
  presentation_pdf_url = EXCLUDED.presentation_pdf_url,
  presentation_original_url = EXCLUDED.presentation_original_url,
  video_url = EXCLUDED.video_url,
  external_project_url = EXCLUDED.external_project_url,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published,
  display_order = EXCLUDED.display_order,
  badge = EXCLUDED.badge,
  updated_at = now();

-- Processes for ai-eco-explorer
DELETE FROM public.project_process WHERE project_id = (SELECT id FROM public.projects WHERE slug = 'ai-eco-explorer');
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'ai-eco-explorer'),
  '지역 하천 생태계 식생 조사 (12회)', '탄천 및 양재천 일대 수서곤충 및 자생식물 120종 현장 채집 및 고해상도 사진 아카이빙', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80', 1
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'ai-eco-explorer'),
  '생태 관계 지식 그래프 온톨로지 구축', '먹이사슬, 공생, 기생, 경쟁 관계를 나타내는 노드-엣지 속성 데이터베이스 설계', 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80', 2
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'ai-eco-explorer'),
  'D3.js Force-Directed 시각화 엔진 구현', '사용자가 노드를 드래그하고 확대하며 먹이사슬의 에너지 흐름을 파동 애니메이션으로 감상할 수 있는 인터페이스 개발', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 3
);

INSERT INTO public.projects (
  title, slug, subtitle, team_name, student_display_names, grade, program, year,
  category, tags, question, summary, motivation, description, reflection, next_question,
  thumbnail_url, report_pdf_url, presentation_pdf_url, presentation_original_url,
  video_url, external_project_url, featured, published, display_order, badge, created_at, updated_at
) VALUES (
  '시뮬레이션 게임으로 배우는 탄소 발자국과 글로벌 기후 위기 극복', 'carbon-hero-game', '나의 작은 소비 선택과 정책 결정이 50년 후 지구 온도를 어떻게 바꿀까?', 'TerraSimulator',
  ARRAY['신*재 (중3)','안*호 (중3)','황*희 (중2)']::text[], '중학교 2-3학년', '소프트웨어 & 환경 시뮬레이션', 2026,
  'SOFTWARE', ARRAY['시뮬레이션','게임기반학습','기후모델','WebAssembly']::text[], 'IPCC 기후 시나리오 물리 방정식을 단순화한 물리 엔진을 웹 브라우저 게임으로 구현하여 청소년이 에너지 정책과 일상 탄소 감축의 상관관계를 체감하게 할 수 있을까?', '기후 물리학 공식과 정책 시뮬레이션을 결합하여 플레이어가 도시를 운영하며 1.5°C 목표를 방어하는 인터랙티브 전략 웹 게임',
  '기후 변화에 대한 교육이 단순한 경고나 수치 전달에 머물러 있어 학생들이 피부로 와닿지 않는다는 문제를 느꼈습니다. 정책 선택과 개인의 소비 습관이 미치는 연쇄 파급 효과를 직접 시뮬레이션해 보며 능동적 환경 의식을 기르고자 했습니다.', 'IPCC 기후변화 6차 보고서의 탄소 순환 및 복사강제력 계산식을 경량 수식 모델로 정립했습니다. WebAssembly 기반 시뮬레이션 엔진을 구축하여 발전원 비율(신재생/원자력/화석연료), 대중교통 인프라, 채식 장려 정책 등 30가지 변수를 조작하며 2050년 탄소중립 달성 여부를 실시간 렌더링합니다.', '복잡한 과학 이론을 직관적이고 흥미로운 게임 메커니즘으로 전환하는 과정에서 게임 기획과 알고리즘 최적화의 균형을 유지하는 방법을 배웠습니다. 교육용 소프트웨어가 갖추어야 할 재미와 학술적 엄밀성의 공존 가치를 체득했습니다.', '실시간 다중 접속 멀티플레이어 모드를 구축하여 플레이어들이 서로 다른 국가를 맡아 탄소 국경세와 배출권 거래를 협상하는 모의 기후 정상회의 시스템으로 확장할 수 있을까?',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'https://example.com/presentations/carbon-game.pptx', NULL, 'https://github.com',
  false, true, 8,
  'NEW IDEA', '2026-08-17T17:30:00Z', '2026-08-27T08:00:00Z'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  team_name = EXCLUDED.team_name,
  student_display_names = EXCLUDED.student_display_names,
  grade = EXCLUDED.grade,
  program = EXCLUDED.program,
  year = EXCLUDED.year,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  question = EXCLUDED.question,
  summary = EXCLUDED.summary,
  motivation = EXCLUDED.motivation,
  description = EXCLUDED.description,
  reflection = EXCLUDED.reflection,
  next_question = EXCLUDED.next_question,
  thumbnail_url = EXCLUDED.thumbnail_url,
  report_pdf_url = EXCLUDED.report_pdf_url,
  presentation_pdf_url = EXCLUDED.presentation_pdf_url,
  presentation_original_url = EXCLUDED.presentation_original_url,
  video_url = EXCLUDED.video_url,
  external_project_url = EXCLUDED.external_project_url,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published,
  display_order = EXCLUDED.display_order,
  badge = EXCLUDED.badge,
  updated_at = now();

-- Processes for carbon-hero-game
DELETE FROM public.project_process WHERE project_id = (SELECT id FROM public.projects WHERE slug = 'carbon-hero-game');
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'carbon-hero-game'),
  'IPCC 기후 모델 수식 간소화 연구', '탄소 농도에 따른 지표면 복사강제력(ΔF = 5.35 ln(C/C0)) 및 기후 민감도 계수 추출', 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80', 1
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'carbon-hero-game'),
  '시뮬레이션 엔진 아키텍처 설계', '연도별 틱(Tick) 단위 경제 생산량, 에너지 수요, 탄소 배출량 연동 파이프라인 수립', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80', 2
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'carbon-hero-game'),
  'Canvas 2D 픽셀 아트 렌더러 및 사운드 작곡', '온도 상승에 따른 해수면 상승, 산불 발생, 사막화 등 기후 재난 이펙트 그래픽 제작', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', 3
);
INSERT INTO public.project_process (project_id, title, description, image_url, display_order)
VALUES (
  (SELECT id FROM public.projects WHERE slug = 'carbon-hero-game'),
  '교내 환경 동아리 베타 플레이 및 학습 효과 검증', '참여 학생 대상 기후 정책 이해도 평가 38% 상승 및 에너지 절약 실천 의향 85% 확인', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', 4
);
