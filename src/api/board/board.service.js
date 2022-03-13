const { NotFoundException, UnAuthorizedException } = require('../../util/exceptions');
const repository = require('./repository/board.repository');

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

const viewBoard = async (memberCode, boardType, page, limitPost) => {
    if(typeof boardTypeList[boardType] === 'undefined'){
        throw new NotFoundException();
    }
    if(boardTypeList[boardType].public == false && memberCode === null){
        throw new UnAuthorizedException();
    }
    const isAnonymous = boardTypeList[boardType].anonymous;

    if(parseInt(page)>=1){
        page=parseInt(page);
    }else{
        page=1;
    }
    if(parseInt(limitPost)>=5){
        limitPost=parseInt(limitPost);
    }else{
        limitPost=15;
    }

    // 총 게시물 갯수
    const totalPosts = await repository.getTotalPosts(boardType);
    if(totalPosts === null){
        throw new NotFoundException();
    }

    // 게시판 페이지 수 계산
    const startPost = (page-1)*limitPost;
    const totalPage = Math.ceil(totalPosts/limitPost);

    const posts = await repository.getPostsByPage(boardType, startPost, limitPost);
    if(posts === null){
        throw new NotFoundException();
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
        pages: totalPage
    }
}

module.exports = {
    viewBoard,
}