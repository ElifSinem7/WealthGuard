const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/config/db');
const admin = require('./src/config/firebase'); 
const notificationRoutes = require('./src/routes/notificationRoutes'); // Güncel Notification Routes
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const runRecurringTransactions = require('./src/cron/recurringTransactions');

const app = express();
const PORT = process.env.PORT || 5000;

// Firebase Admin SDK'yı başlatma zaten firebase.js içinde yapıldı, burada tekrar yapmıyoruz.

// CORS Ayarları
const corsOptions = {
    origin: process.env.CLIENT_URL || '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));
app.use(express.json());

// API Yönlendirmeleri
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);  
app.use('/api/transactions', transactionsRoutes);S
app.use('/api/categories', categoriesRoutes);
app.use('/api/categories', categoriesRoutes); 
app.use('/api/recurring-transactions', transactionsRoutes); 

// Cron Job'u Manuel Çalıştırma Endpoint'i
app.get('/api/test-recurring', async (req, res) => {
    try {
        await runRecurringTransactions();
        res.status(200).json({ message: "Recurring transactions executed successfully" });
    } catch (error) {
        console.error("Error running cron job manually:", error);
        res.status(500).json({ error: "Cron job execution failed" });
    }
});

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
