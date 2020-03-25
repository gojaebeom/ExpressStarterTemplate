const userQuery = require("../database/user-query");

exports.login = async (req, res) =>{
    try {
        const [user] = await userQuery.LOGIN(req.body.u_email);

        console.log(user);

        res.redirect('/');
    } catch (e) {
        console.log(e);
    }
}

exports.register = (req, res) =>{

}