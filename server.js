const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const UserRoutes = require('./Routes/UserRoutes');
const DashboardRoutes = require('./Routes/DashboardRoutes');
require("./Connection/conn")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Homepage');
});

app.use(UserRoutes)
app.use(DashboardRoutes)



// Login
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username, password });
//     if (!user) {
//       res.status(401).send('Invalid username or password');
//     } else {
//       const token = jwt.sign({ userId: user.id }, 'secretkey', { expiresIn: '1h' });
//       res.send({ token });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error logging in');
//   }
// });




app.listen(process.env.PORT, () => {
  console.log('Server started');
});



