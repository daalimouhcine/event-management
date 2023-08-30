import { Survey } from "../types";
import { useState } from "react";
import SurveyDetails from "./EventDetails";
import SurveyActions from "./EventActions";
import { SurveyRowProps } from "../interfaces";


const EventRow: React.FC<SurveyRowProps> = ({
  survey,
  index,
  setReFetch,
  setSurveyToEdit,
  setSurveyToClone,
  setOpenEdit,
}) => {
  const [openDetails, setOpenDetails] = useState(false);

  const editSurvey = (survey: Survey) => {
    setSurveyToEdit(survey);
  };
  const cloneSurvey = (survey: Survey) => {
    setSurveyToClone(survey);
  };

  return (
    <>
      <tr>
        <td>
          <SurveyDetails
            survey={survey}
            isOpen={openDetails}
            setReFetch={setReFetch}
            setOpen={() => setOpenDetails(!openDetails)}
            setSurveyToEdit={editSurvey}
            setSurveyToClone={cloneSurvey}
            surveyTitle={survey.surveyName}
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
          {survey.surveyId}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {survey.surveyName}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {new Date(survey.startDate).toDateString()}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {new Date(survey.endDate).toDateString()}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          <p className='w-44 truncate'>{survey.introPrompt}</p>
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          <p className='w-44 truncate'>{survey.outroPrompt}</p>
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {survey.questions?.length || 0}
        </td>
        <td
          onClick={() => setOpenDetails(true)}
          className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {survey.surveyActive ? (
            <span className='inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800'>
              Active
            </span>
          ) : (
            <span className='inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800'>
              Not Active
            </span>
          )}
        </td>
        <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
          <SurveyActions
            survey={survey}
            viewDetails={() => setOpenDetails(true)}
            displayDetails={true}
            setReFetch={setReFetch}
            setSurveyToEdit={editSurvey}
            setSurveyToClone={cloneSurvey}
            setOpenEdit={() => setOpenEdit()}
            index={index}
          />
        </td>
      </tr>
    </>
  );
};

export default EventRow;
