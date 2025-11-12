export const formatFileSize = (bytes: number): string => {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const formatFileSizeNumber = (bytes: number): number => {
  return parseFloat((bytes / (1024 * 1024)).toFixed(2));
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const isValidStatementPeriod = (period: string): boolean => {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return regex.test(period);
};
