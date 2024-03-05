const express = require("express");
const router = express.Router();
const User = require("../model/user");


router.get("/", async (req, res) => {
    const users = await User.find({});
    res.json({
        "data": users
    })
});



router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(422).json({
                "message": "blank field"
            });
        }
    
        const existingUser = await User.findOne({
            email
        });
    
        if (existingUser) {
            return res.status(400).json({
                "message": "email already exists"
            });
        }
    
        const userInstance = new User({
            name: name, email: email, password: password
        });
        const user = await userInstance.save();
        res.json({ data: user })
    }
    catch (err) { 
        return res.status(500).json({
            "title": "internal server error",
            "message": err
        });
    }

})
module.exports = router;