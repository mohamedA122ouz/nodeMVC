import { Router } from "express";
import { PrepareView } from "../index";
const View = PrepareView(import.meta.url);
const router = Router();
//dataRouter
router.get("/",(req,res)=>{
    res.send(View());
});
export default router;