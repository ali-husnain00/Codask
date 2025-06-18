import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String, 
  },
  role: {
    type: String,
    enum: ["developer", "admin"],
    default: "developer",
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    }
  ],
  invites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invite",
    }
  ]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
