import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Routes } from './routes';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use(Routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
