import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  from: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  sentAt: {
    type: Date,
    default: Date.now, 
  },
}, { timestamps: true });

export default mongoose.model("Invite", inviteSchema);
