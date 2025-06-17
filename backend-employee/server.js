const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

const SECRET_KEY = 'your-secret-key';

const employees = []; // Empty array for CRUD operations stores list of object
let nextId = 0;


// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const token = req.header('Authorization').split(' ')[1];
  console.log("Token",token);
  if (!token) return res.status(403).send('Access denied.');
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Invalid token.');
    req.user = user;
    next();
  });
}

// Sample login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(400).send('Invalid credentials.');
});


// Protected routes for CRUD operations
app.get('/employees', authenticateToken, (req, res) => res.json(employees));


app.post('/employees', authenticateToken, (req, res) => {
  // console.log("id :", nextId);
  const newEmployee = {  ...req.body,id:++nextId };
  // console.log("Assigned ID:", newEmployee.id); // Confirm value
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

app.put('/employees/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = employees.findIndex(emp => emp.id === id);
  if (index !== -1) {
    employees[index] = { ...employees[index], ...req.body };
    res.json(employees[index]);
  } else {
    res.status(404).send('Employee not found.');
  }
});

app.delete('/employees/:id', authenticateToken, (req, res) => {
  const index = employees.findIndex(emp => emp.id === parseInt(req.params.id,10));
  if (index !== -1) {
    nextId=nextId-1;
    console.log("Id in delete :", nextId);
    employees.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Employee not found.');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
