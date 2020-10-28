module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://mzmzyhtjxhfzfj:ac3a32dc8e0a37797f528ce2d858467970228dcdfc89ded5dacfc107440ccfe8@ec2-54-156-121-142.compute-1.amazonaws.com:5432/d8r7rls3pa3a2u',
    JWT_SECRET: process.env.JWT_SECRET || 'hikes',
    CLIENT_ORIGIN: 'https://nek-client.vercel.app/'
};
