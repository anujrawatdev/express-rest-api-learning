const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const users = require("./MOCK_DATA.json")
const app = express();
const PORT = 8000;

//connection 
mongoose.connect("mongodb://127.0.0.1:27017/Local-app-1")
.then(()=> console.log("MongoDB connected"))
.catch(err=> console.log("Mongo Error",err));

//schema
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required:true,
    },
    lastName:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    jobTitle:{
        type: String,
    },
    gender:{
        type: String,
    },   
},
 {timestamps:true} 
);

const User = mongoose.model("User", userSchema);

//Middleware - plugin
app.use(express.urlencoded({ extended : false}));
app.use(express.json({ extended : false}));

app.use((req, res, next)=>{
    fs.appendFile(
        'log.txt',
        `${Date.now()}:${req.ip} : ${req.method} : ${req.path}\n`,
        (err) =>{
            if(err){
                console.log(err);
            }
            next();
        }
    );
    
})


//routes  
app.get("/users",async (req,res)=>{
    const allDBUsers = await User.find({});
     const html = `
     <ul>
      ${allDBUsers.map((user)=> `<li>${user.firstName} - ${user.email}</li>`).join("")}
     </ul>
     `;
     res.send(html);
})

//Rest API
app.get("/api/users", async (req,res)=>{
    const allDBUsers = await User.find({});

    res.setHeader("X-myName","Anuj Rawat");
    return res.json(allDBUsers);
})


app.route('/api/users/:id')

.get(async (req,res)=>{
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({error:"user not found"});
    return res.json(user);
})
.patch(async (req,res)=>{

await User.findByIdAndUpdate(req.params.id, {lastName:"Yadav"});
return res.json({status:"success"});

})
.delete(async (req,res)=>{
    await User.findByIdAndDelete(req.params.id);
      return res.json({status:"success"});
});

// app.post("/api/users",(req,res)=>{
//     const body = req.body;
//     users.push({ ...body,id: users.length + 1});
//     fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{

//          if (err) {
//         console.log(err);
//         return res.status(500).json({ status: "error" });
        
//     }

//     console.log("File Saved");

    
//     return res.json({
//         status:"success",
//         id:users.length});
//     }); 
// });

app.post("/api/users",async (req,res)=>{
    const body = req.body;
    if(
        !body || 
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    ){
        return res.status(400).json({msg:"All fields are  req..."});
    }

   const result =  await User.create({
        firstName:body.first_name,
        lastName:body.last_name,
        email:body.email,
        gender:body.gender,
        jobTitle:body.job_title,
    });

    return res.status(201).json({msg:"success"});
});


app.listen(PORT,()=> console.log(`server started at PORT:${PORT}`))
