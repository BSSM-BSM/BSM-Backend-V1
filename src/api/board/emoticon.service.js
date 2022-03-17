const { NotFoundException } = require('../../util/exceptions');
const emoticonRepository = require('./repository/emoticon.repository');

const getemoticon = async (id) => {
    const emoticonInfo = await emoticonRepository.getEmoticonById(id);
    if (emoticonInfo === null) {
        throw new NotFoundException();
    }

    const emoticons = await emoticonRepository.getEmoticonsById(id);
    if (emoticons === null) {
        throw new NotFoundException();
    }

    return {
        emoticon: {
            id,
            name:emoticonInfo.name,
            created:emoticonInfo.created,
            description:emoticonInfo.description,
            e:emoticons.map(e => {
                return {
                    idx: e.idx,
                    type: e.type
                }
            })
        }
    }
}

const getemoticons = async () => {
    const emoticonInfo = await emoticonRepository.getEmoticon();
    if (emoticonInfo === null) {
        throw new NotFoundException();
    }
    
    let result = emoticonInfo.map(e => {
        return {
            id: e.id,
            alt: e.name,
            e: []
        }
    })
    const emoticons = await emoticonRepository.getEmoticons();
    if (emoticons === null) {
        throw new NotFoundException();
    }

    let map = [];
    for (let i=0,j=-1; i<emoticons.length; i++) {
        if (map[emoticons[i].id] === undefined) {
            j++;
            map[emoticons[i].id]=j;
        }
        result[j].e.push({
            idx:emoticons[i].idx,
            type:emoticons[i].type
        });
    }
    return {
        emoticon: result
    }
}

const uploadEmoticonInfo = async (name, description, memberCode) => {
    let rows
    const getIndexQuery = `
    SELECT AUTO_INCREMENT 
    FROM information_schema.tables 
    WHERE table_name = 'emoticon' 
    AND table_schema = DATABASE()`
    try{
        [rows] = await pool.query(getIndexQuery)
    }catch(err) {
        console.error(err)
        return null;
    }
    const insertEmoticonsQuery = "INSERT INTO emoticon values(?, ?, ?, now(), ?)"
    try{
        pool.query(insertEmoticonsQuery, [rows[0].AUTO_INCREMENT, name, description, memberCode])
    }catch(err) {
        console.error(err)
        return null;
    }
    return rows[0].AUTO_INCREMENT
}
const uploadEmoticons = (id, emoticonList) => {
    let temp = []
    let params = []
    // 한 번에 insert 하기 위해
    emoticonList.forEach(e => {
        params.push(id, e.idx, e.type);
        temp.push('(?,?,?)')
    });
    const insertEmoticonsQuery = `INSERT INTO emoticons values ${temp.join(',')}`;
    try{
        pool.query(insertEmoticonsQuery, params)
    }catch(err) {
        console.error(err)
        return null;
    }
    return true
}
module.exports = {
    getemoticon:getemoticon,
    getemoticons:getemoticons,
    uploadEmoticonInfo:uploadEmoticonInfo,
    uploadEmoticons:uploadEmoticons
}