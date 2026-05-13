async function validateTokenOrRedirect() {
  try {
    const renewToken = await fetch("https://cdn.fr33styler.ro:8443/auth/accounts/token", {
      credentials: "include",
      method: "POST",
    });

    if (!renewToken.ok) {
      window.location.replace('../login');
    }
  } catch (err) {}
}

validateTokenOrRedirect();

document.addEventListener("DOMContentLoaded", async () => {
    await validateTokenOrRedirect();

    const response = await fetch("https://cdn.fr33styler.ro:8443/api/tasks/filtered", {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    const tasks = data.tasks ?? data;
    for (const task of tasks) {
      addTask(task.id, task.task, Math.round(task.progress * 100), task.note, task.dueDate.replace("T", " "), task.priority, task.status);
    }
  }
});

async function logOff() {
  try {
    await fetch("https://cdn.fr33styler.ro:8443/auth/accounts/token", {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
  } catch (err) {}
  
  window.location.replace('../');
}

async function addTaskFromForm() {
  const task = document.getElementById("task");
  const progress = document.getElementById("progress");
  const note = document.getElementById("note");
  const date = document.getElementById("date");
  const time = document.getElementById("time");
  const priority = document.getElementById("priority");
  const status = document.getElementById("status");

  await validateTokenOrRedirect();
  
  const response = await fetch("https://cdn.fr33styler.ro:8443/api/tasks", {
    credentials: "include",
    method: "POST",
    body: JSON.stringify({ 
      task: task.value,
      priority: priority.value,
      status: status.value,
      progress: progress.value / 100,
      dueDate: date.value + "T" + time.value,
      note: note.value,
    }),
    headers: {
      "Content-type": "application/json",
    },
  });

  if (response.ok) {
    const idValue = await response.text();
    addTask(idValue, task.value, progress.value, note.value, date.value + " " + time.value, priority.value, status.value);
  }
  task.value = "";
  progress.value = "0";
  note.value = "";
  date.value = "2026-05-12";
  time.value = "12:00";
  priority.value = "MEDIUM";
  status.value = "unfinished";
}

function addTask(idValue, taskValue, progressValue, noteValue, dateTimeValue, priorityValue, statusValue) {
  const boxes = document.getElementById("boxes");

  const box = document.createElement("div");
  box.className = "box";
  box.id = idValue;

  const title = document.createElement("h1");
  title.textContent = taskValue;
  box.appendChild(title);
  box.appendChild(document.createElement("br"));
  
  const progressBorder = document.createElement("div");
  progressBorder.className = "progress-border";

  const progress = document.createElement("div");
  progress.className = "progress";
  progress.textContent = progress.style.width = progressValue + "%";
  progressBorder.appendChild(progress);
  box.appendChild(progressBorder);

  const flexBox1 = document.createElement("div");
  flexBox1.className = "flex-box";
  const priority = document.createElement("p");
  const priorityLabel = document.createElement("b");
  priorityLabel.textContent = "Priority: ";
  priority.appendChild(priorityLabel);

  switch (priorityValue) {
    case "HIGH":
      priority.style.backgroundColor = "#E53935";
      priority.appendChild(document.createTextNode("High"));
      break;
    case "MEDIUM":
      priority.style.backgroundColor = "#F57C00";
      priority.appendChild(document.createTextNode("Medium"));
      break;
    case "LOW":
      priority.style.backgroundColor = "#2E7D32";
      priority.appendChild(document.createTextNode("Low"));
      break;
    default:
  }

  flexBox1.appendChild(priority);
  const status = document.createElement("p");
  status.className = "status";
  const statusLabel = document.createElement("b");
  statusLabel.textContent = "Status: ";
  status.appendChild(statusLabel);

  switch (statusValue) {
    case "finished":
      status.style.backgroundColor = "#2E7D32";
      status.appendChild(document.createTextNode("Finished"));
      break;
    case "in-progress":
      status.style.backgroundColor = "#F57C00";
      status.appendChild(document.createTextNode("In Progress"));
      break;
    case "unfinished":
      status.style.backgroundColor = "#E53935";
      status.appendChild(document.createTextNode("Unfinished"));
      break;
    default:
  }

  flexBox1.appendChild(status);
  box.appendChild(flexBox1);

  const flexBox2 = document.createElement("div");
  flexBox2.className = "flex-box";
  const note = document.createElement("p");
  note.style.backgroundColor = "#F57C00";
  const noteLabel = document.createElement("b");
  noteLabel.textContent = "Note: ";
  note.appendChild(noteLabel);
  note.appendChild(document.createTextNode(noteValue));
  flexBox2.appendChild(note);
  const due = document.createElement("p");
  due.style.backgroundColor = "#F57C00";
  const dueLabel = document.createElement("b");
  dueLabel.textContent = "Due: ";
  due.appendChild(dueLabel);
  due.appendChild(document.createTextNode(dateTimeValue));
  flexBox2.appendChild(due);
  box.appendChild(flexBox2);

  const boxEnd = document.createElement("div");
  boxEnd.className = "box-end";
  const taskId = document.createElement("p");
  taskId.textContent = "Task #" + idValue;
  boxEnd.appendChild(taskId);
  const boxEndRight = document.createElement("div");
  boxEndRight.className = "box-end-right";
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.setAttribute("popovertarget", "edit-task");
  editButton.addEventListener("click", () => {
    const editForm = document.getElementById("edit-form");
    editForm.setAttribute("data-form-id", idValue);

    const taskBox = document.getElementById(idValue);
    const statusBox = taskBox.querySelector(".status");
    const progressBox = taskBox.querySelector(".progress");

    const progress = document.getElementById("edit-progress");
    const status = document.getElementById("edit-status");

    progress.value = progressBox.textContent.slice(0, -1);
    switch (statusBox.children[1].textContent) {
      case "Finished":
        status.value = "finished";
        break;
      case "In Progress":
        status.value = "in-progress";
        break;
      case "Unfinished":
        status.value = "unfinished";
        break;
      default:
    }
  });
  boxEndRight.appendChild(editButton);
  boxEndRight.appendChild(document.createTextNode(" "));
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", async () => {
    deleteTask(idValue);
  });
  boxEndRight.appendChild(deleteButton);
  boxEnd.appendChild(boxEndRight);
  box.appendChild(boxEnd);
  

  boxes.appendChild(box);
}

async function editTaskFromForm() {
  const editForm = document.getElementById("edit-form");
  const idValue = editForm.getAttribute("data-form-id");

  const progress = document.getElementById("edit-progress");
  const status = document.getElementById("edit-status");

  const taskBox = document.getElementById(idValue);
  const statusBox = taskBox.querySelector(".status");
  const progressBox = taskBox.querySelector(".progress");

  await validateTokenOrRedirect();

  try {
    const response = await fetch("https://cdn.fr33styler.ro:8443/api/tasks/" + idValue + "/progress/" + progress.value / 100, {
      credentials: "include",
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
    });
    if (response.ok) {
      progressBox.textContent = progressBox.style.width = progress.value + "%";
    }
  } catch (err) {}

  try {
    const response = await fetch("https://cdn.fr33styler.ro:8443/api/tasks/" + idValue + "/status/" + status.value, {
      credentials: "include",
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
    });
    if (response.ok) {
      switch (status.value) {
        case "finished":
          statusBox.style.backgroundColor = "#2E7D32";
          statusBox.children[1].textContent = "Finished";
          break;
        case "in-progress":
          statusBox.style.backgroundColor = "#F57C00";
          statusBox.children[1].textContent = "In Progress";
          break;
        case "unfinished":
          statusBox.style.backgroundColor = "#E53935";
          statusBox.children[1].textContent = "Unfinished";
          break;
        default:
      }
    }
  } catch (err) {}
}

async function deleteTask(id) {
  await validateTokenOrRedirect();

  const response = await fetch("https://cdn.fr33styler.ro:8443/api/tasks/" + id, {
    credentials: "include",
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  });

  if (response.ok) {
    document.getElementById(id).remove();
  }
}
