import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  filename: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
    default: "",
  },
  language: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("File", fileSchema);
