const conn = require('../db')
const crypto = require('crypto');
const login = (member_id, member_pw) => {
    loginQuery="SELECT * FROM `members` WHERE `member_id`='"+member_id+"';"
    return new Promise(resolve => {
        conn.query(loginQuery, (error, results, fields) => {
            if(error){
                resolve(error)
            }
            if(Object.keys(results).length){
                if(results[0].member_salt===''){
                    if(results[0].member_pw===crypto.createHash('sha3-256').update(member_pw).digest('hex')){
                        resolve(true)
                    }
                }else{
                    if(results[0].member_pw===crypto.createHash('sha3-256').update(results[0].member_salt+member_pw).digest('hex')){
                        resolve(true)
                    }
                }
            }
            resolve(false)
        })
    })
}
const islogin = () => {
    return 'false'
}

module.exports.login = login
module.exports.islogin = islogin