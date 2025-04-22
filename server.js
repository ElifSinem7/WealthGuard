const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http'); // http server oluşturacağız
const socketIo = require('socket.io'); // Socket.io'yu ekliyoruz
const db = require('./src/config/db');

// Routes
const notificationRoutes = require('./src/routes/notificationRoutes');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const recurringRoutes = require('./src/routes/recurringRoutes');
const runRecurringTransactions = require('./src/cron/recurringTransactions');

const app = express();
const server = http.createServer(app); // Express uygulamasını HTTP server'ına bağlıyoruz
const io = socketIo(server); // Socket.io'yu başlatıyoruz

const PORT = process.env.PORT || 5000;

// ✅ CORS Ayarları
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/recurring', recurringRoutes);

// ✅ Socket.io bağlantısı
let activeSockets = {}; // Kullanıcıların aktif socket ID'lerini tutacak bir nesne

// Socket.io bağlantısı kurulduğunda
io.on('connection', (socket) => {
    console.log('Yeni bir kullanıcı bağlandı:', socket.id);

    // Kullanıcı bağlandığında, onun kullanıcı ID'sini sakla
    socket.on('userConnected', (userId) => {
        activeSockets[userId] = socket.id;
        console.log(`Kullanıcı ${userId} aktif oldu.`);
    });

    // Kullanıcı bağlantısı kesildiğinde, socket ID'yi sil
    socket.on('disconnect', () => {
        for (let userId in activeSockets) {
            if (activeSockets[userId] === socket.id) {
                delete activeSockets[userId];
                console.log(`Kullanıcı ${userId} çıkış yaptı.`);
                break;
            }
        }
    });
});

// ✅ Transaction ekleme route'u (Örneğin gelir-gider eklenince bildirim göndermek için)
app.post('/api/transactions', async (req, res) => {
    const { user_id, category_id, amount, description, transaction_date } = req.body;

    if (!user_id || !category_id || !amount || !transaction_date) {
        return res.status(400).json({ message: "Eksik veri, tüm alanları doldurduğunuzdan emin olun." });
    }

    try {
        const query = `INSERT INTO transactions (user_id, category_id, amount, description, transaction_date) 
                       VALUES (?, ?, ?, ?, ?)`;

        const [result] = await db.query(query, [
            user_id, 
            category_id, 
            amount, 
            description || null, 
            transaction_date
        ]);

        // Kullanıcıya bildirim gönder
        if (activeSockets[user_id]) {
            io.to(activeSockets[user_id]).emit('newTransaction', {
                message: 'Yeni bir gelir-gider eklendi!',
                transaction: { id: result.insertId, amount, description, transaction_date }
            });
        }

        res.status(201).json({
            message: 'Transaction başarıyla eklendi!',
            transaction: { id: result.insertId, user_id, category_id, amount, description, transaction_date }
        });
    } catch (err) {
        console.error('Veritabanı hatası:', err);
        res.status(500).json({ message: "Sunucu hatası, lütfen tekrar deneyin." });
    }
});

// ✅ Cron test endpoint (isteğe bağlı)
app.get('/api/test-recurring', async (req, res) => {
    try {
        await runRecurringTransactions();
        res.status(200).json({ message: "Recurring transactions executed successfully" });
    } catch (error) {
        console.error("Error running cron job manually:", error);
        res.status(500).json({ error: "Cron job execution failed" });
    }
});

// ✅ Ana route
app.get('/', (req, res) => {
    res.send('🚀 API Çalışıyor!');
});

// ✅ Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// ✅ Server başlat
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
