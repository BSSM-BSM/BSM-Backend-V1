const { NotFoundException, UnAuthorizedException, ForbiddenException } = require('../../util/exceptions');
const boardRepository = require('./repository/board.repository');
const likeRepository = require('./repository/like.repository');
const postRepository = require('./repository/post.repository');

let boardTypeList = {};
const getBoardType = async () => {
    const boardTypeInfo = await boardRepository.getBoardType();
    boardTypeInfo.forEach(e => {
        boardTypeList[e.id] = {
            level: e.like_level
        }
    });
}
getBoardType();

const like = async (memberCode, memberLevel, boardType, postNo, like) => {
    if (memberCode === null) {
        throw new UnAuthorizedException();
    }
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException();
    }
    if (boardTypeList[boardType].level > memberLevel) {
        throw new ForbiddenException();
    }

    if (like > 0) {
        like = 1
    } else if (like < 0) {
        like =- 1
    } else {
        like = 0
    }

    const [likeCheck, postTotalLike] = await Promise.all([
        likeRepository.getPostLikeByMemberCode(boardType, postNo, memberCode),
        postRepository.getPostTotalLike(boardType, postNo)
    ])

    // 좋아요 또는 싫어요를 누른 적이 없으면
    if (likeCheck === null) {
        likeRepository.insertPostLike(boardType, postNo, like, memberCode);
        postRepository.updatePostTotalLike(boardType, postNo, like);
        return {
            like: like,
            postLike: postTotalLike+like
        }
    }

    // 취소한 좋아요 또는 싫어요를 다시 누름
    if (likeCheck == 0) {
        likeRepository.updatePostLike(boardType, postNo, like, memberCode);
        postRepository.updatePostTotalLike(boardType, postNo, like, memberCode);
        return {
            like: like,
            postLike: postTotalLike+like
        }
    }

    // 좋아요 또는 싫어요를 한번 더
    if (likeCheck == like) {
        likeRepository.updatePostLike(boardType, postNo, 0, memberCode);
        if (like>0) {// 좋아요를 취소
            postRepository.updatePostTotalLike(boardType, postNo, -1);
            return {
                like: 0,
                postLike: postTotalLike-1
            }
        } else {// 싫어요를 취소
            postRepository.updatePostTotalLike(boardType, postNo, 1);
            return {
                like: 0,
                postLike: postTotalLike+1
            }
        }
    }

    // 좋아요에서 싫어요 또는 싫어요에서 좋아요
    if (likeCheck > 0) {// 좋아요에서 싫어요
        likeRepository.updatePostLike(boardType, postNo, like, memberCode);
        postRepository.updatePostTotalLike(boardType, postNo, -2);
        return {
            like: -1,
            postLike: postTotalLike-2
        }
    } else {// 싫어요에서 좋야요
        likeRepository.updatePostLike(boardType, postNo, like, memberCode);
        postRepository.updatePostTotalLike(boardType, postNo, 2);
        return {
            like: 1,
            postLike: postTotalLike+2
        }
    }
}

module.exports = {
    like,
}