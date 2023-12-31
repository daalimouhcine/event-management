import { useForm } from "react-hook-form";
import { Event, createEventForm } from "../types";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { CreateEventProps } from "../interfaces";

const CreateEvent: React.FC<CreateEventProps> = ({
  EventNames,
  isOpen,
  setOpen,
  setReFetch,
  eventToEdit,
  eventToClone,
  removeDefaultEvent,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const {
    register: registerEvent,
    handleSubmit: handleSubmitEvent,
    reset: resetEvent,
    watch: watchEvent,
    setError: setErrorEvent,
    clearErrors: clearErrorsEvent,
    formState: { errors: errorsEvent },
  } = useForm<createEventForm>();

  useEffect(() => {
    resetEvent({
      EventName: eventToEdit?.EventName || "",
      StartDate: eventToEdit?.StartDate
        ? new Date(eventToEdit.StartDate).toISOString().substr(0, 10)
        : eventToClone?.StartDate
        ? new Date(eventToClone.StartDate).toISOString().substr(0, 10)
        : "",
      EndDate: eventToEdit?.EndDate
        ? new Date(eventToEdit.EndDate).toISOString().substr(0, 10)
        : eventToClone?.EndDate
        ? new Date(eventToClone.EndDate).toISOString().substr(0, 10)
        : "",
      WeekDay: eventToEdit?.WeekDay || eventToClone?.WeekDay || "",
      StartTime: eventToEdit?.StartTime || eventToClone?.StartTime || "",
      EndTime: eventToEdit?.EndTime || eventToClone?.EndTime || "",
      Type: eventToEdit?.Type || eventToClone?.Type || "",
      Active: eventToEdit?.Active || false,
      Description: eventToEdit?.Description || eventToClone?.Description || "",
      Message: eventToEdit?.Message || eventToClone?.Message || "",
    });
    (eventToEdit?.StartDate && eventToEdit?.EndDate && !eventToEdit?.WeekDay) ||
    (eventToClone?.StartDate && eventToClone?.EndDate && !eventToClone?.WeekDay)
      ? setIsChecked(true)
      : setIsChecked(false);
  }, [isOpen]);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const onSubmitEvent = (data: createEventForm) => {
    if (
      (!data.StartDate && !data.WeekDay) ||
      (data.EndDate && !data.StartDate && !data.WeekDay) ||
      (data.EndTime && !data.StartTime && !isChecked) ||
      (data.StartTime && !data.EndTime && !isChecked)
    ) {
      Swal.fire({
        showClass: {
          popup: "swal2-noanimation",
          backdrop: "swal2-noanimation",
          icon: "swal2-noanimation",
        },
        hideClass: {
          popup: "",
        },
        position: "center",
        icon: "error",
        title: "Please fill the schedule fields correctly",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (eventToEdit) {
      const editedEvent: Event = {
        EventID: eventToEdit.EventID,
        EventName: data.EventName,
        WeekDay: data.WeekDay,
        StartDate: !watchEvent("WeekDay") ? data.StartDate : "",
        EndDate: !watchEvent("WeekDay") ? data.EndDate || data.StartDate : "",
        StartTime: !isChecked ? data.StartTime : "",
        EndTime: !isChecked ? data.EndTime : "",
        Type: data.Type,
        Active: data.Active || false,
        Description: data.Description,
        Message: data.Message || "",
        CreatedBy: eventToEdit.CreatedBy,
      };
      axios
        .patch(
          "https://1rix0t19h7.execute-api.eu-west-2.amazonaws.com/dev/events/" +
            eventToEdit.EventID,
          editedEvent
        )
        .then((res) => {
          setReFetch();
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
              position: "center",
              icon: "success",
              title: "Event Edited Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
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
              position: "center",
              icon: "error",
              title: "Something Went Wrong",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
    } else {
      const newEvent: Event = {
        EventName: data.EventName,
        Active: data.Active || false,
        StartDate: !watchEvent("WeekDay") ? data.StartDate : "",
        EndDate: !watchEvent("WeekDay") ? data.StartDate : "",
        WeekDay: data.WeekDay,
        StartTime: !isChecked ? data.StartTime : "",
        EndTime: !isChecked ? data.EndTime : "",
        Type: data.Type,
        CreatedBy: "Nigel Ryan",
        Description: data.Description,
        Message: data.Message || "",
      };
      axios
        .post(
          "https://1rix0t19h7.execute-api.eu-west-2.amazonaws.com/dev/events",
          newEvent
        )
        .then((res) => {
          setReFetch();
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
              position: "center",
              icon: "success",
              title: res.data.body.message,
              showConfirmButton: false,
              timer: 1500,
            });
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
              position: "center",
              icon: "error",
              title: "Something Went Wrong",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
    }
    cancel(false);
  };

  const cancel = (validation: boolean) => {
    if (validation) {
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
        confirmButtonText: "Yes, Cancel!",
      }).then((result) => {
        if (result.isConfirmed) {
          resetEvent({
            EventName: "",
            StartDate: "",
            EndDate: "",
            WeekDay: "",
            StartTime: "",
            EndTime: "",
            Type: "",
            Description: "",
            Message: "",
          });
          setIsChecked(false);
          setOpen();
          if (eventToEdit || eventToClone) {
            removeDefaultEvent();
          }
          Swal.fire({
            showClass: {
              popup: "swal2-noanimation",
              backdrop: "swal2-noanimation",
              icon: "swal2-noanimation",
            },
            hideClass: {
              popup: "",
            },
            title: "Canceled!",
            text: "Your operation has been canceled.",
            icon: "success",
          });
        }
      });
    } else {
      resetEvent({
        EventName: "",
        StartDate: "",
        EndDate: "",
        WeekDay: "",
        StartTime: "",
        EndTime: "",
        Type: "",
        Description: "",
        Message: "",
      });
      setIsChecked(false);
      setOpen();
    }
  };

  const validateName = (name: string) => {
    if (EventNames.includes(name) && !eventToEdit) {
      return "the name is already exists";
    } else {
      clearErrorsEvent("EventName");
    }
  };
  const validateDate = (date: string, type: string) => {
    if (
      new Date(date) < new Date() &&
      new Date(date).getDate() !== new Date().getDate() &&
      !watchEvent("WeekDay")
    ) {
      return "Start Date cannot be before the current date";
    } else if (type === "StartDate") {
      if (
        new Date(date) > new Date(watchEvent("EndDate")) &&
        isChecked &&
        !watchEvent("WeekDay")
      ) {
        setErrorEvent("EndDate", {
          type: "manual",
          message: "End Date cannot be before the Start Date",
        });
        return "Start Date cannot be after the End Date";
      } else {
        clearErrorsEvent("StartDate");
        clearErrorsEvent("EndDate");
      }
    } else if (type === "EndDate" && isChecked) {
      if (new Date(date) < new Date(watchEvent("StartDate"))) {
        setErrorEvent("StartDate", {
          type: "manual",
          message: "Start Date cannot be after the End Date",
        });
        return "End Date cannot be before the Start Date";
      } else {
        clearErrorsEvent("StartDate");
        clearErrorsEvent("EndDate");
      }
    }
    if (
      type === "EndDate" &&
      !watchEvent("StartDate") &&
      !watchEvent("WeekDay")
    ) {
      setErrorEvent("StartDate", {
        type: "manual",
        message: "You also need to fill the Start Date",
      });
    }
  };
  const validateTime = (time: string, type: string) => {
    if (
      watchEvent("StartDate") &&
      time < new Date().toTimeString() &&
      time !== new Date().toTimeString() &&
      (watchEvent("StartTime") || watchEvent("EndTime"))
    ) {
      return "Start Time cannot be before the current Time";
    } else if (type === "StartTime") {
      if (
        time > watchEvent("EndTime")! &&
        watchEvent("EndTime") &&
        !isChecked
      ) {
        setErrorEvent("EndTime", {
          type: "manual",
          message: "End Time cannot be before the Start Time",
        });
        return "Start Time cannot be after the End Time";
      } else {
        clearErrorsEvent("StartTime");
        clearErrorsEvent("EndTime");
      }
    } else if (type === "EndTime") {
      if (
        time < watchEvent("StartTime")! &&
        watchEvent("StartTime") &&
        !isChecked
      ) {
        setErrorEvent("StartTime", {
          type: "manual",
          message: "Start Time cannot be after the End Time",
        });
        return "End Time cannot be before the Start Time";
      } else {
        clearErrorsEvent("StartTime");
        clearErrorsEvent("EndTime");
      }
    }
  };

  const validateActive = () => {
    if (watchEvent("Active")) {
      Swal.fire({
        showClass: {
          popup: "swal2-noanimation",
          backdrop: "swal2-noanimation",
          icon: "swal2-noanimation",
        },
        hideClass: {
          popup: "",
        },
        title: "Only one content can be active at a time",
        text: "If you activate this content, the other active content will be deactivated",
      });
      return;
    }
  };

  return (
    <div
      className={`max-h-[90vh] h-fit w-screen sm:w-[90vw] flex flex-col gap-y-3 px-5 py-8 sm:p-10 rounded-sm bg-gray-400 fixed z-30 ${
        !isOpen ? "-top-full" : "top-1/2"
      } left-1/2 transition-all ease-out duration-100 -translate-x-1/2 -translate-y-1/2 overflow-y-scroll hide-scroll-bar`}>
      <div className='bg-white h-3 w-28  absolute top-2 left-1/2 -translate-x-1/2'></div>
      <form onSubmit={handleSubmitEvent(onSubmitEvent)}>
        <div className='w-full flex justify-between items-center'>
          <h3 className='font-bold text-xl lg:text-3xl text-gray-900'>
            {eventToEdit ? "Edit Event" : "Create Event"}
          </h3>
          <div className='flex gap-x-2'>
            <button
              type='submit'
              className='relative px-5 py-2.5 overflow-hidden font-medium text-green-500 bg-gray-100 border-2 border-gray-100 hover:border-green-500  shadow-inner group'>
              {eventToEdit ? "Save" : "Create"}
            </button>
            <button
              type='button'
              onClick={() => cancel(true)}
              className='relative px-5 py-2.5 overflow-hidden font-medium text-red-500 bg-gray-100 border-2 border-gray-100 hover:border-red-500  shadow-inner group'>
              Cancel
            </button>
          </div>
        </div>
        <div className='w-full h-fit flex flex-col gap-y-3 bg-gray-50  p-5 pb-10 mt-5'>
          <p className='text-gray-800 text-sm font-medium w-fit border-b-2 border-black pb-1'>
            1. Start with setting up your event information
          </p>
          <div className='flex flex-col gap-y-8'>
            <div className='flex max-md:flex-col gap-x-5'>
              <div className='w-5/5 md:w-3/5 flex gap-x-5'>
                <div className='w-3/4 max-md:w-full relative mt-2'>
                  <input
                    className={`peer h-full w-full border-b ${
                      errorsEvent.EventName
                        ? "border-red-200"
                        : "border-gray-200"
                    } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                      errorsEvent.EventName
                        ? "placeholder-shown:border-red-200"
                        : "placeholder-shown:border-gray-200"
                    } focus:border-green-500 focus:outline-0 disabled:border-0`}
                    placeholder=' '
                    type='text'
                    id='EventName'
                    {...registerEvent("EventName", {
                      required: true,
                      validate: (value) => validateName(value),
                    })}
                  />
                  <label
                    htmlFor='EventName'
                    className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                    Event Name
                  </label>
                  {errorsEvent.EventName && (
                    <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                      {errorsEvent.EventName.type === "required"
                        ? "This field is required"
                        : errorsEvent.EventName.message}
                    </p>
                  )}
                </div>
                <div className='w-1/4'>
                  <label className='flex flex-col gap-y-1 cursor-pointer select-none items-center'>
                    <i className='text-gray-800 text-sm font-medium'>
                      Is Active
                    </i>
                    <div className='relative'>
                      <input
                        type='checkbox'
                        id='Active'
                        {...registerEvent("Active", {
                          onChange: validateActive,
                        })}
                        className='sr-only'
                      />
                      <div className='h-5 w-14  bg-[#E5E7EB] shadow-inner'></div>
                      <div
                        className={`shadow-md absolute -top-1 flex h-7 w-7 items-center justify-center  transition-all ease-linear duration-200 ${
                          watchEvent("Active")
                            ? "!bg-white left-1/2"
                            : "bg-white left-0"
                        }`}>
                        <span
                          className={`active h-4 w-4   ${
                            watchEvent("Active")
                              ? "bg-blue-500"
                              : "bg-[#E5E7EB]"
                          }`}></span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <div className='w-2/5 max-md:w-full relative mt-8 md:mt-2'>
                <select
                  defaultValue=''
                  className={`peer h-full w-full border-b ${
                    errorsEvent.Type ? "border-red-200" : "border-gray-200"
                  } bg-transparent font-sans pt-4 pb-4 text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errorsEvent.Type
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  id='Type'
                  {...registerEvent("Type", { required: true })}>
                  <option value='' disabled hidden>
                    Select Type
                  </option>
                  <option value='C'>Closure</option>
                  <option value='M1'>Custom Message 1 </option>
                  <option value='M2'>Custom Message 2</option>
                </select>
                <label
                  htmlFor='Type'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Type
                </label>
                {errorsEvent.Type && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    Type is required
                  </p>
                )}
              </div>
            </div>
            <div className='w-full flex gap-x-5'>
              <div className='w-1/2 h-fit max-md:w-full relative mt-auto'>
                <input
                  className={`peer h-full w-full border-b ${
                    errorsEvent.Message ? "border-red-200" : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errorsEvent.Message
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:text-gray-500`}
                  placeholder=' '
                  type='text'
                  id='Message'
                  {...registerEvent("Message", {
                    required: watchEvent("Type") !== "C" ? true : false,
                  })}
                />
                <label
                  htmlFor='Message'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-gray-500 peer-disabled:peer-placeholder-shown:text-gray-800">
                  Message
                </label>
                {errorsEvent.Message && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    {errorsEvent.Message.type === "required" &&
                      "This field is required"}
                  </p>
                )}
              </div>
              <div className='w-1/2 relative'>
                <input
                  type='text'
                  id='Description'
                  className={`peer h-full w-full border-b ${
                    errorsEvent.Description
                      ? "border-red-200"
                      : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errorsEvent.Description
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  placeholder=' '
                  {...registerEvent("Description", { required: true })}
                />{" "}
                <label
                  htmlFor='Description'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Description
                </label>
                {errorsEvent.Description && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    Description is required
                  </p>
                )}
              </div>
            </div>
          </div>
          <p className='text-gray-800 text-sm font-medium mt-5 w-fit border-b-2 border-black pb-1 mb-5'>
            2. Schedule your Event
          </p>
          <div className='flex px-24 max-md:px-0 gap-x-10 max-md:gap-x-5 items-center w-full'>
            <div className='w-2/5 flex flex-col gap-y-8'>
              <div className='w-full relative mt-1'>
                <input
                  className={`peer h-full w-full border-b ${
                    errorsEvent.StartDate ? "border-red-200" : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errorsEvent.StartDate
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  placeholder=' '
                  type='date'
                  id='StartDate'
                  {...registerEvent("StartDate", {
                    required: false,
                    validate: (value) => validateDate(value, "StartDate"),
                  })}
                  disabled={watchEvent("WeekDay") ? true : false}
                  value={
                    watchEvent("WeekDay") ? "" : watchEvent("StartDate") || ""
                  }
                />
                <label
                  htmlFor='StartDate'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-gray-500 peer-disabled:peer-placeholder-shown:text-gray-800">
                  Start Date
                </label>
                {errorsEvent.StartDate && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    {errorsEvent.StartDate.type === "required"
                      ? "This field is required"
                      : errorsEvent.StartDate.message}
                  </p>
                )}
              </div>
              <div className='w-full relative'>
                <select
                  defaultValue=''
                  className={`peer h-full w-full border-b ${
                    errorsEvent.WeekDay ? "border-red-200" : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errorsEvent.WeekDay
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  id='WeekDay'
                  {...registerEvent("WeekDay", { required: false })}
                  disabled={watchEvent("StartDate") ? true : false}>
                  <option value='' className='text-gray-500'>
                    Select Day
                  </option>
                  <option value='Sunday'>Sunday</option>
                  <option value='Monday'>Monday</option>
                  <option value='Tuesday'>Tuesday</option>
                  <option value='Wednesday'>Wednesday</option>
                  <option value='Thursday'>Thursday</option>
                  <option value='Friday'>Friday</option>
                  <option value='Saturday'>Saturday</option>
                </select>
                <label
                  htmlFor='WeekDay'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-gray-500 peer-disabled:peer-placeholder-shown:text-gray-800">
                  Week Day
                </label>
                {errorsEvent.WeekDay && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    Week Day is required
                  </p>
                )}
              </div>
            </div>
            <div className='w-1/5'>
              <label className='flex flex-col gap-y-1 cursor-pointer select-none items-center'>
                <i className='text-gray-800 text-sm font-medium'>All Day</i>
                <div className='relative'>
                  <input
                    type='checkbox'
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className='sr-only'
                  />
                  <div className='h-5 w-14  bg-[#E5E7EB] shadow-inner'></div>
                  <div
                    className={`shadow-md absolute -top-1 flex h-7 w-7 items-center justify-center  transition-all ease-linear duration-200 ${
                      isChecked ? "!bg-white left-1/2" : "bg-white left-0"
                    }`}>
                    <span
                      className={`active h-4 w-4   ${
                        isChecked ? "bg-blue-500" : "bg-[#E5E7EB]"
                      }`}></span>
                  </div>
                </div>
              </label>
            </div>
            <div className={`${!isChecked && "hidden"} w-2/5 relative mt-1`}>
              <input
                className={`peer h-full w-full border-b ${
                  errorsEvent.EndDate ? "border-red-200" : "border-gray-200"
                } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                  errorsEvent.EndDate
                    ? "placeholder-shown:border-red-200"
                    : "placeholder-shown:border-gray-200"
                } focus:border-green-500 focus:outline-0 disabled:border-0`}
                placeholder=' '
                type='date'
                id='EndDate'
                {...registerEvent("EndDate", {
                  required: false,
                  validate: (value) => validateDate(value, "EndDate"),
                })}
                disabled={watchEvent("WeekDay") ? true : false}
                value={
                  watchEvent("WeekDay")
                    ? watchEvent("StartDate")
                    : watchEvent("EndDate")
                }
                contentEditable={false}
                // readOnly
              />
              <label
                htmlFor='EndDate'
                className="after:content[' '] pointer-events-none absolute left-0 -top-2 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-gray-500 peer-disabled:peer-placeholder-shown:text-gray-800">
                End Date
              </label>
              {errorsEvent.EndDate && (
                <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                  {errorsEvent.EndDate.type === "required"
                    ? "This field is required"
                    : errorsEvent.EndDate.message}
                </p>
              )}
            </div>
            <div
              className={`${
                isChecked && "hidden"
              } w-2/5 flex flex-col gap-7 relative `}>
              <div className='relative'>
                <input
                  className={`peer h-full w-full border-b ${
                    errorsEvent.StartTime ? "border-red-200" : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errorsEvent.StartTime
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  placeholder=' '
                  type='time'
                  id='StartTime'
                  {...registerEvent("StartTime", {
                    required: watchEvent("EndTime") ? true : false,
                    validate: (value) => validateTime(value!, "StartTime"),
                  })}
                />
                <label
                  htmlFor='StartTime'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Start Time
                </label>
                {errorsEvent.StartTime && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    {errorsEvent.StartTime.type === "required"
                      ? "This field is required"
                      : errorsEvent.StartTime.message}
                  </p>
                )}
              </div>
              <div className=' relative'>
                <input
                  className={`peer h-full w-full border-b ${
                    errorsEvent.EndTime ? "border-red-200" : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errorsEvent.EndTime
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  placeholder=' '
                  type='time'
                  id='EndTime'
                  {...registerEvent("EndTime", {
                    required: watchEvent("StartTime") ? true : false,
                    validate: (value) => validateTime(value!, "EndTime"),
                  })}
                />
                <label
                  htmlFor='EndTime'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  End Time
                </label>
                {errorsEvent.EndTime && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    {errorsEvent.EndTime.type === "required"
                      ? "This field is required"
                      : errorsEvent.EndTime.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
