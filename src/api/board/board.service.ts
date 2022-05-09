import { NotFoundException, UnAuthorizedException } from '../../util/exceptions';
import { User } from '../account/User';
import * as boardRepository from './repository/board.repository';
import * as categoryRepository from './repository/category.repository';


let boardTypeList: {
    [index: string]: {
        boardName: string,
        subBoard: {
            boardType: string,
            boardName: string,
        },
        anonymous: boolean,
        public: boolean,
        level: number,
        category: {
            [index: string] : {
                name: string
            }
        }
    }
} = {};

const getBoardType = async () => {
    const boardTypeInfo = await boardRepository.getBoardType();
    const categoryInfo = await categoryRepository.getCategorys();
    if (boardTypeInfo === null) {
        return;
    }
    boardTypeInfo.forEach(e => {
        boardTypeList[e.id] = {
            boardName: e.name,
            subBoard: {
                boardType: e.sub_board_id,
                boardName: e.sub_board_name,
            },
            anonymous: Boolean(e.post_anonymous),
            public: Boolean(e.post_public),
            level: Number(e.post_level),
            category: {
                'normal': {
                    name: '일반'
                }
            }
        }
    });
    categoryInfo?.forEach(e => {
        boardTypeList[e.board].category[e.category] = {
            name: e.name
        }
    });
}
getBoardType();

const viewBoard = async (
    user: User,
    boardType: string,
    page: number,
    limitPost: number
) => {
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException();
    }
    if (boardTypeList[boardType].public == false && !user.getIsLogin()) {
        throw new UnAuthorizedException();
    }
    const isAnonymous = boardTypeList[boardType].anonymous;

    if (page < 1) {
        page = 1;
    }
    if (limitPost < 5) {
        limitPost = 15;
    }

    // 총 게시물 갯수
    const totalPosts = await boardRepository.getTotalPosts(boardType);
    if (totalPosts === null) {
        return {
            board: [],
            pages: 0,
            boardName: boardTypeList[boardType].boardName,
            subBoard: {
                boardType: boardTypeList[boardType].subBoard.boardType,
                boardName: boardTypeList[boardType].subBoard.boardName
            }
        }
    }

    // 게시판 페이지 수 계산
    const startPost = (page-1)*limitPost;
    const totalPage = Math.ceil(totalPosts/limitPost);

    const postInfo = await boardRepository.getPostsByPage(boardType, startPost, limitPost);
    if (postInfo === null) {
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

    return {
        board: postInfo.map(e => {
            if (isAnonymous) {
                e.usercode = -1;
                e.nickname = 'ㅇㅇ';
            }
            if (e.category == null) {
                e.category = 'normal';
            }
            return e;
        }),
        pages: totalPage,
        category: boardTypeList[boardType].category,
        boardName: boardTypeList[boardType].boardName,
        subBoard: {
            boardType: boardTypeList[boardType].subBoard.boardType,
            boardName: boardTypeList[boardType].subBoard.boardName
        }
    }
}

export {
    viewBoard
}