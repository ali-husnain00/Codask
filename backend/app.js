import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import user from "./models/user.js";

dotenv.config();
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("App is working");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).send("All fields are required!");
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(200).send("User created successfully!");
  } catch (error) {
    res.status(500).send("An error occured while creating user");
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send("All fields are required!");
    }

    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    const isMatched = await bcrypt.compare(password, existingUser.password);
    if (!isMatched) {
      return res.status(401).send("Unauthorized: Invalid credentials!");
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).send("Login successful!");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("An error occurred during login");
  }
});

app.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.status(200).send("User Logged out successfully!");
  } catch (error) {
    console.log(error)
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
