
import express from 'express';
import cors from 'cors';
const app = express();

const corsOptions = {
    origin: ['http://127.0.0.1:5500'],
    optionsSuccessStatus: 200,
    credentials: true,
}

app.use(express.json());
app.use(cors(corsOptions));

// post에서는 클라이언트에게 뭘 보내야되는게 아닌건가?
// get은? 클라이언트에게 json 보내보기
app.post('/message',(req,res,next)=>{
    console.log(req.body);
    // res.write(req.body);
    res.send(req.body);
    // res.send("req.body");
})

app.get('/test',(req,res,next)=>{
    res.send('ABC');
})

app.use((err,req,res,next)=>{
    console.log(err);
    res.send('Sorry ..');
})

app.listen(8080);
