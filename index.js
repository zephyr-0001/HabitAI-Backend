const express = require("express");
const app = express();
require('./db/index');

app.use(express.json());
app.use("/user", require("./routes/user"));

app.get("/", (req,res) => {
    res.json({
        "message": "hello bros"
    })
});

app.listen(8082, () =>{
    console.log("service running bitch")
});
