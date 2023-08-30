import { XMarkIcon } from "@heroicons/react/20/solid";
import { SurveyDetailsProps } from "../interfaces";
import SurveyActions from "./EventActions";
import { Survey } from "../types";

const EventDetails: React.FC<SurveyDetailsProps> = ({
  isOpen,
  setOpen,
  setReFetch,
  setSurveyToEdit,
  setSurveyToClone,
  survey,
  surveyTitle,
  setOpenEdit,
}) => {
  const editSurvey = (survey: Survey) => {
    setSurveyToEdit(survey);
  };

  const cloneSurvey = (survey: Survey) => {
    setSurveyToClone(survey);
  };

  return (
    <div
      className={`h-[90vh] sm:h-[85vh] w-screen sm:w-[90vw] flex flex-col gap-y-3 px-5 py-8 sm:p-10 rounded-t-3xl bg-gray-400 fixed z-30 ${
        !isOpen ? "-bottom-full" : "-bottom-0"
      } transition-all ease-out duration-500 left-1/2 -translate-x-1/2 overflow-y-scroll hide-scroll-bar`}>
      <div className='bg-white h-3 w-28 rounded-full absolute top-2 left-1/2 -translate-x-1/2'></div>
      <div className='w-full flex justify-between items-center'>
        <h3 className='font-bold text-xl lg:text-3xl text-gray-900'>
          Survey Details: {surveyTitle}
        </h3>
        <div className='flex gap-x-2 items-center'>
          <SurveyActions
            survey={survey}
            displayDetails={false}
            setReFetch={setReFetch}
            setSurveyToEdit={editSurvey}
            setSurveyToClone={cloneSurvey}
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
        <div className='flex gap-x-8'>
          <div className='w-1/2'>
            <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
              Intro Prompt
            </h4>
            <p className='text-sm lg:text-base text-gray-500'>
              {survey.introPrompt}
            </p>
          </div>
          <div className='w-1/2'>
            <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
              Outro Prompt
            </h4>
            <p className='text-sm lg:text-base text-gray-500'>
              {survey.outroPrompt}
            </p>
          </div>
        </div>
        <div className='flex gap-x-5'>
          <div className='w-1/2 flex gap-x-5'>
            <div className='w-1/2'>
              <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
                Start Date
              </h4>
              <p className='text-sm lg:text-base text-gray-500'>
                {new Date(survey.startDate).toDateString()}
              </p>
            </div>
            <div className='w-1/2'>
              <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
                End Date
              </h4>
              <p className='text-sm lg:text-base text-gray-500'>
                {new Date(survey.endDate).toDateString()}
              </p>
            </div>
          </div>
          <div className='w-2/4'>
            <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
              Description
            </h4>
            <p className='text-sm lg:text-base text-gray-500'>
              {survey.description}
            </p>
          </div>
        </div>
      </div>
      <div className='mt-8 flex flex-col'>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              {/* <table className='min-w-full divide-y divide-gray-300'>
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
                  </tr>
                </thead>
                <tbody className='bg-white'>
                  {survey.questions?.length > 0 ? (
                    survey.questions.map((question, index) => (
                      <QuestionRow
                        key={question.questionNumber}
                        index={index}
                        question={question}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        align='center'
                        colSpan={4}
                        className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        No questions added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
