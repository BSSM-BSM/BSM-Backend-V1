const conn = require('../db')

let membersLevel;

const get = () => {
    membersLevel=new Array()
    const membersLevelQuery="SELECT `member_code`, `member_level` FROM `members` WHERE `member_level`>0";
    return new Promise(resolve => {
        conn.query(membersLevelQuery, (error, results) => {
            if(error) resolve(error)
            for(let i=0;i<Object.keys(results).length;i++){
                membersLevel[results[i].member_code]=results[i].member_level
            }
            resolve(membersLevel)
        })
    })
}

module.exports = {get:get}