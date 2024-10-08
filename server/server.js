import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";

// Schema import
import User from "./Schema/User.js";

dotenv.config(); // Load environment variables from .env
const server = express();
let PORT = 3000;

// Regex for email and password validation
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

server.use(express.json());
server.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.DB_LOCATION, {
    autoIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// Function to format data to send to the client
const formatDataSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

// Function to generate unique username
const generateUsername = async (email) => {
  let baseUsername = email.split("@")[0];
  let username = baseUsername;

  // Loop until a unique username is found
  let isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  });

  while (isUsernameNotUnique) {
    username = `${baseUsername}${nanoid().substring(0, 5)}`;
    isUsernameNotUnique = await User.exists({
      "personal_info.username": username,
    });
  }

  return username;
};

// Signup endpoint
server.post("/signup", async (req, res) => {
  console.log(req.body)
  let { fullname, email, password } = req.body;

  // Fullname validation
  if (fullname.length < 3 || fullname.length > 20) {
    return res.status(403).json({
      message: "Fullname must be between 3 and 20 characters",
    });
  }

  // Email validation
  if (!emailRegex.test(email)) {
    return res.status(403).json({ message: "Invalid email" });
  }

  // Password validation
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      message:
        "Password must be between 6 and 20 characters and contain at least one lowercase letter, one uppercase letter, and one digit.",
    });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ "personal_info.email": email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashed_password = await bcrypt.hash(password, 10);

    // Generate unique username
    const username = await generateUsername(email);

    // Create new user
    const user = new User({
      personal_info: { fullname, email, password: hashed_password, username },
    });

    // Save user to database
    await user.save();

    // Send response to client
    return res.status(200).json(formatDataSend(user));
  } catch (err) {
    // Handle general errors
    return res.status(500).json({ error: err.message });
  }
});

server.post("/signin", (req, res) => {
  const { email, password } = req.body; // Destructure as an object

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "email not found" });
      }

      // check password
      bcrypt.compare(password, user.personal_info.password, (err, result) => {
        if (err) {
          return res
            .status(403)
            .json({ error: "error occured during  signin plesaeu try again" });
        }
        if (!result) {
          return res.status(403).json({
            error: "Invalid password",
          });
        } else {
          return res.status(200).json(formatDataSend(user));
        }
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: "server error" });
    });
});

// Start server
server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
