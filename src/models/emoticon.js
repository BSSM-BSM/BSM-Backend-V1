const conn = require('../db')

const getemoticon = async (id) => {
    const getEmoticonQuery = "SELECT `name` FROM `emoticon` WHERE `id`=?"
    const params = [id]
    return new Promise(resolve => {
        conn.query(getEmoticonQuery, params, (error, rows) => {
            let result = {}
            if(rows.length){
                result = {
                    id:id,
                    alt:rows[0].name,
                    e:[]
                }
                const getEmoticonsQuery = "SELECT `id`, `idx`, `type` FROM `emoticons` WHERE `id`=?"
                conn.query(getEmoticonsQuery, params, (error, rows) => {
                    let n = rows.length
                    if(n){
                        for(let i=0;i<n;i++){
                            result.e.push({
                                idx:rows[i].idx,
                                type:rows[i].type
                            })
                        }
                        resolve(result)
                    }else{
                        resolve(null)
                    }
                })
            }else{
                resolve(null)
            }
        })
    })
}

const getemoticons = async () => {
    const getEmoticonQuery = "SELECT `id`, `name` FROM `emoticon`"
    return new Promise(resolve => {
        conn.query(getEmoticonQuery, (error, rows) => {
            let result = []
            let n = rows.length
            if(n){
                for(let i=0;i<n;i++){
                    result[i]={
                        id:rows[i].id,
                        alt:rows[i].name,
                        e:[]
                    }
                }
                const getEmoticonsQuery = "SELECT `id`, `idx`, `type` FROM `emoticons`"
                conn.query(getEmoticonsQuery, (error, rows) => {
                    n = rows.length
                    if(n){
                        let map = []
                        for(let i=0, j=-1;i<n;i++){
                            if(map[rows[i].id]===undefined){
                                j++;
                                map[rows[i].id]=j;
                            }
                            result[j].e.push({
                                idx:rows[i].idx,
                                type:rows[i].type
                            })
                        }
                        resolve(result)
                    }else{
                        resolve(null)
                    }
                })
            }else{
                resolve(null)
            }
        })
    })
}
module.exports = {
    getemoticon:getemoticon,
    getemoticons:getemoticons
}