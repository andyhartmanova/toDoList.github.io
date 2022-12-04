const form = document.querySelector("#task-form");
const taskList = document.querySelector(".collection");
const taskInput = document.querySelector("#task");
const card = document.querySelector(".card-action");
const filterInput = document.querySelector("#filter");
const clearBtn = document.querySelector(".clear-tasks");
loadEventListeners();

function loadEventListeners() {
document.addEventListener('DOMContentLoaded', loadTasksFromLS);
   //Add task
  form.addEventListener("submit", addTask);
  //Delete task
  card.addEventListener("click", removeTask);
  //Check task
  card.addEventListener("click", checkTask);
  //Clear tasks
  clearBtn.addEventListener("click", clearTasks);
  //Filter tasks
  filterInput.addEventListener("keyup", filterTasks);
}
//Creating li element for task
function createLi(task, done=false) {
  //Create li element
  const taskLi = document.createElement("li");
  //add class to li element
  taskLi.className = "collection-item";
  //insert textNode with text from the input
  taskLi.appendChild(document.createTextNode(task));

  const linkX = document.createElement("a");
  linkX.className = "delete-item secondary-content";
  linkX.innerHTML =
    '<i class="fa-solid fa-xmark" style ="color: rgba(148, 148, 148);"></i>';
  taskLi.appendChild(linkX);

  const linkCheck = document.createElement("a");
  linkCheck.className = "check secondary-content";
  if(done===false){
   linkCheck.innerHTML = '<i class="fa-solid fa-circle-check" style ="color: rgba(148, 148, 148, 0.291);"></i>';
  }else{
   linkCheck.innerHTML = '<i class="fa-solid fa-circle-check" style ="color: rgba(4, 176, 90, 0.748);"></i>';
  }
  
  taskLi.appendChild(linkCheck);
  //append taskLi to the list
  taskList.appendChild(taskLi);
}
function loadTasksFromLS() {
   const tasksInLS = localStorage.getItem("tasks");
  //check for existing tasks in LS
  if (tasksInLS === null) {
    var tasks = [];
  } else {
    var tasks = JSON.parse(tasksInLS);
    tasks.forEach(task => {
      createLi(task.taskText,task.done);
    });
  }
}
//Adding task in UI
function addTask(e) {
  if (taskInput.value === "") {
    alert("Add task");
  } else {
    //calling function for creating the li element
    createLi(taskInput.value);
    //calling function to save task in LS
    storeTask();
  }
  //clear the input
  taskInput.value = "";
  e.preventDefault();
}
//Store task in LS
function storeTask() {
  const tasksInLS = localStorage.getItem("tasks");
  //check for existing tasks in LS
  if (tasksInLS === null) {
    var tasks = [];
  } else {
    var tasks = JSON.parse(tasksInLS);
  }
  //adding new tasks in array
  tasks.push({
    taskText: taskInput.value,
    done: false,
  });
  //saving array with new task in LS
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//RemoveTask
function removeTask(e) {
  if (e.target.parentElement.classList.contains("delete-item")) {
    if (confirm("Are You Sure?")) {
      //removing from html
      e.target.parentElement.parentElement.remove();
      //removing from LS
      removeTaskFromLS(e.target.parentElement.parentElement);
    }
  }
}

//Remove task from LS
function removeTaskFromLS(taskItem) {
  const tasksInLS = localStorage.getItem("tasks");
  //checking for existing tasks in LS
  if (tasksInLS === null) {
    var tasks = [];
  } else {
    var tasks = JSON.parse(tasksInLS);
  }
  //searching for wanted task to delete from array
  tasks.forEach(function (task, index) {
    if (task.taskText === taskItem.textContent) {
      tasks.splice(index, 1);
    }
  });

  //   for (let index = 0; index < tasks.length; index++) {
  //     if (tasks[index].taskText === taskItem.textContent) {
  //       console.log(tasks[index]);

  //       tasks.splice(index, 1);
  //     }
  //   }
  //saving edited array in LS
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Check task
function checkTask(e) {
   if (e.target.parentElement.classList.contains('check')) {
      const checkIcon = e.target;
      const taskToCheck = e.target.parentElement.parentElement.textContent;
      let tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
      tasksFromLS.forEach(taskLS => {
         if(taskLS.taskText === taskToCheck){
            if(taskLS.done === false){
               checkIcon.style = "color: rgba(4, 176, 90, 0.748)";
               taskLS.done = true;               
            }else{
               checkIcon.style = "color: rgba(148, 148, 148, 0.291)";
               taskLS.done = false;
            }
         }
      });

      localStorage.setItem("tasks", JSON.stringify(tasksFromLS));
   }

   
  }


//Clear tasks in UI and in LS
function clearTasks() {
  if (confirm("Are You Sure?")) {
    while (taskList.firstChild) {
      //clear from html
      taskList.removeChild(taskList.firstChild);
      //clear from LS
      localStorage.clear();
    }
  }
}

//Filter tasks
function filterTasks(e) {
  //text from input
  const text = e.target.value.toLowerCase();
  //looping through tasks
  document.querySelectorAll(".collection-item").forEach((task) => {
    const taskItem = task.firstChild.textContent;
    //setting display for matching tasks
    if (taskItem.toLowerCase().indexOf(text) != -1) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
}
