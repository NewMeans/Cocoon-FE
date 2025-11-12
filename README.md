# 코쿤 (Cocoon): 감정 인지 능력 향상을 위한 AI 웰니스 솔루션

> '코쿤'은 AI 페르소나 챗봇과의 대화를 통해 감정 일기를 작성하며, 414개의 감정 어휘 DB를 기반으로 자신의 감정을 명확히 인지하고 표현하는 힘을 길러주는 웰니스 솔루션입니다.
>
> 본 프로젝트는 기존 [아늑(A-Neuk)](https://github.com/pius338/A-Neuk-FE) 프로토타입의 기술과 시장성을 검증하고, 이를 바탕으로 고도화된 버전입니다.

<img width="1920" height="1080" alt="1 (1)" src="https://github.com/user-attachments/assets/4aca3b59-b944-4a55-b93a-c91e23a01de0" />

---

## ✨ 주요 기능 (Key Features)

| 기능                           | 설명                                                                                                                                                                                |
| :----------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **🤖 AI 페르소나 챗봇**        | 반려동물, 연예인 등 원하는 페르소나와 대화하며 심리적 유대감을 형성하고, 쉽고 꾸준하게 일기를 생성합니다.                                                                           |
| **✍️ 정서 명명 & 일기 재구성** | **자체 구축한 414개 한국어 감정 어휘 DB**를 기반으로 AI가 사용자의 감정에 구체적인 이름을 추천합니다. 선택된 어휘로 일기 문장이 즉시 재구성되어 더욱 명료한 감정 기록을 완성합니다. |
| **🃏 CBT 기반 걱정카드**       | 인지행동치료(CBT) 원리를 적용해 불안을 카드로 기록하고, 시간이 지난 뒤 걱정이 현실화되었는지 데이터를 통해 확인하며 부정적인 사고 패턴을 교정합니다.                                |
| **📊 감정 도감 & 리포트**      | 새롭게 학습한 감정 단어를 '감정 도감'에 수집하고, 주간/월간 리포트를 통해 자신의 감정 변화 패턴을 객관적으로 파악하며 성장을 확인합니다.                                            |

---

## 🌐 서비스 링크

🔗 **[서비스 바로가기 (Cocoon 프로토타입)](https://aneuk.dev-lr.com/)**

---

## 📄 개발 동기 및 목적

AI 기술 발전으로 외부 세계와의 연결은 극도로 효율화되었지만, 역설적으로 ‘내면과의 단절’은 심화되었습니다. 특히 자신의 감정을 섬세하게 표현할 어휘와 방법을 잃어가는 10-30대 청년층은 ‘정서적 고립’ 상태에 놓이기 쉽습니다. 이는 감정 표현에 어려움을 겪는 ‘감정표현불능증’으로 이어질 수 있는 심각한 문제입니다. 실제로 전 세계 인구의 10%, 정신질환을 겪는 이들의 40~60%가 이 문제로 어려움을 겪고 있습니다.

'슬픔'이라는 단어가 없어 슬픔을 질병으로 취급했던 타히티 사회의 사례처럼, 언어는 감정을 이해하는 핵심 도구입니다. 코쿤은 이 문제에 대한 솔루션으로, 과학적으로 증명된 ‘정서 명명’ 효과에 주목했습니다. 감정에 구체적인 이름을 붙이는 행위는 감정 조절 능력을 향상시키고 부정적 감정을 완화합니다.

코쿤은 사용자가 AI 페르소나와 즐겁게 소통하며 감정 일기를 쓰고, 정밀한 감정 어휘를 추천받아 자신의 내면을 깊이 탐색하도록 돕습니다. 이를 통해 감정 인지 능력을 훈련하고 건강한 마음 관리 습관을 형성하는 것을 목표로 합니다.

---

## 🛠️ 로컬 실행 가이드

1. `.env.example`을 복사해 `.env.local`을 만든 후 필요한 값을 설정합니다.
    ```bash
    cp .env.example .env.local
    ```
    - `REACT_APP_API_BASE_URL`: 프론트가 호출할 API 서버 주소 (기본값은 배포 서버)
    - `REACT_APP_OAUTH_BASE_URL`: 소셜 로그인 리다이렉트 주소 (기본값은 배포 서버)
    - `REACT_APP_ENABLE_DEV_LOGIN`: `true`면 로그인 화면에 디자인 모드(임시 토큰 주입) 버튼 활성화
2. 의존성을 설치하고 개발 서버를 실행합니다.
    ```bash
    npm install
    npm start
    ```
3. 프로덕션 번들을 만들려면 `npm run build`, 컨테이너 이미지는 `docker build -t cocoon-fe .`를 사용하세요.

---

## 🚀 핵심 기술 및 구현

### 기술 스택

-   **Frontend**: ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Context-API](https://img.shields.io/badge/Context--Api-000000?style=for-the-badge&logo=react)
-   **Backend**: ![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white) ![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
-   **Database**: ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
-   **AI Server**: ![ChatGPT](https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) ![LangChain](https://img.shields.io/badge/langchain-1C3C3C?style=for-the-badge&logo=LangChain&logoColor=white)
-   **Deploy, CI/CD**: ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

### 주요 구현 상세

#### 1. 채팅 기반 일기 생성

<div align="center">
  <img src=https://github.com/user-attachments/assets/e236b2bb-6d9f-4762-ad37-bee14592f855 width="500"/>
</div>

-   LLM 기반의 대화 생성 및 일기 작성 알고리즘을 설계하여, 사용자와의 자연스러운 상호작용을 통해 일기를 완성합니다.

#### 2. 414개 어휘 기반 감정 추천 시스템

<div align="center">
  <img src=https://github.com/user-attachments/assets/cfce6f2d-4407-4b6e-a1f6-88192f06ffaf width="800"/>
</div>

-   자체 구축한 414개 감정 어휘 데이터베이스를 활용해 문맥에 맞는 정밀한 감정 단어를 추천하고, 선택된 단어를 문장에 즉시 반영하여 표현의 깊이를 더합니다.

#### 3. 최종 일기 생성 및 확인

<div align="center">
  <img src=https://github.com/user-attachments/assets/11d19ded-6596-4079-9bfa-45b20e93df0c width="800"/>
</div>

-   재구성된 문장들로 최종 일기를 생성하며, 사용된 감정 단어의 뜻과 예문을 함께 제공하여 어휘력 확장을 돕습니다.

#### 4. 감정 통계 및 도감

<div align="center">
  <img src=https://github.com/user-attachments/assets/b0cadb24-88e2-4fb5-b223-df8535f76b0c width="800"/>
</div>

-   감정 통계 데이터를 시각화하여 자신의 감정 패턴을 쉽게 파악하고, 감정 도감을 통해 성취감을 느끼며 지속적인 사용을 유도합니다.

### 아키텍처

<div align="center">
  <img src=https://github.com/user-attachments/assets/354b211e-1681-40d6-8815-a63caaeea16a width="800"/>
</div>

---

## 📊 기대 효과

-   **정서 지능 강화**: 자신의 감정을 정확히 인식하고 다루는 능력을 훈련합니다.
-   **건강한 마음 관리 습관 형성**: 일기 작성을 '과업'이 아닌 '즐거운 소통'으로 전환하여 꾸준한 자기 성찰을 돕습니다.
-   **불안 통제 능력 향상**: 데이터 기반의 '걱정카드'를 통해 막연한 불안감을 스스로 통제하는 힘을 기릅니다.

---

## 👥 팀 소개 (Team Newmins)

| 이름       | 역할                  | GitHub                                      | 주요 담당                                                |
| :--------- | :-------------------- | :------------------------------------------ | :------------------------------------------------------- |
| **김민식** | FE, Design            | [pius338](https://github.com/pius338)       | 팀 운영 총괄, 프로덕트 기획, UI/UX 설계, 프론트엔드 개발 |
| **장민석** | AI, BE, Infra | [minseok128](https://github.com/minseok128) | AI 모델 개발 및 서빙, 백엔드 API, 인프라 구축 및 관리    |
