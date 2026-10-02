
const propertyGrid = document.getElementById("propertyGrid");
const resultCount = document.getElementById("resultCount");


function formatPrice(price, purpose) {
  const formatted = "₹" + price.toLocaleString("en-IN");
  return purpose === "rent" ? formatted + "/month" : formatted;
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

    card.innerHTML = `
      <span class="badge">For ${property.purpose}</span>
      <button class="fav-btn">🤍</button>
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

    return matchesSearch && matchesType && matchesPurpose;
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


applyFilters();