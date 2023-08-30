import SurveyRow from "./EventRow";
import { Survey } from "../types";
import CreateSurvey from "./CreateEvent";
import { useEffect, useState } from "react";
import axios from "axios";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";

const events = [
  {
    "Event ID": "1234",
    StartDate: "2023-08-28",
    Type: "C",
    Description: "August Bank Holiday",
    Message:
      "Sorry we're closed for August Bank Holiday, please call back tomorrow",
    Active: true,
    CreatedBy: "Nigel Ryan",
  },
  {
    "Event ID": "1235",
    StartDate: "2021-04-01",
    EndDate: "2021-04-30",
    Type: "M2",
    Description: "April Promotion",
    Message: "We have a promotion for April, ask for details",
    Active: true,
    CreatedBy: "Nigel Ryan",
  },
  {
    "Event ID": "1236",
    Weekday: "Monday",
    Type: "M1",
    Description: "Monday Message",
    Message: "Hello, it’s Monday today, yippee!",
    Active: true,
    CreatedBy: "Nigel Ryan",
  },
  {
    "Event ID": "1237",
    Weekday: "Tuesday",
    StartTime: "09:00",
    EndTime: "13:00",
    Type: "C",
    Description: "Tuesday Training",
    Message:
      "Hello, we are closed today between 09 a.m and 1 p.m. for staff training, please call back later",
    Active: true,
    CreatedBy: "Nigel Ryan",
  },
];


type Search = {
  search: string;
  byActive: boolean;
  byInactive: boolean;
};
const EventTable = () => {
  const [createSurveyOpen, setCreateSurveyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [surveyNames, setSurveyNames] = useState<string[]>([]);
  const [reFetch, setReFetch] = useState(false);
  const [surveyToEdit, setSurveyToEdit] = useState<Survey | undefined>();
  const [surveyToClone, setSurveyToClone] = useState<Survey | undefined>();
  const { register, watch, reset } = useForm<Search>();
  const [tableData, setTableData] = useState<Survey[]>(surveys || []);

  // useEffect(() => {
  //   setLoading(true);
  //   const getSurveys = async () => {
  //     await axios
  //       .get(
  //         "https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/surveys"
  //       )
  //       .then((res: { data: { body: { content: Survey }[] } }) => {
  //         const surveysWithoutContent = res.data.body
  //           .filter((item: { content: Survey }) => item.content)
  //           .map((item: { content: Survey }) => {
  //             const { content } = item;
  //             return content;
  //           });
  //         setSurveys([...surveysWithoutContent]);

  //         const surveyNamesGetter = surveysWithoutContent.map(
  //           (survey) => survey.surveyName
  //         );
  //         setSurveyNames(surveyNamesGetter);
  //         setLoading(false);
  //       });
  //   };
  //   getSurveys();
  // }, [reFetch]);

  // useEffect(() => {
  //   if (surveyToClone) {
  //     setCreateSurveyOpen(true);
  //   }
  //   if (surveyToEdit) {
  //     setCreateSurveyOpen(true);
  //   }
  // }, [surveyToEdit, surveyToClone]);

  // const removeEditSurvey = () => {
  //   setSurveyToEdit(undefined);
  //   setSurveyToClone(undefined);
  // };

  // const searchValue = watch("search");
  // const byActive = watch("byActive");
  // const byInactive = watch("byInactive");

  // useEffect(() => {
  //   if (searchValue || byActive || byInactive) {
  //     const filteredSurveys = surveys.filter((survey) => {
  //       if (searchValue && byActive && byInactive) {
  //         return (
  //           survey.surveyName &&
  //           survey.surveyName
  //             .toLowerCase()
  //             .includes(searchValue.toLowerCase()) &&
  //           survey.surveyActive === true
  //         );
  //       } else if (searchValue && byActive) {
  //         return (
  //           survey.surveyName &&
  //           survey.surveyName
  //             .toLowerCase()
  //             .includes(searchValue.toLowerCase()) &&
  //           survey.surveyActive === true
  //         );
  //       } else if (searchValue && byInactive) {
  //         return (
  //           survey.surveyName &&
  //           survey.surveyName
  //             .toLowerCase()
  //             .includes(searchValue.toLowerCase()) &&
  //           !survey.surveyActive
  //         );
  //       } else if (searchValue) {
  //         return (
  //           survey.surveyName &&
  //           survey.surveyName.toLowerCase().includes(searchValue.toLowerCase())
  //         );
  //       } else if (byActive && byInactive) {
  //         return survey.surveyActive === true || !survey.surveyActive;
  //       } else if (byActive) {
  //         return survey.surveyActive === true || survey.surveyActive;
  //       } else if (byInactive) {
  //         return survey.surveyActive === false || !survey.surveyActive;
  //       }
  //     });
  //     setTableData([...filteredSurveys]);
  //   } else {
  //     setTableData([...surveys]);
  //   }
  // }, [searchValue, surveys, byActive, byInactive]);

  // const resetSearch = () => {
  //   reset({ search: "" });
  // };

  return (
    <div className='px-4 sm:px-6 lg:px-8 mt-10'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <h1 className='text-xl font-semibold text-gray-900'>Surveys</h1>
          <p className='mt-2 text-sm text-gray-700'>
            A list of all the surveys including with this details: Id, Name,
            Start Date, End Date, Status and more.
          </p>
        </div>
        <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none max-sm:ml-auto max-sm:w-fit'>
          {/* <CreateSurvey
            surveyNames={surveyNames}
            isOpen={createSurveyOpen}
            setOpen={() => setCreateSurveyOpen(false)}
            setReFetch={() => setReFetch(!reFetch)}
            surveyToEdit={surveyToEdit}
            surveyToClone={surveyToClone}
            removeDefaultSurvey={removeEditSurvey}
          /> */}
          <button
            onClick={() => setCreateSurveyOpen(true)}
            type='button'
            className='relative inline-flex items-end justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-100 group'>
            <span className='absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full'></span>
            <span className='absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12'>
              <svg
                className='w-5 h-5 text-green-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
              </svg>
            </span>
            <span className='absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200'>
              <svg
                className='w-5 h-5 text-green-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
              </svg>
            </span>
            <span className='relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white'>
              Add Survey
            </span>
          </button>
        </div>
      </div>
      <div className='mt-8 flex flex-col'>
        {/* <form className='w-full flex max-md:flex-col gap-5 mb-3'>
          <div className='w-1/2 max-md:w-2/3 max-sm:w-full'>
            <div className='mt-2 relative'>
              <MagnifyingGlassIcon className='absolute w-5 h-5 text-gray-400 left-3 translate-y-1/2' />
              {searchValue && (
                <XMarkIcon
                  onClick={() => resetSearch()}
                  className='absolute w-5 h-5 text-gray-400 right-3 translate-y-1/2 cursor-pointer '
                />
              )}
              <input
                type='text'
                {...register("search")}
                id='search'
                placeholder='Search by name'
                className='px-5 pl-10 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>
          <div className='w-1/2 max-md:w-fit flex max-md:ml-auto gap-x-8 items-center justify-center'>
            <p className='font-semibold'>Filter by Status:</p>
            <div className='flex items-center'>
              <input
                type='checkbox'
                {...register("byActive")}
                id='byActive'
                className='w-5 h-5'
              />
              <label htmlFor='byActive' className='ml-2'>
                Active
              </label>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                {...register("byInactive")}
                id='byInactive'
                className='w-5 h-5'
              />
              <label htmlFor='byInactive' className='ml-2'>
                Not Active
              </label>
            </div>
          </div>
        </form> */}
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='w-full p-3 '>
            <div className='overflow-x-scroll shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-500'>
                  <tr>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-100 sm:pl-6'>
                      Id
                    </th>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-100 sm:pl-6'>
                      Name
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      Start Date
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      End Date
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      Intro Prompt
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      Outro Prompt
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      Questions Count
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      Status
                    </th>
                    <th
                      scope='col'
                      className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
                      <span className='sr-only'>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white'>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center'>
                        Loading...
                      </td>
                    </tr>
                  ) : tableData?.length > 0 ? (
                    tableData.map((survey, index) => (
                      <SurveyRow
                        key={survey.surveyId}
                        index={index}
                        survey={survey}
                        setReFetch={() => setReFetch(!reFetch)}
                        setSurveyToEdit={setSurveyToEdit}
                        setSurveyToClone={setSurveyToClone}
                        setOpenEdit={() => setCreateSurveyOpen(true)}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center'>
                        No Events Found
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

export default EventTable;
