import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import user from "./models/user.js";
import verifyToken from "./middlewares/verifyToken.js";
import file from "./models/file.js";
import project from "./models/project.js";
import crypto from "crypto";
import { userInfo } from "os";

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
    console.log(error);
  }
});

app.get("/getLoggedInUser", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const existingUser = await user
      .findById(userId)
      .select("-password")
      .populate("projects");

    if (!existingUser) {
      return res.status(404).send("User not found!");
    }

    res.status(200).json(existingUser);
  } catch (error) {
    console.error("Error getting logged-in user:", error.message);
    res.status(500).send("An error occurred while getting the logged-in user");
  }
});

app.post("/createProject", verifyToken, async (req, res) => {
  const { title, description, language, isSolo } = req.body;
  const userId = req.user.id;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).send("User not found!");
    }

    if (!title || !description || !language) {
      return res.status(400).send("All fields are required!");
    }

    const roomId = crypto.randomBytes(4).toString("hex");

    const newProject = await project.create({
      title,
      description,
      language,
      lead: userId,
      isSolo,
      members: isSolo ? [] : [{ userId, role: "Project lead" }],
      roomId,
    });

    const extMap = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
    };

    const extension = extMap[language.toLowerCase()] || "txt";
    const default_File = await file.create({
      projectId: newProject._id,
      filename: `main.${extension}`,
      content: "",
      language,
      createdBy: userId,
    });

    newProject.files.push(default_File._id);
    await newProject.save();

    existingUser.projects.push(newProject._id);
    await existingUser.save();

    res
      .status(200)
      .send({ roomId: newProject.roomId, projectId: newProject._id });
  } catch (error) {
    res.status(500).send("An error occured while creating project");
    console.log(error);
  }
});

app.get("/project/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const existingProject = await project
      .findById(id)
      .populate({ path: "members.userId", select: "username email" })
      .populate("files");
    if (!existingProject) {
      return res.status(404).send("Project not found!");
    }

    res.status(200).send(existingProject);
  } catch (error) {
    res.status(500).send("An error occured while getting project details");
    console.log(error);
  }
});

app.post("/createNewFile/:projectId", verifyToken, async (req, res) => {
  const projectId = req.params.projectId;
  const { filename, language } = req.body;
  const userId = req.user.id;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).send("User not found!");
    }

    const proj = await project.findById(projectId).populate("files");
    if (!proj) {
      return res.status(404).send("Project not found!");
    }

    const isDuplicate = proj.files.some(file => file.filename === filename);
    if (isDuplicate) {
      return res.status(400).send("A file with the same name already exists in this project.");
    }

    const newFile = await file.create({
      projectId,
      filename,
      language,
      content: "",
      createdBy: userId,
    });

    proj.files.push(newFile._id);
    await proj.save();

    res.status(201).send(newFile);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the new file.");
  }
});

app.post("/saveCode", verifyToken, async (req, res) =>{
  const {fileId, content} = req.body;
  try {
    const f = await file.findById(fileId);
    if(!f){
      return res.status(404).send("File not found!")
    }

    f.content = content;
    await f.save();

    res.status(200).send("File code saved");
  } catch (error) {
    res.status(500).send("An error occured while saving the code");
  }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
