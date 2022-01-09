const pool = require('../db')

const getemoticon = async (id) => {
    let result = {}
    let rows
    const getEmoticonQuery = "SELECT `name`, `created` FROM `emoticon` WHERE `id`=?"
    try{
        [rows] = await pool.query(getEmoticonQuery, [id])
    }catch(err){
        console.error(err)
        return null;
    }
    if(!rows.length) return null;
    result = {
        id:id,
        alt:rows[0].name,
        created:rows[0].created,
        e:[]
    }
    let n
    const getEmoticonsQuery = "SELECT `id`, `idx`, `type` FROM `emoticons` WHERE `id`=?"
    try{
        [rows] = await pool.query(getEmoticonsQuery, [id])
        n = rows.length
    }catch(err){
        console.error(err)
        return null;
    }
    if(!n) return null;
    for(let i=0;i<n;i++){
        result.e[i] = {
            idx:rows[i].idx,
            type:rows[i].type
        }
    }
    return result
}

const getemoticons = async () => {
    let result = []
    let rows, n
    const getEmoticonQuery = "SELECT `id`, `name` FROM `emoticon`"
    try{
        [rows] = await pool.query(getEmoticonQuery)
        n = rows.length
    }catch(err){
        console.error(err)
        return null;
    }
    if(!n) return null;
    for(let i=0;i<n;i++){
        result[i]={
            id:rows[i].id,
            alt:rows[i].name,
            e:[]
        }
    }
    const getEmoticonsQuery = "SELECT `id`, `idx`, `type` FROM `emoticons`"
    try{
        [rows] = await pool.query(getEmoticonsQuery)
        n = rows.length
    }catch(err){
        console.error(err)
        return null;
    }
    if(!n) return null;
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
    return result
}
module.exports = {
    getemoticon:getemoticon,
    getemoticons:getemoticons
}