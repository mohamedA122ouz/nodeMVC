import { Router } from "express";
const router = Router();
//dataRouter
router.get("/",(req,res)=>{
    res.send("<p>Hello</p>");
});
export default router;