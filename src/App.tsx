import React, { useState } from "react";
import "./App.css";

interface Task {
  id: number;
  title: string;
  subTitle: string;
  description: string;
  imageUrl?: string;
  read?: boolean;
}

interface DayTasks {
  [date: string]: Task[];
}

const tasksData: DayTasks = {
  "2024-07-16": [
    {
      id: 1,
      title: "הדרכה 1",
      subTitle: "העברת מסמכים לשרת בירושלים",
      description:
        "נא לשים לב שכל מסמך שעובר לשרת בירושלים בנוסף לשם הלקוח צריך להוסיף מספר פלאפון",
      read: false,
    },
    {
      id: 2,
      title: "הדרכה 2",
      subTitle: "קבלת מסמכים דרך שרת דיסק אונקי",
      description:
        "קבלת הקבצים מהדיסק אונקי מתאפשרת רק שהדיסק מחובר לכונן כרגע מונחים הלקוחות ע'י מרדכי מרגלית לחבר את הדיסק לכונן ולהתקשר למשרד, הנציג צריך להכנס לתוך התיקייה לבקש מהלקוח את שם הקובץ ולהעתיק את הקובץ אלינו, כל עוד הקובץ לא הועתק אלינו לא תתאפשר פתיחה של הקובץ, רק אחרי העברה למחשב אפשר יהיה לפתוח אותו ולטפל  ",
      read: false,
    },
  ],
};

const App: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [tasksDataState, setTasksDataState] = useState<DayTasks>(tasksData);

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
  };

  const handleCheckboxChange = (taskId: number) => {
    setTasksDataState((prevState) => {
      const updatedTasks = prevState[selectedDay].map((task) => {
        if (task.id === taskId) {
          return { ...task, read: !task.read };
        }
        return task;
      });
      return { ...prevState, [selectedDay]: updatedTasks };
    });
  };

  const handleSubmit = async (task: Task) => {
    try {
      const response = await fetch(
        "https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycby4zIUViJlA7kk0d5jMPHNAmEA2NV_iPML9SE8Sz8yblWKu7ru1aVQtKDjEZtcWMtXe/exec",
        {
          method: "POST",
          body: JSON.stringify(task),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (result.status === "success") {
        console.log("Task added successfully");
      }
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="content-container">
        <h1 className="title">הדרכות יומיות</h1>
        <DayNavigation
          selectedDay={selectedDay}
          onDayChange={handleDayChange}
        />
        <TaskList
          tasks={tasksDataState[selectedDay] || []}
          onCheckboxChange={handleCheckboxChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

const DayNavigation: React.FC<{
  selectedDay: string;
  onDayChange: (day: string) => void;
}> = ({ selectedDay, onDayChange }) => {
  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDay);
    prevDay.setDate(prevDay.getDate() - 1);
    onDayChange(prevDay.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDay);
    nextDay.setDate(nextDay.getDate() + 1);
    onDayChange(nextDay.toISOString().split("T")[0]);
  };

  return (
    <div className="navigation-container">
      <button onClick={handlePreviousDay} className="nav-button">
        לפני
      </button>
      <div className="date-display">{selectedDay}</div>
      <button onClick={handleNextDay} className="nav-button">
        הבא
      </button>
    </div>
  );
};

const TaskList: React.FC<{
  tasks: Task[];
  onCheckboxChange: (taskId: number) => void;
  onSubmit: (task: Task) => void;
}> = ({ tasks, onCheckboxChange, onSubmit }) => {
  const handleCheckboxClick = (task: Task) => {
    onCheckboxChange(task.id);
    onSubmit(task);
  };

  return (
    <div className="task-list-container">
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          {task.imageUrl && (
            <img src={task.imageUrl} alt={task.title} className="task-image" />
          )}
          <div className="task-content">
            <h3>{task.title}</h3>
            <h4>{task.subTitle}</h4>
            <p>{task.description}</p>
            <label>
              <input
                type="checkbox"
                checked={task.read || false}
                onChange={() => handleCheckboxClick(task)}
              />
              קראתי את ההדרכה
            </label>
          </div>
        </div>
      ))}
      {tasks.length === 0 && <p>אין הדרכה יומית היום</p>}
    </div>
  );
};

export default App;
