const express = require('express');
const users = require("./MOCK_DATA.json")
const app = express();
const PORT = 8000;
const fs = require('fs');

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
app.get("/users",(req,res)=>{
     const html = `
     <ul>
      ${users.map((users)=> `<li>${users.first_name}</li>`).join("")}
     </ul>
     `;
     res.send(html);
})

//Rest API
app.get("/api/users",(req,res)=>{
    console.log(req.headers);
    res.setHeader("X-myName","Anuj Rawat");
    return res.json(users);
})


app.route('/api/users/:id')

.get((req,res)=>{
    const id = Number(req.params.id) ;
    const user = users.find((user)=> user.id === id);
    return res.json(user);
})
.patch((req,res)=>{
// edit user with id
return res.json({status:"pending"});

})
.delete((req,res)=>{
//delete user with id
    return res.json({status:"pending"});
});

app.post("/api/users",(req,res)=>{
    const body = req.body;
    users.push({ ...body,id: users.length + 1});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{

         if (err) {
        console.log(err);
        return res.status(500).json({ status: "error" });
        
    }

    console.log("File Saved");

    
    return res.json({
        status:"success",
        id:users.length});
    }); 
});



app.listen(PORT,()=> console.log(`server started at PORT:${PORT}`))
