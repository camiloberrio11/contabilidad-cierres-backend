import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { router } from './routes/routes';
import { connectDatabase } from './database/database';

dotenv.config();

const app = express();
const PORT: string | number = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`Api para vertice - Version ${process.env.VERSION}`);
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use('/api', router);

app.listen(PORT, () => {
  connectDatabase();
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
