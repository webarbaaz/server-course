const express = require("express");
const {
  getCourses,
  postCourse,
  deleteCourse,
  patchCourse,
  getCoursesById,
  getCourseById,
} = require("../controller/coursesController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const router = express.Router();

router.get("/", getCourses);
router.get("/:userId", authMiddleware, getCoursesById);
router.get("/course/:courseId", authMiddleware, getCourseById);
router.post("/", authMiddleware, upload.single("image"), postCourse);
router.delete("/:courseId", authMiddleware, deleteCourse);
router.patch("/:courseId", authMiddleware, patchCourse);

module.exports = router;
