const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

/* -------------------- MongoDB Connection -------------------- */

mongoose.connect(
"mongodb+srv://priteshvbachhavcg_db_user:PRITESH69@cluster0.t3hmcch.mongodb.net/mydatabase?retryWrites=true&w=majority"
)
.then(()=> console.log("MongoDB connected successfully"))
.catch((error)=> console.log("MongoDB connection failed :", error));


/* -------------------- User Schema -------------------- */

const userSchema = new mongoose.Schema(
{
    name: {
        type:String,
        minlength:2,
        required:true
    },
    email: {
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
        minlength:6
    }
},
{
    versionKey: false,
    timestamps: true
}
);

const User = mongoose.model("User", userSchema);


/* -------------------- Routes -------------------- */

app.get("/", (req,res)=>{
    res.send("Express server is running on port 3000");
});


/* Get all users */

app.get("/users", async (req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
});


/* Get user by ID */

app.get("/users/:id", async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
});


/* Add single user */

app.post("/users", async (req,res)=>{
    try{
        const user = new User(req.body);
        await user.save();

        res.status(201).json({
            message:"User added successfully",
            user
        });
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
});


/* Add multiple users */

app.post("/users/bulk", async (req,res)=>{
    try{
        const users = await User.insertMany(req.body);

        res.status(201).json({
            message:"Users added successfully",
            users
        });
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
});


/* Update user */

app.put("/users/:id", async (req,res)=>{
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true }
        );

        res.status(200).json({
            message:"User updated successfully",
            updatedUser
        });
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
});


/* Delete user */

app.delete("/users/:id", async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message:"User deleted successfully"
        });
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
});


/* -------------------- Server -------------------- */

app.listen(3000, ()=>{
    console.log("Server started on port 3000");
});