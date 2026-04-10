// ===============================
// USERS DATA SETUP
// ===============================

async function loadUsersFromJSON() {
  try {
    const response = await fetch("users.json");
    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error("Error loading users.json:", error);
    return [];
  }
}

async function initializeUsers() {
  const storedUsers = localStorage.getItem("users");

  if (!storedUsers) {
    const usersFromFile = await loadUsersFromJSON();
    localStorage.setItem("users", JSON.stringify(usersFromFile));
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser")) || null;
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem("currentUser");
}

function findUserByEmail(email) {
  const users = getUsers();
  return users.find((user) => user.email === email);
}

function addUser(newUser) {
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);
}

function updateUser(updatedUser) {
  const users = getUsers();

  const updatedUsers = users.map((user) =>
    user.id === updatedUser.id ? updatedUser : user
  );

  saveUsers(updatedUsers);
  setCurrentUser(updatedUser);
}

// ===============================
// REGISTER PAGE
// ===============================

function setupRegisterForm() {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("registerName");
    const emailInput = document.getElementById("registerEmail");
    const phoneInput = document.getElementById("registerPhone");
    const addressInput = document.getElementById("registerAddress");
    const passwordInput = document.getElementById("registerPassword");
    const confirmPasswordInput = document.getElementById("registerConfirmPassword");
    const msg = document.getElementById("registerMessage");

    if (
      !nameInput ||
      !emailInput ||
      !phoneInput ||
      !addressInput ||
      !passwordInput ||
      !confirmPasswordInput ||
      !msg
    ) {
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    msg.innerHTML = "";

    if (!name || !email || !phone || !address || !password || !confirmPassword) {
      msg.innerHTML = `<div class="message error">Please complete all fields.</div>`;
      return;
    }

    if (password !== confirmPassword) {
      msg.innerHTML = `<div class="message error">Passwords do not match.</div>`;
      return;
    }

    const existingUser = findUserByEmail(email);

    if (existingUser) {
      msg.innerHTML = `<div class="message error">This email is already registered.</div>`;
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      address,
      password
    };

    addUser(newUser);
    setCurrentUser(newUser);

    msg.innerHTML = `<div class="message success">Account created successfully. Redirecting to profile...</div>`;

    setTimeout(() => {
      window.location.href = "profile.html";
    }, 1200);
  });
}

// ===============================
// LOGIN PAGE
// ===============================

function setupLoginForm() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const msg = document.getElementById("loginMessage");

    if (!emailInput || !passwordInput || !msg) {
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    msg.innerHTML = "";

    if (!email || !password) {
      msg.innerHTML = `<div class="message error">Please fill in all fields.</div>`;
      return;
    }

    const users = getUsers();

    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      msg.innerHTML = `<div class="message error">Invalid email or password.</div>`;
      return;
    }

    setCurrentUser(foundUser);

    msg.innerHTML = `<div class="message success">Login successful. Redirecting to profile...</div>`;

    setTimeout(() => {
      window.location.href = "profile.html";
    }, 1200);
  });
}

// ===============================
// PROFILE PAGE
// ===============================

function loadProfilePage() {
  const profileForm = document.getElementById("profileForm");
  if (!profileForm) return;

  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profilePhone = document.getElementById("profilePhone");
  const profileAddress = document.getElementById("profileAddress");

  const displayName = document.getElementById("displayName");
  const displayEmail = document.getElementById("displayEmail");
  const avatarText = document.getElementById("avatarText");

  if (profileName) profileName.value = currentUser.name;
  if (profileEmail) profileEmail.value = currentUser.email;
  if (profilePhone) profilePhone.value = currentUser.phone;
  if (profileAddress) profileAddress.value = currentUser.address;

  if (displayName) displayName.textContent = currentUser.name;
  if (displayEmail) displayEmail.textContent = currentUser.email;
  if (avatarText) avatarText.textContent = currentUser.name.charAt(0).toUpperCase();
}

function setupProfileForm() {
  const profileForm = document.getElementById("profileForm");
  if (!profileForm) return;

  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser) {
      window.location.href = "login.html";
      return;
    }

    const name = document.getElementById("profileName").value.trim();
    const email = document.getElementById("profileEmail").value.trim();
    const phone = document.getElementById("profilePhone").value.trim();
    const address = document.getElementById("profileAddress").value.trim();
    const msg = document.getElementById("profileMessage");

    msg.innerHTML = "";

    if (!name || !email || !phone || !address) {
      msg.innerHTML = `<div class="message error">Please complete all fields.</div>`;
      return;
    }

    const users = getUsers();
    const emailUsedByAnotherUser = users.find(
      (user) => user.email === email && user.id !== currentUser.id
    );

    if (emailUsedByAnotherUser) {
      msg.innerHTML = `<div class="message error">This email is already used by another account.</div>`;
      return;
    }

    const updatedUser = {
      ...currentUser,
      name,
      email,
      phone,
      address
    };

    updateUser(updatedUser);
    loadProfilePage();

    msg.innerHTML = `<div class="message success">Profile updated successfully.</div>`;
  });
}

// ===============================
// ORDERS PAGE
// ===============================

function loadOrdersPage() {
  const ordersList = document.getElementById("ordersList");
  if (!ordersList) return;

  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const orders = [
    {
      id: "#PM1024",
      items: "Premium Dog Food x2, Chew Toy x1",
      total: "$48.00",
      date: "April 2, 2026",
      status: "Pending"
    },
    {
      id: "#PM1021",
      items: "Cat Litter x1, Food Bowl x2, Treats x3",
      total: "$36.50",
      date: "March 28, 2026",
      status: "Shipped"
    },
    {
      id: "#PM1018",
      items: "Dog Bed x1, Grooming Brush x1",
      total: "$64.99",
      date: "March 19, 2026",
      status: "Delivered"
    }
  ];

  ordersList.innerHTML = "";

  orders.forEach((order) => {
    const statusClass = order.status.toLowerCase();

    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    orderCard.innerHTML = `
      <div class="order-top">
        <h3>${order.id}</h3>
        <span class="badge ${statusClass}">${order.status}</span>
      </div>
      <p class="order-items">${order.items}</p>
      <div class="order-footer">
        <span>${order.date}</span>
        <span>${order.total}</span>
      </div>
    `;

    ordersList.appendChild(orderCard);
  });
}

// ===============================
// LOGOUT BUTTON
// ===============================

function setupLogoutButton() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", function () {
    logoutUser();
    window.location.href = "login.html";
  });
}

// ===============================
// APP START
// ===============================

async function startApp() {
  await initializeUsers();

  setupRegisterForm();
  setupLoginForm();
  loadProfilePage();
  setupProfileForm();
  loadOrdersPage();
  setupLogoutButton();
}

startApp();