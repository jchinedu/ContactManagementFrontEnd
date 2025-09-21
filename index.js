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
async function handleLogin(e) {
  e.preventDefault();
  const data = {
    username: document.getElementById("login-username").value,
    password: document.getElementById("login-password").value
  };
  try {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const result = await res.json();
      authToken = result.token;
      document.getElementById("login-feedback").innerHTML = `<div class="success">Login successful!</div>`;
      clearLoginForm();
      showContactsPage();
      showBottomAlert("Login successful!", "success");
      await loadContactsFromBackend();
    } else {
      const msg = await res.text();
      document.getElementById("login-feedback").innerHTML = `<div class="error">${msg}</div>`;
      showBottomAlert(`Login failed: ${msg}`, "error");
    }
  } catch (err) {
    console.error("Login error:", err);
    showBottomAlert("An error occurred during login.", "error");
  }
}
document.getElementById("register-form").addEventListener("submit", handleRegister);
document.getElementById("login-form").addEventListener("submit", handleLogin);

function logout() {
  authToken = null;
  contacts = [];
  editingContactId = null;
  clearLoginForm();
  clearRegisterForm();
  document.getElementById("contact-form").reset();
  document.getElementById("logout-link").classList.add("hidden");
  document.getElementById("login-nav").classList.remove("hidden");
  document.getElementById("register-nav").classList.remove("hidden");
  showLogin();
}

async function loadContactsFromBackend() {
  if (!authToken) return;
  try {
    const res = await fetch(API_URL, {
      headers: { "Authorization": `Bearer ${authToken}` }
    });

    const text = await res.text();
    if (res.ok) {
      contacts = JSON.parse(text);
      displayContacts(contacts);
    } else {
      console.error("Fetch error:", text);
    }
  } catch (err) {
    console.error("Load contacts error:", err);
  }
}
async function createContact(contact) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(contact)
    });
    if (!res.ok) {
      console.error("Create error:", await res.text());
    }
  } catch (err) {
    console.error("Create contact error:", err);
  }
}
async function updateContact(id, contact) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(contact)
    });
    if (!res.ok) {
      console.error("Update error:", await res.text());
    }
  } catch (err) {
    console.error("Update contact error:", err);
  }
}
async function deleteContact(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${authToken}`
      }
    });
    if (!res.ok) {
      console.error("Delete error:", await res.text());
    }
    loadContactsFromBackend();
  } catch (err) {
    console.error("Delete contact error:", err);
  }
}
async function handleFormSubmit(e) {
  e.preventDefault();
  const contact = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
    email: document.getElementById("email").value.trim(),
  };
  if (editingContactId) {
    await updateContact(editingContactId, contact);
    editingContactId = null;
  } else {
    await createContact(contact);
  }
  document.getElementById("contact-form").reset();
  toggleContactsView(true);
  await loadContactsFromBackend();
}

