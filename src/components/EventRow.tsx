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
            eventTitle={event.eventName}
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
          className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
          {event.eventId}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.eventName}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {new Date(event.startDateTime).toDateString()}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {new Date(event.endDate).toDateString()}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.weekDay}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.eventType}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          <p className='w-44 truncate'>{event.message}</p>
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.status ? (
            <span className='inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800'>
              Active
            </span>
          ) : (
            <span className='inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800'>
              Not Active
            </span>
          )}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.createdBy}
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
