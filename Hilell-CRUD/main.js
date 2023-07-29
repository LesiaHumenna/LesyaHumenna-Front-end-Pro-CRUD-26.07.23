const form = document.getElementById("form");
const newNameInput = document.getElementById("newName");
const newEmailInput = document.getElementById("newEmail");
const newAgeInput = document.getElementById("newAge");
const msg = document.getElementById("msg");
const usersList = document.getElementById("users");
const btn = document.getElementById("btn");
class user {
  constructor(id, name, age, email) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.email = email;
  }
}
let users = JSON.parse(localStorage.getItem("users")) || [];

//add newUser + validation
function addNewUser() {
  const newName = newNameInput.value.trim();
  const newEmail = newEmailInput.value.trim();
  const newAge = newAgeInput.value.trim();

  if (!newName) {
    msg.innerHTML = "Post cannot name";
    newNameInput.focus();
    return;
  }
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!re.test(newEmail)) {
    msg.innerHTML = "Post cannot be email";
    newEmailInput.focus();
    return;
  }
  if (!newAge || isNaN(newAge) || Number(newAge) <= 0) {
    msg.innerHTML = "Post cannot age";
    newAgeInput.focus();
    return;
  } else {
    console.log("successs");
    msg.innerHTML = "";
  }
  const id = Date.now();
  const newUser = new user(id, newName, newAge, newEmail);
  users.push(newUser);
  updateLocalStorage();
  acceptData();
  displayUser();
  
  newNameInput.value = "";
  newEmailInput.value = "";
  newAgeInput.value = "";
}
//
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("button clicked");
  addNewUser();
  handleUserButtonsClick(e);
});
//LocalStorage
function updateLocalStorage() {
  localStorage.setItem("users", JSON.stringify(users));
}
updateLocalStorage();
//
//виводимо дані newUser на console
let data = {};
let acceptData = () => {
  data["text"] = newNameInput.value;
  data["string"] = newEmailInput.value;
  data["number"] = newAgeInput.value;
  console.log(data);
  displayUser(user);
};
//розмістити наші вхідні дані =>right
let displayUser = () => {
   usersList.innerHTML = "";
  users.forEach((user) => {
    usersList.innerHTML += `
    <h3>Список користувачів:</h3>
          <p>${user.name}</p>
          <span class="options">
              <i  onClick="viewUser(this)" class="fas fa-eye " data-id="${user.id}"></i>
              <i onClick="editUser(this)" class="fas fa-edit " data-id="${user.id}"></i>
              <i onClick="deleteUser(this); displayUser()" class="fas fa-trash-alt " data-id="${user.id}"></i>
            </span>
        `;
  });
};
//view user
function viewUser(userEl) {
  const userId = userEl.dataset.id;
  const user = users.find((u) => u.id == userId);
  usersList.innerHTML = `
    <p>Ім'я: ${user.name}</p>
    <p>Email: ${user.email}</p>
    <p>Вік: ${user.age}</p>
`;
}
// Редагування користувача
let editedUserId = null;
function editUser(userEl) {
  const userId = userEl.dataset.id;
  const user = users.find((u) => u.id == userId);
  if (user) {
    newNameInput.value = user.name;
    newEmailInput.value = user.email;
    newAgeInput.value = user.age;
    editedUserId = userId;
  }
};
// Збереження змін
function saveEditedUser() {
  if (editedUserId === null) {
    return;
  }
  const user = users.find((u) => u.id == editedUserId);
  if (user) {
    user.name = newNameInput.value;
    user.email = newEmailInput.value;
    user.age = newAgeInput.value;
    updateLocalStorage();
    //displayUser();
    editedUserId = null;
  }
}
function handleUserButtonsClick(e) {
  if (e.target.classList.contains("view-btn")) {
    viewUser(e.target);
  } else if (e.target.classList.contains("edit-btn")) {
    editUser(e.target);
  }
}
usersList.addEventListener("click", handleUserButtonsClick);
//delete user
let deleteUser = (e) => {
  const userId = parseInt(e.getAttribute("data-id"));
  if (confirm("Ви впевнені, що хочете видалити користувача?")) {
    users = users.filter((user) => user.id !== userId);
  }
  updateLocalStorage();
  displayUser(e);
};
btn.addEventListener("click", saveEditedUser);   
displayUser();