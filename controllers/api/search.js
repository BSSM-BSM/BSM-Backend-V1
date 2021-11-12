let result
let dbResult
const get = async (req, res) =>{
    let model = require('../../models/search')
    dbResult = await model.getBoard(req.params.searchType, req.params.searchStr)
    result={
        status:1,
        subStatus:0,
        arrSearchResult:''
    }
    if(dbResult){
        if(Object.keys(dbResult).length){
            let arrSearchResult=[]
            for(let i=0;i<Object.keys(dbResult).length;i++){
                arrSearchResult[i]={
                    postNo:dbResult[i].post_no,
                    postTitle:dbResult[i].post_title,
                    memberNickname:dbResult[i].member_nickname,
                    postDate:dbResult[i].post_date
                }
            }
            result={
                status:1,
                subStatus:0,
                arrSearchResult:arrSearchResult
            }
        }
    }
    res.send(JSON.stringify(result))
}

module.exports = {
    get:get
}