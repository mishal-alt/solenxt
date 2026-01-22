import express from "express";
import { loginUser, refreshAccessToken } from "../controllers/authcontroller.js";
import validate from "../middleware/validate.js";
import { loginSchema } from "../validation/authValidation.js";

const router = express.Router();

router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh", refreshAccessToken);


export default router;
