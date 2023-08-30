import { Event } from "../types";

export interface CreateEventProps {
  eventNames: string[];
  isOpen: boolean;
  setOpen: () => void;
  setReFetch: () => void;
  eventToEdit?: Event;
  eventToClone?: Event;
  removeDefaultEvent: () => void;
}

export interface EventActionsProps {
  event: Event;
  viewDetails?: () => void;
  displayDetails: boolean;
  setReFetch: () => void;
  setEventToEdit: (event: Event) => void;
  setEventToClone: (event: Event) => void;
  setOpenEdit: () => void;
  index?: number;
}

export interface EventRowProps {
  event: Event;
  index: number;
  setReFetch: () => void;
  setEventToEdit: (event: Event) => void;
  setEventToClone: (event: Event) => void;
  setOpenEdit: () => void;
}

export interface EventDetailsProps {
  isOpen: boolean;
  setOpen: () => void;
  setReFetch: () => void;
  event: Event;
  setEventToEdit: (event: Event) => void;
  setEventToClone: (event: Event) => void;
  eventTitle: string;
  setOpenEdit: () => void;
}
