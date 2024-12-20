import express from 'express';
import cors from 'cors';

const app = express();
const router = express.Router();
app.use('/api', router);
app.use(express.json());
app.use(cors());

let tasks = [
  {
    id: 1,
    text: 'Vuetify',
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

const PORT = process.env.port || 3000;
app.listen(PORT, () => {
  console.log(`Server sluša na http://localhost:${PORT}`);
});
