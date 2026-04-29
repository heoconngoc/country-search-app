async function getCountry(countryName) {
  const url = `https://restcountries.com/v3.1/name/${countryName}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if(!data || data.status === 404){
      alert("Country not found");
      return;
    }

    const country = await data[0];

    document.getElementById("name").textContent = country.name.official;
    document.getElementById("population").textContent = country.population;
    document.getElementById("capital").textContent = country.capital[0];
    document.getElementById("region").textContent = country.region;
    document.getElementById("subregion").textContent = country.subregion;
    document.getElementById("flag").src = country.flags.png;
    document.getElementById("country-card").classList.remove("card-hidden");

    document.getElementById("map").src = `https://www.google.com/maps?q=${country.name.common}&output=embed`
  } catch (error){
    console.error("Error:" + error);
    alert("Something went wrong: " + error);
  }
}

document.getElementById("bt_search").addEventListener("click", () => {
  const countryName = document.getElementById("search").value.trim();
  if(countryName == ""){
    alert("Please enter a country name to get information");
    return;
  }
  getCountry(countryName);
})