const express=require('express');
const requestRouter=express.Router();
const userAuth=require('../middlewares/userAuth');    
const connectionRequest=require('../models/connectionRequest');
//route to send connection request
requestRouter.post('/send/:status/:toUserId',userAuth ,async (req,res)=> {
    try {
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        const AllowedStatus=["ignored","interested"];
        //check if status is allowed
        if(!AllowedStatus.includes(status)) {
            return res.status(400).send(`status ${status} is not allowed`);
        }
        //check if there is a existing request between the two users
        const existingRequest=await connectionRequest.findOne({
            $or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}]
        })
        if(existingRequest)  {
            return res.status(400).send("connection request already exists between the two users");
        }
        const newRequest=new connectionRequest({fromUserId , toUserId , status});
        const data=await newRequest.save();
        res.json({
            message:req.user.firstName+" sent a "+status+"request to user"+toUserId,
            data:data
        })
    }
    catch(err) {
        res.status(400).send("error in sending connection request"+err.message);   
    }
    finally {
        console.log("send connection request route executed");
    }
})
requestRouter.get('/requests',userAuth , async (req,res)=>{});       
module.exports=requestRouter;