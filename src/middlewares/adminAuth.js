const adminAuth=(req,res,next) =>{
    var token="xqyz";
    if(token==="xyz"){
        next();
    }
    else {
        res.status(401).send("unauthorized");
    }
};
module.exports={adminAuth};