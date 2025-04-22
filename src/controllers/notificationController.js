const io = require('socket.io');  // Socket.io'yı import ediyoruz

// Bildirim gönderme işlemi
const sendNotification = async (req, res) => {
    const { userId, message } = req.body;  // Kullanıcı ID ve mesaj alıyoruz

    if (!userId || !message) {
        return res.status(400).json({ message: 'Eksik veri, kullanıcı ID ve mesaj gerekli.' });
    }

    try {
        // Kullanıcıyı bulalım ve socket'e bağlı mı diye kontrol edelim
        const socket = io.sockets.sockets.get(userId);  // userId'ye bağlı olan socket'i buluyoruz
        if (!socket) {
            return res.status(404).json({ message: 'Kullanıcıyı bulamadık.' });
        }

        // Bildirimi gönderiyoruz
        socket.emit('newTransaction', { message });

        return res.status(200).json({ message: 'Bildirim gönderildi.' });
    } catch (error) {
        console.error('Bildirim gönderme hatası:', error);
        res.status(500).json({ message: 'Bir hata oluştu, lütfen tekrar deneyin.' });
    }
};

module.exports = {
    sendNotification
};
