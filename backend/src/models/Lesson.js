const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },
    contentType: {
      type: String,
      enum: ["video", "text"],
      default: "video",
    },
    videoUrl: {
      // local path for uploaded video
      type: String,
      default: "",
    },
    textContent: {
      type: String,
      default: "",
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    sequence: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
