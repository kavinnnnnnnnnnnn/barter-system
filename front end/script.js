document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     🔐 REGISTER (API)
  ===================== */
  window.registerUser = function (e) {
    e.preventDefault();

    fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: regEmail.value.trim(),
        password: regPassword.value.trim()
      })
    })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      if (msg.includes("success")) {
        location.href = "login.html";
      }
    });
  };

  /* =====================
     🔐 LOGIN (API)
  ===================== */
  window.loginUser = function (e) {
    e.preventDefault();

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail.value.trim(),
        password: loginPassword.value.trim()
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("Invalid login");
      return res.json();
    })
    .then(user => {
      localStorage.setItem("user", JSON.stringify(user));
      location.href = "dashboard.html";
    })
    .catch(() => alert("Invalid email or password"));
  };

  /* =====================
     🔐 AUTH CHECK
  ===================== */
  window.checkLogin = function () {
    if (!localStorage.getItem("user")) {
      location.href = "login.html";
    }
  };

  /* =====================
     🚪 LOGOUT
  ===================== */
  window.logout = function () {
    localStorage.removeItem("user");
    location.href = "login.html";
  };

});
