const { clerkClient } = require('@clerk/express')

const auth = async (req, res, next) => {
  try {

    console.log("AUTH STARTED");

    const { userId } = req.auth();

    console.log("USER ID:", userId);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false
      });
    }

    const user = await clerkClient.users.getUser(userId);

    const plan = user?.publicMetadata?.plan || "free";
    const freeUsage = user?.privateMetadata?.free_usage || 0;

    if (plan === "premium") {
      req.plan = "premium";
      req.free_usage = 0;
    } else {
      req.plan = "free";
      req.free_usage = freeUsage;
    }

    console.log("AUTH SUCCESS");

    next();

  } catch (error) {

    console.log("AUTH ERROR:", error);

    return res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

module.exports = auth;