const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: { type: String, require: true },
    email: {
      type: String,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      require: true,
    },
    password: { type: String, require: true },
    role: { type: String, require: true, default: 'student', enum: ["student", "teacher"], },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
