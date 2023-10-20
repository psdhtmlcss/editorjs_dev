export const tabValidate = (data) => {
  return !data.some((item) => !!item === false);
};