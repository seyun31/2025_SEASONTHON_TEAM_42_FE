import { ChatFlow } from '@/data/ai-chat-job-list';
import { generateExpertType } from '@/utils/expertTypeGenerator';

interface Occupation {
  imageUrl: string;
  occupationName: string;
  description: string;
  strength: string;
  workCondition: string;
  wish: string;
  score: string;
}

interface JobRecommendations {
  first: Occupation;
  second: Occupation;
  third: Occupation;
}

interface StrengthReport {
  strength: string;
  experience: string;
  keyword: string[];
  job: string[];
}

interface ApiStrengthReport {
  strength: string;
  experience: string;
  keyword: string[];
  job: string[];
}

interface LoadingData {
  loadingType: 'strengthReport' | 'jobRecommendation';
}

interface LoadPreviousConversationParams {
  userName: string;
  aiChatFlow: ChatFlow;
  strengthReports: StrengthReport[];
  jobRecommendations: JobRecommendations | null;
  addBotMessage: (content: string, questionId?: number) => void;
  addUserMessage: (content: string, questionId?: number) => void;
  addComponentMessage: (
    componentType:
      | 'strengthReport'
      | 'jobCards'
      | 'loading'
      | 'strengthReportGroup',
    componentData?:
      | StrengthReport
      | JobRecommendations
      | StrengthReport[]
      | LoadingData
      | null
  ) => void;
  setStrengthReports: (reports: StrengthReport[]) => void;
  setJobRecommendations: (recommendations: JobRecommendations | null) => void;
  setJobMessageAdded: (added: boolean) => void;
  setShowJobCards: (show: boolean) => void;
}

export const loadPreviousConversation = async ({
  userName,
  aiChatFlow,
  strengthReports,
  jobRecommendations,
  addBotMessage,
  addUserMessage,
  addComponentMessage,
  setStrengthReports,
  setJobRecommendations,
  setJobMessageAdded,
  setShowJobCards,
}: LoadPreviousConversationParams): Promise<void> => {
  try {
    // 1. 채팅 대화 기록 불러오기
    try {
      const chatResponse = await fetch('/api/chat/jobs/history/answer');
      const chatData = await chatResponse.json();

      if (
        chatData.result === 'SUCCESS' &&
        chatData.data &&
        Object.keys(chatData.data).length > 0
      ) {
        // 실제 API 응답 구조에 따라 대화 복원
        const data = chatData.data;

        // 각 필드에 대응하는 질문 ID로 대화 복원 (순서대로)
        const questionsToRestore = [
          { field: 'job', step: 1 },
          { field: 'experience', step: 2 },
          { field: 'certificateOrSkill', step: 3 },
          { field: 'personalityType', step: 4 },
          { field: 'interests', step: 5 },
          { field: 'preferredWorkStyles', step: 6 },
          { field: 'avoidConditions', step: 7 },
          { field: 'preferredWorkStyles', step: 8 }, // 근무 시간·방식
          { field: 'physicalCondition', step: 9 }, // 체력 상태
          { field: 'educationAndCareerGoal', step: 10 },
        ];

        questionsToRestore.forEach(({ field, step }) => {
          if (data[field] !== undefined && data[field] !== null) {
            const question = aiChatFlow.questions.find((q) => q.step === step);
            if (question) {
              addBotMessage(question.message.join('\n'), question.id);
              // 빈 문자열인 경우 "건너뛰기"로 표시
              const answer =
                data[field].trim() === '' ? '건너뛰기' : data[field];
              addUserMessage(answer, step);
            }
          }
        });
      } else {
      }
    } catch (chatError) {
      console.warn('채팅 기록 불러오기 실패:', chatError);
      // 채팅 기록 실패는 무시하고 계속 진행
    }

    // 2. 직업 카드 기록 불러오기 (아직 로드되지 않은 경우에만)
    if (!jobRecommendations) {
      try {
        const jobCardResponse = await fetch(
          '/api/chat/jobs/recommend/occupation'
        );
        const jobCardData = await jobCardResponse.json();

        if (
          jobCardData.result === 'SUCCESS' &&
          jobCardData.data &&
          Object.keys(jobCardData.data).length > 0
        ) {
          // 직업 추천 완료 메시지 추가
          addBotMessage(
            `${userName}님께 잘 어울리는 직업 3가지를 추천드릴게요!\n 마음에 드는 직업이 있다면 ⭐️ 아이콘을 눌러 관심목록에 저장해두세요.\n 나중에 다시 확인하실 때 훨씬 편해요 😀!`
          );

          // 직업 카드 추가
          addComponentMessage('jobCards', jobCardData.data);
          setJobRecommendations(jobCardData.data);
          setJobMessageAdded(true);
          setShowJobCards(true);
        } else {
        }
      } catch (jobCardError) {
        console.warn('직업 카드 기록 불러오기 실패:', jobCardError);
        // 직업 카드 실패는 무시하고 계속 진행
      }
    }

    // 3. 강점 리포트 기록 불러오기 (아직 로드되지 않은 경우에만)
    if (strengthReports.length === 0) {
      try {
        const strengthHistoryResponse = await fetch(
          '/api/chat/strength/history'
        );
        const strengthHistoryData = await strengthHistoryResponse.json();

        if (
          strengthHistoryData.result === 'SUCCESS' &&
          strengthHistoryData.data &&
          strengthHistoryData.data.reportList &&
          strengthHistoryData.data.reportList.length > 0
        ) {
          const reports = strengthHistoryData.data.reportList.map(
            (report: ApiStrengthReport) => ({
              strength: report.strength.replace(/입니다\.$/, ''),
              experience: report.experience,
              keyword: report.keyword,
              job: report.job,
            })
          );

          setStrengthReports(reports);

          // occupation 질문 메시지 추가
          addBotMessage(
            `이제 ${userName}만의 강점 리포트를 만들어볼게요! 📝\n이 리포트는 ${userName}이 가진 경험 속 강점을 한눈에 보여주고,\n나중에 기업에 제출할 때 '나를 소개하는 문서'로도 활용할 수 있어요 💪\n\n제2의 직업을 정하셨다면 '준비하는 직업'을 입력,\n아직 고민 중이라면 '없음'이라고 입력해주세요!`
          );

          // occupation 답변 추가
          const occupation = strengthHistoryData.data.occupation || '없음';
          addUserMessage(occupation);

          // 강점 리포트 완료 메시지 추가
          const expertType = generateExpertType(reports[0].strength);
          addBotMessage(
            `수고 많으셨어요 ${userName}! 🙏\n${userName}은 **${expertType}**입니다.`
          );

          // 강점 리포트 카드들 추가
          reports.forEach((report: StrengthReport) => {
            addComponentMessage('strengthReport', report);
          });
        }
      } catch (strengthError) {
        console.warn('강점 리포트 기록 불러오기 실패:', strengthError);
        // 강점 리포트 실패는 무시하고 계속 진행
      }
    }
  } catch (error) {
    console.error('이전 대화 기록 불러오기 전체 실패:', error);
  }
};

export const checkChatHistory = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/chat/jobs/history/answer');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // API 응답에서 에러 메시지 확인
    if (data.result !== 'SUCCESS') {
      console.warn(
        '채팅 히스토리 조회 실패:',
        data.error || '조건에 맞는 정보가 없습니다'
      );
      return false;
    }

    // data가 없거나 빈 객체인 경우도 처리
    if (!data.data || Object.keys(data.data).length === 0) {
      return false;
    }

    if (data.data?.job && data.data.job !== null && data.data.job !== '') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.warn('채팅 히스토리 확인 실패:', error);
    return false;
  }
};
