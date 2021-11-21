let result
const get = async (req, res) =>{
    switch(req.params.app){
        case 'web':
            result={
                status:1,
                subStatus:0,
                versionCode:1,
                versionName:'1.0.0'
            }
            break
        case 'app':
            switch(req.params.os){
                case 'android':
                    result={
                        status:1,
                        subStatus:0,
                        versionCode:7,
                        versionName:'1.0.0'
                    }
                    break;
            }
            break;
    }
    res.send(result)
}
const getLegacy = async (req, res) =>{
    result={
        status:1,
        subStatus:0,
        versionCode:7,
        versionName:'1.0.0\n현재 호환되지 않는 버전을 사용하고 있습니다\n이 버전의 대부분의 기능이 작동되지 않을 수 있습니다\n업데이트 해주시길 바랍니다'
    }
    res.send(result)
}
module.exports = {
    get:get,
    getLegacy:getLegacy
}