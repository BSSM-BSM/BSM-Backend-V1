const request = require('request').defaults({jar: true})
const iconv = require('iconv-lite')

const model = require('../../models/meister')
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
    iconv.decode(await getHttp(options), 'euc-kr')
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
    result = iconv.decode(await getHttp(options), 'euc-kr')
    options = {
        uri:'https://bssm.meistergo.co.kr/logout.php', 
        method:'GET',
    }
    await getHttp(options)
    res.send(result)
}

const getScore = async (req, res) =>{
    console.log([req.params.grade, req.params.classNo, req.params.studentNo])
    dbResult = await model.getMeisterNo(req.params.grade, req.params.classNo, req.params.studentNo)
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