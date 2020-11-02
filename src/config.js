module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://lsikora@localhost/nek-api',
    JWT_SECRET: process.env.JWT_SECRET || 'hikes',
    CLIENT_ORIGIN: 'https://nek-client.vercel.app/'
};
