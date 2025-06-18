import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  language: {
    type: String,
    default: "js",
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isSolo: {
    type: Boolean,
    default: false,
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        trim: true,
      },
    }
  ],
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    }
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    }
  ],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  roomId: {
    type: String,
    unique: true, 
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
