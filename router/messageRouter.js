// 강의 보기 전 혼자 만든 것

import express from 'express';
// import message from '../message/message.json';

// id라고 데이터를 넣으면 진짜 id가 됨. {id:1,name:'bob',text:'new'}
const message = {
    1:{'name':'bob','text':'기본 메시지'},
    2:{'name':'tom','text':'기본 메시지'},
    3:{'name':'ben','text':'기본 메시지'},    
}

const route = express.Router();

// json? 파일을 어떻게 가져올건지? 모듈이 이렇게 나뉘어져있는데 app과 데이터를 어떻게 공유할건지?
// 일단 이곳에 메모리를 만듦.
route.get('/',(req,res,next)=>{
    if(req.query){
        // name이 bob이면 어떻게 가져오지?

    }
    res.json(message);
});
route.get('/:id',(req,res,next)=>{
    console.log(req.params.id);
    res.json(message[req.params.id]);
    // res.json(message);
});
route.post('/',(req,res,next)=>{
    // JSON.parse(req.body).id왜 안되는지?
    console.log(req.body);
    message[req.body.id] = req.body;
    res.json(message);
});
route.put('/:id',(req,res,next)=>{
    message[req.params.id].text = req.body.text;
    res.json(message);
});
route.delete('/:id',(req,res,next)=>{
    delete message[req.params.id];
    res.json(message);
});

export default route;