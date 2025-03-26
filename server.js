const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./src/cron/recurringTransactions');



const db = require('./config/db');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes'); 
const transactionsRoutes = require('./src/routes/transactionsRoutes');
const categoriesRoutes = require('./src/routes/categoriesRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware'ler
app.use(cors());
app.use(express.json());

// API yönlendirmeleri
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);  
app.use('/api/transactions', transactionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/categories', categoriesRoutes); 
app.use('/api/recurring-transactions', transactionsRoutes); 


app.get('/', (req, res) => {
  res.send('🚀 API Çalışıyor!');
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
});
