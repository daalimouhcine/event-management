import { useState } from "react";
import {
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Event } from "../types";
import { useClickOutside } from "../hooks/useClickOutside";
import Swal from "sweetalert2";
import axios from "axios";
import { EventActionsProps } from "../interfaces";
import EventDetails from "./EventDetails";

const EventActions: React.FC<EventActionsProps> = ({
  event,
  viewDetails,
  displayDetails,
  setReFetch,
  setEventToEdit,
  setEventToClone,
  setOpenEdit,
  index,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => {
    setOpen(false);
  });

  const removeEvent = (eventId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            "https://1rix0t19h7.execute-api.eu-west-2.amazonaws.com/dev/events/" +
              eventId
          )
          .then((res) => {
            if (res.data.statusCode == 200) {
              Swal.fire("Deleted!", res.data.body.message, "success");
              setReFetch();
            } else {
              Swal.fire(
                "Error!",
                "Something went wrong, please try again later",
                "error"
              );
            }
          });
      }
    });
  };

  const editEvent = (event: Event) => {
    setEventToEdit(event);
    setOpenEdit();
  };
  const cloneEvent = (event: Event) => {
    setEventToClone(event);
    setOpenEdit();
  };

  const [openDetails, setOpenDetails] = useState(false);

  return (
    <>
      <EventDetails
        event={event}
        isOpen={openDetails}
        setReFetch={setReFetch}
        setOpen={() => setOpenDetails(!openDetails)}
        setEventToEdit={editEvent}
        setEventToClone={cloneEvent}
        setOpenEdit={() => setOpenEdit()}
      />
      <div ref={open ? ref : undefined} className='relative'>
        <button
          onClick={() => setOpen(!open)}
          className='p-1 bg-gray-300 rounded-md hover:bg-gray-200 transition-colors ease-linear duration-200'>
          <EllipsisVerticalIcon className='w-5 h-5 text-gray-800' />
        </button>
        <div
          className={`w-fit flex flex-col absolute right-0 -translate-x-1/3 top-0 ${
            index! === 0 || !displayDetails
              ? "-translate-y-2/3"
              : "-translate-y-full"
          } mt-8 bg-white rounded-md overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
            open ? "" : "hidden"
          }`}>
          {displayDetails && (
            <button
              onClick={() => {
                setOpen(false);
                viewDetails && viewDetails();
              }}
              className='w-full flex items-center justify-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
              <span>Details</span>
              <EyeIcon className='w-4 h-4 ml-2 inline-block text-green-400' />
            </button>
          )}
          <button
            onClick={() => {
              setOpen(false);
              editEvent(event);
            }}
            className='w-full flex items-center justify-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
            <span>Edit</span>
            <PencilSquareIcon className='w-4 h-4 ml-2 inline-block text-blue-400' />
          </button>
          <button
            onClick={() => {
              setOpen(false);
              cloneEvent(event);
            }}
            className='w-full flex items-center justify-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
            <span>Duplicate</span>
            <DocumentDuplicateIcon className='w-4 h-4 ml-2 inline-block text-yellow-400' />
          </button>
          <button
            onClick={() => {
              setOpen(false);
              removeEvent(event.EventID!);
            }}
            className='w-full flex items-center justify-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
            <span>Delete</span>
            <TrashIcon className='w-4 h-4 ml-2 inline-block text-red-400' />
          </button>
        </div>
      </div>
    </>
  );
};

export default EventActions;
