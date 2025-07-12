import express from "express";
import { assignTask, createNewFile, createProject, deleteProjectById, getAllUsers, getAssignedProjects, getInvites, getLoggedInUser, getMessages, getProjectById, getUserTasks, login, logout, register, respondInvite, saveCode, sendInvite, updateTaskStatus } from "../controllers/controllers.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/getLoggedInUser", verifyToken, getLoggedInUser)
router.get("/getAssignedProjects", verifyToken, getAssignedProjects)
router.post("/createProject", verifyToken, createProject)
router.get("/project/:id", verifyToken, getProjectById)
router.post("/createNewFile/:projectId", verifyToken, createNewFile)
router.post("/saveCode", verifyToken, saveCode)
router.get("/getAllUsers", verifyToken, getAllUsers)
router.post("/send-invite", verifyToken, sendInvite)
router.get("/getInvites", verifyToken, getInvites)
router.post("/respondInvite", verifyToken, respondInvite)
router.delete("/deleteProject/:id", verifyToken, deleteProjectById)
router.post("/assignTask", verifyToken, assignTask)
router.get("/getUserTasks", verifyToken, getUserTasks)
router.patch("/updateTaskStatus/:id", verifyToken, updateTaskStatus)
router.get("/getMessages", verifyToken, getMessages)

export default router