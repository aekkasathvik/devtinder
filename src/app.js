const  express=require('express');
const app= express();

app.get('/' ,(req,res,next)  => {
    next();
    res.send("first route handler");
  
  },
  (req,res,next)=>{
    next();
    res.send("second route handler");},

  (req,res,next)=>{
    next();
    res.send("Third route handler");},

  (req,res,next)=>{
    res.send("fourth route handler");}

);
app.use((req,res)=>{res.send("using a middleware");});
app.listen(3000,()=>{console.log('server is running on port 3000');});