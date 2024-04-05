const express = require("express");
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("./utils/jwtGenerator");

const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Registering a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Query the database to check if the user already exists
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).send("user already exists");
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1,$2,$3) RETURNING *",
      [name, email, bcryptPassword]
    );

    // If user doesn't exist, you can proceed with registration or any other logic
    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Query the database to check if the user already exists
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].user_password
      );

      console.log(validPassword);
      if (validPassword) {
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({ token, validPassword });
      } else {
        res.send("username and password does not match");
      }

      // If user doesn't exist, you can proceed with registration or any other logic
    }
    return res.status(401).send("user dosen't exist");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
