import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import message from "../models/message.js";
import user from "../models/user.js";
import project from "../models/project.js";
import file from "../models/file.js";
import invite from "../models/invite.js";
import task from "../models/task.js";
import { sendError, sendSuccess } from "../utils/response.js";


export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return sendError(res, 400, "All fields are required", "VALIDATION_ERROR");
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, "User already exists", "USER_EXISTS");
    }

    if(existingUser?.username === username) {
      return sendError(res, 409, "Username already taken", "USERNAME_TAKEN");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.create({
      username,
      email,
      password: hashedPassword,
    });

    return sendSuccess(res, 201, "User created successfully");
  } catch (error) {
    if(error.code === 11000) {
      return sendError(res, 409, "Username already taken", "USERNAME_TAKEN");
    }
    return sendError(res, 500, "An error occured while creating user", "REGISTER_FAILED");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return sendError(res, 400, "All fields are required", "VALIDATION_ERROR");
    }

    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return sendError(res, 404, "User not found", "USER_NOT_FOUND");
    }

    const isMatched = await bcrypt.compare(password, existingUser.password);
    if (!isMatched) {
      return sendError(res, 401, "Unauthorized: Invalid credentials", "INVALID_CREDENTIALS");
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    const isLocalhost = req.get("origin")?.includes("localhost");
    res.cookie("token", token, {
      httpOnly: true,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "Lax" : "None",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, 200, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, 500, "An error occurred during login", "LOGIN_FAILED");
  }
};

export const logout = (req, res) => {
  try {
    const isLocalhost = req.get("origin")?.includes("localhost");
    res.clearCookie("token", {
      httpOnly: true,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "Lax" : "None",
      path: "/",
    });
    return sendSuccess(res, 200, "User logged out successfully");
  } catch (error) {
    return sendError(res, 500, "Error during logout", "LOGOUT_FAILED");
  }
};

export const getLoggedInUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const existingUser = await user
      .findById(userId)
      .select("-password")
      .populate({
        path: "projects",
        populate: {
          path: "tasks",
        },
      });

    if (!existingUser) {
      return sendError(res, 404, "User not found", "USER_NOT_FOUND");
    }

    return sendSuccess(res, 200, "Logged in user fetched", existingUser);
  } catch (error) {
    console.error("Error getting logged-in user:", error.message);
    return sendError(res, 500, "An error occurred while getting the logged-in user", "FETCH_USER_FAILED");
  }
};

export const getAssignedProjects = async (req, res) => {
  const userId = req.user.id;
  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return sendError(res, 404, "User not found", "USER_NOT_FOUND");
    }

    const assignedProjects = await project.find({
      "members.userId": userId,
    });

    return sendSuccess(res, 200, "Assigned projects fetched", assignedProjects);
  } catch (error) {
    return sendError(res, 500, "An error occurred while getting assigned projects", "FETCH_ASSIGNED_PROJECTS_FAILED");
  }
};

export const createProject = async (req, res) => {
  const { title, description, language, isSolo } = req.body;
  const userId = req.user.id;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return sendError(res, 404, "User not found", "USER_NOT_FOUND");
    }

    if (!title || !description || !language) {
      return sendError(res, 400, "All fields are required", "VALIDATION_ERROR");
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

    return sendSuccess(res, 201, "Project created successfully", {
      roomId: newProject.roomId,
      projectId: newProject._id,
    });
  } catch (error) {
    return sendError(res, 500, "An error occured while creating project", "CREATE_PROJECT_FAILED");
  }
};
export const getProjectById = async (req, res) => {
  const id = req.params.id;
  try {
    const existingProject = await project
      .findById(id)
      .populate({ path: "members.userId", select: "username email" })
      .populate("lead")
      .populate("files")
      .populate("tasks");
    if (!existingProject) {
      return sendError(res, 404, "Project not found", "PROJECT_NOT_FOUND");
    }

    return sendSuccess(res, 200, "Project details fetched", existingProject);
  } catch (error) {
    return sendError(res, 500, "An error occured while getting project details", "FETCH_PROJECT_FAILED");
  }
};

export const createNewFile = async (req, res) => {
  const projectId = req.params.projectId;
  const { filename, language } = req.body;
  const userId = req.user.id;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return sendError(res, 404, "User not found", "USER_NOT_FOUND");
    }

    const proj = await project.findById(projectId).populate("files");
    if (!proj) {
      return sendError(res, 404, "Project not found", "PROJECT_NOT_FOUND");
    }

    const isDuplicate = proj.files.some((file) => file.filename === filename);
    if (isDuplicate) {
      return sendError(
        res,
        400,
        "A file with the same name already exists in this project",
        "DUPLICATE_FILE"
      );
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

    return sendSuccess(res, 201, "File created successfully", newFile);
  } catch (error) {
    return sendError(res, 500, "An error occurred while creating the new file", "CREATE_FILE_FAILED");
  }
};

export const saveCode = async (req, res) => {
  const { fileId, content } = req.body;
  try {
    const f = await file.findById(fileId);
    if (!f) {
      return sendError(res, 404, "File not found", "FILE_NOT_FOUND");
    }

    f.content = content;
    await f.save();

    return sendSuccess(res, 200, "File code saved");
  } catch (error) {
    return sendError(res, 500, "An error occured while saving the code", "SAVE_CODE_FAILED");
  }
};

export const getAllUsers = async (req, res) => {
  const userId = req.user.id;
  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return sendError(res, 404, "User not found", "USER_NOT_FOUND");
    }
    const allUser = await user
      .find({ _id: { $nin: userId } })
      .select("username email");
    return sendSuccess(res, 200, "Users fetched successfully", allUser);
  } catch (error) {
    return sendError(res, 500, "An error occurred while getting users", "FETCH_USERS_FAILED");
  }
};

export const sendInvite = async (req, res) => {
  const userId = req.user.id;
  const { projectId, receiverEmail } = req.body;

  try {
    if (!projectId || !receiverEmail) {
      return sendError(res, 400, "Project ID and receiver email are required", "VALIDATION_ERROR");
    }

    const senderUser = await user.findById(userId);
    const receiverUser = await user.findOne({ email: receiverEmail });

    if (!senderUser || !receiverUser) {
      return sendError(res, 400, "Sender or receiver user not found", "USER_NOT_FOUND");
    }

    const proj = await project.findById(projectId);
    if (!proj) {
      return sendError(res, 404, "Project not found", "PROJECT_NOT_FOUND");
    }

    if (proj.lead.toString() !== userId) {
      return sendError(res, 403, "Only the project lead can send invites", "FORBIDDEN");
    }

    const newInvite = await invite.create({
      projectId,
      from: userId,
      to: receiverUser._id,
      status: "pending",
    });

    receiverUser.invites.push(newInvite._id);
    await receiverUser.save();

    return sendSuccess(res, 200, "Invite sent successfully");
  } catch (error) {
    return sendError(res, 500, "An error occurred while sending invite", "SEND_INVITE_FAILED");
  }
};

export const getInvites = async (req, res) => {
  const userId = req.user.id;
  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return sendError(res, 404, "User not found", "USER_NOT_FOUND");
    }

    const inv = await invite
      .find({ to: userId })
      .populate("projectId", "title description")
      .populate("from", "username email");
    return sendSuccess(res, 200, "Invites fetched", inv);
  } catch (error) {
    return sendError(res, 500, "An error occured while getting invites on dashboard", "FETCH_INVITES_FAILED");
  }
};

export const respondInvite = async (req, res) => {
  const userId = req.user.id;
  const { inviteId, action } = req.body;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return sendError(res, 404, "User not found", "USER_NOT_FOUND");
    }
    const inv = await invite.findById(inviteId);
    if (!inv) {
      return sendError(res, 404, "Invite not found", "INVITE_NOT_FOUND");
    }

    const proj = await project.findById(inv.projectId);
    if (!proj) {
      return sendError(res, 404, "Project not found", "PROJECT_NOT_FOUND");
    }

    switch (action) {
      case "accept":
        const alreadyMember = proj.members.some(
          (member) => member.userId.toString() === userId
        );
        if (!alreadyMember) {
          proj.members.push({ userId: userId, role: "developer" });
          await proj.save();
        }
        inv.status = "accepted";
        await inv.save();
        break;

      case "decline":
        inv.status = "declined";
        await inv.save();
        break;
      default:
        return sendError(res, 400, "Invalid action", "INVALID_ACTION");
    }

    return sendSuccess(res, 200, "Invite status updated");
  } catch (error) {
    return sendError(res, 500, "An error occured while updating the status of invite", "UPDATE_INVITE_FAILED");
  }
};

export const deleteProjectById = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return sendError(res, 404, "User not found", "USER_NOT_FOUND");
    }

    const proj = await project.findById(projectId);
    if (!proj) {
      return sendError(res, 404, "Project not found", "PROJECT_NOT_FOUND");
    }

    if (proj.lead.toString() !== userId) {
      return sendError(res, 403, "Only the project lead can delete the project", "FORBIDDEN");
    }

    await project.findByIdAndDelete(projectId);

    existingUser.projects = existingUser.projects.filter(
      (p) => p.toString() !== projectId
    );
    await existingUser.save();

    return sendSuccess(res, 200, "Project deleted successfully");
  } catch (error) {
    return sendError(res, 500, "Server error while deleting project", "DELETE_PROJECT_FAILED");
  }
};

export const assignTask = async (req, res) => {
  const { title, description, assignedTo, dueDate, priority, projectId } =
    req.body;
  const userId = req.user.id;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) return sendError(res, 404, "User not found", "USER_NOT_FOUND");

    const existingProject = await project.findById(projectId);
    if (!existingProject) return sendError(res, 404, "Project not found", "PROJECT_NOT_FOUND");

    const lead = existingProject.members.find(
      (memb) => memb.role === "Project lead"
    );

    if (existingUser._id.toString() !== lead.userId.toString()) {
      return sendError(res, 403, "Only project lead can assign tasks", "FORBIDDEN");
    }

    const assignedUser = await user.findById(assignedTo);
    if (!assignedUser) return sendError(res, 404, "Assigned user not found", "ASSIGNED_USER_NOT_FOUND");

    const newTask = await task.create({
      projectId,
      title,
      description,
      assignedTo,
      dueDate,
      priority,
    });

    existingProject.tasks.push(newTask._id);
    await existingProject.save();

    return sendSuccess(res, 200, "Task assigned successfully");
  } catch (error) {
    return sendError(res, 500, "An error occurred while assigning the task", "ASSIGN_TASK_FAILED");
  }
};

export const getUserTasks = async (req, res) => {
  const userId = req.user.id;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return sendError(res, 404, "User not found", "USER_NOT_FOUND");
    }

    const tasks = await task.find({ assignedTo: userId }).populate({
      path: "projectId",
      select: "title lead",
      populate: {
        path: "lead",
        select: "username email",
      },
    });
    return sendSuccess(res, 200, "Tasks fetched successfully", tasks);
  } catch (error) {
    return sendError(res, 500, "An error occurred while getting user tasks", "FETCH_TASKS_FAILED");
  }
};

const updateProjectProgress = async (projectId) => {
  const proj = await project.findById(projectId).populate("tasks");
  if (!proj) return;

  const total = proj.tasks.length;
  if (total === 0) {
    proj.progress = 0;
  } else {
    const completed = proj.tasks.filter((t) => t.status === "Completed").length;
    proj.progress = Math.round((completed / total) * 100);
  }

  await proj.save();
};

export const updateTaskStatus = async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  if (!["Pending", "In Progress", "Completed"].includes(status)) {
    return sendError(res, 400, "Invalid status", "INVALID_STATUS");
  }

  try {
    const updatedTask = await task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) return sendError(res, 404, "Task not found", "TASK_NOT_FOUND");

    await updateProjectProgress(updatedTask.projectId);

    return sendSuccess(res, 200, "Status updated", { task: updatedTask });
  } catch (error) {
    return sendError(res, 500, "Failed to update task status", "UPDATE_TASK_STATUS_FAILED");
  }
};

export const getMessages = async (req, res) => {
  const { projectId } = req.query;

  if (!projectId) {
    return sendError(res, 400, "Project ID is required", "VALIDATION_ERROR");
  }

  try {
    const existingProject = await project.findById(projectId);
    if (!existingProject) {
      return sendError(res, 404, "Project not found", "PROJECT_NOT_FOUND");
    }

    const allMessages = await message
      .find({ projectId })
      .populate("sender", "username");

    return sendSuccess(res, 200, "Messages fetched successfully", allMessages);
  } catch (error) {
    return sendError(res, 500, "An error occurred while retrieving the previous messages", "FETCH_MESSAGES_FAILED");
  }
};

export const executeCode = async (req, res) => {
  const { language, sourceCode, stdin } = req.body;

  if (!language || !sourceCode) {
    return sendError(res, 400, "Language and source code are required", "VALIDATION_ERROR");
  }

  const getJudge0LanguageId = (lang) => {
    switch (lang.toLowerCase()) {
      case 'javascript': return 93;
      case 'python': return 92;
      case 'cpp': return 54;
      case 'java': return 91;
      default: return null;
    }
  };

  const languageId = getJudge0LanguageId(language);
  if (!languageId) {
    return sendError(res, 400, `Unsupported language: ${language}`, "UNSUPPORTED_LANGUAGE");
  }

  try {
    const JUDGE0_URL = process.env.JUDGE0_URL || "https://judge0-ce.p.rapidapi.com";
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";
    const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || "judge0-ce.p.rapidapi.com";

    if (!RAPIDAPI_KEY) {
      return sendError(res, 401, "Missing RAPIDAPI_KEY in backend .env file. Judge0 requires a free API key from RapidAPI.", "MISSING_API_KEY");
    }

    const headers = {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": RAPIDAPI_HOST
    };

    // Since users may not have a RapidAPI key configured in env, 
    // we'll try to execute via RapidAPI if key exists, else fallback to a public instance or mock.
    // Assuming the user has configured this properly or will do so.
    
    const response = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        language_id: languageId,
        source_code: sourceCode,
        stdin: stdin || ""
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Judge0 API Error:", errorText);
      return sendError(res, response.status, "Execution failed", "JUDGE0_ERROR");
    }

    const data = await response.json();
    return sendSuccess(res, 200, "Code executed successfully", {
      stdout: data.stdout,
      stderr: data.stderr,
      compile_output: data.compile_output,
      time: data.time,
      memory: data.memory,
      status: data.status
    });
  } catch (error) {
    console.error("Execution error:", error);
    return sendError(res, 500, "Server error during execution", "EXECUTION_FAILED");
  }
};
