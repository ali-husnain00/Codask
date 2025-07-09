import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import message from "../models/message.js";
import user from "../models/user.js";
import project from "../models/project.js";
import file from "../models/file.js";
import invite from "../models/invite.js";
import task from "../models/task.js";


export const register = async (req, res) => {
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
};

export const login = async (req, res) => {
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
      secure: true,
      sameSite: "None",
    });

    res.status(200).send("Login successful!");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("An error occurred during login");
  }
};

export const logout = (req, res) => {
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
      return res.status(404).send("User not found!");
    }

    res.status(200).json(existingUser);
  } catch (error) {
    console.error("Error getting logged-in user:", error.message);
    res.status(500).send("An error occurred while getting the logged-in user");
  }
};

export const getAssignedProjects = async (req, res) => {
  const userId = req.user.id;
  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).send("User not found!");
    }

    const assignedProjects = await project.find({
      "members.userId": userId,
    });

    res.status(200).send(assignedProjects);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while getting assigned projects");
  }
};

export const createProject = async (req, res) => {
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
      return res.status(404).send("Project not found!");
    }

    res.status(200).send(existingProject);
  } catch (error) {
    res.status(500).send("An error occured while getting project details");
    console.log(error);
  }
};

export const createNewFile = async (req, res) => {
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

    const isDuplicate = proj.files.some((file) => file.filename === filename);
    if (isDuplicate) {
      return res
        .status(400)
        .send("A file with the same name already exists in this project.");
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
};

export const saveCode = async (req, res) => {
  const { fileId, content } = req.body;
  try {
    const f = await file.findById(fileId);
    if (!f) {
      return res.status(404).send("File not found!");
    }

    f.content = content;
    await f.save();

    res.status(200).send("File code saved");
  } catch (error) {
    res.status(500).send("An error occured while saving the code");
  }
};

export const getAllUsers = async (req, res) => {
  const userId = req.user.id;
  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).send("User not found!");
    }
    const allUser = await user
      .find({ _id: { $nin: userId } })
      .select("username email");
    res.status(200).send(allUser);
  } catch (error) {}
};

export const sendInvite = async (req, res) => {
  const userId = req.user.id;
  const { projectId, receiverEmail } = req.body;

  try {
    if (!projectId || !receiverEmail) {
      return res
        .status(400)
        .json({ msg: "Project ID and receiver email are required!" });
    }

    const senderUser = await user.findById(userId);
    const receiverUser = await user.findOne({ email: receiverEmail });

    if (!senderUser || !receiverUser) {
      return res
        .status(400)
        .json({ msg: "Sender or receiver user not found!" });
    }

    const proj = await project.findById(projectId);
    if (!proj) {
      return res.status(404).json({ msg: "Project not found!" });
    }

    if (proj.lead.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "Only the project lead can send invites." });
    }

    const newInvite = await invite.create({
      projectId,
      from: userId,
      to: receiverUser._id,
      status: "pending",
    });

    receiverUser.invites.push(newInvite._id);
    await receiverUser.save();

    res.status(200).json({ msg: "Invite sent successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "An error occurred while sending invite" });
  }
};

export const getInvites = async (req, res) => {
  const userId = req.user.id;
  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).send("User not found!");
    }

    const inv = await invite
      .find({ to: userId })
      .populate("projectId", "title description")
      .populate("from", "username email");
    res.status(200).send(inv);
  } catch (error) {
    res.status(500).send("An error occured while getting invites on dashboard");
    console.log(error);
  }
};

export const respondInvite = async (req, res) => {
  const userId = req.user.id;
  const { inviteId, action } = req.body;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).send("User not found!");
    }
    const inv = await invite.findById(inviteId);
    if (!inv) {
      return res.status(404).send("Invite not found!");
    }

    const proj = await project.findById(inv.projectId);
    if (!proj) {
      return res.status(404).send("Project not found!");
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
        return res.status(400).send("Invalid action");
    }

    res.status(200).send("Invite status updated");
  } catch (error) {
    res
      .status(500)
      .send("An error occured while updating the status of invite");
    console.log(error);
  }
};

export const deleteProjectById = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).send("User not found!");
    }

    const proj = await project.findById(projectId);
    if (!proj) {
      return res.status(404).send("Project not found!");
    }

    if (proj.lead.toString() !== userId) {
      return res
        .status(403)
        .send("Only the project lead can delete the project.");
    }

    await project.findByIdAndDelete(projectId);

    existingUser.projects = existingUser.projects.filter(
      (p) => p.toString() !== projectId
    );
    await existingUser.save();

    res.status(200).send("Project deleted successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error while deleting project");
  }
};

export const assignTask = async (req, res) => {
  const { title, description, assignedTo, dueDate, priority, projectId } =
    req.body;
  const userId = req.user.id;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) return res.status(404).json({ msg: "User not found!" });

    const existingProject = await project.findById(projectId);
    if (!existingProject)
      return res.status(404).json({ msg: "Project not found!" });

    const lead = existingProject.members.find(
      (memb) => memb.role === "Project lead"
    );

    if (existingUser._id.toString() !== lead.userId.toString()) {
      return res
        .status(403)
        .send({ msg: "Only project lead can assign tasks!" });
    }

    const assignedUser = await user.findById(assignedTo);
    if (!assignedUser)
      return res.status(404).json({ msg: "Assigned user not found!" });

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

    res.status(200).json({ msg: "Task assigned successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error occurred while assigning the task" });
  }
};

export const getUserTasks = async (req, res) => {
  const userId = req.user.id;

  try {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ msg: "User not found!" });
    }

    const tasks = await task.find({ assignedTo: userId }).populate({
      path: "projectId",
      select: "title lead",
      populate: {
        path: "lead",
        select: "username email",
      },
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error occurred while getting user tasks" });
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
    return res.status(400).json({ msg: "Invalid status" });
  }

  try {
    const updatedTask = await task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ msg: "Task not found" });

    await updateProjectProgress(updatedTask.projectId);

    res.status(200).json({ msg: "Status updated", task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to update task status" });
  }
};

export const getMessages = async (req, res) => {
  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).send("Project ID is required");
  }

  try {
    const existingProject = await project.findById(projectId);
    if (!existingProject) {
      return res.status(404).send("Project not found");
    }

    const allMessages = await message
      .find({ projectId })
      .populate("sender", "username");

    res.status(200).json(allMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res
      .status(500)
      .send("An error occurred while retrieving the previous messages");
  }
};
