import { NotFoundException, UnAuthorizedException, ForbiddenException } from '../../util/exceptions';
import { User } from '../account/User';
import * as boardRepository from './repository/board.repository';
import * as postRepository from './repository/post.repository';
import * as likeRepository from './repository/like.repository';

const webpush = require('../../util/push');
import { escapeAttrValue, FilterXSS } from 'xss';
const xss = new FilterXSS({
    onIgnoreTagAttr:(tag, name, value, isWhiteAttr) => {
        if (name.substr(0, 5) === "style") {
            return name + '="' + escapeAttrValue(value) + '"';
        }
        if (tag.substr(0, 3)==="img") {
            if (name.substr(0, 4) === "e_id") {
                return name + '="' + escapeAttrValue(value) + '"';
            }
            if (name.substr(0, 5) === "e_idx") {
                return name + '="' + escapeAttrValue(value) + '"';
            }
            if (name.substr(0, 6) === "e_type") {
                return name + '="' + escapeAttrValue(value) + '"';
            }
        }
    },
    onIgnoreTag:(tag, html, options) => {
        if (tag.substr(0, 6) === "iframe") {
            return html;
        }
    }
});

let boardTypeList: {
    [index: string]: {
        anonymous: boolean,
        public: boolean,
        level: number
    }
} = {};
const getBoardType = async () => {
    const boardTypeInfo = await boardRepository.getBoardType();
    if (boardTypeInfo === null) {
        return;
    }
    boardTypeInfo.forEach(e => {
        boardTypeList[e.id] = {
            anonymous: Boolean(e.post_anonymous),
            public: Boolean(e.post_public),
            level: Number(e.post_level)
        }
    });
}
getBoardType();

const viewPost = async (
    user: User,
    boardType: string,
    postNo: number
) => {
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException();
    }
    if (boardTypeList[boardType].public == false && !user.getIsLogin()) {
        throw new UnAuthorizedException();
    }
    const isAnonymous = boardTypeList[boardType].anonymous;

    const [postInfo, likeInfo] = await Promise.all([
        postRepository.getPost(boardType, postNo),
        user.getIsLogin()? likeRepository.getByUsercode(boardType, postNo, user.getUser().code): null
    ]);
    if (postInfo === null || postInfo.deleted) {
        throw new NotFoundException();
    }

    postRepository.updatePostHit(boardType, postNo);
    let result: {
        usercode: number,
        nickname: string,
        title: string,
        content: string,
        date: string,
        hit: number,
        comments: number,
        totalLike: number,
        permission: boolean,
        like: boolean
    } = {
        ...postInfo,
        permission:false,
        like:false
    }
    if (likeInfo !== null) {
        result.like = likeInfo;
    }
    if (user.getIsLogin() && postInfo.usercode == user.getUser().code || user.getUser().level >= 3) {
        result.permission = true;
    } else {
        result.permission = false;
    }
    if (isAnonymous) {
        result.usercode = -1;
        result.nickname = 'ㅇㅇ';
    }
    return {
        post:result
    }
}

const writePost = async (
    memberCode,
    memberLevel,
    memberNickname,
    boardType,
    postTitle,
    postContent
) => {
    if (memberCode === null) {
        throw new UnAuthorizedException();
    }
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException('Board not Found');
    }
    if (boardTypeList[boardType].level > memberLevel) {
        throw new ForbiddenException();
    }

	await postRepository.insertPost(boardType, memberCode, memberNickname, postTitle, xss.process(postContent));
    if (boardType == 'notice') {
        const payload = JSON.stringify({
            title:"새로운 공지사항이 있습니다",
            body:postTitle,
            link:"/board/notice"
        })
        webpush.push(payload, 'all');
    }
}

const updatePost = async (
    memberCode,
    memberLevel,
    boardType,
    postNo,
    postTitle,
    postContent
) => {
    if (memberCode === null) {
        throw new UnAuthorizedException();
    }
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException('Board not Found');
    }
    const postMemberCode = await postRepository.getMemberCodeFromPost(boardType, postNo);
    if (postMemberCode === null) {
        throw new NotFoundException('Post not Found');
    }
    if (!(postMemberCode == memberCode || memberLevel>=3)) {
        throw new ForbiddenException();
    }
    
    await postRepository.updatePost(boardType, postNo, postTitle, xss.process(postContent));
}

const deletePost = async (memberCode, memberLevel, boardType, postNo) => {
    if (memberCode === null) {
        throw new UnAuthorizedException();
    }
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException('Board not Found');
    }
    const postMemberCode = await postRepository.getMemberCodeFromPost(boardType, postNo);
    if (postMemberCode === null) {
        throw new NotFoundException('Post not Found');
    }
    if (!(postMemberCode == memberCode || memberLevel>=3)) {
        throw new ForbiddenException();
    }

    await postRepository.deletePost(boardType, postNo);
}

module.exports = {
    viewPost,
    writePost,
    updatePost,
    deletePost
}