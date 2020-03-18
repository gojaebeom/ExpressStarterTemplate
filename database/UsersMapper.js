//user table
const db = require('./index');

/**
 * 	CREATE TABLE storago.s_users(
	u_no int primary key auto_increment,
    u_name varchar(50) not null,
    u_email varchar(50) not null,
    u_pw varchar(100) not null,
    u_img varchar(1000) default "",
    u_role tinyint default 0,
    u_token varchar(100) default "",
    b_no int,
    created_at datetime default now(),
    updated_at datetime default now(),
    deleted_at datetime default null,
    is_deleted tinyint default 0
);
 */

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