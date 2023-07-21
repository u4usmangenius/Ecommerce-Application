const express = require("express");
const app = express();
const cors = require("cors");
require("./db/config");

// const User = require("./db/User");
const con = require("./mysql_configs");

const Product = require("./db/products");
const port = 1000;
const Jwt = require("jsonwebtoken");
const jwtKey = "e-comm";

app.use(cors());
app.use(express.json());
app.post("/login", (req, res) => {
  const data = [req.body.email, req.body.password];
  con.query(
    "select * from users where email=? and password=?",
    data,
    (err, result) => {
      if (result) {
        let objarray = JSON.stringify(result);
        res.status(200).send(result);
    } else if(result.length===0){
      console.log('usmanaaan')
      res.send('not found')
    }else {
        res.status(401).send({ result: "No Result Found" });
        console.log(err);
        res.status(404).send(err);
      }
    }
  );
  // console.log(req.body.email,req.body.password)
  // if(req.body.email && req.body.password){
  // const sql = "select * from users where email=? and password=?";
  //   con.query(sql,[req.body.email,req.body.password],(err,result)=>{
  //     if(err){
  //       console.log(err)
  //     }else{
  //       if(result.length===1){
  //         res.status(200).send({exists:true})
  //       }else{
  //         res.status(401).send({exists:false})
  //       }
  //     }
  //   })
  // }
});
// Users Login/singup
// here removed verifyToken because when we login we store logined user info in localstorage but for the first time
// when he try to login then user has nothing in its localstorage so how we will be verify it, or we need to take token
// from user manually using input like email and password
app.post("/register", async (req, res) => {
  const sql = "select * from users where email=?";
  const email = req.body.email;
  con.query(sql, [email], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        res.status(200).send({ exists: true });
      } else {
        const data = req.body;
        con.query("insert into users set ?", data, (err, result, fields) => {
          if (err) {
            res.status(404).send(err);
          } else {
            res.status(200).send(result);
          }
        });
      }
    }
  });
  // here remove middleware
  // const checkLogin = (email, password) => {
  //   const sql = "select * from users where email=? and password=?";
  //   // const email = req.body.email;
  //   // const password = req.body.password;
  //   con.query(sql,[email,password], (err, rows) => {
  //     if (rows.length === 1 ) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  // };
  // app.post("/login", async (req, res) => {
  //   const email = req.body.email;
  //   const password = req.body.password;

  //   console.log('usman',email,password)
  //   const isLoginSuccessful = await checkLogin(email, password);
  //   if (isLoginSuccessful) {
  //     res.status(200).send("exists");
  //   } else {
  //     res.status(401).send("does not exists");
  //   }
  // });

  // Products
  app.post("/add-product", verifyToken, async (req, res) => {
    //   let product = new Product(req.body);
    //   let result = await product.save();
    //   res.status(200).send(result);
  });
});
// enlist Products
app.get("/products", verifyToken, async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.status(200).send(products);
  } else {
    res.status(204).send({ result: "No Products Found" });
  }
});
// delete Product
app.delete("/product/:id", verifyToken, async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.status(200).send(result);
});
// Update Product ,First Get it
app.get("/product/:id", verifyToken, async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(204).send({ result: "No Record Found" });
  }
});
// Now update it

app.put("/product/:id", verifyToken, async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );

  res.status(200).send(result);
});
// Search for product any field
app.get("/search/:key", verifyToken, async (req, res) => {
  let result = await Product.find({
    // for searching in more than one field we use or in regex
    $or: [
      { name: { $regex: req.params.key } },
      { price: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
    ],
  });
  res.status(200).send(result);
});
// Verify Token
function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    // the space is must in split(' ') in this brackets, one other thing use bearer always and change your token regularly
    token = token.split(" ")[1];
    // console.log(token);
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "Please Provide Valid Token" });
      } else {
        next();
        console.log(token);
      }
    });
  } else {
    res.status(403).send({ result: "Please add token with header" });
  }
}

app.listen(port, () => {
  console.log(`Backend Running at htttp://localhost:${port}`);
});
// sds
