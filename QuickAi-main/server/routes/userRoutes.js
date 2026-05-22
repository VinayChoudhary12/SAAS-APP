const express= require('express');
const auth = require('../middlewares/auth');
const { getUserCreations, getPublishCreations, toggleLikeCreations } = require('../controllers/userController');
const userRouter = express.Router();

userRouter.get('/get-user-creations',auth,getUserCreations)
userRouter.get('/get-publish-creations',auth,getPublishCreations)
userRouter.post('/toggle-like-creations',auth,toggleLikeCreations)

module.exports = userRouter