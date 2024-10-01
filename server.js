const express = require('express')
const mongoose = require('mongoose')
const path = require('path');
const process = require('process')
const cors = require('cors');
const app = express()
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

mongoose.connect(process.env.DBURL) 
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        require:true
    },
    age: {
        type:Number,
        require:true
    },
    rollNo: {
        type:Number,
        require:true
    },
}, {strict:false});

const User = mongoose.model('Tuple', userSchema);

app.post('/api', async(req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
})

app.get('/api', async(res, req) => {
    try {
        const documents = await User.find({});
        console.log(documents)
        req.send(documents)
    }catch(err) {
        console.log(err)
    }
})

app.get('/api/delete', async(res, req) => {
    try{
        const result = await User.deleteMany({})
        req.status(200).send('Deletion Succesful')
    }catch(err) {
        req.status(500).send(err)
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log('Server running on http://localhost:3000')
})