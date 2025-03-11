const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: "Yetkilendirme başlığı eksik" });
    }

    const token = authHeader.split(' ')[1]; // "Bearer TOKEN" formatını ayıkla

    if (!token) {
        return res.status(401).json({ message: "Token bulunamadı" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Geçersiz veya süresi dolmuş token" });
    }
};
