let result
const upload = async (req, res) =>{
    if(!req.session.isLogin){res.send(JSON.stringify({status:4,subStatus:1}));return;}
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