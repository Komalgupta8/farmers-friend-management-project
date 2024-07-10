const axios = require('axios');

exports.weatherReport = async (req, res) => {
    const location = 'Delhi';
    try {
      const weatherResponse = await axios.get(process.env.Weather_API);
      const weatherData = weatherResponse.data;
      const tempCelsius = weatherData.main.temp;
      const tempFahrenheit = (tempCelsius * 9/5) + 32;
      const weatherReport = `Current weather in ${location}: ${weatherData.weather[0].description} with a temperature of ${tempCelsius}°C (${tempFahrenheit}°F)`;
      res.send(`Your Weather Report =>  ${weatherReport}`);
    } catch (error) {
      console.error(error);
      res.send('Error fetching weather data');
    }
  };