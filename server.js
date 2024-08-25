const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3001;

//Används cors-middleware
app.use(cors());
//Använd express
app.use(express.json());

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log('Response Headers:', res.getHeaders());
    });
    next();
});


//connect to mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/cv').then(()=>{
    console.log('connected to mongodb');
}).catch((error)=>{
    console.log('couldnt connect to db' + error);
})

app.get('/cv', async(req, res)=>{
    res.json({message: 'welcome to my API!'});
})

//ccreate schema
const JobScheme = mongoose.Schema({
    companyname: {
        type: String,
        required: true,
    },
    jobtitle: {
        type: String,
        required: true
    },
    startdate: {
        type: String,
        required: false
    },
    enddate: {
        type: String,
        required: false
    }
   });

//create model
const Job = mongoose.model('Job', JobScheme);

//get all jobs
app.get('/jobs', async(req, res)=>{
    try{
        let result = await Job.find({});

        return res.json(result);
    }catch(error){
        return res.status(500).json(error);
    }
})

app.post('/jobs', async(req, res)=>{
    try{
        let result = await Job.create(req.body);

       return res.json(result);
    }catch(error){
        return res.status(400).json(error);
    }
});
//delete jobs with id
app.delete('/jobs/:id', async(req, res)=>{
    let id = req.params.id;
    const result = await Job.deleteOne({_id: id});
    return res.json(result);
})
//update document with id
app.put('/jobs/:id', async(req, res)=>{
    const { id } = req.params;
    const { companyname, jobtitle, startdate, enddate } = req.body;

    try{
        const updatedJob = await Job.findByIdAndUpdate(id, {companyname, jobtitle, startdate, enddate}, {new:true});
        return res.json(updatedJob);
    }catch(error){
       return res.status(500).json(error);
    }

   
})

app.listen(port, ()=>{
    console.log('server is running on port: '+ port);
})