*nodeJS 를 활용한 웹 서버 맞춤 템플릿*
# Express Server Template

### 주요 기능만 포함한 폴더 구조
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

### 프로젝트 실행흐름
![package-img](https://user-images.githubusercontent.com/62233873/76976999-15259d00-6978-11ea-93d9-e23462577fbf.PNG){width:200px;height:300px;border-radius:3px;}
