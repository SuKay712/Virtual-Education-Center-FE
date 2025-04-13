import { format } from 'date-fns';

export const TruncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }
  return <span>{`${text.slice(0, maxLength)}...`}</span>;
};

export const formatCurrency = (amount) => {
  const formattedAmount = amount.toLocaleString('vi-VN');
  return `${formattedAmount} đồng`;
};

export const darkenColor = (color, amount = 0.5) => {
  let [r, g, b] = color.match(/\w\w/g).map((x) => parseInt(x, 16));

  r = Math.max(0, r - Math.round(255 * amount));
  g = Math.max(0, g - Math.round(255 * amount));
  b = Math.max(0, b - Math.round(255 * amount));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const formatDateNormal = (isoDate) => {
  const formattedDate = format(new Date(isoDate), 'dd-MM-yyyy');
  return formattedDate;
};
