const asyncHandler = require("express-async-handler");
const Courses = require("../model/courses");
const mongoose = require("mongoose");

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Courses.find();

  if (courses.length < 0) {
    return res.status(400).json({ message: "No Courses Found" });
  }

  res.status(200).json({ courses });
});

const getCoursesById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "User not found" });
  }
  const courses = await Courses.find({ userId });

  if (courses.length < 0) {
    return res.status(400).json({ message: "No Courses Found" });
  }

  res.status(200).json({ courses });
});

const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { courseId } = req.params;
  if (!id) {
    return res.status(400).json({ message: "User not found" });
  }
  const course = await Courses.findOne({ _id: new mongoose.Types.ObjectId(courseId) });
  
  if (course.length > 0) {
    return res.status(400).json({ success: false, message: "No Course Found" });
  }

  res.status(200).json({ success: true, course });
});

const postCourse = asyncHandler(async (req, res) => {
  const { title, description, featureImage, duration, price,lessons } = req.body;
  const { id: userId, role } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "User not found" });
  }
  if (role !== "teacher") {
    return res.status(401).json({ message: "You are not authorized" });
  }

  if (!title || !featureImage || !description || !duration || !price ) {
    return res.status(400).json({ message: "Please provide all the fields" });
  }

  if(!lessons.length > 1){
    return res.status(400).json({ message: "Please add atleat 1 lesson" });
  }

  // Create a new course instance
  const newCourse = new Courses({
    userId: new mongoose.Types.ObjectId(userId),
    title,
    description,
    featureImage,
    duration,
    price,
    lessons,
  });

  // Save the course to the database
  await newCourse.save();

  res
    .status(201)
    .json({ message: "Course added successfully", course: newCourse });
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { courseId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User not found" });
  }

  const deletedCourse = await Courses.findOneAndDelete({ _id: courseId });

  // Check if the course exists
  if (!deletedCourse) {
    return res.status(404).json({ error: "Course not found" });
  }

  return res.status(200).json({ message: "Course deleted successfully" });
});
const patchCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params; // Get the course ID from the request parameters
  const updatedCourseData = req.body;

  console.log(updatedCourseData)

  if(!updatedCourseData.lessons.length > 1){
    return res.status(400).json({ message: "Please add atleat 1 lesson" });
  }
  const updatedCourse = await Courses.findByIdAndUpdate(
    courseId,
    updatedCourseData,
    { new: true }
  );

  // Check if the course exists
  if (!updatedCourse) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Return the updated course
  return res
    .status(200)
    .json({ message: "Course updated successfully", updatedCourse });
});

module.exports = {
  getCourses,
  postCourse,
  deleteCourse,
  getCourseById,
  patchCourse,
  getCoursesById,
};
