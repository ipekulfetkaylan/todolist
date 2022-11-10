const todoList= document.getElementById('todo-list');
const todoInput= document.getElementById('todo-input');
const todoButton= document.getElementById('todo-button');
const todoFilter= document.getElementById('todo-filter');

const getTodosFromStorage= () => {
    const storage= JSON.parse(localStorage.getItem('todos'));
    return(storage) ? storage : [];
}

const getDonesFromStorage= () => {
    const storage= JSON.parse(localStorage.getItem('dones'));
    return(storage) ? storage : [];
}



const todos= getTodosFromStorage();
const dones= getDonesFromStorage();


// todos dizisini dolaşıp todo oluşturan foksiyon
const getTodosToPage= () =>{
    todos.forEach((todo)=> {
        createTodoItem(todo);
    });
}
const getDonesToPage= () =>{
    dones.forEach((done)=> {
        createDoneItem(done);
    });
}

// sayfa yüklendiği anda todoların gelmesini sağlıyor
window.addEventListener('load', ()=> {
    getTodosToPage();
    getDonesToPage();
});

const saveTodosToStorage= (todo)=>{
    todos.push(todo);
    localStorage.setItem('todos',JSON.stringify(todos));
    createTodoItem(todo);
}

todoButton.addEventListener('click', ()=> {
    const input= todoInput.value;
    if(input)saveTodosToStorage(input);
    todoInput.value= '';
})

todoInput.addEventListener('keyup', (event)=>{
    if(event.keyCode === 13) todoButton.click();
} )



const removeTodo= (target)=>{
    const todo= target.parentNode.childNodes[0].innerHTML;
    removeTodoFromStorage(todo);

    target.parentNode.classList.add('animate__animated', 'animate__slideOutLeft', 'animate__faster');
    target.parentNode.addEventListener('animationend', ()=>{
    target.parentNode.remove()
    });
    
}

const removeTodoFromStorage= (todo)=>{
    const index= todos.indexOf(todo);
    if(index> -1){
        todos.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

const removeDoneFromStorage= (done)=>{
    const index= dones.indexOf(done);
    if(index> -1){
        dones.splice(index, 1);
        localStorage.setItem('dones', JSON.stringify(dones));
    }
}

const checkTodo= (target)=> {
    const todo= target.parentNode.childNodes[0].innerHTML;
    moveTodoToDone(todo, target);
}

//tamamlanan işleri karşıklık olmasın diye farklı bir dizi içinde topladık
const moveTodoToDone= (todo, target)=>{
    removeTodoFromStorage(todo);
    dones.push(todo);
    localStorage.setItem('dones', JSON.stringify(dones));
    makeItDone(target);
    
}

const moveDoneToTodos= (done, target)=>{
    removeDoneFromStorage(done);
    todos.push(done);
    localStorage.setItem('todos',JSON.stringify(todos));
    makeItTodo(target);
}

const makeItDone= (target)=> {
    const done= target.parentNode.classList.add('done');
    target.parentNode.classList.remove('todo');
    target.parentNode.childNodes[2].setAttribute('onclick', 'removeDone(this)');
    target.className= '';
    target.classList.add('fas', 'fa-check-square');
    target.setAttribute('onclick', 'uncheckDone(this)');
}

const makeItTodo= (target)=> {
    target.parentNode.classList.remove('done');
    target.parentNode.classList.add('todo');
    target.parentNode.childNodes[2].setAttribute('onclick', 'removeTodo(this)');
    target.classList= '';
    target.classList.add('fas', 'fa-square');
    target.setAttribute('onclick', 'checkTodo(this)');
}

const uncheckDone= (target)=>{
    const done= target.parentNode.childNodes[0].innerHTML;
    moveDoneToTodos(done, target);
}

const removeDone= (target)=>{
    const done= target.parentNode.childNodes[0].innerHTML;
    removeDoneFromStorage(done);
    target.parentNode.classList.add('animate__animated', 'animate__slideOutLeft', 'animate__faster');
    target.parentNode.addEventListener('animationend', ()=>{
    target.parentNode.remove()
    })
}

// todo oluşturan fonksiyon
const createTodoItem= (text)=>{
    const todoItem=document.createElement('div');
    todoItem.classList.add('todo-item','todo', 'light');
    const todoItemLi= document.createElement('li');
    todoItemLi.innerHTML= text;
    const todoItemCheck= document.createElement('i');
    todoItemCheck.classList.add('fas', 'fa-square');
    todoItemCheck.setAttribute('onclick', 'checkTodo(this)');
    const todoItemRemove= document.createElement('i');
    todoItemRemove.classList.add('fas','fa-trash-alt');
    todoItemRemove.setAttribute('onclick', 'removeTodo(this)');
    todoItem.appendChild(todoItemLi)
    todoItem.appendChild(todoItemCheck)
    todoItem.appendChild(todoItemRemove)
    todoList.appendChild(todoItem);
}
const createDoneItem= (text)=>{
    const todoItem=document.createElement('div');
    todoItem.classList.add('todo-item','done', 'light');
    const todoItemLi= document.createElement('li');
    todoItemLi.innerHTML= text;
    const todoItemCheck= document.createElement('i');
    todoItemCheck.classList.add('fas', 'fa-check-square');
    todoItemCheck.setAttribute('onclick', 'uncheckDone(this)');
    const todoItemRemove= document.createElement('i');
    todoItemRemove.classList.add('fas','fa-trash-alt');
    todoItemRemove.setAttribute('onclick', 'removeDone(this)');
    todoItem.appendChild(todoItemLi)
    todoItem.appendChild(todoItemCheck)
    todoItem.appendChild(todoItemRemove)
    todoList.appendChild(todoItem);
}

//parseInt ile gelen değeri integer olarak aldık. parseınt ile aldığımız değer 1 2 3 e çıkacak modunu aldığımız için tekrar başa dönecek
todoFilter.addEventListener('click', ()=>{
    todoList.dataset.filter= (parseInt(todoList.dataset.filter) +1)%3;
    listFilter();
});

const listFilter= ()=> {
    const items= todoList.getElementsByClassName('todo-item');//html collecetion olarak bize verdiği için onu diziye döndürmeliyiz.

    let array= [].map.call(items, item => item);

    const filter= todoList.dataset.filter;
    
    array.forEach((item)=> {
        switch(filter){
            case '0':
                todoFilter.className= '';
                todoFilter.classList.add('far','fa-square');
                item.style.display= 'flex';
            break;
            case '1':
                todoFilter.className= '';
                todoFilter.classList.add('fas','fa-square');
                if(item.classList.contains('done'))item.style.display= 'none';
                else item.style.display= 'flex';
            break;
            case '2':
                todoFilter.className= '';
                todoFilter.classList.add('far','fa-check-square');
                if(item.classList.contains('todo'))item.style.display= 'none';
                else item.style.display= 'flex';
            break;


        }
    })
}
// dark mode
const body= document.querySelector('body');
modeToggle= document.querySelector('.mode-toggle');

let getMode= localStorage.getItem('mode');
if(getMode && getMode === 'light'){
    body.classList.toggle('light');
}

modeToggle.addEventListener('click', ()=>{
    body.classList.toggle('light');
    if(body.classList.contains('light')){
        localStorage.setItem('mode', 'light');
    }else{
        localStorage.setItem('mode', 'dark');
    }
})