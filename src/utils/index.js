export const generateRandomNumber = (start, end) => {
  return Math.floor(start + Math.random() * end);
};

export const getDiffDays = (from, to) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((from - to) / oneDay));
};

export const getFakeDate = size =>
  new Array(size).fill(1).map(() => ({ value: generateRandomNumber(10, 30) }));

const foo = [];

export default foo;
