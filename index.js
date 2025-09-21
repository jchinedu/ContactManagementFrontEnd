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
function hideAllSections() {
  document.querySelectorAll(".page-section").forEach(sec => sec.classList.add("hidden"));
}
function showHome() {
  hideAllSections();
  document.getElementById("home").classList.remove("hidden");
}
function showAbout() {
  hideAllSections();
  document.getElementById("about").classList.remove("hidden");
}
function showLogin() {
  hideAllSections();
  document.getElementById("login").classList.remove("hidden");
}
function showRegister() {
  hideAllSections();
  document.getElementById("register").classList.remove("hidden");
}

