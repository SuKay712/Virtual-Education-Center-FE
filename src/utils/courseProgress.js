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
      (a, b) => new Date(a.time_start) - new Date(b.time_start)
    );

    // Get current time
    const now = new Date();

    // Separate completed and upcoming classes
    const completedClasses = sortedClasses.filter(
      (classItem) => new Date(classItem.time_start) < now
    );
    const upcomingClasses = sortedClasses.filter(
      (classItem) => new Date(classItem.time_start) > now
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
  return new Date(dateString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
