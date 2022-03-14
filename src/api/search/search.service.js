const { NotFoundException } = require('../../util/exceptions');
const repository = require('./search.repository');

const getBoard = async (searchType, searchStr) => {
    const searchResult = await repository.getBoard(searchType, searchStr);
    if(searchResult === null){
        throw new NotFoundException();
    }
    return {
        SearchResult: searchResult.map(item => {
            return {
                postNo:item.post_no,
                postTitle:item.post_title,
                memberNickname:item.member_nickname,
                postDate:item.post_date
            }
        })
    }
}

module.exports = {
    getBoard
}