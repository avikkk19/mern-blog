import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import admin from "firebase-admin";
import serviceAccountKey from "./mern-blog-60048-firebase-adminsdk-wet16-7d1c3c398d.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";

// Schema import
import User from "./Schema/User.js";

dotenv.config(); // Load environment variables from .env
const server = express();
let PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

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
// for google auth
server.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});


// Signup endpoint
server.post("/signup", async (req, res) => {
  console.log(req.body);
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
  const { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "email not found" });
      }

      // Check if user has a Google-authenticated account
      if (!user.google_auth) {
        // Compare password if it's not a Google-authenticated account
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
          if (err) {
            return res.status(403).json({
              error: "Error occurred during signin, please try again",
            });
          }
          if (!result) {
            return res.status(403).json({
              error: "Invalid password",
            });
          } else {
            return res.status(200).json(formatDataSend(user));
          }
        });
      } else {
        // If user has logged in with Google, return an error
        return res.status(403).json({
          error:
            "This account is already linked with Google, please log in using Google",
        });
      }
    })
    .catch((err) => {
      console.error("Signin Error: ", err); // Log the error for debugging
      return res.status(500).json({ error: "Server error" });
    });
});

server.post("/google-auth", async (req, res) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;
      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select("personal_info.fullname personal_info.profile_img google_auth")
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(403).json({ error: err.message });
        });

      if (user) {
        if (!user.google_auth) {
          return res
            .status(403)
            .json({ error: "This user is not Google authenticated" });
        } else {
          return res.status(200).json(formatDataSend(user));
        }
      } else {
        let username = await generateUsername(email);

        user = new User({
          personal_info: {
            fullname: name,
            email,
           
            username,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ error: "Server error" });
          });

        return res.status(200).json(formatDataSend(user));
      }
    })
    .catch((err) => {
      console.error("google Auth error :",err)
      return res
        .status(500)
        .json({ error: "Authentication error, try another Google account" });
    });
});

// Start server
server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
