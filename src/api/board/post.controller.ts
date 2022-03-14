import express from "express";
const service = require('./post.service');
const jwt = require('../../util/jwt');

const viewPost = async (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    try{
        res.send(JSON.stringify(
            await service.viewPost(
                jwtValue.isLogin? jwtValue.memberCode: null,
                jwtValue.isLogin? jwtValue.memberLevel: null,
                req.params.boardType,
                req.params.postNo,
            )
        ));
    }catch(err){
        next(err);
    }
}
const writePost = async (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    try{
        res.send(JSON.stringify(
            await service.writePost(
                jwtValue.isLogin? jwtValue.memberCode: null,
                jwtValue.isLogin? jwtValue.memberLevel: null,
                jwtValue.memberNickname,
                req.params.boardType,
                req.body.postTitle,
                req.body.postContent
            )
        ));
    }catch(err){
        next(err);
    }
}
const updatePost = async (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    try{
        res.send(JSON.stringify(
            await service.updatePost(
                jwtValue.isLogin? jwtValue.memberCode: null,
                jwtValue.isLogin? jwtValue.memberLevel: null,
                req.params.boardType,
                req.params.postNo,
                req.body.postTitle,
                req.body.postContent
            )
        ));
    }catch(err){
        next(err);
    }
}
const deletePost = async (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    try{
        res.send(JSON.stringify(
            await service.deletePost(
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

export {
    viewPost,
    writePost,
    updatePost,
    deletePost
}