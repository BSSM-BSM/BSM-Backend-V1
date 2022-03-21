const { NotFoundException, UnAuthorizedException, BadRequestException, ForbiddenException } = require('../../util/exceptions');
const commentRepository = require('./repository/comment.repository');
const postRepository = require('./repository/post.repository');
const js_xss = require('xss');
const xss = new js_xss.FilterXSS({
    whiteList: {
        img: ["e_id", "e_idx", "e_type"]
    },
})


const boardTypeList = {
    board:{
        anonymous:false,
        public:false
    },
    anonymous:{
        anonymous:true,
        public:true
    },
    notice:{
        anonymous:false,
        public:true
    }
}

const viewComment = async (memberCode, memberLevel, boardType, postNo) => {
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException();
    }
    if (boardTypeList[boardType].public == false && memberCode === null) {
        throw new UnAuthorizedException();
    }
    const isAnonymous = boardTypeList[boardType].anonymous;

    const comments = await commentRepository.getComments(boardType, postNo);
    if (comments === null) {
        return {
            comments: null
        }
    }

    return {
        comments: commentTree(comments, 0, memberCode, memberLevel, isAnonymous)// 대댓글 트리
    }
}
const commentTree = (commentList, depth, memberCode, memberLevel, isAnonymous) => {
    let result = [];
    let comment = {}
    commentList.forEach(e => {
        // 대댓글의 깊이가 불러오려는 현재 깊이와 같은지 확인
        if (e.depth!=depth) {
            return;
        }
        if (e.comment_deleted==0) {
            if (memberCode>0 && e.member_code===memberCode || memberLevel>=3) {// 자신의 댓글인지 확인
                e.permission=true;
            } else {
                e.permission=false;
            }
            if (isAnonymous) {// 익명 댓글인지 확인
                e.member_code=-1
                e.member_level=0
                e.member_nickname='ㅇㅇ'
            }
            comment = {
                idx:e.comment_index,
                memberCode:e.member_code,
                memberNickname:e.member_nickname,
                memberLevel:e.member_level,
                comment:e.comment,
                commentDate:e.comment_date,
                depth:depth,
                permission:e.permission,
                deleted:false
            }
        } else {
            comment = {
                idx:e.comment_index,
                memberCode:-1,
                memberNickname:"삭제된 댓글 입니다",
                memberLevel:0,
                comment:"",
                commentDate:e.comment_date,
                depth:depth,
                permission:false,
                deleted:true,
            }
        }
        if (e.parent==1) {// 만약 대댓글이 더 있다면
            let childList = []
            commentList.forEach(child => {// 불러오려는 대댓글들만 배열에 넣음
                if (
                    child.depth!=depth &&// 현재 깊이의 댓글이 아니고
                    !(child.depth==depth+1 && child.parent_idx!=e.comment_index)) {
                    /*
                    자신의 자식 댓글들만 불러오기위한 조건문
                    만약 댓글의 깊이가 바로 밑이고 대댓글의 부모가 현재 댓글과 같다면
                    !(1 && 0) -> !(0) -> 1
                    만약 댓글의 깊이가 바로 밑이고 대댓글의 부모가 현재 댓글과 다르다면
                    !(1 && 1) -> !(1) -> 0
                    만약 댓글의 깊이가 바로 밑이아니고 대댓글의 부모가 현재 댓글과 같다면
                    !(0 && 0) -> !(0) -> 1
                    만약 댓글의 깊이가 바로 밑이아니고 대댓글의 부모가 현재 댓글과 다르다면
                    !(0 && 1) -> !(0) -> 1
                    
                    밑의 코드로도 표현가능
                    if (child.depth!=depth) {// 현재 깊이의 댓글이 아니고
                        if (child.depth==depth+1) {// 만약 댓글의 깊이가 바로 밑이라면
                            if (child.parent_idx==e.comment_index) {// 대댓글의 부모가 현재 댓글과 같다면
                                childList.push(child);
                            }
                        } else {//아니면 바로 넣음
                            childList.push(child);
                        }
                    }
                    */
                    childList.push(child);
                }
            });
            comment.child=commentTree(childList, depth+1, memberCode, memberLevel, isAnonymous)// 대댓글 재귀 호출
        }
        result.push(comment)
    });
    return result;
}
const writeComment = async (memberCode, memberNickname, boardType, postNo, comment, depth, parentIdx) => {
    if (memberCode === null) {
        throw new UnAuthorizedException();
    }
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException('Board not Found');
    }
    
    if (comment == undefined || comment.length < 1) {
        throw new BadRequestException();
    }
    if (parseInt(depth)>0) {
        depth=parseInt(depth);
    } else {
        depth=0;
    }
    if (parseInt(parentIdx)>0) {
        parentIdx=parseInt(parentIdx);
    } else {
        parentIdx=null;
    }

    if (await postRepository.getMemberCodeFromPost(boardType, postNo) === null) {
        throw new NotFoundException();
    }
    if (depth>0) {
        const parentComment = await commentRepository.getComment(boardType, postNo, parentIdx);
        if (parentComment === null) {
            throw new NotFoundException();
        }
        if (parentComment.depth != depth-1) {
            throw new NotFoundException(depth);
        }
        if (parentComment.parent == 0) {
            commentRepository.updateParentComment(boardType, parentIdx);
        }
    }

    await Promise.all([
        commentRepository.insertComment(
            boardType,
            postNo,
            depth,
            parentIdx,
            memberCode,
            memberNickname,
            xss.process(comment)
        ),
        postRepository.updatePostComments(boardType, postNo, 1)
    ]);
}
const deleteComment = async (memberCode, memberLevel, boardType, postNo, commentIdx) => {
    const commentInfo = await commentRepository.getComment(boardType, postNo, commentIdx);
    if (commentInfo === null) {
        throw new NotFoundException();
    }
    if (!(commentInfo.member_code == memberCode || memberLevel>=3)) {
        throw new ForbiddenException();
    }
    
    await Promise.all([
        commentRepository.deleteComment(
            boardType,
            postNo,
            commentIdx
        ),
        postRepository.updatePostComments(boardType, postNo, -1)
    ]);
}

module.exports = {
    viewComment,
    writeComment,
    deleteComment
}