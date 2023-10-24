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
  const [openDetails, setOpenDetails] = useState(false);
  const [eventDetails, setEventDetails] = useState<Event | undefined>();

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
          return Object.keys(event).some((key) =>
            event[key as keyof Event]!.toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        } else if (searchValue && byActive) {
          return Object.keys(event).some((key) =>
            event[key as keyof Event]!.toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        } else if (searchValue && byInActive) {
          return Object.keys(event).some((key) =>
            event[key as keyof Event]!.toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        } else if (searchValue) {
          return Object.keys(event).some((key) =>
            event[key as keyof Event]!.toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
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

  const statusBodyTemplate = (event: Event) => {
    const status = event.Active;
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold  ${
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

  return (
    <div className='px-4 sm:px-6 lg:px-8 mt-10'>
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

      <div className='w-full flex flex-wrap-reverse justify-between gap-5 mb-5'>
        <div className='w-1/4 max-md:w-2/4 mt-2 relative'>
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
            placeholder='Keyword Search'
            className='px-5 pl-10 w-3/3 border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6'
          />
        </div>
        <div className='max-w-2/4  max-md:ml-auto flex gap-x-8 max-sm:gap-x-5 items-center justify-center'>
          <p className='font-semibold'>Filter by Status:</p>
          <div className='flex items-center'>
            <input
              type='checkbox'
              {...register("byActive")}
              id='byActive'
              className='w-5 h-5'
            />
            <label htmlFor='byActive' className='ml-2 max-sm:ml-1'>
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
            <label htmlFor='byInActive' className='ml-2 max-sm:ml-1'>
              Inactive
            </label>
          </div>
        </div>
        <div className='w-1/4 max-md:w-2/4 flex justify-end max-md:ml-auto'>
          <button
            onClick={() => setCreateEventOpen(true)}
            type='button'
            className=' px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-700 text-indigo-700'>
            Add Event
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
        onRowClick={(event) => {
          // Change the argument to DataTableRowClickEvent
          const rowData = event.data as Event;
          const excludedColumn = "Actions";
          const target = event.originalEvent.target as HTMLElement;
          // Check if the click event is not on the excluded column
          if (!target || !target.classList.contains(excludedColumn)) {
            setEventDetails(rowData);
            setOpenDetails(true);
          }
        }}>
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
          alignHeader={"center"}
          className='Actions'
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
              />
            );
          }}
          style={{ textAlign: "center" }}></Column>
      </DataTable>
    </div>
  );
};

export default EventTable;
