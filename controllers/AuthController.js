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