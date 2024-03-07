const router = require("express").Router();
const mongoose = require("mongoose");
const moment = require("moment");

const { isAuthenticated } = require("../middlewares/user.middleware");
const Task = require("../model/task.model");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req._id;
    res.json({
      data: await Task.find({
        userId: userId,
      }),
    });
  } catch (err) {
    return res.status(500).json({
      title: "internal server error",
      message: err.message,
    });
  }
});

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = req._id;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "invalid task id!",
      });
    }

    const taskId = new mongoose.Types.ObjectId(req.params.id);
    const task = await Task.findOne({
      _id: taskId,
      userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found!!",
      });
    }

    res.json({
      data: task,
    });
  } catch (err) {
    return res.status(500).json({
      title: "internal server error",
      message: err.message,
    });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;

    if (!name || !description || !dueDate) {
      return res.status(422).json({
        message: "Name and Description is required!!",
      });
    }

    const newTask = new Task({
      userId: req._id,
      name,
      description,
      dueDate: moment.utc(dueDate),
    });

    const task = await newTask.save();
    res.status(201).json({
      data: task,
    });
  } catch (err) {
    return res.status(500).json({
      title: "internal server error",
      message: err.message,
    });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "invalid task id!",
      });
    }

    const userId = req._id;
    const taskId = new mongoose.Types.ObjectId(req.params.id);

    await Task.findOneAndDelete({ userId: userId, _id: taskId });
    res.status(204).end();
  } catch (err) {
    return res.status(500).json({
      title: "internal server error",
      message: err.message,
    });
  }
});

module.exports = router;
