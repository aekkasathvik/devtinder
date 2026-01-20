const mongoose=require('mongoose');
const connectionRequestSchema=new mongoose.Schema({
    //id of the user who sent the request
    fromUserId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    //id of the user who received the request
    toUserId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    //status of the request: pending, accepted, rejected
    status:{type:String,
        enum:{value:["ignored","accepted","rejected","interested"],message:`{VALUE} is not supported`},default:'pending' ,required:true }
},{timestamps:true});
const connectionRequestModel=mongoose.model('connectionRequest',connectionRequestSchema);
module.exports=connectionRequestModel;