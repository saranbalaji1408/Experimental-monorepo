import express from "express";
import { MessageModel } from "../models/message";

const router = express.Router();

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await MessageModel.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "An error occurred",
    });
  }
});

// Get single message
router.get("/:id", async (req, res) => {
  try {
    const message = await MessageModel.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "An error occurred",
    });
  }
});

// Create message
router.post("/", async (req, res) => {
  try {
    const newMessage = await MessageModel.create(req.body);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "An error occurred",
    });
  }
});

// Update message
router.put("/:id", async (req, res) => {
  try {
    const message = await MessageModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(message);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "An error occurred",
    });
  }
});

// Delete message
router.delete("/:id", async (req, res) => {
  try {
    const message = await MessageModel.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "An error occurred",
    });
  }
});

export default router;
