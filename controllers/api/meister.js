const request = require('request').defaults({jar: true})
const iconv = require('iconv-lite')

let result, options

const get = async (req, res) =>{
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
    result = iconv.decode(await getHttp(options), 'euc-kr')
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

const getHttp = (options) =>{
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            resolve(body)
        })
    })
}

module.exports = {
    get:get
}