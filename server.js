const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const userService = require('./services/userService');
const authMiddleware = require('./auth/authMiddleware');

const router = express.Router();

app.use(cors({
  origin: [process.env.CORS_ORIGIN, 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Host'],
  credentials: true
}));

app.use(bodyParser.json());

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      error: "Missing email or password" 
    });
  }
  
  const result = userService.loginUser(email, password);
  if (result) {
    res.json(result);
  } else {
    res.status(401).json({ 
      error: "Invalid credentials" 
    });
  }
});

router.use(authMiddleware)

router.get('/users', (req, res) => {
  console.log(req)
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.per_page) || 6;
  const result = userService.getUsers(page, perPage);
  res.json(result);
});

router.get('/users/:id', (req, res) => {
  const user = userService.getUserById(req.params.id);
  if (user) {
    res.json({ data: user });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

router.post('/users', (req, res) => {
  const { first_name, last_name, email } = req.body;
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  const newUser = userService.addUser({ first_name, last_name, email });
  res.status(201).json(newUser);
});

router.put('/users/:id', (req, res) => {
  const { first_name, last_name, email } = req.body;
  const updatedUser = userService.updateUser(req.params.id, { first_name, last_name, email });
  
  if (updatedUser) {
    res.json(updatedUser);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

router.delete('/users/:id', (req, res) => {
  const deleted = userService.deleteUser(req.params.id);
  if (deleted) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }
  
  const result = userService.registerUser(email, password);
  res.json(result);
});

app.use('/api', router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API running at port ${PORT}`);
});
