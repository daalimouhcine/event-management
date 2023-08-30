import { useForm } from "react-hook-form";
import { Question, Event, createQuestionForm, createEventForm } from "../types";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Swal from "sweetalert2";
import axios from "axios";
import { CreateEventProps } from "../interfaces";

const CreateEvent: React.FC<CreateEventProps> = ({
  eventNames,
  isOpen,
  setOpen,
  setReFetch,
  eventToEdit,
  eventToClone,
  removeDefaultEvent,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionOnEdit, setQuestionOnEdit] = useState<number>(0);

  const {
    register: registerEvent,
    handleSubmit: handleSubmitEvent,
    reset: resetEvent,
    watch: watchEvent,
    setError: setErrorEvent,
    clearErrors: clearErrorsEvent,
    formState: { errors: errorsEvent },
  } = useForm<createEventForm>();
  const {
    register: registerQuestion,
    handleSubmit: handleSubmitQuestion,
    reset: resetQuestion,
    watch: watchQuestion,
    setError: setErrorQuestion,
    clearErrors: clearErrorsQuestion,
    formState: { errors: errorsQuestion },
  } = useForm<createQuestionForm>();

  useEffect(() => {
    setQuestions(eventToEdit?.questions || eventToClone?.questions || []);
    resetEvent({
      eventName: eventToEdit?.eventName || "",
      startDate: eventToEdit?.startDate
        ? new Date(eventToEdit.startDate).toISOString().substr(0, 10)
        : eventToClone?.startDate
        ? new Date(eventToClone.startDate).toISOString().substr(0, 10)
        : "",
      endDate: eventToEdit?.endDate
        ? new Date(eventToEdit.endDate).toISOString().substr(0, 10)
        : eventToClone?.endDate
        ? new Date(eventToClone.endDate).toISOString().substr(0, 10)
        : "",
      introPrompt: eventToEdit?.introPrompt || eventToClone?.introPrompt || "",
      outroPrompt: eventToEdit?.outroPrompt || eventToClone?.outroPrompt || "",
      description: eventToEdit?.description || eventToClone?.description || "",
    });
  }, [isOpen]);

  const onSubmitEvent = (data: createEventForm) => {
    if (eventToEdit) {
      const editedEvent: Event = {
        eventId: eventToEdit.eventId,
        eventName: data.eventName,
        eventActive: eventToEdit.eventActive,
        startDate: data.startDate,
        endDate: data.endDate,
        introPrompt: data.introPrompt,
        outroPrompt: data.outroPrompt,
        CreatedBy: eventToEdit.CreatedBy,
        description: data.description,
        questions: [...questions],
      };

      axios
        .patch(
          "https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/events/" +
            eventToEdit.eventId,
          editedEvent
        )
        .then((res) => {
          setReFetch();
          if (res.data.statusCode == 200) {
            const responseMessage = JSON.parse(res.data.body);
            Swal.fire({
              position: "center",
              icon: "success",
              title: responseMessage.message,
              showConfirmButton: false,
              timer: 1500,
            });
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
      const newEvent: Event = {
        eventName: data.eventName,
        eventActive: true,
        startDate: data.startDate,
        endDate: data.endDate,
        introPrompt: data.introPrompt,
        outroPrompt: data.outroPrompt,
        CreatedBy: "Mouhcine Daali",
        description: data.description,
        questions: [...questions],
      };
      axios
        .post(
          "https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/events",
          newEvent
        )
        .then((res) => {
          setReFetch();
          if (res.data.statusCode == 200) {
            const responseMessage = JSON.parse(res.data.body);
            Swal.fire({
              position: "center",
              icon: "success",
              title: responseMessage.message,
              showConfirmButton: false,
              timer: 1500,
            });
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
    }
    cancel(false);
  };
  const onSubmitQuestion = (data: createQuestionForm) => {
    if (data.questionNumber) {
      const newQuestion: Question = {
        questionNumber: data.questionNumber,
        questionText: data.questionText,
        minValue: data.minValue,
        maxValue: data.maxValue,
      };

      // edit question in questions array and update the state with the new array of questions with the edited question and the same order
      setQuestions(
        questions.map((question) => {
          if (question.questionNumber === data.questionNumber) {
            return newQuestion;
          } else {
            return question;
          }
        })
      );
      setQuestionOnEdit(0);
    } else {
      const newQuestion: Question = {
        questionNumber: questions.length + 1,
        questionText: data.questionText,
        minValue: data.minValue,
        maxValue: data.maxValue,
      };

      setQuestions([...questions, newQuestion]);
    }
    resetQuestion({ questionText: "", minValue: NaN, maxValue: NaN });
  };

  const editQuestion = (questionNumber: number) => {
    setQuestionOnEdit(questionNumber);
    const question = questions.find(
      (question) => question.questionNumber === questionNumber
    );
    if (question) {
      resetQuestion({
        questionNumber: question.questionNumber,
        questionText: question.questionText,
        minValue: question.minValue,
        maxValue: question.maxValue,
      });
    }
  };
  const cancelEdit = () => {
    setQuestionOnEdit(0);
    resetQuestion({ questionText: "", minValue: NaN, maxValue: NaN });
  };
  const removeQuestion = (questionNumber: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setQuestions(
          questions.filter(
            (question) => question.questionNumber !== questionNumber
          )
        );
        Swal.fire("Removed!", "Your question has been removed.", "success");
      }
    });
  };

  const cancel = (validation: boolean) => {
    if (
      validation &&
      (questions.length > 0 ||
        watchEvent("eventName") ||
        watchEvent("startDate") ||
        watchEvent("endDate") ||
        watchEvent("introPrompt") ||
        watchEvent("outroPrompt") ||
        watchEvent("description"))
    ) {
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
          resetEvent({
            eventName: "",
            startDate: "",
            endDate: "",
            introPrompt: "",
            outroPrompt: "",
            description: "",
          });
          resetQuestion({ questionText: "", minValue: NaN, maxValue: NaN });
          setQuestions([]);
          setOpen();
          questionOnEdit && setQuestionOnEdit(0);
          Swal.fire(
            "Canceled!",
            "Your operation has been canceled.",
            "success"
          );
        }
      });
    } else {
      resetEvent({
        eventName: "",
        startDate: "",
        endDate: "",
        introPrompt: "",
        outroPrompt: "",
        description: "",
      });
      resetQuestion({ questionText: "", minValue: NaN, maxValue: NaN });
      setQuestions([]);
      setOpen();
      questionOnEdit && setQuestionOnEdit(0);
    }

    if (eventToEdit || eventToClone) {
      removeDefaultEvent();
    }
  };

  const validateName = (name: string) => {
    if (eventNames.includes(name)) {
      return "the name is already exists";
    } else {
      clearErrorsEvent("eventName");
    }
  };
  const validateDate = (date: string, type: string) => {
    if (type === "startDate") {
      if (new Date(date) < new Date()) {
        return "Start Date cannot be before the current date and time";
      } else if (new Date(date) > new Date(watchEvent("endDate"))) {
        setErrorEvent("endDate", {
          type: "manual",
          message: "End Date cannot be before the Start Date",
        });
        return "Start Date cannot be after the End Date";
      } else {
        clearErrorsEvent("startDate");
        clearErrorsEvent("endDate");
      }
    } else {
      if (new Date(date) < new Date(watchEvent("startDate"))) {
        setErrorEvent("startDate", {
          type: "manual",
          message: "Start Date cannot be after the End Date",
        });
        return "End Date cannot be before the Start Date";
      } else {
        clearErrorsEvent("startDate");
        clearErrorsEvent("endDate");
      }
    }
  };
  const validateMinMax = (data: number, type: string) => {
    if (type === "minValue") {
      if (Number(data) > Number(watchQuestion("maxValue").valueOf())) {
        setErrorQuestion("maxValue", {
          type: "manual",
          message: "Max Value cannot be less than Min Value",
        });
        return "Min Value cannot be greater than Max Value";
      } else {
        clearErrorsQuestion("minValue");
        clearErrorsQuestion("maxValue");
      }
    } else {
      if (Number(data) < Number(watchQuestion("minValue"))) {
        setErrorQuestion("minValue", {
          type: "manual",
          message: "Min Value cannot be greater than Max Value",
        });
        return "Max Value cannot be less than Min Value";
      } else {
        clearErrorsQuestion("minValue");
        clearErrorsQuestion("maxValue");
      }
    }
  };

  return (
    <div
      className={`h-[90vh] sm:h-[85vh] w-screen sm:w-[90vw] flex flex-col gap-y-3 px-5 py-8 sm:p-10 rounded-t-3xl bg-gray-400 fixed z-30 ${
        !isOpen ? "-bottom-full" : "-bottom-0"
      } transition-all ease-out duration-500 left-1/2 -translate-x-1/2 overflow-y-scroll hide-scroll-bar`}>
      <div className='bg-white h-3 w-28 rounded-full absolute top-2 left-1/2 -translate-x-1/2'></div>
      <form onSubmit={handleSubmitEvent(onSubmitEvent)}>
        <div className='w-full flex justify-between items-center'>
          <h3 className='font-bold text-xl lg:text-3xl text-gray-900'>
            {eventToEdit ? "Edit Event" : "Create Event"}
          </h3>
          <div className='flex gap-x-2'>
            <button
              type='submit'
              className='relative px-5 py-2.5 overflow-hidden font-medium text-green-500 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group'>
              <span className='absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-green-400 group-hover:w-full ease'></span>
              <span className='absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-green-400 group-hover:w-full ease'></span>
              <span className='absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-green-400 group-hover:h-full ease'></span>
              <span className='absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-green-400 group-hover:h-full ease'></span>
              <span className='absolute inset-0 w-full h-full duration-300 delay-300 bg-green-500 opacity-0 group-hover:opacity-100'></span>
              <span className='relative transition-colors duration-300 delay-200 group-hover:text-white ease'>
                {eventToEdit ? "Save" : "Create"}
              </span>
            </button>
            <button
              type='button'
              onClick={() => cancel(true)}
              className='relative px-5 py-2.5 overflow-hidden font-medium text-red-500 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group'>
              <span className='absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-red-400 group-hover:w-full ease'></span>
              <span className='absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-red-400 group-hover:w-full ease'></span>
              <span className='absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-red-400 group-hover:h-full ease'></span>
              <span className='absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-red-400 group-hover:h-full ease'></span>
              <span className='absolute inset-0 w-full h-full duration-300 delay-300 bg-red-500 opacity-0 group-hover:opacity-100'></span>
              <span className='relative transition-colors duration-300 delay-200 group-hover:text-white ease'>
                Cancel
              </span>
            </button>
          </div>
        </div>
        <div className='w-full h-fit flex flex-col gap-y-3 bg-gray-50 rounded-lg p-5 pb-8 mt-5'>
          <p className='text-gray-800 text-sm font-medium'>
            1. Start with setting up your event information
          </p>
          <div className='flex flex-col gap-y-8'>
            <div className='flex max-md:flex-col gap-x-5'>
              <div className='w-2/4 max-md:w-full relative mt-1'>
                <input
                  className={`peer h-full w-full border-b ${
                    errorsEvent.eventName ? "border-red-200" : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errorsEvent.eventName
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  placeholder=' '
                  type='text'
                  id='eventName'
                  {...registerEvent("eventName", {
                    required: true,
                    validate: (value) => validateName(value),
                  })}
                />
                <label
                  htmlFor='eventName'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Event Name
                </label>
                {errorsEvent.eventName && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    {errorsEvent.eventName.type === "required"
                      ? "This field is required"
                      : errorsEvent.eventName.message}
                  </p>
                )}
              </div>
              <div className='flex max-md:mt-10 gap-x-5 w-2/4 max-md:w-full'>
                <div className='w-1/2 relative'>
                  <input
                    className={`peer h-full w-full border-b ${
                      errorsEvent.startDate
                        ? "border-red-200"
                        : "border-gray-200"
                    } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                      errorsEvent.startDate
                        ? "placeholder-shown:border-red-200"
                        : "placeholder-shown:border-gray-200"
                    } focus:border-green-500 focus:outline-0 disabled:border-0`}
                    placeholder=' '
                    type='date'
                    id='startDate'
                    {...registerEvent("startDate", {
                      valueAsDate: true,
                      required: true,
                      validate: (value) =>
                        validateDate(value.toLocaleString(), "startDate"),
                    })}
                  />
                  <label
                    htmlFor='startDate'
                    className="after:content[' '] pointer-events-none absolute left-0 -top-2 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                    Start Date
                  </label>
                  {errorsEvent.startDate && (
                    <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                      {errorsEvent.startDate.type === "required"
                        ? "This field is required"
                        : errorsEvent.startDate.message}
                    </p>
                  )}
                </div>
                <div className='w-1/2 relative'>
                  <input
                    className={`peer h-full w-full border-b ${
                      errorsEvent.endDate ? "border-red-200" : "border-gray-200"
                    } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                      errorsEvent.endDate
                        ? "placeholder-shown:border-red-200"
                        : "placeholder-shown:border-gray-200"
                    } focus:border-green-500 focus:outline-0 disabled:border-0`}
                    placeholder=' '
                    type='date'
                    id='endDate'
                    {...registerEvent("endDate", {
                      valueAsDate: true,
                      required: true,
                      validate: (value) =>
                        validateDate(value.toString(), "endDate"),
                    })}
                  />
                  <label
                    htmlFor='endDate'
                    className="after:content[' '] pointer-events-none absolute left-0 -top-2 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                    End Date
                  </label>
                  {errorsEvent.endDate && (
                    <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                      {errorsEvent.endDate.type === "required"
                        ? "This field is required"
                        : errorsEvent.endDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className='flex gap-x-5'>
              <div className='w-1/2 relative '>
                <input
                  className={`peer h-full w-full border-b ${
                    errorsEvent.introPrompt
                      ? "border-red-200"
                      : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errorsEvent.introPrompt
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  placeholder=' '
                  type='text'
                  id='introPrompt'
                  {...registerEvent("introPrompt", { required: true })}
                />
                <label
                  htmlFor='introPrompt'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Intro Prompt
                </label>
                {errorsEvent.introPrompt && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    Intro Prompt is required
                  </p>
                )}
              </div>
              <div className='w-1/2 relative '>
                <input
                  className={`peer h-full w-full border-b ${
                    errorsEvent.outroPrompt
                      ? "border-red-200"
                      : "border-gray-200"
                  } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                    errorsEvent.outroPrompt
                      ? "placeholder-shown:border-red-200"
                      : "placeholder-shown:border-gray-200"
                  } focus:border-green-500 focus:outline-0 disabled:border-0`}
                  placeholder=' '
                  type='text'
                  id='outroPrompt'
                  {...registerEvent("outroPrompt", { required: true })}
                />
                <label
                  htmlFor='outroPrompt'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Outro Prompt
                </label>
                {errorsEvent.outroPrompt && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    Outro Prompt is required
                  </p>
                )}
              </div>
            </div>
            <div className='w-full relative'>
              <textarea
                className={`peer h-full w-full border-b ${
                  errorsEvent.description ? "border-red-200" : "border-gray-200"
                } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                  errorsEvent.description
                    ? "placeholder-shown:border-red-200"
                    : "placeholder-shown:border-gray-200"
                } focus:border-green-500 focus:outline-0 disabled:border-0`}
                placeholder=' '
                id='description'
                {...registerEvent("description", { required: true })}
              />{" "}
              <label
                htmlFor='description'
                className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                Description
              </label>
              {errorsEvent.description && (
                <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                  Description is required
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
      <div className='mt-8 flex flex-col p-1 bg-gray-100 rounded-lg'>
        <div className='flex justify-between items-center px-5 pt-3'>
          <p className='text-gray-800 text-sm font-medium'>2. Add Questions</p>
        </div>
        <form
          onSubmit={handleSubmitQuestion(onSubmitQuestion)}
          className='flex flex-col gap-y-3 my-5 px-5'>
          <div className='w-full flex max-sm:flex-col gap-10'>
            <div className='w-2/4 max-sm:w-full relative '>
              <input
                className='peer h-full w-full border-b border-gray-200 bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-gray-200 focus:border-green-500 focus:outline-0 disabled:border-0'
                placeholder=' '
                type='text'
                id='questionText'
                {...registerQuestion("questionText", { required: true })}
              />
              <label
                htmlFor='questionText'
                className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                Question Text
              </label>
              {errorsQuestion.questionText && (
                <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                  Question Text is required
                </p>
              )}
            </div>
            <div className='w-2/4 max-sm:w-full flex'>
              <div className='w-1/2 relative '>
                <input
                  className='peer h-full w-full border-b border-gray-200 bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-gray-200 focus:border-green-500 focus:outline-0 disabled:border-0'
                  placeholder=' '
                  type='number'
                  id='minValue'
                  {...registerQuestion("minValue", {
                    required: true,
                    validate: (value) => validateMinMax(value, "minValue"),
                  })}
                />
                <label
                  htmlFor='minValue'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Min Value
                </label>
                {errorsQuestion.minValue && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    {errorsQuestion.minValue.type === "required"
                      ? "Min Value is required"
                      : errorsQuestion.minValue.message}
                  </p>
                )}
              </div>
              <div className='w-1/2 relative '>
                <input
                  className='peer h-full w-full border-b border-gray-200 bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-gray-200 focus:border-green-500 focus:outline-0 disabled:border-0'
                  placeholder=' '
                  type='number'
                  id='maxValue'
                  {...registerQuestion("maxValue", {
                    required: true,
                    validate: (value) => validateMinMax(value, "maxValue"),
                  })}
                />
                <label
                  htmlFor='maxValue'
                  className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                  Max Value
                </label>
                {errorsQuestion.maxValue && (
                  <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                    {errorsQuestion.maxValue.type === "required"
                      ? "Max Value is required"
                      : errorsQuestion.maxValue.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            type='submit'
            className='self-end relative inline-flex items-center justify-start px-5 py-2.5 mt-5 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group'>
            <span className='w-48 h-48 rounded rotate-[-40deg] bg-green-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0'></span>
            <span className='relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white'>
              {questionOnEdit ? "Edit Question" : "Add Question"}
            </span>
          </button>
        </form>
        <div className='w-full'>
          <div className='w-full p-3 '>
            <div className='overflow-x-scroll shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'>
                      N°
                    </th>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'>
                      Question Text
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Min Value
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Max Value
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white'>
                  {questions.length > 0 ? (
                    questions.map((question: Question) => (
                      <tr
                        key={question.questionNumber}
                        className={`${
                          questionOnEdit === question.questionNumber &&
                          "border-4 border-gray-700"
                        }`}>
                        <td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {question.questionNumber}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {question.questionText}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {question.minValue}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {question.maxValue}
                        </td>
                        <td className='flex gap-x-3 px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <button
                            onClick={() => {
                              removeQuestion(question.questionNumber);
                            }}
                            className='text-red-600 hover:text-red-900'>
                            <TrashIcon className='w-5 h-5' />
                          </button>
                          {/* {questionOnEdit === question.questionNumber && (
                            <button
                              onClick={() => {
                                questionOnEdit
                                  ? cancelEdit()
                                  : editQuestion(question.questionNumber);
                              }}
                              className={`${
                                questionOnEdit
                                  ? "text-gray-600 hover:text-gray-900"
                                  : "text-green-600 hover:text-green-900"
                              }`}>
                              <XMarkIcon className='w-5 h-5 bg-gray-200/70 rounded-md' />
                            </button>
                          )} */}
                          <button
                            onClick={() => {
                              questionOnEdit === question.questionNumber
                                ? cancelEdit()
                                : editQuestion(question.questionNumber);
                            }}
                            className={`${
                              questionOnEdit === question.questionNumber
                                ? "text-gray-600 hover:text-gray-900"
                                : "text-green-600 hover:text-green-900"
                            }`}>
                            {questionOnEdit === question.questionNumber ? (
                              <XMarkIcon className='w-5 h-5 bg-gray-200/70 rounded-md' />
                            ) : (
                              <PencilIcon className='w-5 h-5' />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        align='center'
                        colSpan={5}
                        className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        No Questions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
