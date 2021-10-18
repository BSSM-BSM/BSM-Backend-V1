const conn = require('../db')
const crypto = require('crypto')

var result={
    bool:false,
};

const login = (member_id, member_pw) => {
    loginQuery="SELECT * FROM `members` WHERE `member_id`='"+member_id+"';"
    return new Promise(resolve => {
        conn.query(loginQuery, (error, results) => {
            if(error) resolve(error)
            if(Object.keys(results).length){
                if(results[0].member_salt===''){
                    if(results[0].member_pw===crypto.createHash('sha3-256').update(member_pw).digest('hex')){
                        result={
                            bool:true,
                            member_code:results[0].member_code,
                            member_id:results[0].member_id,
                            member_nickname:results[0].member_nickname,
                            member_level:results[0].member_level,
                        };
                        resolve(result)
                    }
                }else{
                    if(results[0].member_pw===crypto.createHash('sha3-256').update(results[0].member_salt+member_pw).digest('hex')){
                        result={
                            bool:true,
                            member_code:results[0].member_code,
                            member_id:results[0].member_id,
                            member_nickname:results[0].member_nickname,
                            member_level:results[0].member_level,
                        };
                        resolve(result)
                    }
                }
            }
            resolve(results)
        })
    })
}

module.exports = {
    login:login,
}