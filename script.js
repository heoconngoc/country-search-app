const state = {
  isLoading: false,
  searchResults: [],
  selectedCountry: null,
  history: []
};

function setLoading(value) {
  state.isLoading = value;

  const card = document.getElementById("country-card");
  card.classList.remove("card-hidden");

  if (value) {
    card.innerHTML = `<p class="loading">Loading...</p>`;
  }
}

async function getCountry(countryName) {
  try {
    setLoading(true);

    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const data = await response.json();

    setLoading(false);

    if (!data || data.status === 404) {
      alert("Country not found");
      return;
    }

    if (data.length === 1) {
      renderCountry(data[0]);
      saveHistory(data[0]);
    } else {
      renderCountryList(data);
    }

  } catch (error) {
    console.error("Error:" + error);
    alert("Something went wrong: " + error);
  }
}

function renderCountryList(list) {
  const card = document.getElementById("country-card");
  card.innerHTML = "";

  list.forEach(country => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${country.flags.png}" width="40">      
      ${country.name.common}
    `;

    div.onclick = () => {
      renderCountry(country);
      saveHistory(country);
    };

    card.appendChild(div);
  });
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const suggestList = document.getElementById("suggest-list");
const handleSuggest = debounce(async (value) => {
  if (value.length < 2) return;

  const res = await fetch(`https://restcountries.com/v3.1/name/${value}`);
  const data = await res.json();

  suggestList.innerHTML = "";

  data.slice(0, 5).forEach(c => {
    const li = document.createElement("li");
    li.textContent = c.name.common;
    li.onclick = () => {
      document.getElementById("search").value = c.name.common;
      suggestList.classList.add("hidden");
      getCountry(c.name.common);
    };
    suggestList.appendChild(li);
  })

  suggestList.classList.remove("hidden");
}, 500);

function loadHistory() {
  state.history = JSON.parse(localStorage.getItem("history")) || [];
  renderHistory();
}

function saveHistory(country) {
  const exists = state.history.some(
    c => c.name === country.name.common
  );

  if (exists) return;

  state.history.unshift({
    name: country.name.common,
    flag: country.flags.png
  });

  localStorage.setItem("history", JSON.stringify(state.history));
  renderHistory();
}

function renderCountry(country) {
  const card = document.getElementById("country-card");
  card.classList.remove("card-hidden");

  const capital = country.capital ? country.capital[0] : "N/A";
  const population = country.population.toLocaleString();
  const region = country.region || "N/A";
  const subregion = country.subregion || "N/A";

  card.innerHTML = `
    <img class="flag" src="${country.flags.png}" alt="Flag">
    <h2>${country.name.official}</h2>
    <p><strong>Capital: </strong> ${capital}</p>
    <p><strong>Population: </strong> ${population}</p>
    <p><strong>Region: </strong> ${region}</p>
    <p><strong>Subregion: </strong> ${subregion}</p>
  `;

  document.getElementById("map").src =
    `https://www.google.com/maps?q=${country.name.common}&output=embed`;
}

function renderHistory() {
  const ul = document.getElementById("history-list");
  ul.innerHTML = "";

  state.history.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `<img src="${c.flag}"> ${c.name}`;
    li.onclick = () => getCountry(c.name);
    ul.appendChild(li);
  });
}

document.getElementById("search").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("bt_search").click();
  }
});

document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value.trim();
  handleSuggest(value);
});

document.getElementById("bt_search").addEventListener("click", () => {
  const countryName = document.getElementById("search").value.trim();
  if (countryName == "") {
    alert("Please enter a country name to get information");
    return;
  }
  getCountry(countryName);
  suggestList.classList.add("hidden");
});

const toggleButton = document.getElementById("toggle-theme");
toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  
  if (isDark) {
    toggleButton.textContent = "☀️";
  } else {
    toggleButton.textContent = "🌙";
  }

  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
}

loadTheme();