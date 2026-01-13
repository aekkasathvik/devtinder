const express=require('express');
const requestRouter=express.Router();
const userAuth=require('../middlewares/userAuth');    
requestRouter.get('/requests',userAuth , async (req,res)=>{});       
module.exports=requestRouter;