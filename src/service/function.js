const pool = require('../util/db')

const overlapCheck = async (table, a, b) => {
    const getQuery=`SELECT * FROM ?? WHERE ${a}=?`
    try{
        const [rows] = await pool.query(getQuery, [table, b])
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
const validCheck = async (table, a, b, c, d) => {
    const getQuery=`SELECT * FROM ?? WHERE ${a}=? AND ${c}=?`
    try{
        const [rows] = await pool.query(getQuery, [table, b, d])
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