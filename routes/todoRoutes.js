import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

/* TEST ROUTE */
router.get("/test", (req, res) => {
  res.json({ ok: true });
});

/* GET TODOS */
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error("GET TODOS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* CREATE TODO */
router.post("/", async (req, res) => {
  try {
    console.log("BODY RECEIVED 👉", req.body);

    const { task, deadline, priority } = req.body;

    if (!task || task.trim() === "") {
      return res.status(400).json({ message: "Task is required" });
    }

    const todo = await Todo.create({
      task,
      deadline,
      priority
    });

    res.status(201).json(todo);
  } catch (err) {
    console.error("CREATE TODO ERROR ❌", err);
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE TODO */
router.put("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(todo);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* DELETE TODO */
router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
