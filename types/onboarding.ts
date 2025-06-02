export interface OnboardingState {
  currentStep: number;
  companyDescription: string;
  companyWebsite: string;
  capabilityStatements: File[];
  resumes: File[];
  proposals: File[];
}

export interface StepProps {
  state: OnboardingState;
  setState: (state: OnboardingState) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}