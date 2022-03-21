const { NotFoundException, UnAuthorizedException, ForbiddenException } = require('../../util/exceptions');
const repository = require('./repository/post.repository');
const likeRepository = require('./repository/like.repository');
const webpush = require('../../util/push');
const js_xss = require('xss');
const xss = new js_xss.FilterXSS({
    onIgnoreTagAttr:(tag, name, value, isWhiteAttr) => {
        if (name.substr(0, 5) === "style") {
            return name + '="' + js_xss.escapeAttrValue(value) + '"';
        }
        if (tag.substr(0, 3)==="img") {
            if (name.substr(0, 4) === "e_id") {
                return name + '="' + js_xss.escapeAttrValue(value) + '"';
            }
            if (name.substr(0, 5) === "e_idx") {
                return name + '="' + js_xss.escapeAttrValue(value) + '"';
            }
            if (name.substr(0, 6) === "e_type") {
                return name + '="' + js_xss.escapeAttrValue(value) + '"';
            }
        }
    },
    onIgnoreTag:(tag, html, options) => {
        if (tag.substr(0, 6) === "iframe") {
            return html;
        }
    }
});

const boardTypeList = {
    board:{
        anonymous:false,
        public:false,
        level:0
    },
    anonymous:{
        anonymous:true,
        public:true,
        level:0
    },
    notice:{
        anonymous:false,
        public:true,
        level:3
    }
}
const viewPost = async (
    memberCode,
    memberLevel,
    boardType,
    postNo
) => {
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException();
    }
    if (boardTypeList[boardType].public == false && memberCode === null) {
        throw new UnAuthorizedException();
    }
    const isAnonymous = boardTypeList[boardType].anonymous;

    const [postInfo, likeInfo] = await Promise.all([
        repository.getPostByCode(boardType, postNo),
        likeRepository.getPostLikeByMemberCode(boardType, postNo, memberCode)
    ]);
    if (postInfo === null) {
        throw new NotFoundException();
    }
    if (postInfo.post_deleted) {
        throw new NotFoundException();
    }

    repository.updatePostHit(boardType, postNo);
    const result = {
        postTitle:postInfo.post_title,
        postComments:postInfo.post_comments,
        postContent:postInfo.post_content,
        memberCode:postInfo.member_code,
        memberNickname:postInfo.member_nickname,
        postDate:postInfo.post_date,
        postHit:postInfo.post_hit,
        postLike:postInfo.like,
        permission:false,
        like:false
    }
    if (likeInfo !== null) {
        result.like = likeInfo;
    }
    if (memberCode>0 && postInfo.member_code===memberCode || memberLevel>=3) {
        result.permission=true;
    } else {
        result.permission=false;
    }
    if (isAnonymous) {
        result.memberCode=-1;
        result.memberNickname='ㅇㅇ';
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

	await repository.insertPost(boardType, memberCode, memberNickname, postTitle, xss.process(postContent));
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
    const postMemberCode = await repository.getMemberCodeFromPost(boardType, postNo);
    if (postMemberCode === null) {
        throw new NotFoundException('Post not Found');
    }
    if (!(postMemberCode == memberCode || memberLevel>=3)) {
        throw new ForbiddenException();
    }
    
    await repository.updatePost(boardType, postTitle, xss.process(postContent), postNo);
}

const deletePost = async (memberCode, memberLevel, boardType, postNo) => {
    if (memberCode === null) {
        throw new UnAuthorizedException();
    }
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException('Board not Found');
    }
    const postMemberCode = await repository.getMemberCodeFromPost(boardType, postNo);
    if (postMemberCode === null) {
        throw new NotFoundException('Post not Found');
    }
    if (!(postMemberCode == memberCode || memberLevel>=3)) {
        throw new ForbiddenException();
    }

    await repository.deletePost(boardType, postNo);
}

module.exports = {
    viewPost,
    writePost,
    updatePost,
    deletePost
}