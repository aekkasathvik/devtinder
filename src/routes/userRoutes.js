const express=require("express");
const userRouter=express.Router();
const userAuth=require('../middlewares/userAuth');
const connectionRequest=require('../models/connectionRequest');
//get all the connection requests with status interested and allow user to accept or reject
userRouter.get('/getAllRequest',userAuth ,async (req,res)=>{
    try {
        //get the logged in user details
        const loggedInUser=req.user;
        const requests=await connectionRequest.find({toUserId:loggedInUser._id , status:"interested"});
        if(requests.length===0) {
            return res.status(404).json({
                message:"no connection requests with status interested found for user "+loggedInUser._id,
            })
        }
        return res.status(200).json({
            message:"connection requests with status interested for user "+loggedInUser._id,
            data:requests
            })
    }
    catch(err) {
        res.status(400).json({"error":err.message});
    }
    finally {
        console.log("get all connection requests route executed");
    }
})
//get all the connections
userRouter.get('/getAllConnections',userAuth , async (req,res)=>{
    try {
        const loggedInUser=req.user;
        const Request=await connectionRequest.find({$or: [{toUserId:loggedInUser._id , status:"accepted"},{fromUserId:loggedInUser._id , status:"accepted"}]}).populate('fromUserId',['firstName']);
        if(Request.length==0) {
            res.status(404).send('No connection request for User ' +loggedInUser.firstName);
        }
        return res.status(200).json({
            message:`Connection Request for User ${loggedInUser.firstName} are found`,
            data:Request
        });
    }
    catch(err) {
        res.send(err.message);
    }
    finally {
        console.log('get all connection routes executed');
    }
})
module.exports=userRouter;