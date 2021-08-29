import axios from 'axios';
import {createCard} from '/init.js/';

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

// $( document ).ready(function() {

//     if($("#register-button")){
//         getElementById("#register-button").onclick = register;
//     }

//     if($("#login-button")){
//         getElementById("#login-button").onclick = login;
//     }

//     if(localStorage.getItem("token")){
//         if($("#logout-button")){
//             getElementById("#logout-button").onclick = logout;
//         }
//         if($("#addTasks")){
//             getElementById("#addTasks").onclick = addTask;
//         }
//     }
// }

// var valueCurr,valueNew;
// const regButton = document.querySelector("#register-button");
// const logInButton = document.querySelector("#login-button");

// if(regButton) {

//     regButton.onclick = register;
// }

if(logInButton) {

    logInButton.onclick = login;
}
if (localStorage.getItem("token")) {
    document.querySelector("#logout-button").onclick = logout;
    document.querySelector("#addTasks").onclick = addTask;
}

function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
};

function displayErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message
    });
};

function displayInfoToast(message) {
    iziToast.info({
        title: 'Info',
        message: message
    });
};


function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login/';
};

function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address.")
        return false;
    }
    return true;
};

function register() {
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

        axios({
            url: API_BASE_URL + 'auth/register/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function({data, status}) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('An account using same email or username is already created');
        })
    }
};

function login() {

    const User = document.getElementById('inputUsername').value.trim();
    const Pass = document.getElementById('inputPassword').value;

    if(registerFieldsAreValid(Username, Password)){
        displayInfoToast("Please wait...");

        const dataForCredVeriRequest = {
            username: User,
            password: Pass,
        }

        axios({
            url: API_BASE_URL + '/auth/login/',
            method: 'post',
            data: dataForCredVeriRequest,
        }).then(function({data, status}){
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        }).catch(function(err){
            document.getElementById('inputPassword').value = " ";
            displayErrorToast('An account using same email or username is already created');
        })

    }
};

function addTask() {

    let inputTask = document.getElementById('addTask');
    inputTask = inputTask.value;

    let dataForAddTaskRequest = {  

        title: inputTask,
        maxLength: 225,
        minLength: 1,
    }
    axios({

        headers: {
            Authorization: "Token " + localStorage.getItem("token")
        },

        url: API_BASE_URL + '/todo/create',
        method: 'post',
        data: dataForAddTaskRequest,
    }).then(function(){
        inputTask.value = " ";
        getTask(inputTask.value);
        displaySuccessToast("To do added Successfully");
    }).catch(function(err){
        //inputTask.value = " ";
        displayErrorToast(`An Error Ocured: ${err.status} : ${err.statusText}`);
    })
};

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
};

function deleteTask(id) {

    axios({

        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + `/todo/${id}/`,
        method: 'DELETE',
    }).then(function(){
        document.getElementById("task-" + id).parentElement.remove();
        displaySuccessToast("To do deleted Successfully");
    }).catch(function(err){
        //inputTask.value = " ";
        displayErrorToast(`An Error Ocured: ${err.status} : ${err.statusText}`);
    })
};

function updateTask(id) {

    UpdateTask = document.getElementById(`input-button-${id}`)
    TaskBody = document.getElementById('task-' + id);
    TaskButton = document.getElementById('task-actions-' + id);
    UpdateButton = document.getElementById('done-button-' + id);

    if(UpdateTask == '' || UpdateTask == undefined){
        editTask(id);
        return;
    }

    axios({

        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + `/todo/${id}/`,
        method: 'PUT',

        data: {
            title: UpdateTask.value,
        },
    }).then(function(data){

        editTask(id);

        TaskBody.id = `task-${data.id}`;
        TaskBody.textContent = data.title;

        UpdateTask.value = "";
        UpdateButton.id = 'done-button-' + data.id;
        TaskButton.id = 'task-' + data.id;

        displaySuccessToast("To do Updated Successfully")

    }).catch(function({data, err, status}){
        displayErrorToast(`Error occured -> ${data.status} ${data.statusText}`);
        editTask(id);
    })
};

function getTask(data){

    axios({

        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + 'todo/',
        method: 'get',
        dataType: "json",
    }).then(function(data){
        createCard(data[data.length - 1])
    })          
};