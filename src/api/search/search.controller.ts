import express from "express"
const service = require('./search.service')
let result:{
    status:number;
    subStatus:number;
    arrSearchResult:object|null;
}
let dbResult
const get = async (req:express.Request, res:express.Response) =>{
    dbResult = await service.getBoard(req.params.searchType, req.params.searchStr)
    result={
        status:1,
        subStatus:0,
        arrSearchResult:[]
    }
    if(dbResult){
        if(dbResult.length){
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