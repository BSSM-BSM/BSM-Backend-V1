const jwt = require('../../jwt')
const model = require('../../models/account')
const funcModel = require('../../models/function')
const crypto = require('crypto')
const sharp = require('sharp')
const mail = require('../../mail')

let result
let dbResult
const login = async (req, res) =>{
    dbResult = await model.getMemberId(req.body.member_id)
    result={
        status:5,
        subStatus:0
    }
    if(dbResult){
        if(dbResult.member_salt===''){
            if(dbResult.member_pw===crypto.createHash('sha3-256').update(req.body.member_pw).digest('hex')){
                const jwtToken = jwt.sign({
                    isLogin:false,
                    pwEdit:dbResult.member_code
                }, '300s');
                res.cookie('token', jwtToken.token, {
                    path:"/",
                    httpOnly:true,
                    secure:true,
                    maxAge:1000*60*5// 5분동안 1000ms*60초*5분
                });
                result={
                    status:4,
                    subStatus:2
                }
            }
        }else{
            if(dbResult.member_pw===crypto.createHash('sha3-256').update(dbResult.member_salt+req.body.member_pw).digest('hex')){
                const jwtToken = await jwt.sign({
                    isLogin:true,
                    memberCode:dbResult.member_code,
                    memberId:dbResult.member_id,
                    memberNickname:dbResult.member_nickname,
                    memberLevel:dbResult.member_level,
                    grade:dbResult.member_grade,
                    classNo:dbResult.member_class,
                    studentNo:dbResult.member_studentNo
                }, '60d');
                res.cookie('token', jwtToken.token, {
                    path:"/",
                    httpOnly:true,
                    secure:true,
                    maxAge:24*60*1000*60*60// 60일간 저장 24시간*60일*1000ms*60초*60분
                });
                res.cookie('refreshToken', jwtToken.refreshToken, {
                    path:"/",
                    httpOnly:true,
                    secure:true,
                    maxAge:24*60*1000*60*60// 60일간 저장 24시간*60일*1000ms*60초*60분
                });
                result={
                    status:1,
                    subStatus:0,
                    jwt:jwtToken
                }
            }
        }
    }
    res.send(JSON.stringify(result))
}
const signUp = async (req, res) =>{
    result={
        status:2,
        subStatus:2
    }
    if(req.body.member_pw!==req.body.member_pw_check){// 비밀번호 재입력 확인
        result={
            status:5,
            subStatus:1,
        }
        res.send(JSON.stringify(result))
        return 0
    }
    if(await funcModel.overlapCheck('members', 'member_id', req.body.member_id)){// 아이디 중복체크
        result={
            status:5,
            subStatus:2,
        }
        res.send(JSON.stringify(result))
        return 0
    }
    if(await funcModel.overlapCheck('members', 'member_nickname', req.body.member_nickname)){// 닉네임 중복체크
        result={
            status:5,
            subStatus:3,
        }
        res.send(JSON.stringify(result))
        return 0
    }
    if(!await funcModel.overlapCheck('valid_code', 'code', req.body.code)){// 인증코드 존재여부 체크
        result={
            status:3,
            subStatus:2,
        }
        res.send(JSON.stringify(result))
        return 0
    }
    if(!await funcModel.validCheck('valid_code', 'code', req.body.code, 'valid', 1)){// 인증코드 유효체크
        result={
            status:4,
            subStatus:3,
        }
        res.send(JSON.stringify(result))
        return 0
    }
    if(await model.signUp(req.body.member_id, req.body.member_pw, req.body.member_nickname, req.body.code)){
        result={
            status:1,
            subStatus:0
        }
    }
    res.send(JSON.stringify(result))
}
const islogin = async (req, res) =>{
    if(!await jwt.check(req.cookies.token).isLogin){
        result={
            status:1,
            subStatus:0,
            is_login:true
        }
    }else{
        result={
            status:1,
            subStatus:0,
            is_login:false
        }
    }
    res.send(result)
}
const view = async (req, res) =>{
    const jwtValue = await jwt.check(req.cookies.token);
    dbResult = await model.getMemberCode(req.params.memberCode)
    if(jwtValue.memberCode>0 && dbResult.memberCode==jwtValue.memberCode){
        dbResult.permission=true;
    }else{
        dbResult.permission=false;
    }
    result={
        status:1,
        subStatus:0,
        member:dbResult
    }
    res.send(JSON.stringify(result))
}
const profileUpload = async (req, res) =>{
    const fileDir="public/resource/member/profile_images/"
    result={
        status:1,
        subStatus:0,
        filePath:fileDir.split('.')[0]+'.png'
    }
    await sharp(fileDir+req.file.filename)
    .resize({width:128,height:128})
    .png()
    .toFile(fileDir+req.file.filename.split('.')[0].split('-')[1]+'.png', (error, info) => {
        if(error){
            result={
                status:2,
                subStatus:4
            }
        }
    })
    res.send(JSON.stringify(result))
}
const validCode = async (req, res) =>{
    dbResult = await model.getMember(req.body.student_enrolled, req.body.student_grade, req.body.student_class, req.body.student_no, req.body.student_name)
    if(dbResult){
        if(dbResult.member_class<10){
            dbResult.member_class="0"+dbResult.member_class
        }
        if(dbResult.member_studentNo<10){
            dbResult.member_studentNo="0"+dbResult.member_studentNo
        }
        const userMail = ""+dbResult.member_enrolled+dbResult.member_grade+dbResult.member_class+dbResult.member_studentNo+"@bssm.hs.kr"
        const subject = 'BSM 회원가입 인증 코드입니다';
        const content = `
        <!DOCTYPE HTML>
        <html lang="kr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <div style="display:flex;justify-content:center;">
                <div style="padding:25px 0;text-align:center;margin:0 auto;border:solid 5px;border-radius:25px;font-family:-apple-system,BlinkMacSystemFont,\'Malgun Gothic\',\'맑은고딕\',helvetica,\'Apple SD Gothic Neo\',sans-serif;background-color:#202124; color:#e8eaed;">
                    <img src="https://bssm.kro.kr/icons/logo.png" alt="로고" style="height:35px; padding-top:12px;">
                    <h1 style="font-size:28px;margin-left:25px;margin-right:25px;">BSM 회원가입 인증 코드입니다.</h1>
                    <h2 style="display:inline-block;font-size:20px;font-weight:bold;text-align:center;margin:0;color:#e8eaed;padding:15px;border-radius:7px;box-shadow:20px 20px 50px rgba(0, 0, 0, 0.5);background-color:rgba(192, 192, 192, 0.2);">${dbResult.code}</h2>
                    <br><br><br>
                    <div style="background-color:rgba(192, 192, 192, 0.2);padding:10px;text-align:left;font-size:14px;">
                        <p style="margin:0;">- 본 이메일은 발신전용 이메일입니다.</p>
                        <p style="margin:0;">- 인증 코드는 한 사람당 한 개의 계정에만 쓸 수 있습니다.</p>
                    </div><br>
                    <footer style="padding:15px 0;bottom:0;width:100%;font-size:15px;text-align:center;font-weight:bold;">
                        <p style="margin:0;">부산 소프트웨어 마이스터고 학교 지원 서비스</p>
                        <p style="margin:0;">Copyright 2021. BSM TEAM all rights reserved.</p>
                    </footer>
                </div>
            </div>
        </body>
        </html>
        `;
        res.send(JSON.stringify(await mail.send(userMail, subject, content)));
    }else{
        result={
            status:3,
            subStatus:8
        }
        res.send(JSON.stringify(result))
    }
}
const pwResetMail = async (req, res) => {
    dbResult = await model.getMemberId(req.body.member_id)
    if(dbResult){
        if(dbResult.member_class<10){
            dbResult.member_class="0"+dbResult.member_class
        }
        if(dbResult.member_studentNo<10){
            dbResult.member_studentNo="0"+dbResult.member_studentNo
        }
        const jwtToken = jwt.sign({
            isLogin:false,
            pwEdit:dbResult.member_code
        }, '300s');
        const userMail = ""+dbResult.member_enrolled+dbResult.member_grade+dbResult.member_class+dbResult.member_studentNo+"@bssm.hs.kr"
        const subject = 'BSM 비밀번호 재설정 링크입니다';
        const content = `
        <!DOCTYPE HTML>
        <html lang="kr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <div style="display:flex;justify-content:center;">
                <div style="padding:25px 0;text-align:center;margin:0 auto;border:solid 5px;border-radius:25px;font-family:-apple-system,BlinkMacSystemFont,\'Malgun Gothic\',\'맑은고딕\',helvetica,\'Apple SD Gothic Neo\',sans-serif;background-color:#202124; color:#e8eaed;">
                    <img src="https://bssm.kro.kr/icons/logo.png" alt="로고" style="height:35px; padding-top:12px;">
                    <h1 style="font-size:28px;margin-left:25px;margin-right:25px;">BSM 비밀번호 재설정 링크입니다.</h1>
                    <a href="https://bssm.kro.kr/pwReset?token=${jwtToken.token}" style="display:inline-block;font-size:20px;text-decoration:none;font-weight:bold;text-align:center;margin:0;color:#e8eaed;padding:15px;border-radius:7px;box-shadow:20px 20px 50px rgba(0, 0, 0, 0.5);background-color:rgba(192, 192, 192, 0.2);">비밀번호 재설정</a>
                    <br><br><br>
                    <div style="background-color:rgba(192, 192, 192, 0.2);padding:10px;text-align:left;font-size:14px;">
                        <p style="margin:0;">- 본 이메일은 발신전용 이메일입니다.</p>
                        <p style="margin:0;">- 해당 링크는 발송시점으로 부터 5분동안 유효합니다</p>
                    </div><br>
                    <footer style="padding:15px 0;bottom:0;width:100%;font-size:15px;text-align:center;font-weight:bold;">
                        <p style="margin:0;">부산 소프트웨어 마이스터고 학교 지원 서비스</p>
                        <p style="margin:0;">Copyright 2021. BSM TEAM all rights reserved.</p>
                    </footer>
                </div>
            </div>
        </body>
        </html>
        `;
        res.send(JSON.stringify(await mail.send(userMail, subject, content)));
    }else{
        result={
            status:5,
            subStatus:0
        }
        res.send(JSON.stringify(result))
    }
}
const pwEdit = async (req, res) =>{
    const jwtValue = jwt.verify(req.cookies.token);
    if(jwtValue=='EXPIRED'){
        return res.send(JSON.stringify({status:3,subStatus:10}))
    }
    result={
        status:3,
        subStatus:0
    }
    if(jwtValue.pwEdit||jwtValue.memberCode){
        let memberCode
        if(jwtValue.memberCode) memberCode = jwtValue.memberCode
        if(jwtValue.pwEdit) memberCode = jwtValue.pwEdit
        if(req.body.member_pw!==req.body.member_pw_check){// 비밀번호 재입력 확인
            result={
                status:5,
                subStatus:1,
            }
        }else{
            if(await model.pwEdit(memberCode, req.body.member_pw)){
                res.clearCookie('token');
                res.clearCookie('refreshToken');
                result={
                    status:1,
                    subStatus:0
                }
            }else{
                result={
                    status:2,
                    subStatus:0
                }
            }
        }
    }
    res.send(JSON.stringify(result))
}
module.exports = {
    login:login,
    islogin:islogin,
    signUp:signUp,
    view:view,
    profileUpload:profileUpload,
    validCode:validCode,
    pwResetMail:pwResetMail,
    pwEdit:pwEdit
}