const cookieParser = require('cookie-parser')
const express = require('express')
const svgCaptcha = require('svg-captcha')
const Database = require('better-sqlite3')
const md5 = require('md5')

const app = express()
const port = 8082
const db = new Database('./bbs.sqlite3')

//设置模板文件位置
app.set('views', './templates')

// const posts = [{
//   id: 2,
//   title: "aaa",
//   content: "adadawdad",
//   createdBy:"sharlock",
// }]
// const users = []
// const comments = [{
//   id:'4',
//   content:'adad',
//   postId:'2',
//   createdBy:'sharlock',
//   timeStamp:new Date().toISOString(),
//   ip:'192.19.1.1',
// }]

app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})
//静态页面注册登录
app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//解析和解密验证cookie的中间件
app.use(cookieParser('sadjkbciaha'))
const sessions = {
  //sessionId:{}, 由sessionid到session对象的映射，session对象记录一个会话的各种信息
}
//下发sessionID(会话)的中间件
app.use((req,res,next)=>{
  if(!req.cookies.sessionId){
    let sessionId = Math.random().toString(36).slice(2)
    res.cookie('sessionId',sessionId,{
      maxAge:864000000
    })
    req.cookies.sessionId = sessionId
  }
  if(sessions[req.cookies.sessionId]){
    req.session = sessions[req.cookies.sessionId]
  }else{
    req.session = sessions[req.cookies.sessionId] = {}
  }
  res.locals.session = req.session
  next()
})
//res.locals上的数据可以被所有模板访问到
//cookie用户登录状态
app.use((req,res,next)=>{
  req.user = db.prepare('SELECT * FROM users WHERE name=?').get(req.signedCookies.loginUser)
  res.locals.user = req.user
  res.locals.isLogin = !!req.user
  next()
})
//首页
app.get('/', (req, res, next) => {
  let page = req.query.page ?? 1
  let size = 5
  let offset = (page - 1) *  size
  let totalPosts = db.prepare('SELECT count(*) as total FROM posts').get().total
  let totalPages = Math.ceil(totalPosts/size)
  let posts = db.prepare("SELECT * FROM posts LIMIT ? OFFSET ?").all(size,offset)
  res.render('index.pug', {
    posts: posts,
    totalPages,
    page,
  })
})

let cookieUserMap = {} //用户信息

//用户注册
app.post('/register', (req, res, next) => {
  //ajv.validate(registerSchema,req.body) 数据验证
  let registerInfo = req.body //name password
  if(registerInfo.name.length<5){
    res.type('html').end('用户名不少于5个字符')
    return 
  }
  if (registerInfo.password !== registerInfo.password1) {
    res.type('html').end('两次输入的密码不同')
    return
  }
  if (db.prepare('SELECT * FROM users WHERE name=?').get(registerInfo.name)){
    res.type('html').end('用户名已存在')
    return
  }
  if (db.prepare('SELECT * FROM users WHERE email=?').get(registerInfo.email)){
    res.type('html').end('email已存在')
    return
  }
  registerInfo.createdAt = new Date().toISOString()
  //密码加盐
  registerInfo.salt = Math.random().toString(36).slice(2)
  registerInfo.password = md5(md5(registerInfo.password) + md5(registerInfo.salt))
  
  try{
    db.prepare(`INSERT INTO users (name,password,email,createdAt,salt) 
    VALUES ($name,$password,$email,$createdAt,$salt)`
    ).run(registerInfo)
  }catch(e){
    if(e.code == 'SQLITE_CONSTRAINT_UNIQUE'){
      res.end(e.message)
      return 
    }else{
      throw e
    }
  }
  res.type('html').end('注册成功，前往<a href="/login">登录</a>')
})

//用户登录
app.post('/login',(req,res,next)=>{
  let loginInfo = req.body
  if(req.session.loginFail>=3&&loginInfo.captcha!==req.session.captcha){
    res.end('captcha not match')
  }else{
    delete req.session.captcha
    delete req.session.loginFail
  }
  let targetuser = db.prepare('SELECT * FROM users WHERE name=?').get(loginInfo.name)
  
  if(targetuser){
    let saltedPassword = md5(md5(loginInfo.password) + md5(targetuser.salt))
    if(saltedPassword==targetuser.password){
      res.cookie('loginUser',targetuser.name,{
        signed:true,
        maxAge:86400 * 1000
      })
      res.redirect('/')
    }else{
      req.session.loginFail = (req.session.loginFail ?? 0) + 1
      res.type('html').end('用户名或密码错误')
    }
  }else{
    req.session.loginFail = (req.session.loginFail ?? 0) + 1
    res.type('html').end('用户名或密码错误')
  }
})
app.get('/login',(req,res,next)=>{
  res.render('login.pug')
})
app.get('/logout',(req,res,next)=>{
  res.clearCookie('loginUser')
  res.redirect('/')
})

//展示用户信息
app.get('/user/:userId',(req,res,next)=>{

})

//验证码
app.get('/captcha',(req,res,next)=>{
  //生成随机码，将随机码画到图片中，并记录这个随机码
  //后续用户提交的表单中的验证码要和随机码做对比
  let captcha = svgCaptcha.create()
  req.session.captcha = captcha.text
  console.log(req.session)
  res.type('svg').end(captcha.data)
})

//忘记密码
app.get('/forget',(req,res,next)=>{
  res.render('forget.pug')
})

let changePasswordMap = {
  //token:user
}
app.post('/forget',(req,res,next)=>{
  let email = req.body.email
  let user = db.prepare('SELECT * FROM users WHERE email=?').get(email)
  if(user){
    let token = Math.random().toString(36).slice(2)
    changePasswordMap[token] = user
    setTimeout(()=>{
      delete changePasswordMap[token]
    },20*60*1000)
    let link = 'http://localhost:8082/change-password?token=' + token
    console.log(link)
    // sendEmail(email,`
    //   请点击以下链接修改密码,
    //   ${link}
    //   `)
      res.type('html').end('请查看电子邮件')
  }else{
    res.end('输入有误')
  }
})
app.get('/change-password',(req,res,next)=>{
  let token = req.query.token
  let user = changePasswordMap[token]
  if(user){
    res.render('change-password.pug',{
      user
    })
  }else{
    res.type('html').end('链接已过期，请重试')
  }
})
app.post('/change-password',(req,res,next)=>{
  let token = req.query.token
  let user = changePasswordMap[token]
  let body = req.body
  if(user){
    if(body.password==body.password1){
      let saltedPassword = md5(md5(body.password)+md5(user.salt))
      db.prepare('UPDATE users SET password=? WHERE id=?').run(saltedPassword,user.id)
      delete changePasswordMap[token]
      res.type('html').end('密码修改成功，请前往<a href="/login">登录</a>')
    }else{
      res.type('html').end('两次密码输入不一致')
    }
  }else{
    res.type('html').end('链接已过期，请重试')
  }
})
//帖子内容
app.get('/post/:postId', (req, res, next) => {
  var postId = req.params.postId
  let post = db.prepare('SELECT * FROM posts WHERE id=?').get(postId)
  if (post) {
    let thisComments = db.prepare(`SELECT comments.id, content, comments.createdAt ,users.id as UserId, name 
      FROM comments JOIN users ON comments.createdBy = users.id WHERE postId=?
      `).all(postId)//comments.filter(it => it.postId == postId)
    let postOwner = db.prepare('SELECT * FROM users WHERE id=?').get(post.createdBy)
    res.render('post.pug', {
      post: post,
      comments: thisComments,
      Postuser:postOwner,
    })
  } else {
    res.render('404.pug')
  }
})

//发帖
app.get('/add-post', (req, res, next) => {
  if(req.user){
    res.render('add-post.pug')
  }else{
    res.end('Please Login')
  }
})
//删帖
app.delete('/post/:postId',(req,res,next)=>{
  let post = db.prepare('SELECT * FROM posts WHERE id =?').get(req.params.postId)
  if(post){
    if(req.user&&post.createdBy==req.user.id){
      db.prepare('DELETE FROM comments WHERE postId =?').run(req.params.postId)
      db.prepare('DELETE FROM posts WHERE id =?').run(req.params.postId)
    }else{
     res.status(401).end('无权限删除')
    }
  }else{
    res.end()
  }
})

//提交帖子
app.post('/add-post', (req, res, next) => {
  if(!req.user){
    res.end('Not Login!!')
    return 
  }
  let post = req.body //{title:'xxx',content:'xxx'}

  post.createdBy = req.user.id
  post.createdAt = new Date().toISOString()
  post.ip = req.ip
  let result = db.prepare(`
    INSERT INTO posts(title,content,createdAt,createdBy)
    VALUES ($title,$content,$createdAt,$createdBy)
    `).run(post)
  
  res.redirect('/post/' + result.lastInsertRowid)
})

//提交评论
app.post('/comment', (req, res, next) => {
  if(!req.user){
    res.end('Please Login')
    return 
  }
  let content = req.body.content
  let postId = req.body.postId
  let createdBy = req.user.id


  let commentObj = {
    content,
    postId,
    createdBy,
    createdAt: new Date().toISOString(),
  }
  db.prepare(`
    INSERT INTO comments(content,postId,createdBy,createdAt)
    VALUES ($content,$postId,$createdBy,$createdAt)
    `).run(commentObj)
  res.redirect('/post/' + postId)
})

//删除评论
app.post('/delete-comment/:commentId',(req,res,next)=>{
  let comment = db.prepare('SELECT * FROM comments WHERE id =?').get(req.params.commentId)
  if(comment){
    if(req.user&&comment.createdBy==req.user.id){
      db.prepare('DELETE FROM comments WHERE id=?').run(req.params.commentId)
    }else{
     res.status(401).type('html').end('无权限删除')
    }
  }
  res.redirect(req.get('referer'))
})

app.listen(port, () => {
  console.log('listening on port: ', port)
})



