export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    migration: process.env.POSTGRES_MIGRATION === 'true',
    synchronize: process.env.POSTGRES_SYNC === 'true',
    logging: process.env.POSTGRES_LOGGING === 'true',
    // dropSchema: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  },
  // s3: {
  //   awsAccessKeyID: process.env.AWS_ACCESS_KEY_ID,
  //   awsSecretAccessKeyID: process.env.AWS_SECRET_ACCESS_KEY_ID,
  //   awsS3BucketName: process.env.AWS_BUCKET_NAME,
  //   awsSdkLoadConfig: process.env.AWS_SDK_LOAD_CONFIG,
  // },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    saltRound: process.env.BCRYPT_SALT,
  },
  refreshToken: {
    jwtSecret: process.env.REFRESH_SECRET,
  },
  minio: {
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT, 10) || 9000,
    urlEndPoint: process.env.MINIO_ENDPOINT + ':' + process.env.MINIO_PORT,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucketName: process.env.MINIO_BUCKET_NAME,
  },
  mailer: {
    transport: {
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT, 10) || 587,
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
        apiKey: process.env.MAIL_API_KEY,
      },
    },
    defaults: {
      from: process.env.MAIL_FROM,
    },
  },
});
