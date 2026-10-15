import express from 'express';
import studentRoutes from './routes/student.route.js';
const app = express();
const port = 3000;

app.use(express.json());


app.use("/api/student", studentRoutes);




app.get('/', (req, res) => {
  res.send('Hello World!!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
