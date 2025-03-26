const express = require('express');
const cors = require('cors');
require('dotenv').config();
<<<<<<< HEAD
require('./src/cron/recurringTransactions');



const db = require('./config/db');
=======
>>>>>>> bdd8102ac2d938959e2fa348cf4b731154fb4966
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes'); // Dosya adı düzeltildi

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Ayarları
const corsOptions = {
    origin: process.env.CLIENT_URL || '*', // Daha güvenli olması için .env'den okunabilir
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));
app.use(express.json());

// API Yönlendirmeleri
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);  
app.use('/api/transactions', transactionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/categories', categoriesRoutes); 
app.use('/api/recurring-transactions', transactionsRoutes); 


// Ana Route
app.get('/', (req, res) => {
    res.send('🚀 API Çalışıyor!');
});

// Hata Yakalama Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Server Başlatma
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

