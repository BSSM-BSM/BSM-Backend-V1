const jwt = require('../../jwt')
let result
const upload = async (req, res) =>{
    if(!await jwt.check(req.cookies.token).isLogin){res.send(JSON.stringify(jwtValue.msg));return;}
    result={
        status:1,
        subStatus:0,
        filePath:"/resource/board/upload_images/"+req.file.filename
    }
    res.send(JSON.stringify(result))
}

module.exports = {
    upload:upload
}