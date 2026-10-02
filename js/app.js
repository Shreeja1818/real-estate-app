
const propertyGrid = document.getElementById("propertyGrid");
const resultCount = document.getElementById("resultCount");
const favCount = document.getElementById("favCount");
const showFavoritesBtn = document.getElementById("showFavorites");


let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let showOnlyFavorites = false;


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
    favBtn.addEventListener("click", function () {
      toggleFavorite(property.id);
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

  let result = properties.filter(function (property) {
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


updateFavCount();
applyFilters();