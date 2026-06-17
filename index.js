const express = require('express');
const users = require("./MOCK_DATA.json")
const app = express();
const PORT = 8000;

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
    return res.json(users);
})


app.route('/api/users/:id').get("/api/users/:id",(req,res)=>{
    const id = Number(req.params.id) ;
    const user = users.find((user)=> user.id === id);
    return res.json(user);
}).patch((req,res)=>{
// 
return res.json({status:"pending"});


}).delete((req,res)=>{
//delete user with id
    return res.json({status:"pending"});
})





app.listen(PORT,()=> console.log(`server started at PORT:${PORT}`))
