// 路由中间件
var express=require('express');

let indexRoute=express.Router();

let path=require('path');


indexRoute.get('/',(req,res)=>{
   if(req.session.userInfo){
       let userName=req.session.userInfo.userName;
       res.render(path.join(__dirname,'../static/views/index.art'),{
           userName
       });
   }

})




// 暴露出去
module.exports=indexRoute;