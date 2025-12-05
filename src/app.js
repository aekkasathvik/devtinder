const  express=require('express');
const app= express();
const {adminAuth}=require('./middlewares/adminAuth');
app.use('/admin',adminAuth);
app.get('/admin/allUsers',(req,res)=>{
    res.send("List of all users");
});
app.delete('/admin/deleteUser/:id',(req,res)=>{
    const userId=req.params.id;
    res.send(`User with id ${userId} deleted`);
});
app.listen(3000,()=>{console.log('server is running on port 3000');});