// ---------- 1. Get HTML elements ----------
const propertyGrid = document.getElementById("propertyGrid");
const resultCount = document.getElementById("resultCount");

// ---------- 2. Format price in Indian style ----------
function formatPrice(price, purpose) {
  const formatted = "₹" + price.toLocaleString("en-IN");
  return purpose === "rent" ? formatted + "/month" : formatted;
}

// ---------- 3. Show cards on the page ----------
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

// ---------- 4. Run when the page loads ----------
renderProperties(properties);