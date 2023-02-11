export const tabValidate = (data) => {
  console.log('validate data', data);
  return !data.some((item) => !!item === false);
};