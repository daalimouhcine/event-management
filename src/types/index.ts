export type Event = {
  ["Event ID"]?: string | number;
  EventName?: string;
  StartDate?: string;
  EndDate?: string;
  WeekDay?: string;
  StartTime?: string;
  EndTime?: string;
  Type: string;
  Description: string;
  Message: string;
  Active: boolean;
  CreatedBy: string;
};

export type createEventForm = {
  EventName: string;
  StartDate: string;
  EndDate: string;
  WeekDay?: string;
  StartTime?: string;
  EndTime?: string;
  Description: string;
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
  byInActive: boolean;
};
