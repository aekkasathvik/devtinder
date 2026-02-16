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
//get all the request associated with this user
requestRouter.get('/getRequest',userAuth , async (req,res)=>{

    try{
        //details of the logged in user
        const loggedInUser=req.user;
        const requests=await connectionRequest.find({toUserId:loggedInUser._id});
        if(requests.length===0){
            return res.status(404).json({
                message:"no connection requests found for user "+loggedInUser._id,
            })
        }
        res.status(200).json({
            message:"connection requests for user "+loggedInUser._id,
            data:requests
        })
    }
    catch(err){

    }
    finally{
        console.log("get connection request route executed");
    }
});
//handling the user response to a connection request
requestRouter.post('/review/:status/:requestId',userAuth ,async (req,res)=>{
    //details of the logged in user
    
    try {
      const loggedInUser=req.user;
      const status=req.params.status;
      const requestId=req.params.requestId;
      const AllowedStatus=["rejected","accepted"];
    if(!AllowedStatus.includes(status)) {
        return res.status(400).send(`status ${status} is not allowed`);
    }
    //get the connection request from the database
   const connectionReq = await connectionRequest.findOne({
         _id: requestId,
          toUserId: loggedInUser._id,
          status: "interested"
    });

    if(!connectionReq) {
        return res.status(404).json({
            message:"connection request not found",
        })
    }
    if(!connectionReq.toUserId.equals(loggedInUser._id)) {
        return res.status(400).json({
            message:"you are not authorized to review this request",
        })
    }
    connectionReq.status=status;
    const data=await connectionReq.save();
    res.json({
        message:`request ${requestId} has been ${status} by user ${loggedInUser._id}`,
        data:data
    })
    }
    catch(err) {
        res.status(400).json({"error" : err.message});
    }
    finally {
        console.log("review connection request route executed");
    }
})
module.exports=requestRouter;