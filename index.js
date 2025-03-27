const {faker, ur} = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "/views"));

const connection =  mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta",
  password :"mysql",
});

// connection.connect(function(err){
//   if(err) throw err;
//   console.log("Connected!");
// });


//INSERTING NEW DATA  
let  q = "INSERT INTO user(id ,username , email , password ) VALUES ?";
// let users = [
//   ["123b" , "123_newuserb" , "abc@gmail.comb" , "abcb"],
//   ["123c" , "123_newuserc" , "abc@gmail.comc" , "abcc"]
// ];

// let data = []; 
// for(let i = 1 ; i<=100 ; i++){
//   console.log(getRandomUser());
// }


let getRandomUser = () => {

  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];  
};

// try{
//     connection.query(q , [data] ,(err,result) =>{
//       if(err) throw err;
//       console.log(result)
//     });
// }catch(err){
//   console.log(err);
// }




//Home Route
app.get("/" , (req ,res) =>{
  let q =  `SELECT count(*) FROM user`;
  try{
    connection.query(q ,(err,result) =>{
      if(err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs" , {count});
    });
  }catch(err){
    console.log(err);
    res.send("Some error is Database");
  }
});

//Show Route

app.get("/user" , (req , res) =>{
  let q  = `SELECT * FROM user`;
  try{
    connection.query(q ,(err,users) =>{
      if(err) throw err;
      // console.log(result);
      // res.send(result);
      res.render("show_user.ejs" , {users});
    });
  }catch(err){
    console.log(err);
    res.send("Some error is Database");
  }

})

//EDIT ROUTE

app.get("/user/:id/edit" , (req ,res) =>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q ,(err,result) =>{
      if(err) throw err;
      let user =  result[0];
      console.log(result);
      res.render("edit.ejs" ,{user} );
    });
  }catch(err){
    console.log(err);
    res.send("Some error is Database");
  }
  
});

//Update (DB) Route
app.patch("/user/:id" , (req , res) =>{
  let {id} = req.params;
  let {password: formPass , username: newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id=${parseInt(id)}`;

  try{
    connection.query(q ,(err,result) =>{
      if(err) throw err;
      let user =  result[0];
      // // console.log(user);
      if (formPass != user.password) {
        return res.send("Wrong Password!");
      }else{
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2 , (err ,result) =>{
          if(err) throw err;
          res.redirect("/user");
        })
      }    
      // res.send(user);
    });
  }catch(err){
    console.log(err);
    res.send("Some error is Database");
  }
  
})


app.listen("8080" , () =>{
  console.log("server is listing at port");
})