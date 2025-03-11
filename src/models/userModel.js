const db = require('../config/db');

const createUser = async (name, email, password) => {
    const [result] = await db.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
    );
    return result;
};

module.exports = { createUser };
