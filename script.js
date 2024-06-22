// Seleccionar elementos del DOM
const itTask = document.querySelector("#writeText");
const form = document.querySelector("#form");
const tasksContainer = document.querySelector(".app__ctrTasks-tasks");
const appTimerNameTask = document.querySelector(".app__timer-nameTask");
const timeDiv = document.querySelector(".app__timer-time");
const select = document.getElementById("select");

// Variables y arrays iniciales
const tasks = [];
let time = 0;
let timer = null;
let currentTask = null;

// Renderizar tiempo inicial
renderTime();

// Event listener para agregar una nueva tarea
form.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(e) {
    e.preventDefault();
    const taskValue = itTask.value.trim();//trim() elimina los espacios en blanco
    if (taskValue !== "") {
        createTask(taskValue);
        itTask.value = "";
        renderTasks();
    }
}

// Función para crear una nueva tarea y agregarla al array de tareas
function createTask(value) {
    const newTask = {
        id: generateId(),
        title: value,
        completed: false,
    };
    tasks.unshift(newTask);
}

function generateId() {
    return (Math.random() * 100).toString(36).slice(2);
}

// Función para renderizar las tareas en pantalla
function renderTasks() {
    const tasksHtml = tasks.map(generateTaskHtml).join("");
    tasksContainer.innerHTML = tasksHtml;
    addStartButtonListeners();
}

function generateTaskHtml(task) {
    return `
        <div class="task">
            <div class="title">${task.title}</div>
            <div class="completed">${task.completed ? "<span class='done'>Done</span>" : `<button class="start-button" data-id="${task.id}">Start</button>`}</div>
        </div>`;
}

function addStartButtonListeners() {
    const startButtons = document.querySelectorAll(".start-button");
    startButtons.forEach((startButton) => {
        startButton.addEventListener("click", handleStartButtonClick);
    });
}

function handleStartButtonClick() {
    const taskId = this.getAttribute("data-id");
    if (!timer) {
        startTimer(taskId);
        this.textContent = "In progress";
        this.classList.add("in_progress");
        this.classList.remove("start-button");
    }
}

// Función para manejar el botón de inicio de una tarea
function startTimer(taskId) {
    time = Number(select.value) * 60;
    currentTask = taskId;
    appTimerNameTask.textContent = tasks.find(task => task.id === taskId).title;
    timer = setInterval(() => {
        timerHandler(taskId);
    }, 1000);
}

// Función para manejar el temporizador de una tarea
function timerHandler(taskId) {
    renderTime();
    time--;
    if (time === 0) {
        markTaskAsComplete(taskId);
        clearInterval(timer);
        timer = null;
        renderTasks();
        startBreak();
    }
}

// Función para marcar una tarea como completada
function markTaskAsComplete(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = true;
    }
}

// Función para iniciar el temporizador de descanso
function startBreak() {
    time = 0.1 * 60;
    appTimerNameTask.textContent = "Break";
    timer = setInterval(timerBreakHandler, 1000);
}

// Función para manejar el temporizador de descanso
function timerBreakHandler() {
    time--;
    renderTime();
    if (time === 0) {
        clearInterval(timer);
        timer = null;
        currentTask = null;
        appTimerNameTask.textContent = "";
        renderTime();
    }
}

// Función para renderizar el tiempo en pantalla
function renderTime() {
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);
    timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}