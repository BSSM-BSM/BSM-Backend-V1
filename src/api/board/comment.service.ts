import { NotFoundException, UnAuthorizedException, BadRequestException, ForbiddenException } from '../../util/exceptions';
import { User } from '../account/User';
import boardRepository = require('./repository/board.repository');
import commentRepository = require('./repository/comment.repository');
import postRepository = require('./repository/post.repository');
import { CommentEntity } from './entity/comment.entity';
import { CommentDTO } from './entity/comment.dto';

import { FilterXSS } from 'xss';
const xss = new FilterXSS({
    whiteList: {
        img: ["e_id", "e_idx", "e_type"]
    },
})

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
            anonymous: Boolean(e.comment_anonymous),
            public: Boolean(e.comment_public),
            level: Number(e.comment_level)
        }
    });
}
getBoardType();

const viewComment = async (
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

    const comments = await commentRepository.getComments(boardType, postNo);
    if (comments === null) {
        return {
            comments: null
        }
    }

    return {
        comments: commentTree(comments, 0, user.getUser().code, user.getUser().level, isAnonymous)// 대댓글 트리
    }
}
const commentTree = (
    commentList: CommentEntity[],
    depth: number,
    usercode: number,
    userLevel: number,
    isAnonymous: boolean
): CommentDTO[] => {
    let result: CommentDTO[] = [];
    let comment: CommentDTO;
    commentList.forEach(e => {
        // 대댓글의 깊이가 불러오려는 현재 깊이와 같은지 확인
        if (e.depth != depth) {
            return [];
        }
        if (!e.deleted) {
            if (isAnonymous) {// 익명 댓글인지 확인
                e.usercode = -1;
                e.nickname = 'ㅇㅇ';
            }
            comment = {
                idx: e.idx,
                usercode: e.usercode,
                nickname: e.nickname,
                comment: e.comment,
                date: e.date,
                depth: depth,
                permission: usercode>0 && e.usercode==usercode || userLevel>=3? true: false,
                deleted: false
            }
        } else {
            comment = {
                idx: e.idx,
                usercode: -1,
                nickname: '',
                comment: '',
                date: e.date,
                depth: depth,
                permission: false,
                deleted: true,
            }
        }
        if (e.parent) {// 만약 대댓글이 더 있다면
            const childList = commentList.filter(child => {// 불러오려는 대댓글들만 배열에 넣음
                return (child.depth != depth && !(child.depth == depth+1 && child.parent_idx != e.idx))
                /*
                밑의 코드로도 표현가능
                if (child.depth != depth) {// 현재 깊이의 댓글이 아니고
                    if (child.depth == depth+1) {// 만약 댓글의 깊이가 바로 밑이라면
                        if (child.parent_idx == e.idx) {// 대댓글의 부모가 현재 댓글과 같다면
                            return true;
                        }
                    } else {//아니면 바로 넣음
                        return true;
                    }
                }
                */
            });
            const childComment: CommentDTO[] = commentTree(childList, depth+1, usercode, userLevel, isAnonymous)// 대댓글 재귀 호출
            if (childComment.length) {
                comment.child = childComment;
            }
        }
        result.push(comment);
    });
    return result;
}
const writeComment = async (
    user: User,
    boardType: string,
    postNo: number,
    comment: string,
    depth: number,
    parentIdx: number | null
) => {
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException('Board not Found');
    }
    if (boardTypeList[boardType].level > user.getUser().level) {
        throw new ForbiddenException();
    }
    
    const newComment = xss.process(comment);
    if (newComment.length < 1) {
        throw new BadRequestException();
    }
    if (depth > 0) {
        depth = depth;
    } else {
        depth = 0;
    }
    if (parentIdx !== null && parentIdx > 0) {
        parentIdx = parentIdx;
    } else {
        parentIdx = null;
    }

    if (await postRepository.getUsercode(boardType, postNo) === null) {
        throw new NotFoundException();
    }
    if (depth > 0 && parentIdx !== null) {
        const parentComment = await commentRepository.getComment(boardType, postNo, parentIdx);
        if (parentComment === null) {
            throw new NotFoundException();
        }
        if (parentComment.depth != depth-1) {
            throw new NotFoundException();
        }
        if (!parentComment.parent && parentIdx !== null) {
            commentRepository.updateParentComment(boardType, parentIdx);
        }
    }

    await Promise.all([
        commentRepository.insertComment(
            boardType,
            postNo,
            depth,
            parentIdx,
            user.getUser().code,
            newComment
        ),
        postRepository.updatePostComments(boardType, postNo, 1)
    ]);
}
const deleteComment = async (
    user: User,
    boardType: string,
    postNo: number,
    commentIdx: number
) => {
    const commentInfo = await commentRepository.getComment(boardType, postNo, commentIdx);
    if (commentInfo === null) {
        throw new NotFoundException();
    }
    if (!(commentInfo.usercode == user.getUser().code || user.getUser().level>=3)) {
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

export {
    viewComment,
    writeComment,
    deleteComment
}