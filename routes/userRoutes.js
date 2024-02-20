const express = require("express");
const { getUser, patchUser } = require("../controller/userController");

const router = express.Router();

router.route("/:userId").get(getUser).patch(patchUser);

module.exports = router;
