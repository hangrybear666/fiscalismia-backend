export const replaceCommaAndParseFloat = (input: string) => {
  return parseFloat(input.replace(',', '.').replace(/[^\d.]/g, ''));
};

export const getLocalTimestamp = () => {
  const now = new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Berlin' // Timezone for Germany
  });
  const date = new Date(now);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
