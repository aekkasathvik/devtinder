const adminAuth=(req,res,next) =>{
    const token="xyz";
    if(token==="xyz"){
        next();
    }
    else {
        res.status(401).send("unauthorized");
    }
};
module.exports=adminAuth;