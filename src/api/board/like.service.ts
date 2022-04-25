import { NotFoundException, UnAuthorizedException, ForbiddenException } from '../../util/exceptions';
import { User } from '../account/User';
import * as boardRepository from './repository/board.repository';
import * as likeRepository from './repository/like.repository';
import * as postRepository from './repository/post.repository';

let boardTypeList: {
    [index: string]: {
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
            level: Number(e.like_level)
        }
    });
}
getBoardType();

const like = async (
    user: User,
    boardType: string,
    postNo: number,
    like: number
) => {
    if (!user.getIsLogin()) {
        throw new UnAuthorizedException();
    }
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException();
    }
    if (boardTypeList[boardType].level > user.getUser().level) {
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
        likeRepository.getByUsercode(boardType, postNo, user.getUser().code),
        postRepository.getPostTotalLike(boardType, postNo)
    ]);
    if (postTotalLike === null) {
        throw new NotFoundException('Post not Found');
    }

    // 좋아요 또는 싫어요를 누른 적이 없으면
    if (likeCheck === null) {
        likeRepository.insertPostLike(boardType, postNo, like, user.getUser().code);
        postRepository.updatePostTotalLike(boardType, postNo, like);
        return {
            like: like,
            totalLike: postTotalLike+like
        }
    }

    // 취소한 좋아요 또는 싫어요를 다시 누름
    if (likeCheck == 0) {
        likeRepository.updatePostLike(boardType, postNo, like, user.getUser().code);
        postRepository.updatePostTotalLike(boardType, postNo, like);
        return {
            like: like,
            totalLike: postTotalLike+like
        }
    }

    // 좋아요 또는 싫어요를 한번 더
    if (likeCheck == like) {
        likeRepository.updatePostLike(boardType, postNo, 0, user.getUser().code);
        if (like>0) {// 좋아요를 취소
            postRepository.updatePostTotalLike(boardType, postNo, -1);
            return {
                like: 0,
                totalLike: postTotalLike-1
            }
        } else {// 싫어요를 취소
            postRepository.updatePostTotalLike(boardType, postNo, 1);
            return {
                like: 0,
                totalLike: postTotalLike+1
            }
        }
    }

    // 좋아요에서 싫어요 또는 싫어요에서 좋아요
    if (likeCheck > 0) {// 좋아요에서 싫어요
        likeRepository.updatePostLike(boardType, postNo, like, user.getUser().code);
        postRepository.updatePostTotalLike(boardType, postNo, -2);
        return {
            like: -1,
            totalLike: postTotalLike-2
        }
    } else {// 싫어요에서 좋야요
        likeRepository.updatePostLike(boardType, postNo, like, user.getUser().code);
        postRepository.updatePostTotalLike(boardType, postNo, 2);
        return {
            like: 1,
            totalLike: postTotalLike+2
        }
    }
}

export {
    like
}