const express = require("express");
const auth = require("../middlewares/auth");

const {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
  reviewResume,
} = require("../controllers/aiController");

const upload = require("../config/multer");

const aiRouter = express.Router();


// Text Tools

aiRouter.post("/generate-article", auth, generateArticle);


//aiRouter.post("/generate-article", generateArticle);
aiRouter.post("/generate-blog-title", auth, generateBlogTitle);

// Image Tools
aiRouter.post("/generate-image", auth, generateImage);

aiRouter.post(
  "/remove-image-background",
  auth,
  upload.single("image"),
  removeImageBackground
);

aiRouter.post(
  "/remove-image-object",
  auth,
  upload.single("image"),
  removeImageObject
);

// Resume Tool
aiRouter.post(
  "/resume-review",
  auth,
  upload.single("resume"),
  reviewResume
);

module.exports = aiRouter;