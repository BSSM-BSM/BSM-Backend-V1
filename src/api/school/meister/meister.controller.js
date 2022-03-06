const request = require('request').defaults({jar: true})
const iconv = require('iconv-lite')

const service = require('./meister.service')
let result, options

const getPoint = async (req, res) =>{
    options = {
        uri:'https://bssm.meistergo.co.kr/inc/common_json.php', 
        method:'POST',
        encoding:null,
        form:{
            'caseBy':'login',
            'pw':""+req.body.pw,
            'lgtype':'S',
            'hakgwa':'공통과정',
            'hak':""+req.params.grade,
            'ban':""+req.params.classNo,
            'bun':""+req.params.studentNo
        }
    }
    if(iconv.decode(await getHttp(options), 'euc-kr')=='true'){
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
        result={
            status:1,
            subStatus:0,
            result:iconv.decode(await getHttp(options), 'euc-kr')
        }
        options = {
            uri:'https://bssm.meistergo.co.kr/logout.php', 
            method:'GET',
        }
        getHttp(options)
    }else{
        result={
            status:5,
            subStatus:0
        }
    }
    res.send(result)
}

const getScore = async (req, res) =>{
    dbResult = await service.getMeisterNo(req.params.grade, req.params.classNo, req.params.studentNo)
    if(dbResult){
        options = {
            uri:'https://bssm.meistergo.co.kr/_suCert/bssm/B002/jnv_201j.php',
            method:'POST',
            encoding:null,
            form:{
                'caseBy':'getViewer',
                'uniqNo':dbResult['uniq_no']
            }
        }
        result={
            status:1,
            subStatus:0,
            result:iconv.decode(await getHttp(options), 'euc-kr')
        }
    }else{
        result={
            status:3,
            subStatus:8
        }
    }
    res.send(JSON.stringify(result))
}

const getHttp = (options) =>{
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            resolve(body)
        })
    })
}

module.exports = {
    getPoint:getPoint,
    getScore:getScore
}