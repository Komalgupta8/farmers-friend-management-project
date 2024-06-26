const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database (in-memory for simplicity, you should use a real database in production)
const users = [];
const farms = [];


app.get('/', (req, res) => {
  res.send('Homepage');
});


// Register
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  const user = { username, password, email };
  users.push(user);
  res.send(`User created successfully!`);
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    res.status(401).send('Invalid username or password');
  } else {
    const token = jwt.sign({ userId: user.id }, 'secretkey', { expiresIn: '1h' });
    res.send({ token });
  }
});

// Dashboard (protected route)



app.get('/dashboard', async (req, res) => {
  const location = 'Mathura';
  const schemeApiUrl = 'https://apisetu.gov.in/api/schemes/farmers'; // Replace with the actual API URL
  const schemeApiKey = 'YOUR_API_KEY'; // Replace with your API key

  try {
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=3bd51442b1e3c2a556a48ac32d00ea19`);
    const weatherData = weatherResponse.data;
    const tempCelsius = weatherData.main.temp;
    const tempFahrenheit = (tempCelsius * 9/5) + 32;
    const weatherReport = `Current weather in ${location}: ${weatherData.weather[0].description} with a temperature of ${tempCelsius}°C (${tempFahrenheit}°F)`;
    res.send(`Your Weather Report =>  ${weatherReport}`);
    try {
      const schemeResponse = await axios.get(schemeApiUrl, {
        headers: {
          'Authorization': `Bearer ${schemeApiKey}`,
        },
      });
      const schemeData = schemeResponse.data;
      const schemeList = schemeData.map(scheme => `<li>${scheme.schemeName} - ${scheme.description}</li>`).join('');

      res.send(`
        <p>Schemes for Farmers:</p>
        <ul>
          ${schemeList}
        </ul>
      `);
    } catch (error) {
      console.error(error);
      res.send('Error fetching scheme data');
    }
  } catch (error) {
    console.error(error);
    res.send('Error fetching weather data');
  }
});

// My Farm (protected route)
app.get('/myfarm', verifyToken, (req, res) => {
  const userId = req.user.id;
  const farm = farms.find(f => f.userId === userId);
  res.send(farm);
});

// Start Farming (protected route)
app.post('/startfarming', verifyToken, (req, res) => {
  const userId = req.user.id;
  const farm = { userId, crops: [] };
  farms.push(farm);
  res.send('Farming started successfully!');
});

// Shop (protected route)
app.get('/shop', verifyToken, (req, res) => {
  res.send('Welcome to the shop!');
});

// Price Chart (protected route)
app.get('/pricechart', verifyToken, (req, res) => {
  res.send('Price chart data');
});

// middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send('No token provided');
  }
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }
    req.user = users.find(u => u.id === decoded.userId);
    next();
  });
}

app.listen(3000, () => {
  console.log('Server started on port 3000');
  console.log("Server listening on http://localhost:3000/")
});



