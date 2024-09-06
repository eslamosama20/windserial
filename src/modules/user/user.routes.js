import Router from "express";
import { signUp, login, logout,userWithOrders } from "./user.cntroller.js";
import { IsAuth } from "../../middleware/auth.middleware.js";
import {validation} from "../../middleware/validation.middleWare.js"
import { signUpSchema, loginSchema } from "./auth.schema.js"

const router = Router();

router.post("/signUp", validation(signUpSchema),signUp);
router.post("/login", validation(loginSchema),login);
router.post("/logout", IsAuth, logout);
router.get('/:id/orders', userWithOrders);
  

export default router;
