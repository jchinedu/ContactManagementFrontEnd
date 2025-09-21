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
function showContactsPage() {
  hideAllSections();
  document.getElementById("contacts").classList.remove("hidden");
  document.getElementById("logout-link").classList.remove("hidden");
  document.getElementById("login-nav").classList.add("hidden");
  document.getElementById("register-nav").classList.add("hidden");
}
function showBottomAlert(message, type = "success") {
  let container = document.getElementById("bottom-alert-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "bottom-alert-container";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
    container.style.zIndex = "9999";
    container.style.minWidth = "250px";
    container.style.textAlign = "center";
    container.style.fontWeight = "bold";
    container.style.padding = "12px 20px";
    container.style.borderRadius = "5px";
    container.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    container.style.color = "#fff";
    container.style.fontSize = "16px";
    container.style.opacity = "0";
    container.style.transition = "opacity 0.3s ease";
    document.body.appendChild(container);
  }
  container.textContent = message;
  container.style.backgroundColor = type === "success" ? "#4caf50" : "#f44336";
  container.style.opacity = "1";
  setTimeout(() => {
    container.style.opacity = "0";
  }, 3000);
}
async function handleRegister(e) {
  e.preventDefault();
  const data = {
    name: document.getElementById("register-name").value,
    username: document.getElementById("register-username").value,
    password: document.getElementById("register-password").value
  };
  try {
    const res = await fetch(`${AUTH_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const msg = await res.text();
    document.getElementById("register-feedback").innerHTML =
      `<div class="${res.ok ? "success" : "error"}">${msg}</div>`;

    if (res.ok) {
      clearRegisterForm();
      showBottomAlert("Registration successful!", "success");
      showLogin(); 
    } else {
      showBottomAlert(`Registration failed: ${msg}`, "error");
    }
  } catch (err) {
    console.error("Register error:", err);
    showBottomAlert("An error occurred during registration.", "error");
  }
}
