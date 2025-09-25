import { formatDistanceToNow, parseISO, isToday, isYesterday } from 'date-fns';

export const formatDate = (dateString) => {
    console.log('Date string received for formatting:', dateString);

  try {
    // Parse the ISO date string to a Date object
    const date = parseISO(dateString);

    if (isToday(date)) {
      return 'Today';
    }

    if (isYesterday(date)) {
      return 'Yesterday';
    }

    // Use formatDistanceToNow for other dates
    return formatDistanceToNow(date, { addSuffix: true });

  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;  // Fallback to raw date string if parsing fails
  }
};
