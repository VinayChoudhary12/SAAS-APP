const sql = require('../config/db.js');

const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();

    const creations =
      await sql`SELECT * FROM Creations WHERE user_id = ${userId} ORDER BY created_at DESC`;
    
      console.log(creations);
    res.json({
      success: true,
      creations,
    });

  } catch (err) {
    res.json({
      success: false,
      message: err.message
    });
  }
};
const getPublishCreations = async (req, res) => {
  try {

    const creations = await sql`
      SELECT *
      FROM Creations
      WHERE publish = true
      AND type = 'image'
      ORDER BY created_at DESC
    `;

    res.json({
      success: true,
      creations,
    });

  } catch (err) {

    console.log(err);

    res.json({
      success: false,
      message: err.message
    });

  }
};

const toggleLikeCreations = async (req, res) => {
  try {

    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] =
      await sql`SELECT * FROM Creations WHERE id=${id}`;

    if (!creation) {
      return res.json({
        success: false,
        message: "Creations not found"
      });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();

    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {

      updatedLikes =
        currentLikes.filter((user) => user !== userIdStr);

      message = 'Creation Unliked';

    } else {

      updatedLikes = [...currentLikes, userIdStr];

      message = 'Creation Liked';
    }

    const formattedArray = `{${updatedLikes.join(',')}}`;

    await sql`
      UPDATE Creations
      SET likes = ${formattedArray}::text[]
      WHERE id = ${id}
    `;

    res.json({
      success: true,
      message,
    });

  } catch (err) {
    res.json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  getUserCreations,
  toggleLikeCreations,
  getPublishCreations
};