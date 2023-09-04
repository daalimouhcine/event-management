import { XMarkIcon } from "@heroicons/react/20/solid";
import { EventDetailsProps } from "../interfaces";
import EventActions from "./EventActions";
import { Event } from "../types";

const EventDetails: React.FC<EventDetailsProps> = ({
  isOpen,
  setOpen,
  setReFetch,
  setEventToEdit,
  setEventToClone,
  event,
  setOpenEdit,
}) => {
  const editEvent = (event: Event) => {
    setEventToEdit(event);
  };

  const cloneEvent = (event: Event) => {
    setEventToClone(event);
  };

  return (
    <div
      className={`h-[90vh] sm:h-[85vh] w-screen sm:w-[90vw] flex flex-col gap-y-3 px-5 py-8 sm:p-10 rounded-t-3xl bg-gray-400 fixed z-30 ${
        !isOpen ? "-bottom-full" : "-bottom-0"
      } transition-all ease-out duration-500 left-1/2 -translate-x-1/2 overflow-y-scroll hide-scroll-bar`}>
      <div className='bg-white h-3 w-28 rounded-full absolute top-2 left-1/2 -translate-x-1/2'></div>
      <div className='w-full flex justify-between items-center'>
        <h3 className='font-bold text-xl lg:text-3xl text-gray-900'>
          Event Details: {event.EventName || "Name Not assigned"}
        </h3>
        <div className='flex gap-x-2 items-center'>
          <EventActions
            event={event}
            displayDetails={false}
            setReFetch={setReFetch}
            setEventToEdit={editEvent}
            setEventToClone={cloneEvent}
            setOpenEdit={() => {
              setOpen();
              setOpenEdit();
            }}
          />
          <button
            onClick={() => setOpen()}
            className='p-1 lg:p-2 bg-white rounded-lg grid place-items-center shadow-md hover:shadow-2xl transition'>
            <XMarkIcon className='h-5 w-5 lg:h-6 lg:w-6 text-gray-900' />
          </button>
        </div>
      </div>
      <div className='w-full h-fit flex flex-col gap-y-8 bg-gray-50 rounded-lg p-5 mt-5'>
        <div className='flex flex-col gap-5'>
          <div className='flex w-full'>
            <div className='w-1/2'>
              <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
                Type
              </h4>
              <p className='text-sm lg:text-base text-gray-500'>
                {event.Type === "C"
                  ? "Closure "
                  : event.Type === "E"
                  ? "Emergency"
                  : event.Type === "M1"
                  ? "Custom Message 1"
                  : event.Type === "M2"
                  ? "Custom Messag 2"
                  : "Not assigned"}
              </p>
            </div>
            <div className='w-1/2'>
              <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
                Week Day
              </h4>
              <p className='text-sm lg:text-base text-gray-500'>
                {event.WeekDay || "Not assigned"}
              </p>
            </div>
          </div>
          <div className='flex w-full'>
            <div className='w-1/2'>
              <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
                Start-End Date
              </h4>
              <p className='text-sm lg:text-base text-gray-500'>
                {`${event.StartDate || "Not assigned"} - ${
                  event.EndDate || "Not assigned"
                }`}
              </p>
            </div>
            <div className='w-1/2'>
              <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
                Start-End Time
              </h4>
              <p className='text-sm lg:text-base text-gray-500'>
                {`${event.StartTime || "Not assigned"} - ${
                  event.EndTime || "Not assigned"
                }`}
              </p>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-8'>
          <div className='w-1/2'>
            <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
              Description
            </h4>
            <p className='text-sm lg:text-base text-gray-500'>
              {event.Description}
            </p>
          </div>
          <div className='w-1/2'>
            <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
              Message
            </h4>
            <p className='text-sm lg:text-base text-gray-500'>
              {event.Message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
