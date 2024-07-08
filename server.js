const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./Models/user.model');
const Farm = require('./Models/farm.model');

mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database (in-memory for simplicity, you should use a real database in production)
const users = [];
const farms = [];


app.get('/', (req, res) => {
  res.send('Homepage');
});



// Register
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // Check if a user with the same username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send('Username or email already taken');
    }

    const user = new User({ username, password, email });
    await user.save();
    res.send(`User created successfully!`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});
// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      res.status(401).send('Invalid username or password');
    } else {
      const token = jwt.sign({ userId: user.id }, 'ecretkey', { expiresIn: '1h' });
      res.send({ token });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in');
  }
});


// Dashboard (protected route)



app.get('/dashboard',verifyToken, async (req, res) => {
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
    // try {
    //   const schemeResponse = await axios.get(schemeApiUrl, {
    //     headers: {
    //       'Authorization': `Bearer ${schemeApiKey}`,
    //     },
    //   });
    //   const schemeData = schemeResponse.data;
    //   const schemeList = schemeData.map(scheme => `<li>${scheme.schemeName} - ${scheme.description}</li>`).join('');

    //   res.send(`
    //     <p>Schemes for Farmers:</p>
    //     <ul>
    //       ${schemeList}
    //     </ul>
    //   `);
    // } catch (error) {
    //   console.error(error);
    //   res.send('Error fetching scheme data');
    // }
  } catch (error) {
    console.error(error);
    res.send('Error fetching weather data');
  }
});

// My Farm (protected route)
app.get('/myfarm', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const farm = await Farm.findOne({ userId });
    res.send(farm);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching farm data');
  }
});

// Start Farming (protected route)
app.post('/startfarming', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const farm = new Farm({ userId, crops: [] });
    await farm.save();
    res.send('Farming started successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error starting farming');
  }
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
  jwt.verify(token, 'ecretkey', (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }
    User.findById(decoded.userId).then(user => {
      if (!user) {
        return res.status(401).send('Invalid token');
      }
      req.user = user;
      next();
    }).catch(err => {
      return res.status(401).send('Invalid token');
    });
  });
}

app.listen(3000, () => {
  console.log('Server started on port 3000');
  console.log("Server listening on http://localhost:3000/")
});



