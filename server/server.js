import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env
const server = express();
let PORT = 3000;
server.use(express.json());

// mongooooooooooooooo
mongoose
  .connect(process.env.DB_LOCATION, {
    autoIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

server.post("/signup", (req, res) => {
  let { fullname, email, password } = req.body;
  if (fullname.length < 3 || fullname.length > 20) {
    return res.status(403).json({
      message: "Fullname must be between 3 and 20 characters",
    });
  }
  return res.status(200).json({ status: "okay" });
});

server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
