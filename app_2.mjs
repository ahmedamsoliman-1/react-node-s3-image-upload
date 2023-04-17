// import 'dotenv/config';
// import express, { json } from 'express';
// import cors from 'cors';
// import multer, { memoryStorage } from 'multer';
// // import { getUserPresignedUrls, uploadToS3 } from './s3.mjs';

// import {
//   GetObjectCommand,
//   ListObjectsV2Command,
//   PutObjectCommand,
//   S3Client,
// } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuid } from 'uuid';

// const s3 = new S3Client({
//   region: process.env.REGION,
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY_ID,
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
//   },
// });

// const BUCKET = process.env.BUCKET;

// export const uploadToS3 = async ({ file, userId }) => {
//   const key = `${userId}/${uuid()}`;
//   const command = new PutObjectCommand({
//     Bucket: BUCKET,
//     Key: key,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   });

//   try {
//     await s3.send(command);
//     return { key };
//   } catch (error) {
//     console.log(error);
//     return { error };
//   }
// };

// const getImageKeysByUser = async userId => {
//   const command = new ListObjectsV2Command({
//     Bucket: BUCKET,
//     Prefix: userId,
//   });

//   const { Contents = [] } = await s3.send(command);

//   return Contents.sort(
//     (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
//   ).map(image => image.Key);
// };

// export const getUserPresignedUrls = async userId => {
//   try {
//     const imageKeys = await getImageKeysByUser(userId);

//     const presignedUrls = await Promise.all(
//       imageKeys.map(key => {
//         const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
//         return getSignedUrl(s3, command, { expiresIn: 900 }); // default
//       })
//     );
//     return { presignedUrls };
//   } catch (error) {
//     console.log(error);
//     return { error };
//   }
// };

// const app = express();

// const PORT = process.env.PORT || 4000;

// const storage = memoryStorage();
// const upload = multer({ storage });

// app.use(
//   cors({
//     origin: '*',
//   })
// );
// app.use(json());

// app.post('/images', upload.single('image'), (req, res) => {
//   const { file } = req;
//   const userId = req.headers['x-user-id'];

//   if (!file || !userId) return res.status(400).json({ message: 'Bad request' });

//   const { error, key } = uploadToS3({ file, userId });
//   if (error) return res.status(500).json({ message: error.message });

//   return res.status(201).json({ key });
// });

// app.get('/', function (req, res) {
//   res.send('SUCCESSS');
// });

// app.get('/images', async (req, res) => {
//   const userId = req.headers['x-user-id'];

//   if (!userId) return res.status(400).json({ message: 'Bad request' });

//   const { error, presignedUrls } = await getUserPresignedUrls(userId);
//   if (error) return res.status(400).json({ message: error.message });

//   return res.json(presignedUrls);
// });

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });
