 export const asyncHandler = (cntroller) => {
  return (req, res, next) => {
    cntroller(req, res, next).catch((error) => {
     next(error);
    });
  };
};
