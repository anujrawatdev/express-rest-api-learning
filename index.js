const express = require('express');
const {connectMongoDb} = require('./connection');


const app = express();
const PORT = 8000;

const userRouter = require('./routes/user');
const { logReqRes } = require("./middleware");
//connection 
connectMongoDb("mongodb://127.0.0.1:27017/Local-app-1").then(()=>console.log('MongoDB connected'));



//Middleware - plugin
app.use(express.urlencoded({ extended : false}));
app.use(express.json({ extended : false}));


app.use(logReqRes('.log.txt'));

//routes  
app.use('/api/users',userRouter);

app.listen(PORT,()=> console.log(`server started at PORT:${PORT}`))
