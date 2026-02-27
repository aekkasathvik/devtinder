const express=require("express");
const userRouter=express.Router();
const userAuth=require('../middlewares/userAuth');
const User=require('../models/users');
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

//Feed API 
userRouter.get('/feed' ,userAuth , async (req,res)=>{
    try {
        //get the users based on below conditions 
        //1 we should not get the logged in user details
        //2 we should not get the users who are connected to the logged in user
        //3 we should not get the users who have sent connection request to the logged in user with status interested
        const loggedInUser=req.user;
        console.log(loggedInUser);
        const connections =await connectionRequest.find({$or:[{fromUserId:loggedInUser._id },{toUserId:loggedInUser._id}]});
        //loop through all the connections and store the user ids in a set
        const hideUsers=new Set();
        connections.forEach(connection=>{
           if(connection.fromUserId.toString() === loggedInUser._id.toString()) {
               hideUsers.add(connection.toUserId.toString());
           }
           else {
               hideUsers.add(connection.fromUserId.toString());
           }
        })
        //add the logged in User id to the set so that we do not ge the logged in user details in to the feed 
        hideUsers.add(loggedInUser._id.toString());
        //we got all the users we do not want in the feed now we will get all the users and filter out the users we do not want in the feed
        console.log(hideUsers);
        //pagination cooncept where we get the page number and limit from the query params and skip the records based on the page number and limit
        const page=parseInt(req.params.page || 1);
        const limit=parseInt(req.params.limit || 10);
        const skip=(page-1)*limit;
        const data =await User.find({_id:{$nin:Array.from(hideUsers)}}).skip(skip).limit(limit);
        res.json({
            message:"Feed for user "+loggedInUser.firstName,
            data:data
        });
        console.log(data);
    }
    catch(err) {
        res.status(400).json({"error":err.message});
    }
    finally {
        console.log('Feed API executed');
    }
});
module.exports=userRouter;