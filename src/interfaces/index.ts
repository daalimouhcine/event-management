import { Survey } from "../types";

export interface CreateSurveyProps {
  surveyNames: string[];
  isOpen: boolean;
  setOpen: () => void;
  setReFetch: () => void;
  surveyToEdit?: Survey; 
  surveyToClone?: Survey; 
  removeDefaultSurvey: () => void;
}

export interface SurveyActionsProps {
  survey: Survey;
  viewDetails?: () => void;
  displayDetails: boolean;
  setReFetch: () => void;
  setSurveyToEdit: (survey: Survey) => void;
  setSurveyToClone: (survey: Survey) => void;
  setOpenEdit: () => void;
  index?: number;
}

export interface SurveyRowProps {
  survey: Survey;
  index: number;
  setReFetch: () => void;
  setSurveyToEdit: (survey: Survey) => void;
  setSurveyToClone: (survey: Survey) => void;
  setOpenEdit: () => void;
}

export interface SurveyDetailsProps {
  isOpen: boolean;
  setOpen: () => void;
  setReFetch: () => void;
  survey: Survey;
  setSurveyToEdit: (survey: Survey) => void;
  setSurveyToClone: (survey: Survey) => void;
  surveyTitle: string;
  setOpenEdit: () => void;
}
