let debounceTimeout;
let inputChecker = document.getElementById("inputChecker");
let checker = true;

inputChecker.classList.add("default");
inputChecker.classList.remove("checking");
inputChecker.classList.remove("error");
inputChecker.classList.remove("success");

let iconCloud = document.getElementById("iconCloud");
iconCloud.classList.toggle("fa-cloud-sun");

document.getElementById("inputCity").addEventListener("input", function (event) {
  event.preventDefault();

  inputChecker.classList.remove("default");
  inputChecker.classList.add("checking");
  inputChecker.classList.remove("error");
  inputChecker.classList.remove("success");

  inputChecker.textContent = "Checking...";

  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(() => {
    fetchWeatherData();
  }, 1000);
});

function fetchWeatherData() {
  const cityInput = document.querySelector("input");
  const city = cityInput.value.trim();
  const apiKey = "oURfeLvsbvhmTFUIH2qjNA==dOeOl3zMI1XmFZyB";

  if (city === "") {
    // alert("Masukkan nama kota");
    inputChecker.textContent = "Enter the city name!";
    checker = false;

    inputChecker.classList.remove("default");
    inputChecker.classList.remove("checking");
    inputChecker.classList.add("error");
    inputChecker.classList.remove("success");

    return;
  }

  fetch(`https://api.api-ninjas.com/v1/weather?city=${city}`, {
    headers: {
      "X-Api-Key": apiKey,
    },
  })
    .then((response) => {
      if (!response.ok) {
        // throw new Error("Data tidak ditemukan");
        inputChecker.textContent = "Not Found!";
        checker = false;

        inputChecker.classList.remove("default");
        inputChecker.classList.remove("checking");
        inputChecker.classList.add("error");
        inputChecker.classList.remove("success");
      }
      return response.json();
    })
    .then((data) => {
      // memperbaiki kalimat
      let nameCity = `${city}`;
      nameCity = nameCity.toLowerCase();
      let wordTitle = nameCity.trim().split(/\s+/);
      for (let i = 0; i < wordTitle.length; i++) {
        wordTitle[i] = wordTitle[i][0].toLocaleUpperCase() + wordTitle[i].substr(1);
      }
      nameCity = wordTitle.join(" ");

      if (checker == true) {
        inputChecker.classList.remove("default");
        inputChecker.classList.remove("checking");
        inputChecker.classList.remove("error");
        inputChecker.classList.add("success");

        inputChecker.textContent = "Found!";

        document.getElementById("city").textContent = nameCity;

        if (`${data.cloud_pct}` <= 50) {
          document.getElementById("conditions").textContent = " Clear Sky";
          iconCloud.classList.add("fa-sun");
          iconCloud.classList.remove("fa-cloud");
          iconCloud.classList.remove("fa-cloud-sun");
        } else if (`${data.cloud_pct}` > 50) {
          document.getElementById("conditions").textContent = " Cloudy";
          iconCloud.classList.remove("fa-sun");
          iconCloud.classList.add("fa-cloud");
          iconCloud.classList.remove("fa-cloud-sun");
        } else {
          document.getElementById("conditions").textContent = "Condition";
          iconCloud.classList.remove("fa-sun");
          iconCloud.classList.remove("fa-cloud");
          iconCloud.classList.add("fa-cloud-sun");
        }

        document.getElementById("temperature").textContent = `${data.temp}°C`;
        document.getElementById("wind_speed").textContent = `${data.wind_speed} m/s`;
        document.getElementById("humidity").textContent = `${data.humidity}%`;
        document.getElementById("min_temp").textContent = `${data.min_temp}°C`;
        document.getElementById("max_temp").textContent = `${data.max_temp}°C`;
      }
    })
    .catch((error) => {
      alert(error.message);
      console.error("Error:", error);
    });
}
