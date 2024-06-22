const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

app.get('/', (req, res) => {
  res.send('Homepage');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database (in-memory for simplicity, you should use a real database in production)
const users = [];
const farms = [];

// API endpoints

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
app.get('/dashboard', verifyToken, (req, res) => {
  res.send('Welcome to your dashboard!');
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



