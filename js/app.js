
const propertyGrid = document.getElementById("propertyGrid");
const resultCount = document.getElementById("resultCount");
const favCount = document.getElementById("favCount");
const showFavoritesBtn = document.getElementById("showFavorites");


let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let showOnlyFavorites = false;
let userProperties = JSON.parse(localStorage.getItem("userProperties")) || [];
let allProperties = properties.concat(userProperties);

function formatPrice(price, purpose) {
  const formatted = "₹" + price.toLocaleString("en-IN");
  return purpose === "rent" ? formatted + "/month" : formatted;
}


function updateFavCount() {
  favCount.textContent = favorites.length;
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(function (favId) {
      return favId !== id;
    });
  } else {
    favorites.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavCount();
  applyFilters();
}

 
function renderProperties(list) {
  propertyGrid.innerHTML = "";

  if (list.length === 0) {
    propertyGrid.innerHTML = "<p>No properties found.</p>";
    resultCount.textContent = "0 properties found";
    return;
  }

  list.forEach(function (property) {
    const card = document.createElement("div");
    card.className = "card";

    const heart = favorites.includes(property.id) ? "❤️" : "🤍";

    card.innerHTML = `
      <span class="badge">For ${property.purpose}</span>
      <button class="fav-btn">${heart}</button>
      <img src="${property.image}" alt="${property.title}">
      <div class="card-body">
        <p class="price">${formatPrice(property.price, property.purpose)}</p>
        <h3>${property.title}</h3>
        <p class="location">📍 ${property.city}</p>
        <div class="details">
          <span>🛏 ${property.bedrooms} Beds</span>
          <span>🚿 ${property.bathrooms} Baths</span>
          <span>📐 ${property.area} sqft</span>
        </div>
      </div>
    `;

    const favBtn = card.querySelector(".fav-btn");
    favBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleFavorite(property.id);
    });

    card.addEventListener("click", function () {
      openModal(property);
    });

    propertyGrid.appendChild(card);
  });

  resultCount.textContent = list.length + " properties found";
}


const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const purposeFilter = document.getElementById("purposeFilter");
const sortSelect = document.getElementById("sortSelect");


function applyFilters() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedType = typeFilter.value;
  const selectedPurpose = purposeFilter.value;
  const selectedSort = sortSelect.value;

  let result = allProperties.filter(function (property) {
    const matchesSearch =
      property.title.toLowerCase().includes(searchText) ||
      property.city.toLowerCase().includes(searchText);

    const matchesType =
      selectedType === "all" || property.type === selectedType;

    const matchesPurpose =
      selectedPurpose === "all" || property.purpose === selectedPurpose;

    const matchesFavorites =
      !showOnlyFavorites || favorites.includes(property.id);

    return matchesSearch && matchesType && matchesPurpose && matchesFavorites;
  });

  if (selectedSort === "low") {
    result.sort(function (a, b) { return a.price - b.price; });
  } else if (selectedSort === "high") {
    result.sort(function (a, b) { return b.price - a.price; });
  }

  renderProperties(result);
}


searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);
purposeFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

showFavoritesBtn.addEventListener("click", function () {
  showOnlyFavorites = !showOnlyFavorites;
  showFavoritesBtn.style.background = showOnlyFavorites ? "#2f855a" : "#ff5a5f";
  applyFilters();
});


const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeModalBtn = document.getElementById("closeModal");

function openModal(property) {
  const typeName =
    property.type.charAt(0).toUpperCase() + property.type.slice(1);

  let pricePerSqft = "";
  if (property.purpose === "sale") {
    pricePerSqft =
      "<div>💰 ₹" +
      Math.round(property.price / property.area).toLocaleString("en-IN") +
      " per sqft</div>";
  }
      let emiSection = "";
  if (property.purpose === "sale") {
    emiSection = `
      <div class="emi-box">
        <h3>🧮 EMI Calculator</h3>
        <label>Down payment (%)</label>
        <input type="number" id="emiDown" value="20">
        <label>Interest rate (% per year)</label>
        <input type="number" id="emiRate" value="8.5" step="0.1">
        <label>Loan tenure (years)</label>
        <input type="number" id="emiYears" value="20">
        <button id="emiBtn" class="emi-btn">Calculate EMI</button>
        <div id="emiResult" class="emi-result"></div>
      </div>
    `;
  }

  modalContent.innerHTML = `
    <img src="${property.image}" alt="${property.title}">
    <div class="modal-info">
      <p class="price">${formatPrice(property.price, property.purpose)}</p>
      <h2>${property.title}</h2>
      <p class="location">📍 ${property.city}</p>
      <div class="modal-grid">
        <div>🏠 Type: ${typeName}</div>
        <div>🏷 For: ${property.purpose === "sale" ? "Sale" : "Rent"}</div>
        <div>🛏 ${property.bedrooms} Bedrooms</div>
        <div>🚿 ${property.bathrooms} Bathrooms</div>
        <div>📐 ${property.area} sqft</div>
        ${pricePerSqft}
      </div>
      ${emiSection}  
    </div>
  `;

  modal.classList.remove("hidden");
  setupEmi(property);
}

function closeModal() {
  modal.classList.add("hidden");
}

closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});
// ---------- 11. Add property form ----------
const formModal = document.getElementById("formModal");
const addPropertyBtn = document.getElementById("addPropertyBtn");
const closeFormBtn = document.getElementById("closeForm");
const propertyForm = document.getElementById("propertyForm");
const formError = document.getElementById("formError");

function openForm() {
  formError.textContent = "";
  formModal.classList.remove("hidden");
}

function closeForm() {
  formModal.classList.add("hidden");
}

addPropertyBtn.addEventListener("click", openForm);
closeFormBtn.addEventListener("click", closeForm);

formModal.addEventListener("click", function (event) {
  if (event.target === formModal) {
    closeForm();
  }
});

propertyForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("fTitle").value.trim();
  const city = document.getElementById("fCity").value.trim();
  const type = document.getElementById("fType").value;
  const purpose = document.getElementById("fPurpose").value;
  const price = Number(document.getElementById("fPrice").value);
  const bedrooms = Number(document.getElementById("fBedrooms").value);
  const bathrooms = Number(document.getElementById("fBathrooms").value);
  const area = Number(document.getElementById("fArea").value);
  let image = document.getElementById("fImage").value.trim();

  
  if (title === "" || city === "") {
    formError.textContent = "Please enter the title and city.";
    return;
  }
  if (price <= 0) {
    formError.textContent = "Price must be greater than 0.";
    return;
  }
  if (area <= 0) {
    formError.textContent = "Area must be greater than 0.";
    return;
  }
  if (bedrooms < 0 || bathrooms < 0) {
    formError.textContent = "Bedrooms and bathrooms cannot be negative.";
    return;
  }

  
  if (image === "") {
    image = "https://picsum.photos/seed/" + Date.now() + "/400/300";
  }

  const newProperty = {
    id: Date.now(),
    title: title,
    type: type,
    purpose: purpose,
    price: price,
    city: city,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    area: area,
    image: image
  };

  userProperties.push(newProperty);
  localStorage.setItem("userProperties", JSON.stringify(userProperties));
  allProperties = properties.concat(userProperties);

  propertyForm.reset();
  closeForm();
  applyFilters();
});

function setupEmi(property) {
  const emiBtn = document.getElementById("emiBtn");
  if (!emiBtn) return; // rentals have no calculator

  emiBtn.addEventListener("click", function () {
    const downPercent = Number(document.getElementById("emiDown").value);
    const yearlyRate = Number(document.getElementById("emiRate").value);
    const years = Number(document.getElementById("emiYears").value);
    const result = document.getElementById("emiResult");

    
    if (downPercent < 0 || downPercent > 90) {
      result.innerHTML = "<span style='color:#e53e3e'>Down payment must be between 0 and 90%.</span>";
      return;
    }
    if (yearlyRate <= 0 || yearlyRate > 30) {
      result.innerHTML = "<span style='color:#e53e3e'>Interest rate must be between 0 and 30%.</span>";
      return;
    }
    if (years < 1 || years > 30) {
      result.innerHTML = "<span style='color:#e53e3e'>Tenure must be between 1 and 30 years.</span>";
      return;
    }

    
    const loanAmount = property.price - (property.price * downPercent) / 100;
    const monthlyRate = yearlyRate / 12 / 100;
    const months = years * 12;
    const growth = Math.pow(1 + monthlyRate, months);
    const emi = (loanAmount * monthlyRate * growth) / (growth - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanAmount;

    result.innerHTML = `
      <div>Monthly EMI</div>
      <div class="emi-amount">₹${Math.round(emi).toLocaleString("en-IN")}</div>
      <div>Loan amount: ₹${Math.round(loanAmount).toLocaleString("en-IN")}</div>
      <div>Total interest: ₹${Math.round(totalInterest).toLocaleString("en-IN")}</div>
      <div>Total payment: ₹${Math.round(totalPayment).toLocaleString("en-IN")}</div>
    `;
  });
}
updateFavCount();
applyFilters();