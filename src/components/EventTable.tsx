import EventRow from "./EventRow";
import { Event, Search } from "../types";
import CreateEvent from "./CreateEvent";
import { useEffect, useState } from "react";
import axios from "axios";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import EventActions from "./EventActions";
import EventDetails from "./EventDetails";
import Swal from "sweetalert2";

const EventTable = () => {
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [EventNames, setEventNames] = useState<string[]>([]);
  const [reFetch, setReFetch] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>();
  const [eventToClone, setEventToClone] = useState<Event | undefined>();
  const { register, watch, reset } = useForm<Search>();
  const [tableData, setTableData] = useState<Event[]>(events || []);

  useEffect(() => {
    setLoading(true);
    const getEvents = async () => {
      await axios
        .get(
          "https://1rix0t19h7.execute-api.eu-west-2.amazonaws.com/dev/events"
        )
        .then((res: { data: { body: { Items: Event[] } } }) => {
          setEvents([...res.data.body.Items]);

          const EventNamesGetter = res.data.body.Items.map(
            (event: Event) => event.EventName!
          );
          setEventNames(EventNamesGetter);
          setLoading(false);
        });
    };
    getEvents();
  }, [reFetch]);

  useEffect(() => {
    if (eventToClone) {
      setCreateEventOpen(true);
    }
    if (eventToEdit) {
      setCreateEventOpen(true);
    }
  }, [eventToEdit, eventToClone]);

  const removeEditEvent = () => {
    setEventToEdit(undefined);
    setEventToClone(undefined);
  };

  const searchValue = watch("search");
  const byActive = watch("byActive");
  const byInActive = watch("byInActive");

  useEffect(() => {
    if (searchValue || byActive || byInActive) {
      const filteredEvents = events.filter((event) => {
        if (searchValue && byActive && byInActive) {
          return (
            event.EventName &&
            event.EventName.toLowerCase().includes(searchValue.toLowerCase()) &&
            event.Active === true
          );
        } else if (searchValue && byActive) {
          return (
            event.EventName &&
            event.EventName.toLowerCase().includes(searchValue.toLowerCase()) &&
            event.Active === true
          );
        } else if (searchValue && byInActive) {
          return (
            event.EventName &&
            event.EventName.toLowerCase().includes(searchValue.toLowerCase()) &&
            !event.Active
          );
        } else if (searchValue) {
          return (
            event.EventName &&
            event.EventName.toLowerCase().includes(searchValue.toLowerCase())
          );
        } else if (byActive && byInActive) {
          return event.Active === true || !event.Active;
        } else if (byActive) {
          return event.Active === true || event.Active;
        } else if (byInActive) {
          return event.Active === false || !event.Active;
        }
      });
      setTableData([...filteredEvents]);
    } else {
      setTableData([...events]);
    }
  }, [searchValue, events, byActive, byInActive]);

  const resetSearch = () => {
    reset({ search: "" });
  };

  const editEvent = (event: Event) => {
    setEventToEdit(event);
  };
  const cloneEvent = (event: Event) => {
    setEventToClone(event);
  };

  const [openDetails, setOpenDetails] = useState(false);
  const [eventDetails, setEventDetails] = useState<Event | undefined>();

  const statusBodyTemplate = (event: Event) => {
    const status = event.Active;
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
        {status ? "Active" : "Inactive"}
      </span>
    );
  };
  const typeBodyTemplate = (event: Event) => {
    const type = event.Type;
    return (
      <span
        className='text-sm truncate'
        title={
          type === "C"
            ? "Closure"
            : type === "M1"
            ? "Custom Message 1"
            : type === "M2"
            ? "Custom Message 2"
            : "Not assigned"
        }>
        {type === "C"
          ? "Closure"
          : type === "M1"
          ? "Custom Message 1"
          : type === "M2"
          ? "Custom Message 2"
          : "Not assigned"}
      </span>
    );
  };

  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const onSelectionChange = (e: any) => {
    const value = e.value;
    setSelectedEvents(value);
    setSelectAll(value.length === tableData.length);
  };
  const onSelectAllChange = (e: any) => {
    const selectAll = e.checked;

    if (selectAll) {
      setSelectedEvents(tableData);
      setSelectAll(true);
    } else {
      setSelectAll(false);
      setSelectedEvents([]);
    }
  };

  const deleteAll = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "green",
      confirmButtonText: "Yes, delete all!",
    }).then((result) => {
      if (result.isConfirmed) {
        selectedEvents.forEach((event) => {
          axios
            .delete(
              `https://1rix0t19h7.execute-api.eu-west-2.amazonaws.com/dev/events/${event.EventID}`
            )
            .then(() => {
              setSelectedEvents([]);
              setReFetch(!reFetch);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  return (
    <div className='px-2 sm:px-4 lg:px-5 mt-20'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto relative'>
          <div
            className={`flex items-center justify-between gap-x-5 px-5 py-3 bg-indigo-500/70 rounded-md absolute bottom-0 transition-all ease-linear duration-300 ${
              selectedEvents.length ? "left-0" : "-left-full"
            }`}>
            <p className='text-white font-semibold'>
              {selectedEvents.length} Event{selectedEvents.length > 1 && "s"}{" "}
              Selected
            </p>
            <button
              onClick={() => deleteAll()}
              className='rounded-md px-3.5 py-1.5 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-white hover:border-red-600 transition-colors duration-150 ease-linear shadow-red-600/60 shadow-md  text-white'>
              <span className='absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-red-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease'></span>
              <span className='relative text-white transition duration-300 group-hover:text-white ease'>
                Delete All
              </span>
            </button>
          </div>
        </div>
      </div>

      <EventDetails
        event={eventDetails}
        isOpen={openDetails}
        setReFetch={() => setReFetch(!reFetch)}
        setOpen={() => setOpenDetails(!openDetails)}
        setEventToEdit={editEvent}
        setEventToClone={cloneEvent}
        setOpenEdit={() => setCreateEventOpen(true)}
      />
      <CreateEvent
        EventNames={EventNames}
        isOpen={createEventOpen}
        setOpen={() => setCreateEventOpen(false)}
        setReFetch={() => setReFetch(!reFetch)}
        eventToEdit={eventToEdit}
        eventToClone={eventToClone}
        removeDefaultEvent={removeEditEvent}
      />

      <div className='w-full flex justify-between max-md:flex-col gap-5 mb-5'>
        <div className='w-1/3 mt-2 relative'>
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
        <div className='max-w-1/3 max-md:w-fit flex max-md:ml-auto gap-x-8 items-center justify-center'>
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
              {...register("byInActive")}
              id='byInActive'
              className='w-5 h-5'
            />
            <label htmlFor='byInActive' className='ml-2'>
              Inactive
            </label>
          </div>
        </div>
        <div className='max-w-1/3'>
          <button
            onClick={() => setCreateEventOpen(true)}
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
              Add Event
            </span>
          </button>
        </div>
      </div>
      <DataTable
        value={tableData}
        key='eventID'
        stripedRows
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{}}
        loading={loading}
        emptyMessage='No Events Found'
        scrollHeight='500px'
        selection={selectedEvents}
        onSelectionChange={onSelectionChange}
        selectAll={selectAll}
        onSelectAllChange={onSelectAllChange}
        cellSelection={false}
        selectionMode="multiple"
        >
        <Column selectionMode='multiple' headerStyle={{ width: "3rem" }} />
        <Column
          field='EventName'
          header='Event Name'
          sortable
          style={{ maxWidth: "200px" }}
          className='truncate text-sm'></Column>
        <Column
          field='Description'
          header='Description'
          sortable
          style={{ maxWidth: "200px" }}
          className='truncate text-sm'></Column>
        <Column
          field='Message'
          header='Message'
          sortable
          style={{ maxWidth: "250px" }}
          className='truncate text-sm'></Column>
        <Column
          field='Type'
          header='Type'
          sortable
          body={typeBodyTemplate}
          style={{}}></Column>
        <Column
          field='WeekDay'
          header='WeekDay'
          sortable
          className='text-sm'
          style={{}}></Column>
        <Column
          field='StartDate'
          header='Start_Date'
          sortable
          style={{}}
          className='text-sm w-fit'></Column>
        <Column
          field='EndDate'
          header='End_Date'
          className='text-sm'
          style={{ minWidth: "104px" }}></Column>
        <Column
          field='StartTime'
          header='Start_Time'
          className='text-sm'
          style={{}}></Column>
        <Column
          field='EndTime'
          header='End_Time'
          className='text-sm'
          style={{}}></Column>
        <Column
          field='Status'
          header='Status'
          dataType='boolean'
          body={statusBodyTemplate}
          style={{}}></Column>
        <Column
          field='Actions'
          header='Actions'
          body={(rowData: Event) => {
            return (
              <EventActions
                event={rowData}
                viewDetails={() => {
                  setEventDetails(rowData);
                  setOpenDetails(true);
                }}
                displayDetails={true}
                setReFetch={() => setReFetch(!reFetch)}
                setEventToEdit={editEvent}
                setEventToClone={cloneEvent}
                setOpenEdit={() => setCreateEventOpen(true)}
                index={0}
              />
            );
          }}
          style={{ textAlign: "center" }}></Column>
      </DataTable>
      {/* <div className='mt-8 flex flex-col'>
        <div className='w-full flex max-md:flex-col gap-5 mb-3'>
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
                {...register("byInActive")}
                id='byInActive'
                className='w-5 h-5'
              />
              <label htmlFor='byInActive' className='ml-2'>
                Inactive
              </label>
            </div>
          </div>
        </div>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='w-full p-3 '>
            <div className='overflow-x-scroll shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-500'>
                  <tr>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-100 sm:pl-6'>
                      Event Name
                    </th>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-100 sm:pl-6'>
                      Description
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      Message
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      Type
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      WeekDay
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
                      Start Time
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-100'>
                      End Time
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
                    tableData.map((event, index) => (
                      <EventRow
                        key={event.EventID}
                        index={index}
                        event={event}
                        setReFetch={() => setReFetch(!reFetch)}
                        setEventToEdit={setEventToEdit}
                        setEventToClone={setEventToClone}
                        setOpenEdit={() => setCreateEventOpen(true)}
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
      </div> */}
    </div>
  );
};

export default EventTable;
