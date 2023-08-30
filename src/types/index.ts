export type Event = {
  eventId?: number | string;
  eventName: string;
  startDateTime: string;
  endDate: string;
  weekDay: string;
  eventType: string;
  description?: string;
  message: string;
  active: boolean;
  createdBy?: string;
};

export type createEventForm = {
  eventName: string;
  startDate: string;
  endDate: string;
  introPrompt: string;
  outroPrompt: string;
  description: string;
};

export type createQuestionForm = {
  questionNumber?: number;
  questionText: string;
  minValue: number;
  maxValue: number;
};

export type Search = {
  search: string;
  byActive: boolean;
  byInactive: boolean;
};
