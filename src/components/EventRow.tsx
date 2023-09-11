import { Event } from "../types";
import { useState } from "react";
import EventDetails from "./EventDetails";
import EventActions from "./EventActions";
import { EventRowProps } from "../interfaces";

const EventRow: React.FC<EventRowProps> = ({
  event,
  index,
  setReFetch,
  setEventToEdit,
  setEventToClone,
  setOpenEdit,
}) => {
  const [openDetails, setOpenDetails] = useState(false);

  const editEvent = (event: Event) => {
    setEventToEdit(event);
  };
  const cloneEvent = (event: Event) => {
    setEventToClone(event);
  };

  return (
    <>
      <tr>
        <td>
          <EventDetails
            event={event}
            isOpen={openDetails}
            setReFetch={setReFetch}
            setOpen={() => setOpenDetails(!openDetails)}
            setEventToEdit={editEvent}
            setEventToClone={cloneEvent}
            setOpenEdit={() => setOpenEdit()}
          />
        </td>
      </tr>
      <tr
        className={`hover:bg-gray-100 cursor-pointer ${
          index % 2 === 0 ? undefined : "bg-gray-50"
        }`}>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.EventName || ""}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          <p className='w-36 truncate'>{event.Description || ""}</p>
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          <p className='w-36 truncate'>{event.Message || ""}</p>
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.Type === "C"
            ? "Closure "
            : event.Type === "M1"
            ? "Custom Message 1"
            : "Custom Message 2"}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.WeekDay || ""}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.StartDate || ""}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.EndDate || ""}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.StartTime || ""}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.EndTime || ""}
        </td>
        <td className='flex gap-x-2 whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.Active ? (
            <span className='inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800'>
              Active
            </span>
          ) : (
            <span className='inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800'>
              Inactive
            </span>
          )}
        </td>
        <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
          <EventActions
            event={event}
            viewDetails={() => setOpenDetails(true)}
            displayDetails={true}
            setReFetch={setReFetch}
            setEventToEdit={editEvent}
            setEventToClone={cloneEvent}
            setOpenEdit={() => setOpenEdit()}
            index={index}
          />
        </td>
      </tr>
    </>
  );
};

export default EventRow;
