const { OpenAI } = require("openai");
const { clerkClient } = require("@clerk/express");
const sql = require("../config/db.js");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const pdf = require("pdf-parse");
const pdfParse = require('pdf-parse');
const axios = require("axios");
const FormData = require("form-data");

// const AI = new OpenAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
// });
const AI = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Common Usage Check
const checkUsageLimit = (plan, free_usage, res) => {
  if (plan !== "premium" && free_usage >= 100) {
    res.json({
      success: false,
      message: "Limit reached. Upgrade to continue.",
    });
    return true;
  }
  return false;
};

// Update Usage
const updateUsage = async (userId, plan, free_usage) => {
  if (plan !== "premium") {
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        free_usage: free_usage + 1,
      },
    });
  }
};


//====================GENERATE ARTICLE=====================

  const generateArticle = async (req, res) => {
  try {

    console.log("CONTROLLER STARTED");

   // const userId = "test-user";
   const { userId } = req.auth();

    const { prompt, length } = req.body;

    console.log("BODY:", prompt, length);

    const response = await AI.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: Number(length) || 500,
    });

    console.log("AFTER AI CALL");

    const content = response.choices[0].message.content;

    console.log("CONTENT GENERATED");

    
    // TEMPORARILY REMOVE DATABASE INSERT
    await sql`
      INSERT INTO Creations(user_id, prompt, content, type)
      VALUES(${userId}, ${prompt}, ${content}, 'article')
    `;
   

    return res.status(200).json({
      success: true,
      content,
    });

  } catch (error) {

    console.log("CONTROLLER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//===================BLOG TITLE============
const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const { plan, free_usage } = req;

    if (checkUsageLimit(plan, free_usage, res)) return;

   const {length } = req.body;

    const response = await AI.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: Number(length)|| 500,
    });
    

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO Creations(user_id,prompt,content,type)
      VALUES(${userId},${prompt},${content},'blog-title')
    `;

    await updateUsage(userId, plan, free_usage);

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ======================= GENERATE IMAGE =======================

const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();

    // SAFE destructuring
    const prompt = req.body?.prompt;

    const { plan, free_usage } = req;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required"
      });
    }


    if (checkUsageLimit(plan, free_usage, res)) return;

    const formData = new FormData();

    formData.append("prompt", prompt);

    console.log(process.env.CLIP_DROP_API_KEY);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIP_DROP_API_KEY,
        },
        responseType: "arraybuffer",
        timeout: 120000,
      }
    );

    console.log("BODY:", req.body);

    const base64Image = `data:image/png;base64,${Buffer.from(
      response.data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    // await sql`
    //   INSERT INTO Creations(user_id, prompt, content, type)
    //   VALUES(${userId}, ${prompt}, ${secure_url}, 'image')
    // `;
    await sql`
  INSERT INTO Creations(
    user_id,
    prompt,
    content,
    type,
    publish
  )
  VALUES(
    ${userId},
    ${prompt},
    ${secure_url},
    'image',
    true
  )
`;

    await updateUsage(userId, plan, free_usage);

    return res.json({
      success: true,
      content: secure_url,
    });

  } catch (error) {

    console.log("IMAGE ERROR:", error);
    console.log(error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================= REMOVE BACKGROUND =======================
const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const { plan, free_usage } = req;

    if (checkUsageLimit(plan, free_usage, res)) return;

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [{ effect: "background_removal" }],
    });

    // await sql`
    //   INSERT INTO Creations(user_id,prompt,content,type)
    //   VALUES(${userId},'Removed Background',${secure_url},'image')
    // `;


    await sql`
  INSERT INTO Creations(
    user_id,
    prompt,
    content,
    type,
    publish
  )
  VALUES(
    ${userId},
    'Removed Background',
    ${secure_url},
    'image',
    true
  )
`;

    await updateUsage(userId, plan, free_usage);

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// ======================= REMOVE OBJECT =======================
const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const { plan, free_usage } = req;

    if (checkUsageLimit(plan, free_usage, res)) return;

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`
      INSERT INTO Creations(user_id,prompt,content,type,publish)
      VALUES(${userId},${`Removed ${object} from image`},${imageUrl},'image',true)
    `;

    await updateUsage(userId, plan, free_usage);

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// ======================= REVIEW RESUME =======================
const reviewResume = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const { plan, free_usage } = req;

    if (checkUsageLimit(plan, free_usage, res)) return;

  

    if (!resume) {
      return res.json({
        success: false,
        message: "Resume file is required.",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds 5MB.",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `
Review the following resume and provide feedback on:
1. Strengths
2. Weaknesses
3. Improvements

Resume:
${pdfData.text}
`;

    const response = await AI.chat.completions.create({
       model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO Creations(user_id,prompt,content,type,publish)
      VALUES(${userId},'Resume Review',${content},'resume-review',true)
    `;

    await updateUsage(userId, plan, free_usage);

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
  reviewResume,
};