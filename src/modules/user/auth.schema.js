import joi from "joi"
// validation
export const signUpSchema = joi
.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
  name: joi.string().required().min(4).max(20),
})
.required();

// validation
export const loginSchema = joi
.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
})
.required();

