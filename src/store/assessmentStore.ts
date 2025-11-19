import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompanyProfile {
  companyName: string;
  industrySector: string;
  companySize: string;
  grcMaturity: string;
  email: string;
  phone: string;
}

export interface SectionAnswer {
  questionId: number;
  answer: string;
  score: number;
}

export interface AssessmentState {
  currentStep: number;
  companyProfile: CompanyProfile | null;
  sections: {
    [key: number]: SectionAnswer[];
  };
  setCurrentStep: (step: number) => void;
  setCompanyProfile: (profile: CompanyProfile) => void;
  setSectionAnswer: (sectionId: number, questionId: number, answer: string, score: number) => void;
  getSectionProgress: (sectionId: number) => number;
  getSectionScore: (sectionId: number) => number;
  getTotalScore: () => number;
  getOverallProgress: () => number;
  resetAssessment: () => void;
}

const TOTAL_QUESTIONS_PER_SECTION = 5;
const TOTAL_SECTIONS = 5;

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      companyProfile: null,
      sections: {},

      setCurrentStep: (step) => set({ currentStep: step }),

      setCompanyProfile: (profile) => set({ companyProfile: profile }),

      setSectionAnswer: (sectionId, questionId, answer, score) =>
        set((state) => {
          const sectionAnswers = state.sections[sectionId] || [];
          const existingIndex = sectionAnswers.findIndex(
            (a) => a.questionId === questionId
          );

          const updatedAnswers =
            existingIndex >= 0
              ? sectionAnswers.map((a, i) =>
                  i === existingIndex ? { questionId, answer, score } : a
                )
              : [...sectionAnswers, { questionId, answer, score }];

          return {
            sections: {
              ...state.sections,
              [sectionId]: updatedAnswers,
            },
          };
        }),

      getSectionProgress: (sectionId) => {
        const answers = get().sections[sectionId] || [];
        return answers.length;
      },

      getSectionScore: (sectionId) => {
        const answers = get().sections[sectionId] || [];
        return answers.reduce((sum, a) => sum + a.score, 0);
      },

      getTotalScore: () => {
        const state = get();
        return Object.values(state.sections).reduce(
          (total, answers) => total + answers.reduce((sum, a) => sum + a.score, 0),
          0
        );
      },

      getOverallProgress: () => {
        const state = get();
        if (!state.companyProfile) return 0;

        const totalAnswers = Object.values(state.sections).reduce(
          (sum, answers) => sum + answers.length,
          0
        );
        const totalQuestions = TOTAL_SECTIONS * TOTAL_QUESTIONS_PER_SECTION;
        return Math.round(((totalAnswers / totalQuestions) * 100));
      },

      resetAssessment: () =>
        set({
          currentStep: 0,
          companyProfile: null,
          sections: {},
        }),
    }),
    {
      name: 'readinow-assessment',
    }
  )
);
