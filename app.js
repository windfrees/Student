//  验证码的使用

let express=require('express');
//  验证码的模块
let  svgCaptcha=require('svg-captcha');

let path=require('path');

let app=express();

//  托管静态文件
app.use(express.static('static'));

// 访问login页面
app.get('/login',(req,res)=>{
    // 读取文件返回
    res.sendFile(path.join(__dirname,'static/views/login.html'));
})
// 生成图片的功能,把地址设置给登录页的img的src
app.get('/login/captchImg',(req,res)=>{
    var captcha = svgCaptcha.create();
	
	res.type('svg'); 
	res.status(200).send(captcha.data);
})

app.listen(100,'127.0.0.1',()=>{
    console.log('success');
})