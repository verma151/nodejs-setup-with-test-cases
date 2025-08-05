import express, { Router } from "express";
import products from "../routes/product"
import users from "../routes/users";

const router: Router = express.Router();

router.use("/users", users);
router.use("/products", products);


export default router;