import { format } from "date-fns";

/**
 * Format date to Vietnamese locale format (DD/MM/YYYY)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return "";
  return format(new Date(date), "dd/MM/yyyy");
};

/**
 * Format time to 24-hour format (HH:mm)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatTime = (timeString) => {
  if (!timeString) return "";
  // Handle format "HH:mm DD/MM/YYYY"
  const [time] = timeString.split(" ");
  return time;
};

/**
 * Format date and time to Vietnamese locale format (HH:mm DD/MM/YYYY)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return "";

  if (date instanceof Date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }

  // Handle string format "HH:mm DD/MM/YYYY"
  if (typeof date === "string") {
    const [time, dateStr] = date.split(" ");
    if (!dateStr) return date;
    const [day, month, year] = dateStr.split("/");
    return `${time} ${day}/${month}/${year}`;
  }

  return "";
};

/**
 * Format date to input date format (YYYY-MM-DD)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string for input fields
 */
export const formatDateForInput = (date) => {
  if (!date) return "";
  return format(new Date(date), "yyyy-MM-dd");
};
