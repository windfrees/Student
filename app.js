//  验证码的使用

let express=require('express');
//  验证码的模块
let  svgCaptcha=require('svg-captcha');

let path=require('path');
//  session模块
let session=require('express-session');
//  导入body-parser 格式化表单的数据
let bodyParser = require('body-parser');
//   封装的函数
let myT=require(path.join(__dirname,'tools/myT'));

//  首页路由
let indexRoute=require(path.join(__dirname,"route/indexRoute"));



// 创建app ---------------
let app=express();

//  托管静态文件
app.use(express.static('static'));
//  session 中间件
app.use(session({
    secret: 'keyboard cat',
  }));
// bodyParser中间件
app.use(bodyParser.urlencoded({ extended: false }));

//  使用路由件,挂载到/index下面
app.use('/index',indexRoute);

//  导入art-template
app.engine('art',require('express-art-template'));
app.set('views','/static/views');

//  路由 -----------------------
// 访问login页面
app.get('/login',(req,res)=>{
    // 读取文件返回
    res.sendFile(path.join(__dirname,'static/views/login.html'));
})
//  login页面提交数据,验证登录
app.post('/login',(req,res)=>{
    // console.log(req);
    
    let userName=req.body.userName;
    let userPass=req.body.userPass;
    let code=req.body.code;

    if(code==req.session.captcha){
       myT.find('userList',{
           userName,userPass},(err,docs)=>{
                if(!err){
                    if(docs.length==1){
                        req.session.userInfo={userName}
                        myT.mess(res,'欢迎回来','/index');
                    }else{
                        myT.mess(res,'用户名或者密码错误','/login');
                    }
                }
           }                      
        )
    } else{
        myT.mess(res,'验证码不对','/login');
    }   
})


// 生成图片的功能,把地址设置给登录页的img的src
app.get('/login/captchImg.png',(req,res)=>{
    var captcha = svgCaptcha.create();   
    // console.log(captcha.text); 
    //  保存验证码到session
    req.session.captcha = captcha.text.toLocaleLowerCase();  
	res.type('svg'); 
	res.status(200).send(captcha.data);
})

//  访问首页
app.get('/index',(req,res)=>{
    if(req.session.userInfo){
        res.sendFile(path.join(__dirname,'static/views/index.html')); 
    }else{
        res.setHeader('content-type','text/html');
        res.send('<script>alert("请登录");window.location.href="/login"</script>')
    }
})

//  登出
app.get('/logout',(req,res)=>{
    delete req.session.userInfo;
    res.redirect('/login');
})

//  访问注册页面
app.get('/register',(req,res)=>{
    // 读取文件返回
    res.sendFile(path.join(__dirname,'static/views/register.html'));
})

// 获取数据
app.post('/register',(req,res)=>{
    let userName=req.body.userName;
    let userPass=req.body.userPass;
    myT.find('userList',{
        userName
    },(err,docs)=>{
        if(docs.length==0){
            myT.insert('userList',{
                userName,userPass
            },(err,result)=>{
                if(!err) myT.mess(res,'欢迎加入我们','/login');
            })
        }else{
            myT.mess(res,'遗憾,被注册','/register');
        }
    })    
})





//  监听
app.listen(100,'127.0.0.1',()=>{
    console.log('success');
})