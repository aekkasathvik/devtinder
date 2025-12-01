const  express=require('express');
const app= express();
app.get('/new',(req,res)=>{
    res.send('response from express server');
});
app.use((req,res)=>{res.send("useing a middleware");});
app.listen(3000,()=>{console.log('server is running on port 3000');});