const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const validateRoutes = require('./routes/validate');
const reportRoutes = require('./routes/report');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/validate', validateRoutes);
app.use('/api/report', reportRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'MailSense API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});