const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Authorization header'dan token'ı al
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: "Yetkilendirme başlığı eksik" });
    }

    // "Bearer TOKEN" formatında token'ı ayıkla
    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: "Token bulunamadı" });
    }

    try {
        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Token doğrulandıktan sonra, kullanıcının bilgilerini req.user'a ekle
        req.user = decoded;

        // Eğer token geçerliyse, bir sonraki middleware'e geç
        next();
    } catch (error) {
        // Eğer token geçerli değilse, hata mesajı döndür
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token süresi dolmuş, lütfen yeniden giriş yapın" });
        }
        return res.status(401).json({ message: "Geçersiz token" });
    }
};
