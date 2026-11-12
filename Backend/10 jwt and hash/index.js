import express from 'express';
import studentRoutes from './routes/student.route.js';
import authRoutes from './routes/auth.route.js';
import orderRoutes from './routes/order.route.js';
import { checkDBConnection } from "./db.js";

checkDBConnection();

const app = express();
const port = 3000;

app.use(express.json());


app.use("/api/student", studentRoutes);
app.use("/api/students", studentRoutes);

// Authentication Routes
app.use("/api/auth", authRoutes);

// Orders, JOINs, Aggregates, GROUP BY, and HAVING Routes
app.use("/api/orders", orderRoutes);




app.get('/', (req, res) => {
  res.send('Hello World!!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
