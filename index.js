// import { method } from "lodash";

let tasks = [];
const setTasks = (tasksData) => {
  tasks = [...tasksData];
};

const fetchTasks = async () => {
  const data = await fetch("http://localhost:7000/tasks");
  const tasks = await data?.json();
  return tasks;
};
const deleteTodo = async (id) => {
  const deleted = await fetch(`http://localhost:7000/tasks/${id}`, {
    method: "DELETE",
  });
  console.log(deleted);
};

const addTodo = async (todo) => {
  const added = await fetch(`http://localhost:7000/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  console.log(added);
};
const formTask = (title, description, reminder, time) => {
  const newTask = description
    ? {
        title,
        description,
        reminder,
        timeDue: time,
      }
    : {
        title,
        description: "No description",
        reminder,
        timeDue: time,
      };
  return newTask;
};
function createTasks(tasksSection) {
  tasks.forEach((task) => {
    const { id, title, description, timeDue, reminder } = task;
    createTask(id, title, description, timeDue, reminder, tasksSection);
  });
}
function clearSection(tasksSection) {
  const taskItems = tasksSection.children;
  const taskArray = Array.from(taskItems);
  for (let i = 0; i < taskArray.length; i++) {
    if (i > 0) {
      tasksSection.removeChild(taskArray[i]);
    }
  }
}
const addTask = async (
  e,
  titleInput,
  timeInput,
  descriptionInput,
  reminderInput,
  tasksSection
) => {
  e.preventDefault();
  const title = titleInput.value;
  const description = descriptionInput.value;
  const time = timeInput.value;
  const reminder = reminderInput.checked;
  const newTask = formTask(title, description, reminder, time);
  addTodo(newTask);
};

const createTask = (
  id,
  title,
  description,
  timeDue,
  reminder,
  tasksSection
) => {
  const task = document.createElement("div");
  const taskHeader = document.createElement("div");
  const deleteTask = document.createElement("span");
  const line = document.createElement("hr");
  const taskTitle = document.createElement("h3");
  const descriptionBtn = document.createElement("button");

  const timeText = document.createElement("small");
  const timeQuote = document.createElement("blockquote");
  const actualTime = document.createElement("cite");
  const descriptionContainer = document.createElement("div");
  const descriptionContent = document.createElement("div");
  const closeSection = document.createElement("div");
  const descriptionClose = document.createElement("span");
  const descriptionTitle = document.createElement("h3");
  const descriptionLine = document.createElement("hr");
  const descriptionText = document.createElement("div");
  const descriptionTimeText = document.createElement("small");
  const descriptionTimeQuote = document.createElement("blockquote");
  const descriptionTime = document.createElement("cite");
  const toggleButton = document.createElement("div");
  const toggleCircle = document.createElement("div");
  const reminderContainer = document.createElement("div");

  task.classList.add("task");
  taskHeader.classList.add("task_header");
  taskTitle.classList.add("task_title");
  deleteTask.classList.add("delete");
  descriptionBtn.classList.add("check_description");
  descriptionContainer.classList.add("description_container");
  descriptionContent.classList.add("description_content");
  closeSection.classList.add("close_section");
  descriptionClose.classList.add("close_description");
  descriptionTitle.classList.add("description_title");
  descriptionText.classList.add("description_text");
  descriptionTimeText.classList.add("time_due");
  toggleButton.classList.add("toggle_btn");
  toggleCircle.classList.add("inner_circle");
  reminderContainer.classList.add("reminder_container");

  reminder && toggleButton.classList.add("active");

  taskTitle.innerHTML = title;
  deleteTask.innerHTML = "delete";
  descriptionBtn.innerHTML = "Check Description";
  reminderContainer.innerHTML = `Reminder: `;

  actualTime.innerHTML = timeDue;
  timeQuote.innerHTML = "Time Due: ";
  descriptionClose.innerHTML = "close";
  descriptionTitle.innerHTML = title;
  descriptionText.innerHTML = description;
  descriptionTime.innerHTML = timeDue;
  descriptionTimeQuote.innerHTML = "Time Due: ";

  deleteTask.addEventListener("click", () => {
    // const newTasks = tasks.filter((task) => task.id !== id);
    deleteTodo(id);
  });
  descriptionBtn.addEventListener("click", () => {
    descriptionContainer.classList.add("open");
  });
  descriptionClose.addEventListener("click", () => {
    descriptionContainer.classList.remove("open");
  });
  toggleButton.addEventListener("click", () => {
    toggleButton.classList.toggle("active");
    reminder = !reminder;
    fetch(`http://localhost:7000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title, description, reminder, timeDue }),
    });
  });
  // reminderContainer.appendChild();
  taskHeader.appendChild(taskTitle);
  taskHeader.appendChild(deleteTask);

  timeQuote.appendChild(actualTime);
  timeText.appendChild(timeQuote);

  closeSection.appendChild(descriptionClose);

  descriptionTimeQuote.appendChild(descriptionTime);
  descriptionTimeText.appendChild(descriptionTimeQuote);
  toggleButton.appendChild(toggleCircle);
  reminderContainer.appendChild(toggleButton);

  descriptionContent.appendChild(closeSection);
  descriptionContent.appendChild(descriptionTitle);
  descriptionContent.appendChild(descriptionLine);
  descriptionContent.appendChild(descriptionText);
  descriptionContent.appendChild(descriptionTimeText);

  descriptionContainer.appendChild(descriptionContent);

  task.appendChild(taskHeader);
  task.appendChild(line);
  task.appendChild(descriptionBtn);
  task.appendChild(reminderContainer);
  task.appendChild(timeText);
  task.appendChild(descriptionContainer);

  tasksSection.appendChild(task);
};

document.addEventListener("DOMContentLoaded", () => {
  const addForm = document.querySelector("#add_form_container");
  const closeForm = document.querySelector("#close_form");
  const titleInput = document.querySelector(".title_input");
  const timeInput = document.querySelector("#time_input");
  const descriptionInput = document.querySelector("#description_input");
  const reminderInput = document.querySelector("#reminder_input");
  const tasksSection = document.getElementById("tasks");
  const toggleForm = document.querySelector("#toggle_form");
  const noTask = document.createElement("p");
  noTask.classList.add("no_task");
  noTask.innerHTML = "Sorry you have no tasks";
  const checkOpen = () => {
    if (addForm.classList.contains("open")) {
      toggleForm.innerHTML = "Close Form";
    } else {
      toggleForm.innerHTML = "Add Task";
    }
  };
  closeForm.addEventListener("click", () => {
    addForm.classList.remove("open");
    checkOpen();
  });

  checkOpen();
  toggleForm.addEventListener("click", () => {
    addForm.classList.toggle("open");
    checkOpen();
  });

  addForm.addEventListener("submit", (e) =>
    addTask(
      e,
      titleInput,
      timeInput,
      descriptionInput,
      reminderInput,
      tasksSection
    )
  );
  (async function init() {
    const todos = await fetchTasks();
    setTasks(todos);
    console.log(tasks);
    tasks.length ? createTasks(tasksSection) : tasksSection.appendChild(noTask);
  })();
});
