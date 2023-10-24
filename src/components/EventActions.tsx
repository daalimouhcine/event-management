import {
  DocumentDuplicateIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Event } from "../types";
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
}) => {
  const removeEvent = (eventId: string) => {
    Swal.fire({
      showClass: {
        popup: "swal2-noanimation",
        backdrop: "swal2-noanimation",
        icon: "swal2-noanimation",
      },
      hideClass: {
        popup: "",
      },
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
              Swal.fire({
                showClass: {
                  popup: "swal2-noanimation",
                  backdrop: "swal2-noanimation",
                  icon: "swal2-noanimation",
                },
                hideClass: {
                  popup: "",
                },
                title: "Deleted!",
                text: res.data.body.message,
                icon: "success",
              });
              setReFetch();
            } else {
              Swal.fire({
                showClass: {
                  popup: "swal2-noanimation",
                  backdrop: "swal2-noanimation",
                  icon: "swal2-noanimation",
                },
                hideClass: {
                  popup: "",
                },
                title: "Error!",
                text: "Something went wrong, please try again later",
                icon: "error",
              });
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

  return (
    <>
      <div className='relative Actions w-fit mx-auto'>
        <div className={`w-fit flex gap-x-1 Actions`}>
          {displayDetails && (
            <button
              onClick={() => {
                viewDetails && viewDetails();
              }}
              className='w-full flex items-center justify-center px-1 py-1 text-xs text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900'>
              <EyeIcon className='w-4 h-4 inline-block text-green-400' />
            </button>
          )}
          <button
            onClick={() => {
              editEvent(event!);
            }}
            className='w-full flex items-center justify-center px-1 py-1 text-xs text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900'>
            <PencilSquareIcon className='w-4 h-4 inline-block text-blue-400' />
          </button>
          <button
            onClick={() => {
              cloneEvent(event!);
            }}
            className='w-full flex items-center justify-center px-1 py-1 text-xs text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900'>
            <DocumentDuplicateIcon className='w-4 h-4 inline-block text-yellow-400' />
          </button>
          <button
            onClick={() => {
              removeEvent(event?.EventID!);
            }}
            className='w-full flex items-center justify-center px-1 py-1 text-xs text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900'>
            <TrashIcon className='w-4 h-4 inline-block text-red-400' />
          </button>
        </div>
      </div>
    </>
  );
};

export default EventActions;
