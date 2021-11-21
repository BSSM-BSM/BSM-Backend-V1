const conn = require('../db')

const overlapCheck = (table, a, b) => {
    const getQuery="SELECT * FROM ?? WHERE `"+a+"`=?"
    const params=[table, b]
    return new Promise(resolve => {
        conn.query(getQuery, params, (error, rows) => {
            if(error) resolve(false)
            if(Object.keys(rows).length)
                resolve(true)
            else
                resolve(false)
        })
    })
}
const validCheck = (table, a, b, c, d) => {
    const getQuery="SELECT * FROM ?? WHERE `"+a+"`=? AND `"+c+"`=?"
    const params=[table, b, d]
    return new Promise(resolve => {
        conn.query(getQuery, params, (error, rows) => {
            if(error) resolve(false)
            if(Object.keys(rows).length)
                resolve(true)
            else
                resolve(false)
        })
    })
}
module.exports = {
    overlapCheck:overlapCheck,
    validCheck:validCheck
}