import { Event } from "../types";
import { useState } from "react";
import EventDetails from "./EventDetails";
import EventActions from "./EventActions";
import { EventRowProps } from "../interfaces";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "./Loader";
import { ArrowsRightLeftIcon } from "@heroicons/react/20/solid";

const EventRow: React.FC<EventRowProps> = ({
  event,
  index,
  setReFetch,
  setEventToEdit,
  setEventToClone,
  setOpenEdit,
}) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const editEvent = (event: Event) => {
    setEventToEdit(event);
  };
  const cloneEvent = (event: Event) => {
    setEventToClone(event);
  };

  const toggleActive = (event: Event) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        event.Active = !event.Active;
        axios
          .patch(
            "https://1rix0t19h7.execute-api.eu-west-2.amazonaws.com/dev/events/" +
              event.EventID,
            event
          )
          .then((res) => {
            setLoading(false);
            if (res.data.statusCode == 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "the event status is updated",
                showConfirmButton: false,
                timer: 1500,
              });
              setReFetch();
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Something Went Wrong",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
      } else {
        Swal.fire("Canceled!", "Your operation has been canceled.", "success");
      }
    });
  };

  return (
    <>
      <tr>
        <td>
          <Loader display={loading} />
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
          {event.EventName || "Not assigned"}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          <p className='w-36 truncate'>{event.Description || "Not assigned"}</p>
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.WeekDay || "Not assigned"}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {`${event.StartDate || "Not assigned"} - ${
            event.EndDate || "Not assigned"
          }`}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {`${event.StartTime || "Not assigned"} - ${
            event.EndTime || "Not assigned"
          }`}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.Type === "C"
            ? "Closure "
            : event.Type === "M1"
            ? "Custom Message 1"
            : event.Type === "M2"
            ? "Custom Messag 2"
            : "Not assigned"}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          <p className='w-44 truncate'>{event.Message}</p>
        </td>
        <td
          onClick={() => toggleActive(event)}
          className='flex gap-x-2 whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.Active ? (
            <span className='inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800'>
              Active
            </span>
          ) : (
            <span className='inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800'>
              Not Active
            </span>
          )}
          <ArrowsRightLeftIcon className='h-5 w-5 text-gray-400' />
        </td>
        {/* <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {event.CreatedBy}
        </td> */}
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
