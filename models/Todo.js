import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true
    },
    deadline: {
      type: Date
    },
    priority: {
      type: String,
      default: "medium"
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
