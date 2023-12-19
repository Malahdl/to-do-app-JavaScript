const tasksTab = document.querySelector(".tasks");
const doneTab = document.querySelector(".done");
const unfinishedTab = document.querySelector(".unfinished");

const todosPage = document.querySelector(".todos-page");
const donePage = document.querySelector(".done-page");
const unfinishedPage = document.querySelector(".unfinished-page");

const addBtn = document.querySelector(".add-btn");
const taskText = document.getElementById("task-text");
const datePickerBtn = document.querySelector(".date-picker-btn");
const dateText = document.querySelector(".date-text");
const errorTask = document.querySelector(".error");
const tasksListBody = document.querySelector(".tasks-list-body");

const datePickerWindow = document.querySelector(".date-picker-window");
const daysPicker = document.getElementById("days");
const monthsPicker = document.getElementById("months");
const yearsPicker = document.getElementById("years");
const errorDateText = document.querySelector(".error-date");
const confirmBtn = document.querySelector(".confirm-btn");
const resetBtn = document.querySelector(".reset-btn");


let currentTasksTab = "tasks";
let todos = [];

let currentDate = "";
let taskTitle = "";

activateTab();
buildDatePicker();
loadTaskItems();

function getRandomId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    return `${timestamp}-${random}`; // Combine timestamp and random number
}

function activateTab() {
    if (currentTasksTab == "tasks") {
        doneTab.classList.remove("active-tab");
        donePage.classList.add("hidden");

        unfinishedTab.classList.remove("active-tab");
        unfinishedPage.classList.add("hidden");

        tasksTab.classList.add("active-tab");
        todosPage.classList.remove("hidden");
    } else if (currentTasksTab == "done") {
        tasksTab.classList.remove("active-tab");
        todosPage.classList.add("hidden");

        unfinishedTab.classList.remove("active-tab");
        unfinishedPage.classList.add("hidden");

        doneTab.classList.add("active-tab");
        donePage.classList.remove("hidden");
    } else {
        tasksTab.classList.remove("active-tab");
        todosPage.classList.add("hidden");

        doneTab.classList.remove("active-tab");
        donePage.classList.add("hidden");

        unfinishedTab.classList.add("active-tab");
        unfinishedPage.classList.remove("hidden");
    }
}

function buildDatePicker() {
    daysPicker.innerHTML = "";
    monthsPicker.innerHTML = "";
    yearsPicker.innerHTML = "";

    daysPicker.innerHTML += `<option value="dd">dd</option>`;
    monthsPicker.innerHTML += `<option value="mm">mm</option>`;
    yearsPicker.innerHTML += `<option value="yyyy">yyyy</option>`;

    for (let i = 1; i <= 31; i++) {
        daysPicker.innerHTML += `<option value="${i}">${i}</option>`;
    }

    for (let i = 1; i <= 12; i++) {
        monthsPicker.innerHTML += `<option value="${i}">${i}</option>`;
    }

    for (let i = new Date().getFullYear(); i <= (new Date().getFullYear() + 10); i++) {
        yearsPicker.innerHTML += `<option value="${i}">${i}</option>`;
    }
}

function loadTaskItems() {
    todos = getTasksLS();

    let inProgressTasks = todos.filter((taskItem) => (isAfterDate(taskItem.endDate) == false && taskItem.isDone == "false"));
    let doneTasks = todos.filter((taskItem) => taskItem.isDone == "true");
    let unfinishedTasks = todos.filter((taskItem) => (isAfterDate(taskItem.endDate) == true && taskItem.isDone == "false"));

    buildInProgressTasks(inProgressTasks);
    buildDoneTasks(doneTasks);
    buildUnfinishedTasks(unfinishedTasks);
}

function isAfterDate(dateString) {
    const endDate = new Date(dateString);
    const currentDate = new Date();

    if (currentDate > endDate) {
        return true;
    } else {
        return false;
    }
}

function buildInProgressTasks(tasksList) {
    tasksListBody.innerHTML = "";

    if (tasksList.length == 0) {
        tasksListBody.innerHTML = "<h1>Be Productive & Add New Tasks!</h1>";
    } else {
        tasksList.forEach(element => {
            let taskItem = document.createElement("div");
            taskItem.classList.add("task-item");
            taskItem.innerHTML =
                `
            <div class="first-half">
                <div class="upper-widgets">
                    <div class="check-box"></div>
                    <h3>${element.title}</h3>
                </div>
                <h6>Due Date: ${element.endDate}</h6>
            </div>
            <div class="remove-btn">
                <i class="fa-solid fa-trash"></i>
            </div>
            `;

            let checkBox = taskItem.querySelector(".check-box");

            checkBox.addEventListener("click", () => {
                checkBox.classList.add("checked");
                checkBox.innerHTML = `<i class="fa-solid fa-check"></i>`;
                element.isDone = "true";
                addTaskLS(element);

                loadTaskItems();
            });

            let removeBtn = taskItem.querySelector(".remove-btn");

            removeBtn.addEventListener("click", () => {
                removeTaskIdLS(element.id);
                removeTaskLS(element.id);

                loadTaskItems();
            });

            tasksListBody.appendChild(taskItem);
        });
    }

}

function buildDoneTasks(tasksList) {
    donePage.innerHTML = "";

    if(tasksList.length == 0) {
        donePage.innerHTML = "<h1>Your Finished Tasks Will Appear Here!</h1>"
    } else {
        tasksList.forEach(element => {
            let taskItem = document.createElement("div");
            taskItem.classList.add("done-task-item");
            taskItem.innerHTML =
                `
            <h3>${element.title}</h3>
            <i class="fa-solid fa-check"></i>
            `;
            donePage.appendChild(taskItem);
        });
    }
}

function buildUnfinishedTasks(tasksList) {
    unfinishedPage.innerHTML = "";

    if(tasksList.length == 0) {
        unfinishedPage.innerHTML = "<h1>Your Unfinished Tasks Will Appear Here!</h1>";
    } else {
        tasksList.forEach(element => {
            let taskItem = document.createElement("div");
            taskItem.classList.add("unfinished-task-item");
            taskItem.innerHTML =
                `
            <h3>${element.title}</h3>
            <i class="fa-sharp fa-solid fa-xmark"></i>
            `;
            unfinishedPage.appendChild(taskItem);
        });
    }
}

function addTaskIdLS(id) {
    let taskIds = getTaskIdsLS();

    localStorage.setItem(
        "taskIds", JSON.stringify([...taskIds, id])
    );
}

function removeTaskIdLS(id) {
    let taskIds = getTaskIdsLS();

    localStorage.setItem(
        "taskIds", JSON.stringify(taskIds.filter((taskId) => taskId !== id))
    );
}

function getTaskIdsLS() {
    let taskIds = JSON.parse(localStorage.getItem("taskIds"));

    return taskIds === null ? [] : taskIds;
}

function addTaskLS(taskItem) {
    localStorage.setItem(taskItem.id, JSON.stringify(taskItem));
}

function removeTaskLS(id) {
    localStorage.removeItem(id);
}

function getTasksLS() {
    let taskIds = getTaskIdsLS();
    let taskItems = [];

    if (taskIds.length == 0) {
        return [];
    } else {
        taskIds.forEach(element => {
            taskItems.push(JSON.parse(localStorage.getItem(element)));
        });

        return taskItems;
    }
}

tasksTab.addEventListener("click", () => {
    currentTasksTab = "tasks";
    activateTab();
});

doneTab.addEventListener("click", () => {
    currentTasksTab = "done";
    activateTab();
});

unfinishedTab.addEventListener("click", () => {
    currentTasksTab = "unfinished";
    activateTab();
});

datePickerBtn.addEventListener("click", (event) => {
    datePickerWindow.classList.toggle("hidden");
    datePickerWindow.style.top = `${(event.clientY - 100) + (200 - event.clientY) + 40}px`;
    datePickerWindow.style.right = `5%`;
});

addBtn.addEventListener("click", () => {
    taskTitle = taskText.value;

    if (taskTitle.trim() == "" || currentDate == "") {
        errorTask.innerHTML = "Must Enter Task Title And End Date!";
    } else {
        errorTask.innerHTML = "";
        let taskItem = {
            id: getRandomId(),
            title: taskTitle,
            endDate: currentDate,
            isDone: "false",
        };

        addTaskIdLS(taskItem.id);
        addTaskLS(taskItem);

        currentDate = "";
        taskTitle = "";
        taskText.value = "";
        dateText.innerHTML = "Select a Date";

        loadTaskItems();
    }
});

resetBtn.addEventListener("click", () => {
    buildDatePicker();
    errorDateText.innerHTML = "";
});

confirmBtn.addEventListener("click", () => {
    let daysValue = daysPicker.options[daysPicker.selectedIndex].text;
    let monthsValue = monthsPicker.options[monthsPicker.selectedIndex].text;
    let yearsValue = yearsPicker.options[yearsPicker.selectedIndex].text;
    if (daysValue != "dd" && monthsValue != "mm" && yearsValue != "yyyy") {
        currentDate = yearsValue + "-" + monthsValue + "-" + daysValue;
        datePickerWindow.classList.add("hidden");
        dateText.innerHTML = currentDate;
        errorDateText.innerHTML = "";
        buildDatePicker();
    } else {
        errorDateText.innerHTML = "Must Enter a Valid Date!";
    }
});