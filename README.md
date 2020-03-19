# Express Server Template
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
|   └── www (최상위 시작 파일)
├── config
│   └── config.json (db정보를 입력하는 파일)
├── database
|   ├── index.js (config.json 파일을 읽어와 mysql connect 생성 및 연결)
│   └── UsersMapper.js (User 테이블에 대한 쿼리 작성)
├── routes
│   ├── index.js (각각의 라우터들을 불러와 get, post 통신 방식을 설정)
│   ├── User.js (UserMapper를 읽어와 로그인, 로그아웃, 회원가입등을 처리)
│   └── Auth.js (클라이언트에서 요청시 암호화된 쿠키가 있으면 복호화 하여 유저 정보 추출)
├── app.js (www파일에서 서버를 실행하기 이전에 미들웨어 처리)
└── package.json (node_module 폴더에 있는 라이브러리들을 관리 및 실행 스크립트 작성)
```
<br/>

### _프로젝트 실행흐름_
-  package.json 의 스크립트를 통해 *npm run start* 또는 _npm run serve_ 를 이용하여 www파일을 읽기 시작한다.
    - [package.json 파일 참고](https://github.com/gojaebeom/express-server-templete/blob/master/package.json)
-  www 는 app.js 의 설정파일을 불러와 port 주소를 설정하고 오류시 예외처리등을 하고있다. 정상적인 흐름이라면 server를 listenning 한다.
    - [www 파일 참고](https://github.com/gojaebeom/express-server-templete/blob/master/bin/www)
-  app.js 는 express 모듈을 불러와 www파일에 보내기 이전에 미들웨어를 담당한다.
    - cookieParser, bodyParser 라이브러리를 불러오고 사용
    - router 연결
    - 정적 디렉토리 주소 설정
    - 템플릿 엔진 설정(본프로젝트에서는 client와 server를 나누어 통신하는 방식이기때문에 사실상 필요없다.)
    - [app.js 파일 참고](https://github.com/gojaebeom/express-server-templete/blob/master/app.js)
-  express 는 nodejs의 프레임워크지만 spring이나 lalabel 과 같이 확실한 디렉토리구조를 나누어 주지 않기때문에 자신의 생각대로 로직을 짜게 되는 경우가 많다. (물론 express generator 라이브러리를 전역으로 다운받으면 기본적인 디렉토리 구조를 잡아주지만 db설정이나 router 설정은 역시 따로 잡아주지 않는다.) 이 프로젝트는 express generator를 base로 하여 스택오버플로우 형님들의 글을 보고 어느정도의 깔끔한 구조를 만들었다고 생각한다.(본인피셜이다)
<br/>

### _Router_
```javascript
//index.js

/**
 * express 모듈을 불러와 변수에 담고 
 * express 변수중 Router함수를 불러와 router 변수에 담는다.
 */
var express = require('express');
var router = express.Router();


// Auth , User 라우터를 불러온다. 사용하기 편하게 비구조할당으로 선언.
// Auth : 다른 라우터를 불러오기전에 암호화된 쿠키가 있다면 디코딩하여 사용자 정보를 받아오는 기능.
// User : 로그인, 로그아웃, 회원가입 등을 처리 
const { auth } = require('./Auth');
const { login, register, logout } = require('./User');


/* test url */
router.get('/hello', (req, res)=>{
    res.send("hello world");
});

/* rest full API 통신. */
router.post('/user/login', login);
router.post('/user/register', register);
router.get('/user/logout', auth, logout);


// router를 app.js 받아볼수있게 export한다.
module.exports = router;
```
#### index.js 는 모든 라우터를 불러와 통신방식을 설정하는 곳 입니다.

