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

  const removeEvent = (eventId: number) => {
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
            "https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/events/" +
              eventId
          )
          .then((res) => {
            if (res.data.statusCode == 200) {
              const responseMessage = JSON.parse(res.data.body);
              Swal.fire("Deleted!", responseMessage.message, "success");
              setReFetch();
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

  // const duplicate = (event: Event) => {
  //   setShowLoader(true);
  //   const clonedEvent: Event = {
  //     eventName: event.eventName,
  //     eventActive: event.eventActive,
  //     startDate: event.startDate,
  //     endDate: event.endDate,
  //     introPrompt: event.introPrompt,
  //     outroPrompt: event.outroPrompt,
  //     CreatedBy: "Mouhcine Daali",
  //     description: event.description,
  //     questions: [...event.questions],
  //   };
  //   axios
  //     .post(
  //       "https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/events",
  //       clonedEvent
  //     )
  //     .then((res) => {
  //       setReFetch();
  //       setShowLoader(false);
  //       if (res.data.statusCode == 200) {
  //         const responseMessage = JSON.parse(res.data.body);
  //         Swal.fire({
  //           position: "center",
  //           icon: "success",
  //           title: responseMessage.message,
  //           showConfirmButton: false,
  //           timer: 1500,
  //         });
  //       } else {
  //         Swal.fire({
  //           position: "center",
  //           icon: "error",
  //           title: "Something Went Wrong",
  //           showConfirmButton: false,
  //           timer: 1500,
  //         });
  //       }
  //     });
  // };

  return (
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
            removeEvent(event.eventId!);
          }}
          className='w-full flex items-center justify-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
          <span>Delete</span>
          <TrashIcon className='w-4 h-4 ml-2 inline-block text-red-400' />
        </button>
      </div>
    </div>
  );
};

export default EventActions;
