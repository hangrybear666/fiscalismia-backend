export const replaceCommaAndParseFloat = (input: string) => {
  return parseFloat(input.replace(',', '.').replace(/[^\d.]/g, ''))
}