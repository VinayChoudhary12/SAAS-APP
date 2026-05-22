const express = require('express');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/express');

require('dotenv').config();

const aiRouter = require("./routes/aiRoutes");
const connectCloudinary = require('./config/cloudinary');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

app.use(clerkMiddleware());

app.use((req, res, next) => {
  console.log("REQUEST HIT:", req.method, req.url);
  next();
});


app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

connectCloudinary();

app.get('/', (req, res) => {
  res.send('server is live');
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Server Running On PORT', PORT);
});

module.exports = app;