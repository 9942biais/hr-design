export const categories = [
  { id: "thinking", name: "사고하기", order: 1 },
  { id: "making", name: "만들기", order: 2 },
  { id: "communicating", name: "소통하기", order: 3 },
  { id: "working", name: "일하기", order: 4 },
] as const;

export const indicators = [
  { id: "problem-discovery", categoryId: "thinking", name: "문제 발견", order: 1, consultingPriority: "프로젝트의 문제 정의문을 다시 작성하세요." },
  { id: "research-insight", categoryId: "thinking", name: "리서치와 인사이트", order: 2, consultingPriority: "조사 결과가 인사이트로 이어지는 근거를 추가하세요." },
  { id: "concept-translation", categoryId: "thinking", name: "콘셉트 전환", order: 3, consultingPriority: "콘셉트가 시각적·구조적·인터랙션 결정으로 전환되는 과정을 명확히 하세요." },
  { id: "visual-sensibility", categoryId: "making", name: "시각적 감각", order: 4, consultingPriority: "타이포그래피, 색상, 레이아웃, 시각적 위계를 개선하세요." },
  { id: "system-building", categoryId: "making", name: "시스템 구축", order: 5, consultingPriority: "규칙, 컴포넌트, 변형, 적용 사례를 보여주세요." },
  { id: "execution-finish", categoryId: "making", name: "실행과 완성도", order: 6, consultingPriority: "최종 목업, 세부 표현, 제작 완성도를 높이세요." },
  { id: "portfolio-structure", categoryId: "communicating", name: "포트폴리오 구조", order: 7, consultingPriority: "프로젝트 순서를 재구성하고 첫 5페이지의 메시지를 명확히 하세요." },
  { id: "storytelling", categoryId: "communicating", name: "스토리텔링", order: 8, consultingPriority: "각 프로젝트를 문제-과정-결과 구조로 다시 구성하세요." },
  { id: "verbalization-pitching", categoryId: "communicating", name: "언어화와 피칭", order: 9, consultingPriority: "핵심 프로젝트마다 30초 피치를 작성하세요." },
  { id: "self-direction", categoryId: "working", name: "자기주도성", order: 10, consultingPriority: "개인적 동기, 프로젝트 목표, 의사결정의 주도권을 추가하세요." },
  { id: "iteration-improvement", categoryId: "working", name: "반복과 개선", order: 11, consultingPriority: "변경 전후와 피드백을 반영한 수정 과정을 보여주세요." },
  { id: "collaboration-professionalism", categoryId: "working", name: "협업과 프로페셔널리즘", order: 12, consultingPriority: "팀 역할, 기여도, 일정, 책임 범위를 명확히 하세요." },
] as const;

const selfQuestionText: Record<string, string[]> = {
  "problem-discovery": ["나는 최초 브리프와 근본적인 문제를 구분할 수 있다.", "나는 특정 사용자나 맥락을 중심으로 프로젝트를 정의한다.", "나는 이 문제를 해결해야 하는 이유를 설명할 수 있다."],
  "research-insight": ["나는 프로젝트 질문에 맞는 조사 방법을 선택한다.", "나는 관찰 결과를 의미 있는 패턴으로 정리한다.", "나의 디자인 결정은 조사 근거와 연결되어 있다."],
  "concept-translation": ["나는 콘셉트를 명확한 디자인 원칙으로 표현할 수 있다.", "나의 콘셉트는 시각적·구조적·인터랙션 선택에 영향을 준다.", "나는 아이디어와 결과물의 연결 관계를 설명할 수 있다."],
  "visual-sensibility": ["나는 타이포그래피와 색상을 의도적으로 선택한다.", "나는 명확한 시각적 위계와 구도를 만든다.", "나의 작업은 일관된 수준의 시각적 판단력을 보여준다."],
  "system-building": ["나는 개별 화면이나 그래픽보다 재사용 가능한 규칙을 정의한다.", "나는 컴포넌트, 변형, 예외 상황을 보여준다.", "나의 디자인은 여러 적용 사례에서도 일관성을 유지한다."],
  "execution-finish": ["나의 최종 결과물은 세부까지 꼼꼼하게 완성되어 있다.", "나는 설득력 있는 목업과 발표 자료를 사용한다.", "나는 작업을 발표하기 전에 제작 완성도를 점검한다."],
  "portfolio-structure": ["나의 프로젝트 순서는 의도한 디자이너 포지션을 전달한다.", "첫 페이지들만으로도 내가 어떤 디자이너인지 빠르게 알 수 있다.", "독자는 별도 설명 없이 내 포트폴리오를 탐색할 수 있다."],
  "storytelling": ["각 프로젝트에는 문제-과정-결과의 명확한 흐름이 있다.", "나는 핵심 이야기를 돕도록 과정 자료를 선별하고 편집한다.", "나의 포트폴리오는 프로젝트의 성과를 쉽게 이해하게 한다."],
  "verbalization-pitching": ["나는 각 프로젝트를 30초 안에 요약할 수 있다.", "나는 디자인 결정의 이유를 쉬운 언어로 설명한다.", "나는 청중에 맞게 발표 방식을 조정한다."],
  "self-direction": ["나는 최소 요구사항을 넘어 스스로 프로젝트 목표를 설정한다.", "나는 중요한 디자인 결정에 주도권을 가진다.", "나의 포트폴리오는 개인적 관심과 동기를 드러낸다."],
  "iteration-improvement": ["나는 하나를 확정하기 전에 여러 방향을 시험한다.", "나는 피드백을 실제 개선으로 연결한다.", "나는 의미 있는 변경 전후를 기록한다."],
  "collaboration-professionalism": ["나는 팀 프로젝트에서 나의 역할과 기여를 명확히 한다.", "나는 일정과 업무 전달을 신뢰감 있게 관리한다.", "나는 결정과 제약 조건을 전문적으로 소통한다."],
};

export const selfQuestions = indicators.flatMap((indicator, indicatorIndex) =>
  selfQuestionText[indicator.id].map((text, questionIndex) => ({
    id: `self-${indicator.id}-${questionIndex + 1}`,
    indicatorId: indicator.id,
    order: indicatorIndex * 3 + questionIndex + 1,
    text,
  })),
);

const situations: Record<string, { prompt: string; options: string[]; best: number }> = {
  "problem-discovery": { prompt: "클라이언트가 참여율이 낮다며 새 앱을 요청했습니다. 가장 먼저 무엇을 하겠습니까?", options: ["바로 인터페이스 스케치를 시작한다", "경쟁 앱을 조사한다", "누구의 참여율이 어느 지점에서 왜 떨어지는지 확인한다", "클라이언트에게 선호하는 시각 스타일을 고르게 한다"], best: 2 },
  "research-insight": { prompt: "다섯 번의 인터뷰에서 서로 충돌하는 의견이 많이 나왔습니다. 다음 단계는 무엇입니까?", options: ["가장 기억에 남는 인용문을 사용한다", "패턴을 묶고 행동이나 맥락과 비교한다", "모든 의견의 평균을 낸다", "발표에서 리서치를 제외한다"], best: 1 },
  "concept-translation": { prompt: "콘셉트가 '차분한 자신감'입니다. 이를 어떻게 발전시키겠습니까?", options: ["표지에 해당 문구를 넣는다", "유행하는 색상 조합을 선택한다", "원칙을 정의하고 서체, 속도감, 레이아웃, 인터랙션에 미치는 영향을 시험한다", "완성도 높은 대표 이미지 하나를 만든다"], best: 2 },
  "visual-sensibility": { prompt: "레이아웃이 복잡하고 한눈에 읽기 어렵습니다. 무엇을 먼저 조정하겠습니까?", options: ["장식 요소를 추가한다", "위계, 여백, 타이포그래피 역할을 강화한다", "모든 글자 크기를 줄인다", "콘텐츠를 구분하기 위해 색상을 더 많이 사용한다"], best: 1 },
  "system-building": { prompt: "세 화면은 잘 디자인했지만 네 번째 화면이 어울리지 않습니다. 어떻게 하겠습니까?", options: ["네 번째 화면만 독립적인 스타일로 만든다", "가장 비슷한 화면을 복사한다", "공통 규칙을 찾고 컴포넌트 시스템을 확장한다", "케이스 스터디에서 해당 화면을 숨긴다"], best: 2 },
  "execution-finish": { prompt: "콘셉트는 강하지만 최종 리뷰가 내일입니다. 무엇을 우선하겠습니까?", options: ["새 콘셉트를 하나 더 추가한다", "핵심 흐름, 세부 요소, 최종 발표 자료를 다듬는다", "도입 설명을 더 길게 쓴다", "미완성 화면을 그대로 보여준다"], best: 1 },
  "portfolio-structure": { prompt: "채용 담당자가 포트폴리오를 2분도 보지 않습니다. 어떻게 대응하겠습니까?", options: ["학교 프로젝트를 모두 추가한다", "가장 강하고 직무에 맞는 작업을 앞에 두고 탐색 구조를 단순화한다", "모든 프로젝트의 분량을 같게 만든다", "자기소개를 가장 먼저 배치한다"], best: 1 },
  "storytelling": { prompt: "케이스 스터디에 과정 이미지가 30장 있지만 결과가 불명확합니다. 어떻게 하겠습니까?", options: ["노력을 보여주기 위해 모두 유지한다", "의사결정 근거와 함께 문제-과정-결과 흐름으로 편집한다", "최종 이미지를 맨 뒤로 옮긴다", "모든 이미지에 설명을 더 추가한다"], best: 1 },
  "verbalization-pitching": { prompt: "면접관이 팀 프로젝트에서 무엇을 기여했는지 묻습니다. 어떻게 답하겠습니까?", options: ["팀이 모든 일을 함께 했다고 답한다", "나의 역할, 핵심 결정, 협업 방식, 결과를 설명한다", "프로젝트 전체를 시간순으로 설명한다", "최종 비주얼만 이야기한다"], best: 1 },
  "self-direction": { prompt: "브리프가 넓고 지도교수의 지시도 적습니다. 어떻게 하겠습니까?", options: ["더 구체적인 지시를 기다린다", "개인적인 질문, 목표, 의사결정 기준을 설정한다", "작년 프로젝트 형식을 따라 한다", "평가 요구사항에만 집중한다"], best: 1 },
  "iteration-improvement": { prompt: "크리틱에서 사용자가 핵심 인터랙션을 오해한다는 사실을 발견했습니다. 어떻게 하겠습니까?", options: ["원래 의도를 방어한다", "수정하고 다시 테스트한 뒤 변경 내용을 기록한다", "목업 스타일을 바꾼다", "케이스 스터디에서 해당 피드백을 제외한다"], best: 1 },
  "collaboration-professionalism": { prompt: "팀원이 내 작업에 필요한 결과물을 늦게 전달하고 있습니다. 어떻게 하겠습니까?", options: ["말없이 그 팀원의 작업을 다시 한다", "위험을 일찍 공유하고 복구 계획과 담당 범위를 합의해 기록한다", "마감일까지 기다린다", "팀원과 이야기하지 않고 바로 지도교수에게 알린다"], best: 1 },
};

const fallbackScores = [25, 50, 25, 0];
export const situationalQuestions = indicators.map((indicator, index) => ({
  id: `sjt-${indicator.id}`,
  indicatorId: indicator.id,
  order: index + 1,
  prompt: situations[indicator.id].prompt,
  options: situations[indicator.id].options.map((text, optionIndex) => ({
    id: `sjt-${indicator.id}-${optionIndex + 1}`,
    order: optionIndex + 1,
    text,
    score: optionIndex === situations[indicator.id].best ? 100 : fallbackScores[optionIndex],
    tags: optionIndex === situations[indicator.id].best ? "best-practice" : null,
  })),
}));

const evidenceText: Record<string, string[]> = {
  "problem-discovery": ["명확한 문제 정의문", "정의된 대상 사용자 또는 맥락", "최초 브리프를 재정의한 근거"],
  "research-insight": ["조사 방법과 출처", "분석 또는 패턴 도출 과정", "디자인 결정과 연결된 인사이트"],
  "concept-translation": ["콘셉트 문장", "디자인 원칙", "콘셉트가 결과물로 이어지는 논리"],
  "visual-sensibility": ["타이포그래피 시스템", "색상과 레이아웃의 선택 근거", "강한 시각적 위계 사례"],
  "system-building": ["컴포넌트 또는 규칙 체계", "변형과 상태", "다양한 맥락의 적용 사례"],
  "execution-finish": ["완성도 높은 최종 목업", "세부적으로 표현된 핵심 화면 또는 결과물", "제작 가능한 수준의 결과물"],
  "portfolio-structure": ["의도적인 프로젝트 순서", "명확한 도입 페이지", "내비게이션 또는 목차 구조"],
  "storytelling": ["문제-과정-결과 흐름", "선별·편집된 과정 근거", "결과와 영향"],
  "verbalization-pitching": ["짧은 프로젝트 요약", "의사결정 근거", "역할과 기여 설명"],
  "self-direction": ["개인적 동기", "스스로 정의한 목표", "의사결정 주도권의 근거"],
  "iteration-improvement": ["대안 탐색 과정", "피드백 기록", "수정 전후 비교"],
  "collaboration-professionalism": ["팀 역할 구분", "일정 또는 작업 흐름 근거", "책임 범위와 업무 전달"],
};

export const evidenceItems = indicators.flatMap((indicator) =>
  evidenceText[indicator.id].map((text, index) => ({
    id: `evidence-${indicator.id}-${index + 1}`,
    indicatorId: indicator.id,
    order: index + 1,
    text,
    weight: 1,
  })),
);

export type IndicatorId = (typeof indicators)[number]["id"];
