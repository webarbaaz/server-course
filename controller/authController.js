const asyncHandler = require("express-async-handler");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;
  
  // Check if required fields are provided
  if (!username || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields." });
  }

  // Check if a user with the provided email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User with this email already exists." });
  }

  // Generate salt and hash the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Create a new user with hashed password
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });
  // If user creation is successful, generate JWT token
  if (newUser) {
    const token = jwt.sign({ id: newUser._id, }, process.env.JWT_SECRET, {
      expiresIn: "12h", // Token expiration time in seconds (e.g., 1 hour)
    });

    // If token is generated successfully, send the response
    if (token) {
      return res.status(201).json({
        token,
        user: {
          id: newUser._id,
          username,
          email: newUser.email,
          role,
        },
        message: "Successfully Register",
      });
    }
  }

  // If something goes wrong, send a generic error response
  return res
    .status(500)
    .json({ message: "Internal server error. Please try again later." });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password." });
  }

  // Check if a user with the provided email exists
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .json({ message: "User not found." });
  }

  // Verify the password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res
      .status(401)
      .json({ message: "Invalid credentials. Password does not match." });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id, role:user.role }, process.env.JWT_SECRET, {
    expiresIn: "72h", // Token expiration time (e.g., 1 hour)
  });

  // Respond with token and user information
  if (token) {
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role:user.role,
      },
      message: "Successfully Login",
    });
  }

  return res
    .status(500)
    .json({ message: "Internal server error. Please try again later." });
});

module.exports = { register, login };
