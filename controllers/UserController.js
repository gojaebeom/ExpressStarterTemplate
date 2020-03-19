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
		console.log('회원가입 post!');
		console.log(req.body.u_email)

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


