console.log('JS работает');

let tasks = [];
const savedTasks = localStorage.getItem('tasks');

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
}

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const counter = document.querySelector('#task-counter');
const filters = document.querySelector('#filters');
const searchInput = document.querySelector('#search-input');
const clearCompletedButton = document.querySelector('#clear-completed');

let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function renderTasks() {
    list.innerHTML = '';

    const searchText = searchInput.value.toLowerCase();

    let filteredTasks = tasks;

    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(function (task) {
            return !task.completed;
        });
    }

    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(function (task) {
            return task.completed;
        });
    }

    filteredTasks = filteredTasks.filter(function (task) {
            return task.text.toLowerCase().includes(searchText);
    });

    filteredTasks.forEach(function (task) {
        const li = document.createElement('li');

        li.textContent = task.text;

        if (task.completed) {
            li.classList.add('completed');
        }

        li.addEventListener('click', function () {
            task.completed = !task.completed;
            
            saveTasks();
            
            renderTasks();
        });


        const editButton = document.createElement('button');

        editButton.textContent = 'Изменить';

        editButton.addEventListener('click', function (event) {
            event.stopPropagation();

            const newText = prompt('Измените задачу:', task.text);

            if (newText !== null && newText !== '') {
                task.text = newText;

                saveTasks();

                renderTasks();
            }
        });


        const deleteButton = document.createElement('button');

        deleteButton.textContent = 'Удалить';

        deleteButton.addEventListener('click', function (event) {
            event.stopPropagation();

            tasks = tasks.filter(function (item) {
                return item !== task;
            });

            saveTasks();

            renderTasks();
        });


        li.appendChild(editButton);
        li.appendChild(deleteButton);

        list.appendChild(li);
    });


    const activeTasks = tasks.filter(function (task) {
        return !task.completed;
    });

    counter.textContent = 'Осталось задач: ' + activeTasks.length;
}


form.addEventListener('submit', function (event) {
    event.preventDefault();

    const task = input.value;

    if (task === '') {
        return;
    }

    const newTask = {
        text: task,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();

    input.value = '';
});


filters.addEventListener('click', function (event) {
    if (event.target.tagName !== 'BUTTON') {
        return;
    }

    currentFilter = event.target.dataset.filter;

    renderTasks();
});

searchInput.addEventListener('input', function () {
    renderTasks();
});

clearCompletedButton.addEventListener('click', function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
});