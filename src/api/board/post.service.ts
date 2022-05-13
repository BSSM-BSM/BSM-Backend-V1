import { NotFoundException, UnAuthorizedException, ForbiddenException, BadRequestException } from '@src/util/exceptions';
import { User } from '@src/api/account/User';
import * as boardRepository from '@src/api/board/repository/board.repository';
import * as postRepository from '@src/api/board/repository/post.repository';
import * as likeRepository from '@src/api/board/repository/like.repository';
import * as categoryRepository from '@src/api/board/repository/category.repository';

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
    delete postInfo.deleted;

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
        like: number
    } = {
        ...postInfo,
        permission: false,
        like: 0
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
    user: User,
    boardType: string,
    title: string,
    content: string,
    category: string
) => {
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException('Board not Found');
    }
    if (boardTypeList[boardType].level > user.getUser().level) {
        throw new ForbiddenException();
    }
    if (!title || !content || !boardTypeList[boardType].category[category]) {
        throw new BadRequestException();
    }

	await postRepository.insertPost(boardType, user.getUser().code, title, xss.process(content), category=='normal'? null: category);
    if (boardType == 'notice') {
        const payload = JSON.stringify({
            title: '새로운 공지사항이 있습니다',
            body: title,
            link: '/board/notice'
        })
        webpush.push(payload, 'all');
    }
}

const updatePost = async (
    user: User,
    boardType: string,
    postNo: number,
    title: string,
    content: string,
    category: string
) => {
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException('Board not Found');
    }
    const postUsercode = await postRepository.getUsercode(boardType, postNo);
    if (postUsercode === null) {
        throw new NotFoundException('Post not Found');
    }
    if (!(postUsercode == user.getUser().code || user.getUser().level >= 3)) {
        throw new ForbiddenException();
    }
    if (!title || !content || !boardTypeList[boardType].category[category]) {
        throw new BadRequestException();
    }
    
    await postRepository.updatePost(boardType, postNo, title, xss.process(content), category=='normal'? null: category);
}

const deletePost = async (
    user: User,
    boardType: string,
    postNo: number
) => {
    if (typeof boardTypeList[boardType] === 'undefined') {
        throw new NotFoundException('Board not Found');
    }
    const postUsercode = await postRepository.getUsercode(boardType, postNo);
    if (postUsercode === null) {
        throw new NotFoundException('Post not Found');
    }
    if (!(postUsercode == user.getUser().code || user.getUser().level >= 3)) {
        throw new ForbiddenException();
    }

    await postRepository.deletePost(boardType, postNo);
}

export {
    viewPost,
    writePost,
    updatePost,
    deletePost
}