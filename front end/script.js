document.addEventListener("DOMContentLoaded", () => {

  /* -------- REGISTER -------- */
  window.registerUser = function(e){
    e.preventDefault();
    const email = regEmail.value.trim();
    const pass = regPassword.value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if(users[email]){ alert("User already exists"); return; }

    users[email] = pass;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful");
    location.href = "login.html";
  };

  /* -------- LOGIN -------- */
  window.loginUser = function(e){
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if(users[loginEmail.value] !== loginPassword.value){
      alert("Invalid credentials"); return;
    }
    localStorage.setItem("loggedInUser", loginEmail.value);
    location.href = "index.html";
  };

  /* -------- AUTH CHECK -------- */
  window.checkLogin = function(){
    if(!localStorage.getItem("loggedInUser")){
      location.href = "login.html";
    }
  };

  /* -------- LOGOUT -------- */
  window.logout = function(){
    localStorage.removeItem("loggedInUser");
    location.href = "login.html";
  };

  /* -------- POST OFFER -------- */
  const form = document.getElementById("barterForm");
  if(form){
    form.addEventListener("submit", e=>{
      e.preventDefault();

      let offers = JSON.parse(localStorage.getItem("barterOffers")) || [];

      offers.push({
        owner: localStorage.getItem("loggedInUser"),
        offer: offer.value.trim(),
        need: need.value.trim(),
        image: image.value.trim()
      });

      localStorage.setItem("barterOffers", JSON.stringify(offers));
      form.reset();
      loadOffers();
    });
  }

  /* -------- LOAD OFFERS -------- */
  window.loadOffers = function(){
    let offers = JSON.parse(localStorage.getItem("barterOffers")) || [];
    let box = document.getElementById("barterCards");
    if(!box) return;

    box.innerHTML = "";
    offers.forEach(o=>{
      let img = o.image || "https://via.placeholder.com/300x200?text=No+Image";
      box.innerHTML += `
        <div class="card">
          <img src="${img}" 
               onerror="this.src='https://via.placeholder.com/300x200?text=Invalid+Image'">
          <p><b>Owner:</b> ${o.owner}</p>
          <p><b>Offers:</b> ${o.offer}</p>
          <p><b>Needs:</b> ${o.need}</p>
        </div>`;
    });
  };

});
