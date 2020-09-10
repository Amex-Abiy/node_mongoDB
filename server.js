const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const connectDB = require('./config/dbConn');
const errorHandler = require('./middleware/errorHandler')

dotenv.config({ path: './config/config.env' });
const bootcampRouter = require('./routes/bootcamp');
const courseRouter = require('./routes/course');
const authRouter = require('./routes/auth');

connectDB();
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(fileupload());
app.use(cookieParser());
app.use('/api/v1/bootcamp', bootcampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/auth', authRouter);


app.use(errorHandler);
app.listen(process.env.PORT || 5000);