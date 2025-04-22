'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../popup/Popup";
import TaskPopupContent from "../TaskPopupContent/TaskPopupContent";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'pending': return '#F59E0B';
      case 'in progress': return '#8B5CF6';
      case 'test': return '#3B82F6';
      case 'completed': return '#10B981';
      default: return '#9CA3AF';
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const uid = localStorage.getItem('user_id');
        const { data } = await axios.get('http://127.0.0.1:8000/api/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const userTasks = data.tasks.filter(t => t.users.some(u => u.id == uid));
        setEvents(userTasks.map(t => ({
          id: t.id,
          title: t.title,
          date: t.due_date,
          due_date: t.due_date,
          description: t.description,
          category: t.category,
          project_id: t.project_id,
          project: t.project?.name,
          is_important: t.is_important,
          users: t.users,
          backgroundColor: getCategoryColor(t.category),
          borderColor: getCategoryColor(t.category),
          textColor: 'white'
        })));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleUpdateTask = (updatedTask) => {
    setEvents(prev =>
      prev.map(evt =>
        evt.id === updatedTask.id
          ? {
              ...evt,
              title: updatedTask.title,
              date: updatedTask.due_date,
              due_date: updatedTask.due_date,
              description: updatedTask.description,
              category: updatedTask.category,
              users: updatedTask.users ?? evt.users,      
              backgroundColor: getCategoryColor(updatedTask.category),
              borderColor: getCategoryColor(updatedTask.category),
            }
          : evt
      )
    );
  };
  

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={({ event }) =>
          setSelectedTask({
            id: event.id,
            title: event.title,
            ...event.extendedProps
          })
        }
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />

      <Popup trigger={!!selectedTask} onBlur={() => setSelectedTask(null)}>
        {selectedTask && (
          <TaskPopupContent
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            updateTask={handleUpdateTask}
          />
        )}
      </Popup>
    </div>
  );
}
