import {Router} from "express"
import {createNewToken,makeFriend} from "../controllers/friends.js"
export const router = Router();


router.get('/home',(req,res)=>{res.render("index")});
router.get('/admin',(req,res)=>{});

router.post('/token',createNewToken);
router.post('/friend',makeFriend);


