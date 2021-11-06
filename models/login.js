const conn = require('../db')
const crypto = require('crypto')

let result={
    bool:false,
};

const login = (member_id, member_pw) => {
    const loginQuery="SELECT * FROM `members` WHERE `member_id`=?"
    const params=[member_id]
    return new Promise(resolve => {
        conn.query(loginQuery, params, (error, results) => {
            if(error) resolve(error)
            if(Object.keys(results).length){
                results=results[0]
                if(results.member_salt===''){
                    if(results.member_pw===crypto.createHash('sha3-256').update(member_pw).digest('hex')){
                        result={
                            bool:true,
                            member_code:results.member_code,
                            member_id:results.member_id,
                            member_nickname:results.member_nickname,
                            member_level:results.member_level,
                        };
                        resolve(result)
                    }
                }else{
                    if(results.member_pw===crypto.createHash('sha3-256').update(results.member_salt+member_pw).digest('hex')){
                        result={
                            bool:true,
                            member_code:results.member_code,
                            member_id:results.member_id,
                            member_nickname:results.member_nickname,
                            member_level:results.member_level,
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