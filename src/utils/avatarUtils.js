import { IMAGES } from "../constants/images";

/**
 * Get avatar URL with default fallback
 * @param {string} avatar - Avatar URL from user data
 * @returns {string} - Avatar URL or default avatar if not available
 */
export const getAvatarUrl = (avatar) => {
  return avatar || IMAGES.avatarDefault;
};

/**
 * Get avatar image component with default fallback
 * @param {string} avatar - Avatar URL from user data
 * @param {Object} style - Additional styles for the image
 * @param {string} className - Additional classes for the image
 * @returns {JSX.Element} - Avatar image component
 */
export const AvatarImage = ({ avatar, style = {}, className = "" }) => {
  const defaultStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  return (
    <img
      src={getAvatarUrl(avatar)}
      alt="Avatar"
      className={className}
      style={{ ...defaultStyle, ...style }}
    />
  );
};
