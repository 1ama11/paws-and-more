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
  return users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
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
// VALIDATION HELPERS
// ===============================

function showMessage(elementId, message, type) {
  const target = document.getElementById(elementId);
  if (!target) return;
  target.innerHTML = `<div class="message ${type}">${message}</div>`;
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPhone(phone) {
  const phonePattern = /^\d{11}$/;
  return phonePattern.test(phone);
}

function isStrongPassword(password) {
  return password.length >= 6;
}

// ===============================
// REGISTER PAGE
// ===============================

function setupRegisterForm() {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const phone = document.getElementById("registerPhone").value.trim();
    const address = document.getElementById("registerAddress").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirmPassword = document.getElementById("registerConfirmPassword").value.trim();

    if (!name || !email || !phone || !address || !password || !confirmPassword) {
      showMessage("registerMessage", "Please complete all fields.", "error");
      return;
    }

    if (name.length < 3) {
      showMessage("registerMessage", "Full name must be at least 3 characters long.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("registerMessage", "Please enter a valid email address.", "error");
      return;
    }

    if (!isValidPhone(phone)) {
      showMessage("registerMessage", "Phone number must be exactly 11 digits.", "error");
      return;
    }

    if (address.length < 5) {
      showMessage("registerMessage", "Address must be at least 5 characters long.", "error");
      return;
    }

    if (!isStrongPassword(password)) {
      showMessage("registerMessage", "Password must be at least 6 characters long.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("registerMessage", "Passwords do not match.", "error");
      return;
    }

    const existingUser = findUserByEmail(email);

    if (existingUser) {
      showMessage("registerMessage", "This email is already registered.", "error");
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

    showMessage("registerMessage", "Account created successfully. Redirecting to profile...", "success");

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

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      showMessage("loginMessage", "Please fill in all fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("loginMessage", "Please enter a valid email address.", "error");
      return;
    }

    const users = getUsers();

    const foundUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (!foundUser) {
      showMessage("loginMessage", "Invalid email or password.", "error");
      return;
    }

    setCurrentUser(foundUser);

    showMessage("loginMessage", "Login successful. Redirecting to profile...", "success");

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

    if (!name || !email || !phone || !address) {
      showMessage("profileMessage", "Please complete all fields.", "error");
      return;
    }

    if (name.length < 3) {
      showMessage("profileMessage", "Full name must be at least 3 characters long.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("profileMessage", "Please enter a valid email address.", "error");
      return;
    }

    if (!isValidPhone(phone)) {
      showMessage("profileMessage", "Phone number must be exactly 11 digits.", "error");
      return;
    }

    const users = getUsers();
    const emailUsedByAnotherUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.id !== currentUser.id
    );

    if (emailUsedByAnotherUser) {
      showMessage("profileMessage", "This email is already used by another account.", "error");
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

    showMessage("profileMessage", "Profile updated successfully.", "success");
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
// AUTH NAVIGATION
// ===============================

function setupAuthNavigation() {
  const currentUser = getCurrentUser();

  const loginLinks = document.querySelectorAll('a[href="login.html"]');
  const registerLinks = document.querySelectorAll('a[href="register.html"]');
  const profileLinks = document.querySelectorAll('a[href="profile.html"]');

  if (currentUser) {
    loginLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "profile.html";
      });
    });

    registerLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "profile.html";
      });
    });
  } else {
    profileLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "login.html";
      });
    });
  }
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
  setupAuthNavigation();
}

startApp();