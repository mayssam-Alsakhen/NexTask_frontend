'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../popup/Popup";
import AddTaskForm from "../AddTaskForm/AddTaskForm";
import './calendar.css';
// import TaskPopupContent from "../TaskPopupContent/TaskPopupContent";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  // const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [addTaskMessage, setAddTaskMessage] = useState(null);
const [openPopup, setOpenPopup] = useState(false);
const router = useRouter();

const handleDateClick = (arg) => {
  setSelectedDate(arg.dateStr); // Save the clicked date
  setOpenPopup(true);           // Open the popup
};


  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'pending': return '#fffcab';
      case 'in progress': return '#ffe2a3';
      case 'test': return '#a9e4ff';
      case 'completed': return '#a9ffb7';
      default: return '#9CA3AF';
    }
  };

  const fetchTasks = async () => {
    try {
      const uid = localStorage.getItem('user_id');
      const { data } = await axios.get('http://127.0.0.1:8000/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const userTasks = data.tasks.filter(t => t.users.some(u => u.id == uid));
      setEvents(userTasks.map(t => (  {
        id: t.id,
        title: t.title,
        date: t.due_date,
        due_date: t.due_date,
        description: t.description,
        category: t.category,
        project_id: t.project?.id,
        project: t.project?.name,
        is_important: t.is_important,
        users: t.users,
        backgroundColor: getCategoryColor(t.category),
        borderColor: getCategoryColor(t.category),
        textColor: '#333'
      })));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="md:px-4 w-full h-full">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={
          ({ event }) =>
          router.push(`projects/${event.project_id}/tasks/${event.id}`)
        }
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        dateClick={handleDateClick}
      />
{/* 
      {/* add task  */}
      <Popup trigger={openPopup} onBlur={setOpenPopup}>
  <AddTaskForm 
  defaultDueDate={selectedDate}  
  onTaskCreated={()=>{setOpenPopup(false), fetchTasks()}}/>
</Popup>
    </div>
  );
}
