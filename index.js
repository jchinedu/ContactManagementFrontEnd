let contacts = [];
let editingContactId = null;
const API_URL = "http://localhost:8080/contacts";
const AUTH_URL = "http://localhost:8080/auth";
let authToken = null;
function clearLoginForm() {
  document.getElementById("login-form").reset();
  document.getElementById("login-feedback").innerHTML = "";
}
function clearRegisterForm() {
  document.getElementById("register-form").reset();
  document.getElementById("register-feedback").innerHTML = "";
}
