import { registerAs } from "@nestjs/config";

export default registerAs("config", () => {
    return {
        database: {
            dbname: process.env.DATABASE_NAME || "admin_tenis",
            user: process.env.DATABASE_USER || "admin_tenis",
            password: process.env.DATABASE_PASSWORD  || "QTCZyH6i",
            port: process.env.DATABASE_PORT || 3306,
            hostname: process.env.DATABASE_HOST || "127.0.0.1",
            connection: process.env.DATABASE_CONNECTION || "mysql"          
        },
        session: {
            accessToken: process.env.ACCESS_TOKEN,
            jwtAccessTokenSecret: process.env.JWT_ACCESS_SECRET,
            jwtAccessTokenExpiresTime: process.env.JWT_ACCESS_EXPIRES_TIME,
            jwtRefreshTokenSecret: process.env.JWT_REFRESH_SECRET,
            jwtRefreshTokenExpiresTime: process.env.JWT_REFRESH_EXPIRES_TIME,
            jwtForgotPasswordSecret: process.env.JWT_FORGOT_PASSWORD_SECRET,
            jwtForgotPasswordExpiresTime: process.env.JWT_FORGOT_PASSWORD_EXPIRES_TIME,
        },
    }

});