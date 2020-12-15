const todoInput = document.querySelector('#todoInput')
const todoList = document.querySelector('#todoList > ul')

async function createTodoItem(e) {
    if (e.keyCode === 13 && todoInput.value !== '') {
        if (todoList.innerHTML.includes('no_data')) {
            todoList.innerHTML = ''
        }
        const todoValue = todoInput.value
        try {
            const {data} = await request('/api/todos', 'POST', JSON.stringify(todoValue))
            if (data.success) {
                todoInput.value = ''
                todoList.insertAdjacentHTML(
                    'afterbegin', 
                    `<li class="todo__item" data-id="${data.id}">
                        <p class="todo__item-value">${todoValue}</p>
                        <span class="todo__item-close">&#x2715</span>
                    </li>`
                )
            } else {
                console.error('Error')
            }
        } catch (err) {
            console.error(err, 'Error')
        }
    }
}

async function deleteTodoItem(e) {
    if (e.target.className === 'todo__item-close') {
        if (confirm('Are you sure?')) {
            const todoId = e.target.closest('.todo__item').getAttribute('data-id')
            try {
                const {data} = await request('/api/todos', 'DELETE', JSON.stringify(todoId))
                if (data.success) {
                    e.target.closest('.todo__item').remove()
                    const todoItems = todoList.querySelectorAll('.todo__item')
                    if (!todoItems.length) {
                        todoList.insertAdjacentHTML(
                            'afterbegin', 
                            `<p class="no_data">There's no items here, type a new one and hit "Enter"</p>`
                        )
                    }
                } else {
                    console.error('Error')
                }
            } catch (err) {
                console.error(err, 'Error')
            }
        } 
    }
}

function editTodoItem(e) {
    if (e.target.className === 'todo__item-value') {
        e.target.setAttribute('contenteditable', true)
        e.target.focus()
    }
}

async function clickOutsideEditedItem(e) {
    if (!e.target.hasAttribute('contenteditable') && document.querySelector('.todo__item-value[contenteditable]')) {
        const todoItem = document.querySelector('.todo__item-value[contenteditable]')
        const todoId = todoItem.closest('.todo__item').getAttribute('data-id')
        const todoValue = todoItem.innerText
        try {
            const {data} = await request('/api/todos', 'PUT', JSON.stringify({id: todoId, value: todoValue}))
            if (data.success) {
               console.log(data)
               todoItem.removeAttribute('contenteditable')
            } else {
                console.error('Error')
            }
        } catch (err) {
            console.error(err, 'Error')
        }
    }
}

async function getAllTodos() {
    try {
        const {data} = await request('/api/todos')
        if (data.success) {
            if (data.todoArray.length) {
                data.todoArray.forEach(element => {
                    todoList.insertAdjacentHTML(
                        'afterbegin', 
                        `<li class="todo__item" data-id="${element.id}">
                            <p class="todo__item-value">${element.data}</p>
                            <span class="todo__item-close">&#x2715</span>
                        </li>`
                    )  
                })
            } else {
                todoList.insertAdjacentHTML(
                    'afterbegin', 
                    `<p class="no_data">There's no items here, type a new one and hit "Enter"</p>`
                )
            }
            
        } else {
            console.warn('No data')
        }
    } catch (err) {
        console.error(err, 'Error')
    }
}

async function request(url, method = 'GET', data = null) {
    try {
        const headers = {}
        let body = null

        if(data) {
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }
        const response = await fetch(url, {
            method, headers, body
        })
        return await response.json()

    } catch (e) {
        console.warn('Error: ', e.message)
    }
}

todoInput.addEventListener('keyup', createTodoItem)
todoList.addEventListener('click', deleteTodoItem)
todoList.addEventListener('dblclick', editTodoItem)
document.addEventListener('click', clickOutsideEditedItem)
document.addEventListener('DOMContentLoaded', getAllTodos)