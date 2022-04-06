const { NotFoundException, UnAuthorizedException } = require('../../util/exceptions');
const boardRepository = require('./repository/board.repository');


let boardTypeList = {};
const getBoardType = async () => {
    const boardTypeInfo = await boardRepository.getBoardType();
    boardTypeInfo.forEach(e => {
        boardTypeList[e.id] = {
            boardName: e.name,
            subBoard: {
                boardType: e.sub_board_id,
                boardName: e.sub_board_name,
            },
            anonymous: e.post_anonymous,
            public: e.post_public,
            level: e.post_level
        }
    });
}
getBoardType();

const viewBoard = async (memberCode, boardType, page, limitPost) => {
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException();
    }
    if (boardTypeList[boardType].public == false && memberCode === null) {
        throw new UnAuthorizedException();
    }
    const isAnonymous = boardTypeList[boardType].anonymous;

    if (parseInt(page)>=1) {
        page=parseInt(page);
    } else {
        page=1;
    }
    if (parseInt(limitPost)>=5) {
        limitPost=parseInt(limitPost);
    } else {
        limitPost=15;
    }

    // 총 게시물 갯수
    const totalPosts = await boardRepository.getTotalPosts(boardType);
    // 게시판 페이지 수 계산
    const startPost = (page-1)*limitPost;
    const totalPage = Math.ceil(totalPosts/limitPost);

    const posts = await boardRepository.getPostsByPage(boardType, startPost, limitPost);
    if (posts === null) {
        return {
            board: [],
            pages: totalPage,
            boardName: boardTypeList[boardType].boardName,
            subBoard: {
                boardType: boardTypeList[boardType].subBoard.boardType,
                boardName: boardTypeList[boardType].subBoard.boardName
            }
        }
    }

    const result = posts.map(e => {
        return {
            postNo:e.post_no,
            postTitle:e.post_title,
            postComments:e.post_comments,
            memberCode:isAnonymous? -1: e.member_code,
            memberNickname:isAnonymous? 'ㅇㅇ': e.member_nickname,
            postDate:e.post_date,
            postHit:e.post_hit,
            postLike:e.like,
        }
    })

    return {
        board: result,
        pages: totalPage,
        boardName: boardTypeList[boardType].boardName,
        subBoard: {
            boardType: boardTypeList[boardType].subBoard.boardType,
            boardName: boardTypeList[boardType].subBoard.boardName
        }
    }
}

module.exports = {
    viewBoard
}