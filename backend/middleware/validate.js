// export const validate = (schema) => (req, res, next) => {
//   try {
//     schema.parse({
//       body: req.body,
//       params: req.params,
//       query: req.query,
//     });
//     next();
//   } catch (err) {
//     return res.status(400).json({
//       message: "Validation failed",
//       errors: err.errors,
//     });
//   }
// };


export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (err) {
    if (err.errors && Array.isArray(err.errors)) {
      const formattedErrors = err.errors.map((e) => ({
        path: e.path.join("."),   // e.g. "body.price"
        message: e.message,       // e.g. "Expected number, received string"
      }));

      return res.status(400).json({
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    // fallback for unexpected errors
    return res.status(400).json({
      message: "Validation failed",
      error: err.message || "Unknown validation error",
    });
  }
};
