import { formatDateTime } from "./dateFormat";
import { parse } from "date-fns";

/**
 * Calculate course progress based on class start times
 * @param {Array} classes - Array of class objects with lecture and course information
 * @returns {Array} Array of courses with their progress
 */
export const calculateCourseProgress = (classes) => {
  // Group classes by course
  const courseMap = new Map();

  classes.forEach((classItem) => {
    const course = classItem.lecture.course;
    if (!courseMap.has(course.id)) {
      courseMap.set(course.id, {
        ...course,
        classes: [],
        completedClasses: [],
        upcomingClasses: [],
      });
    }
    const courseData = courseMap.get(course.id);
    courseData.classes.push(classItem);
  });

  // Calculate progress for each course
  const courses = Array.from(courseMap.values()).map((course) => {
    // Sort classes by time_start
    const sortedClasses = course.classes.sort(
      (a, b) =>
        parse(a.time_start, "HH:mm dd-MM-yyyy", new Date()).getTime() -
        parse(b.time_start, "HH:mm dd-MM-yyyy", new Date()).getTime()
    );

    // Get current time
    const now = new Date().getTime();

    // Separate completed and upcoming classes
    const completedClasses = sortedClasses.filter(
      (classItem) =>
        parse(classItem.time_start, "HH:mm dd-MM-yyyy", new Date()).getTime() <
        now
    );
    const upcomingClasses = sortedClasses.filter(
      (classItem) =>
        parse(classItem.time_start, "HH:mm dd-MM-yyyy", new Date()).getTime() >
        now
    );

    // Calculate progress percentage
    const progress = Math.round(
      (completedClasses.length / course.num_classes) * 100
    );

    return {
      ...course,
      progress,
      completedClasses,
      upcomingClasses,
      totalClasses: course.num_classes,
      nextClass: upcomingClasses[0] || null,
    };
  });

  return courses;
};

/**
 * Format date to local string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  return formatDateTime(dateString);
};
