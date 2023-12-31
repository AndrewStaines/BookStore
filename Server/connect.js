const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Book', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => err ? console.log(err) :
    console.log('Connected to Book database'));

const UserSchema = new mongoose.Schema({
    uname:{
        type: String
    },
    name:{
        type: String
    },
    Pass:{
        type: String
    },
    email:{
        type: String
    }
});

const User= mongoose.model('Details',UserSchema);
User.createIndexes();

const express = require('express');
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());

app.get('/api/items', async (req, res) => {
    try {
        const items = await User.find();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post("/register", async (req, resp) => {
    try {
        const user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        if (result) {
            resp.send(req.body);
            console.log(result);
        }

    } catch (e) {
        console.log(e)
        resp.send("Something Went Wrong");
    }
});

app.put("/update", async (req, resp) => {
    try {
        console.log(req.body)
        let result = await User.findOneAndUpdate({ uname: req.body.uname }, { $set: {Pass: req.body.Pass} }, { new: true })
        console.log(result)
        if (result) {
            resp.send(req.body);
            console.log(result);
        }

    } catch (e) {
        console.log(e)
        resp.send("Something Went Wrong");
    }
})

app.post("/login", async (req, resp) => {
	try {
		const user = new User(req.body);

		const data= await User.findOne({ uname: user.uname})
        const data1=await User.findOne({ Pass: user.Pass })
		console.log(user)
		if (data && data1) {
			return resp.json(data)
		}
		else if(!data) {
            return resp.json('User not Found')
		}
        else{
            return resp.json('Password is Incorrect')
        }

	} catch (e) {
		resp.send("Something Went Wrong");
	}
});

app.listen(5000)