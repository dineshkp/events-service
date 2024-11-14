import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/v1/events';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/events', eventRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});