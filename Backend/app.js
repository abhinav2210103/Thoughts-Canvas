require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { connectMongoDB } = require('./connection');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const topicRouter = require('./routes/topic');
const adminRouter = require('./routes/admin');
const commentRouter = require('./routes/comment')
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT || 8000;

connectMongoDB(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.json());

app.use('/user', userRouter);
app.use('/blog', blogRouter); 
app.use('/topic', topicRouter);
app.use('/admin', adminRouter);
app.use('/comment',commentRouter);

app.listen(PORT, () => console.log(`Server is started at ${PORT}`));