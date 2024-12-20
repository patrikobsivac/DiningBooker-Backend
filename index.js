const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let tasks = [
  {
    id: 1,
    text: 'Vue.js',
    done: false,
  },
  {
    id: 2,
    text: 'Express',
    done: true,
  },
  {
    id: 3,
    text: 'Mongo',
    done: true,
  },
];

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTasks = { id: Date.now(), text: req.body.text, done: false };
  tasks.push(newTasks);
  res.json(newTasks);
});

app.put('/api/tasks/:id', (req, res) => {
  const tasks = tasks.find((t) => t.id === parseInt(req.params.id));
  if (tasks) {
    tasks.done = !tasks.done;
    res.json(tasks);
  } else {
    res.status(404).send('Task nije pronađen');
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  tasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
  res.json({ success: true });
});

const frontendPath = path.join(__dirname, 'dist');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
  console.log(`Server sluša na http://localhost:${PORT}`);
});
