const mongoose = require("mongoose");

const Courseschema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, unique: false },
    description: { type: String, required: true, },
    featureImage: { type: String, required: true, },
    lessons: [{
      title: {type: String, required: true},
      description: {type: String, required: true},
      videoLink: {type: String, required: true},
    }],
    duration: { type: String },
    price: { type: Number, required: true },
  },
  { timestamp: true }
);

module.exports = mongoose.model("courses", Courseschema);