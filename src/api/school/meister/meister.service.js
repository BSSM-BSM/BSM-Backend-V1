const { BadRequestException, NotFoundException, InternalServerException } = require('../../../util/exceptions');
const repository = require('./meister.repository');
const request = require('request').defaults({jar: true});
const iconv = require('iconv-lite');

let options

const getPoint = async (grade, classNo, studentNo, pw) =>{
    options = {
        uri:'https://bssm.meistergo.co.kr/inc/common_json.php', 
        method:'POST',
        encoding:null,
        form:{
            'caseBy':'login',
            'pw':""+grade,
            'lgtype':'S',
            'hakgwa':'공통과정',
            'hak':""+grade,
            'ban':""+classNo,
            'bun':""+studentNo
        }
    }
    if(iconv.decode(await getHttp(options), 'euc-kr')!='true'){
        throw new BadRequestException();
    }
    options = {
        uri:'https://bssm.meistergo.co.kr/ss/ss_a40j.php', 
        method:'POST',
        encoding:null,
        form:{
            'caseBy':'listview',
            'pageNumber':1,
            'onPageCnt':100,
        }
    }
    const result = iconv.decode(await getHttp(options), 'euc-kr');
    // logout
    options = {
        uri:'https://bssm.meistergo.co.kr/logout.php', 
        method:'GET',
    }
    getHttp(options);
    return result;
}

const getScore = async (grade, classNo, studentNo) =>{
    const studentInfo = await repository.getMeisterNo(grade, classNo, studentNo)
    if(studentInfo === null){
        throw new NotFoundException();
    }
    options = {
        uri:'https://bssm.meistergo.co.kr/_suCert/bssm/B002/jnv_201j.php',
        method:'POST',
        encoding:null,
        form:{
            'caseBy':'getViewer',
            'uniqNo':studentInfo.uniq_no
        }
    }
    return iconv.decode(await getHttp(options), 'euc-kr');
}

const getHttp = (options) =>{
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if(err){
                throw new InternalServerException();
            }
            resolve(body)
        })
    })
}

module.exports = {
    getPoint,
    getScore
}