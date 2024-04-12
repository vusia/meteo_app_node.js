
const express = require('express');
const axios = require('axios')
const app = express();
const fs = require('fs');

app.set("view engine", "ejs")

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.render("index", {weather: null, error: null});
});


const storeData = (data, path) => {
  const timestamp = new Date()
  const dataToStore = {timestamp, data}
  try {
      fs.writeFileSync(path, JSON.stringify(dataToStore));
  } catch (err) {
      console.error(err);
  }
};


const saveData = async () => {
  const city = 'Bordeaux'
  const apiKey = "e773e177550d5d0eca29c755726b1a90"
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

  try {
      const response = await axios.get(apiUrl);
      const weather = response.data;

      const pathToFile = "weatherData.json"; 
      storeData(weather, pathToFile);
      console.log("Data saved:", weather);
  } catch (error) {
      console.error(error);
  }
};

setInterval(saveData, 1000 * 60 * 60);


app.get("/weather", async (req, res) => {
  const city = req.query.city
  const apiKey = "e773e177550d5d0eca29c755726b1a90"
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

  let weather
  let error = null

  try {
    const response = await axios.get(apiUrl)
    weather = response.data
  } catch(error) {
    weather = null
    error = "Error, please try again"
  }
  res.render("index", { weather, error})
})
    
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});