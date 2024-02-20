const asyncHandler = require("express-async-handler");
const User = require("../model/user");

const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(404).json({ status: false, message: "Invalid inputs" });
    return;
  }

  const user = await User.findOne({ _id: userId }).select("-password");

  if (!user) {
    res.status(404).json({ status: false, message: "No user found" });
    return;
  }

  res.status(200).json({ status: true, user });
});

const patchUser = asyncHandler(async (req, res) => {});



module.exports = {
  getUser,
  patchUser,
};
