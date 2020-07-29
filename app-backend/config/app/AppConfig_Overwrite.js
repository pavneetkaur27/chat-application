require('dotenv').config();
exports.server = {
    MODE                                    : 'prod',
    SESSION_SECRET                          : process.env.REDIS_PASSWORD || 'zhdbcshvchdvhdvfd',
    REDIS_PASSWORD                          : process.env.REDIS_PASSWORD || '',
    MONGO_URL                               : 'mongodb://localhost:27017/chatdb',
    MONGO_TEST_URL                          : 'mongodb://localhost:27017/chatdb',
    REDIS_HOST                              : process.env.REDIS_HOST || 'localhost',
    REDIS_PORT                              : Number(process.env.REDIS_PORT) || 6379,
    ORIGIN_SECURE                           : Number(process.env.ORIGIN_SECURE) || true,
    REDIS_PASSWORD                          : '',
    REDIS_TTL                               : Number(process.env.REDIS_TTL) || 260,
    ADMIN_TOKEN_PRIVATE_KEY                 : 'sdbchjsbvhdfv',
    RABBITMQ_HOST                           : 'localhost',
    RABBITMQ_PORT                           : 5672,
    RABBITMQ_USER                           : 'jsdchvs',
    RABBITMQ_PASSWORD                       : 'sdjbshj',
    JWT_PRIVATE_KEY                         : "sndcvdhgf2736634rjhhbh",
    AWS_ACCESS_KEY                          : "AKIAIUKBNUTLJ4XDZAGQ",
    AWS_SECRET_KEY                          : "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",
    AWS_REGION                              : "ap-south-1",
    S3_BUCKET                               : "pavneet-ckeditor-images",
    WEBPURIFY_API_KEY                       : "68373530625384ba846d19ebe047bbb9"
}