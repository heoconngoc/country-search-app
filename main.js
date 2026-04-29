async function getCountry() {
  const url = "https://restcountries.com/v3.1/name/vietnam";

  // fetch() gửi request đến API, trả về Promise
  // await: chờ API trả kết quả hẳn chứ không còn là Promise
  const response = await fetch(url);

  console.log(response)
  console.log("======== Data ========")

  // API trả về raw data
  // .json() chuyển thành object Javascript 
  const data = await response.json();
  console.log(data);

  const country = data[0];

  console.log("Name: ", country.name.common);
  console.log("Population: ", country.population);
  console.log("Region: ", country.region);
}

getCountry();