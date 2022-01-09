const conn = require('../db')

const overlapCheck = (table, a, b) => {
    const getQuery="SELECT * FROM ?? WHERE ?=?"
    try{
        const [rows] = await pool.query(getQuery, [table, a, b])
        if(rows.length){
            return true
        }else{
            return false
        }
    }catch(err){
        console.error(err)
        return null;
    }
}
const validCheck = (table, a, b, c, d) => {
    const getQuery="SELECT * FROM ?? WHERE ?=? AND ?=?"
    try{
        const [rows] = await pool.query(getQuery, [table, a, b, c, d])
        if(rows.length){
            return true
        }else{
            return false
        }
    }catch(err){
        console.error(err)
        return null;
    }
}
module.exports = {
    overlapCheck:overlapCheck,
    validCheck:validCheck
}