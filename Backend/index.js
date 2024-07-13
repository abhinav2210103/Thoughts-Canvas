require('dotenv').config()
const express = require('express');
const { connectMongoDB } = require('./connection');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const topicRouter = require('./routes/topic');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT || 8000;

connectMongoDB(process.env.MONGO_URL).then((e) => console.log('MongoDB Connected'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.json());

app.use('/user', userRouter);
app.use('/blog', blogRouter);
app.use('/topic', topicRouter);

app.listen(PORT, () => console.log(`Server is started at ${PORT}`));