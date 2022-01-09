const pool = require('../db')

let membersLevel;

const get = async () => {
    let rows
    membersLevel=new Array()
    const membersLevelQuery="SELECT `member_code`, `member_level` FROM `members` WHERE `member_level`>0";
    try{
        [rows] = await pool.query(membersLevelQuery)
    }catch(err){
        console.error(err)
        return null;
    }
    for(let i=0;i<rows.length;i++){
        membersLevel[rows[i].member_code]=rows[i].member_level
    }
    return membersLevel
}

module.exports = get