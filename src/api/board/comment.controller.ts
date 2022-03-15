import express from "express";
const service = require('./comment.service');
const jwt = require('../../util/jwt');

const viewComment = async (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    try{
        res.send(JSON.stringify(
            await service.viewComment(
                jwtValue.isLogin? jwtValue.memberCode: null,
                jwtValue.isLogin? jwtValue.memberLevel: null,
                req.params.boardType,
                req.params.postNo
            )
        ));
    }catch(err){
        next(err);
    }
}
const writeComment = async (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    try{
        res.send(JSON.stringify(
            await service.writeComment(
                jwtValue.isLogin? jwtValue.memberCode: null,
                jwtValue.memberNickname,
                req.params.boardType,
                req.params.postNo,
                req.body.comment,
                req.params.depth,
                req.params.parentIdx
            )
        ));
    }catch(err){
        next(err);
    }
}
const deleteComment = async (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    try{
        res.send(JSON.stringify(
            await service.deleteComment(
                jwtValue.isLogin? jwtValue.memberCode: null,
                jwtValue.isLogin? jwtValue.memberLevel: null,
                req.params.boardType,
                req.params.postNo,
                req.params.commentIdx
            )
        ));
    }catch(err){
        next(err);
    }
}

export {
    viewComment,
    writeComment,
    deleteComment
}