const mongoose=require('mongoose');
const connectionRequestSchema=new mongoose.Schema({
    //id of the user who sent the request
    fromUserId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    //id of the user who received the request
    toUserId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    //status of the request: pending, accepted, rejected
    status:{type:String,
        enum:{values:["ignored","accepted","rejected","interested"],message:`{VALUE} is not supported`},required:true }
},{timestamps:true});
connectionRequestSchema.pre("save", async function () {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("fromUserId and toUserId cannot be the same");
    }
});
//indexing on the fromUserId and toUserId to ensure uniqueness of connection requests between two users
connectionRequestSchema.index({fromUserId:1,toUserId:1},{unique:true});

const connectionRequestModel=mongoose.model('connectionRequest',connectionRequestSchema);
module.exports=connectionRequestModel;