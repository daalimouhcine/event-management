export type Event = {
  EventID?: string;
  EventName?: string;
  StartDate?: string;
  EndDate?: string;
  WeekDay?: string;
  StartTime?: string;
  EndTime?: string;
  Type: string;
  Description: string;
  Message?: string;
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
  Type: string;
  Active: boolean;
  Message?: string;
  Description: string;
};

export type Search = {
  search: string;
  byActive: boolean;
  byInActive: boolean;
};
