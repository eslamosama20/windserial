import Router from "express";
import { signUp, login, logout,userWithOrders } from "./user.cntroller.js";
import { IsAuth } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/logout", IsAuth, logout);
router.get('/:id/orders', userWithOrders);
  

export default router;
