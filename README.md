# Express Starter Template
#### *nodejs 관련 프로젝트를 만들때 반복되는 작업들을 최소화 할 수 있게 만든 starter-template 이다. 자주 사용되는 라이브러리들을 등록하고 회원가입 로그인 로그아웃 기능을 구현함.*
<br/>

#### _file download_
-  _git clone https://github.com/gojaebeom/express-server-templete.git_
#### _install and start_
-  _1. 최상위 경로에서 npm install_
-  _2. npm run start 또는 npm run serve_
<br/>
<br/>

### _주요 기능만 포함한 폴더 구조_
```
my-app
├── bin
│   └── www (최상위 시작 파일)
├── config
│   └── config.json (db정보를 입력하는 파일)
├── database
│   ├── index.js (config.json 파일을 읽어와 mysql connect 생성 및 연결)
│   └── UsersMapper.js (User 테이블에 대한 쿼리 작성)
├── controllers
│   ├── UserController.js (UserMapper를 읽어와 로그인, 로그아웃, 회원가입등을 처리)
│   └── AuthController.js (클라이언트에서 요청시 암호화된 쿠키가 있으면 복호화 하여 유저 정보 추출)
├── routes
│   └── index.js (각각의 controller 들을 불러와 get, post 통신 방식을 설정)
├── app.js (www파일에서 서버를 실행하기 이전에 미들웨어 처리)
└── package.json (node_module 폴더에 있는 라이브러리들을 관리 및 실행 스크립트 작성)
```
<br/>

### _프로젝트 실행_
-  package.json 의 스크립트를 통해 *npm run start* 또는 _npm run serve_ 를 이용하여 www파일을 읽기 시작한다.
    - [package.json 파일 참고](https://github.com/gojaebeom/express-server-templete/blob/master/package.json)
-  www 는 app.js 의 설정파일을 불러와 port 주소를 설정하고 오류시 예외처리등을 하고있다. 정상적인 흐름이라면 server를 실행시킨다.
    - [www 파일 참고](https://github.com/gojaebeom/express-server-templete/blob/master/bin/www)
-  app.js 는 express 모듈을 불러와 www파일에 보내기 이전에 미들웨어들을 처리한다.
    - cookieParser, bodyParser 등 라이브러리를 불러와 가저온 express 객체에 연결시킨다.
    - router 연결
    - 정적 디렉토리 주소 설정
    - 템플릿 엔진 설정(본프로젝트에서는 client와 server를 나누어 통신하는 방식이기때문에 사실상 필요없다.)
    - [app.js 파일 참고](https://github.com/gojaebeom/express-server-templete/blob/master/app.js)
-  express 는 nodejs의 프레임워크지만 spring이나 laravel 과 같이 확실한 디렉토리구조를 잡아주지 않기때문에 자신의 생각대로 로직을 짜게 되는 경우가 많다. (물론 express generator 라이브러리를 전역으로 다운받으면 기본적인 디렉토리 구조를 잡아주지만 db설정이나 controller 설정은 역시 따로 만들어주지 않는다.) 이 프로젝트는 express generator 폴더구조를 기본으로 하여 스택오버플로우 형님들의 글을 보고 어느정도 타 프레임워크와 비슷한 구조를 만들었다고 생각한다.(본인피셜이다)
<br/>

### _-Controller_
#### Controller 들은 Router를 통해 클라이언트에서 온 요청(Request)을 받아 db의 데이터를 생성, 조회, 수정, 삭제 등을 처리하고 다시 응답(response) 해주는 역할을 한다.
```javascript
//AuthController : 다른 Controller를 불러오기전에 암호화된 쿠키가 있다면 디코딩하여 사용자 정보를 받아오는 기능.
//Router에서 이 Controller를 받아 쿠키를 다시 디코딩해 알려줘야하는 Controller 이전에 미들웨어로 사용시킨다.

const jwt = require('jsonwebtoken');
const users = require('../database/UsersMapper');

/**
 * 클라이언트에서 서버로 데이터를 보내는 와중에 
 * 쿠키의 토큰을 받아와 디코딩한다. 
 * 사용자의 원래 아이디 값을 구하는 작업을 함
 */
exports.auth = async (req, res, next)=>{
    try{
        console.log(`cookies : ${req.cookies.x_auth}`);
        const token = req.cookies.x_auth;
        
        //토큰 decode
        const u_no = jwt.verify(token, 'secretToken')
        console.log(`u_no : ${u_no}`);

        const userArr = await users.FIND_USER(u_no);
        const [user] = userArr;
        console.log(user);
    
        if(user){
            if(user.u_token === token){
                req.user = user;
            }
            else{
                return res.json({
                    success:false,
                    message:'해당 아이디가 존재하지 않음'
                })
            }
        }
        else{
            return res.json({
                success:false,
                message:'해당 아이디가 존재하지 않음'
            })
        }
    
        next();
    
    }catch(e){
        console.log(e)
    }
}
```
```javascript
//UserController : 로그인 , 로그아웃 , 회원가입 기능이 구현되어있다.

const users = require('../database/UsersMapper');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

/**
 * 클라이언트에서 req.body에 넘어온 email을 db에 있는지 검사 후
 * 있으면 같이 넘어온 비밀번호를 bcrypt 라이브러리를 통해 암호화된 비밀번호와 비교
 * 비밀번호까지 맞으면 유저에 토큰 저장, 쿠키에 토큰 저장 후 넘어가기
 */
exports.login= async (req, res) =>{
    try{

		const userInfoArr =  await users.LOGIN(req.body.u_email);
		const [ userInfo ] = userInfoArr;
		//const userInfo = userInfo[0] 과 같다.
		console.log('-----userInfo----');
		console.log(userInfo)

		if(!userInfo) return res.json({
			success:false,
			message:'찾고자하는 이메일이 존재하지 않습니다.'
		})

		const checkPassword = bcrypt.compareSync(req.body.u_pw , userInfo.u_pw)

		if(!checkPassword) return res.json({
			success:false,
			message:'찾고자하는 비밀번호가 존재하지 않습니다.'
		})

		const token = jwt.sign(userInfo.u_no,'secretToken');
		console.log(`token : ${token}`);		  

		await 
			users.SET_TOKEN(userInfo.u_no , token)
				.then(()=>{
					//쿠키에 토큰 넣어주기
					res.cookie('x_auth', token)
					.status(200)
						.json({
						success:true,
						userID:token
						})
				})

    }catch(e){
      	console.log(e);
    }
}


/**
 * 로그아웃
 * 미들웨어 auth 에서  쿠키를 디코딩하여 유저 id값을 추출하였다.
 * 그리고 해당사용자를 req.user 객체에 담아 전달하였기때문에
 * logout 라우터에서 req에 user객체를 받아올 수 있다.
 * 그리고 받아온 user객체에 u_no(id값)의 사용자에 토큰을 지워주는 것으로
 * 성공여부를 반환한다.
 */
exports.logout = async (req, res)=>{
    try{
		const u_no = req.user.u_no
		const token = "";

		await users.SET_TOKEN(u_no , token)
			.then(()=>{
				console.log('성공적으로 로그아웃하였습니다!');
				res.json({
					success:true,
					message:'성공적인 로그아웃!'
				})
			})

    }catch(e){
        console.log(e);
    }
}


/**
 * 회원가입 
 * 데이터를 받고 , 그중에 비밀번호를 bcrypt 라이브러리를 통해 암호화 한뒤 user 테이블에 insert 시킴
 */
exports.register = async (req, res) =>{
	try{
		console.log(req.body);

		const u_email   = req.body.u_email ? req.body.u_email : ""
		let 	u_pw   	= req.body.u_pw    ? req.body.u_pw    : ""
		const   u_name  = req.body.u_name  ? req.body.u_name  : ""

		const salt = bcrypt.genSaltSync(saltRounds);
		const hash = bcrypt.hashSync(req.body.u_pw , salt, (err)=>console.log(err));

		u_pw = hash;

		await 
			users.REGISTER(u_email, u_pw, u_name)
				.then(()=>{res.json({success:true}) })
		
	}catch(e){
		console.log(e);
	}
}


```
<br/>

### _-Router_
#### Router 는 모든 요청을 각 Controller에 연결시키고 다시 Controller의 응답을 받아서 client에게 보내주는 역할을 한다.
```javascript
//index.js

/**
 * express 모듈을 불러와 변수에 담고 
 * express 변수중 Router함수를 불러와 router 변수에 담는다.
 */
var express = require('express');
var router = express.Router();


// Auth , User Controller를 불러온다. 사용하기 편하게 비구조할당으로 선언.
// Auth : 다른 Controller를 불러오기전에 암호화된 쿠키가 있다면 디코딩하여 사용자 정보를 받아오는 기능.
// User : 로그인, 로그아웃, 회원가입 등을 처리 
const { auth } = require('../controllers/AuthController');
const {login, register, logout} = require('../controllers/UserController');


/* test url */
router.get('/hello', (req, res)=>{
    res.send("hello world");
});

/* rest full API 통신. */
router.post('/user/login', login);
router.post('/user/register', register);
router.get('/user/logout', auth, logout);


// router를 app.js 에서 받을 수 있게 export한다.
module.exports = router;
```

### _-DataBase_
#### database는 mysql을 사용하여 config의 db정보를 가저와 연결한다.
```javascript
//database/index.js

const mysql = require('mysql');
const dbInfo = require('../config/config.json');

console.log('database loading..')

const db = mysql.createConnection({
    host:dbInfo.host,
    user:dbInfo.user,
    password:dbInfo.password,
    database:dbInfo.database,
    port:dbInfo.port,
    dateStrings:'date'
})

db.connect(function(err) {
    if(err){
        console.log(err.code); // 'ECONNREFUSED'
        console.log(err.fatal); // true
    }else{
        console.log(`database is connected`)
    }
});

exports.query = function(query, params){

    return new Promise((resolve, reject)=>{

        db.query(query, params, function(err, result){

            if(err) reject(err);
            else resolve(result);

        });
    });
}


```
#### user 테이블에 해당하는 query를 스프링의 mapper 방식처럼 만들어 사용한다.
#### nodejs 에서 mysql sequelize를 지원해 더 간단히 사용하는 방식이 있지만 아직 본인이 잘 습득하지 못하였다. 시간나는대로 알아볼 생각이다.
```javascript
//database/UserMapper.js

const db = require('./index');

 //로그인 
exports.LOGIN = function(u_email){
    const queryString = 
    "select * from s_users where u_email = ?";
    return db.query(queryString,[u_email]);
}

//회원가입
exports.REGISTER = function(u_email, u_pw, u_name){
    const queryString = 
    "insert into storago.s_users (u_email, u_pw, u_name)" +
    "values (?, ?, ?)";
    return db.query(queryString,[u_email ,u_pw, u_name]);
}

//토큰 생성/ 삭제
exports.SET_TOKEN = function(u_no, u_token){
    const queryString = 
    "update storago.s_users set u_token = ? where u_no = ?";
    return db.query(queryString,[u_token, u_no]);
}

//토큰을 디코딩하여 추출해낸 id로 다시 유저 정보 얻어오기
exports.FIND_USER = function(u_no){
    const queryString = 
    "select * from s_users where u_no = ?";
    return db.query(queryString,[u_no]);
}
```

