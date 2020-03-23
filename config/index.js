const mysql = require('mysql');
const dbInfo = require('./config.json');

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

