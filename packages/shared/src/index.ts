export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};
