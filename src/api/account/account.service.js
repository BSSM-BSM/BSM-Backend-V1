const { NotFoundException, BadRequestException, UnAuthorizedException, ConflictException, InternalServerException } = require('../../util/exceptions');
const repository = require('./account.repository');
const tokenRepository = require('./token.repository');
const jwt = require('../../util/jwt');
const crypto = require('crypto');
const sharp = require('sharp');
const mail = require('../../util/mail');
import { User } from './User';

const login = async (res, userId, userPw) => {
    const userInfo = await repository.getById(userId);
    if (userInfo === null) {
        throw new BadRequestException();
    }
    if (userInfo.user_pw != crypto.createHash('sha3-256').update(userInfo.user_pw_salt+userPw).digest('hex')) {
        throw new BadRequestException();
    }
    const user = new User(userInfo);
    if (!user.getIsLogin()) {
        throw new InternalServerException('Failed to login');
    }

    const jwtToken = await jwt.login(user.getUser(), '1h');
    res.cookie('token', jwtToken.token, {
        domain:'.bssm.kro.kr',
        path:'/',
        httpOnly:true,
        secure:true,
        maxAge:1000*60*60// 1시간 동안 저장 1000ms*60초*60분
    });
    res.cookie('refreshToken', jwtToken.refreshToken, {
        domain:'.bssm.kro.kr',
        path:'/',
        httpOnly:true,
        secure:true,
        maxAge:24*60*1000*60*60// 60일간 저장 24시간*60일*1000ms*60초*60분
    });
    return {
        token:jwtToken.token,
        refreshToken:jwtToken.refreshToken    
    }
}

const viewUser = async (memberCode, viewMemberCode) => {
    const memberInfo = await repository.getMemberByCode(viewMemberCode);
    let member = {};
    if (memberInfo === null) {
        if (viewMemberCode == 0) {
            member.memberType = "deleted";
            member.memberCode = viewMemberCode;
        } else if (viewMemberCode == -1) {
            member.memberType = "anonymous";
            member.memberCode = viewMemberCode;
        } else {
            member.memberType = "none";
            member.memberCode = viewMemberCode;
        }
        return {
            user:member
        };
    }
    member.memberType = "active";
    member.memberCode = viewMemberCode;
    member.memberNickname = memberInfo.member_nickname;
    member.memberLevel = memberInfo.member_level;
    member.memberCreated = memberInfo.member_created;
    member.memberEnrolled = memberInfo.member_enrolled;
    member.memberGrade = memberInfo.member_grade;
    member.memberClass = memberInfo.member_class;
    member.memberStudentNo = memberInfo.member_studentNo;
    member.memberName = memberInfo.member_name;
    if (memberCode>0 && memberInfo.member_code == memberCode) {
        member.permission=true;
    } else {
        member.permission=false;
    }
    return {
        user:member
    };
}

const signUp = async (memberId, memberPw, memberPwCheck, memberNickname, code) => {
    if (memberPw != memberPwCheck) {
        throw new BadRequestException('Password not match');
    }
    const [existId, existNickname] = await Promise.all([
        repository.getMemberById(memberId),
        repository.getMemberByNickname(memberNickname)
    ]);
    if (existId) {
        throw new ConflictException('Existing id');
    }
    if (existNickname) {
        throw new ConflictException('Existing nickname');
    }

    //인증코드로 유저정보를 가져옴
    const studentInfo = await repository.getStudentInfoByCode(code);
    if (studentInfo === null) {
        throw new NotFoundException('Code not found');
    }

    await repository.signUp(
        studentInfo.member_level,
        memberId,
        memberPw,
        memberNickname,
        studentInfo.member_enrolled,
        studentInfo.member_grade,
        studentInfo.member_class,
        studentInfo.member_studentNo,
        studentInfo.member_name,
        studentInfo.email,
        studentInfo.uniq_no,
    )

    repository.updateCodeAvailable(code, false);
}

const profileUpload = async (filename) => {
    const fileDir='public/resource/user/profile_images/';
    await sharp(fileDir+filename)
    .resize({width:128,height:128})
    .png()
    .toFile(fileDir+filename.split('.')[0].split('-')[1]+'.png', (err) => {
        if (err) {
            throw new InternalServerException('Failed to upload profile');
        }
    })
}

const validCodeMail = async (studentEnrolled, studentGrade, studentClass, studentNo, studentName) => {
    const memberInfo = await repository.getMemberFromCode(studentEnrolled, studentGrade, studentClass, studentNo, studentName);
    if (memberInfo === null) {
        throw new NotFoundException('User not found');
    }

    const userMail = memberInfo.email;
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
                <h2 style="display:inline-block;font-size:20px;font-weight:bold;text-align:center;margin:0;color:#e8eaed;padding:15px;border-radius:7px;box-shadow:20px 20px 50px rgba(0, 0, 0, 0.5);background-color:rgba(192, 192, 192, 0.2);">${memberInfo.code}</h2>
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
    await mail.send(userMail, subject, content);
}

const pwResetMail = async (memberId) => {
    const memberInfo = await repository.getMemberById(memberId);
    if (memberInfo === null) {
        throw new NotFoundException('User not found');
    }

    const jwtToken = jwt.sign({
        isLogin:false,
        pwEdit:memberInfo.member_code
    }, '300s');
    const userMail = memberInfo.email;
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
    await mail.send(userMail, subject, content);
}

const findIdMail = async (studentEnrolled, studentGrade, studentClass, studentNo, studentName) => {
    const studentInfo = await repository.getMemberFromCode(studentEnrolled, studentGrade, studentClass, studentNo, studentName);
    if (studentInfo === null) {
        throw new NotFoundException('User not found');
    }
    const userInfo = await repository.getMemberByUniqNo(studentInfo.uniq_no);
    if (userInfo === null) {
        throw new NotFoundException('User not found');
    }

    const userMail = userInfo.email;
    const subject = 'BSM ID 복구 메일입니다';
    const content = `
    <!DOCTYPE HTML>
    <html lang="kr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div style="display:flex;justify-content:center;">
            <div style="padding:25px 0;text-align:center;margin:0 auto;border:solid 5px;border-radius:25px;font-family:-apple-system,BlinkMacSystemFont,\'Malgun Gothic\',\'맑은고딕\',helvetica,\'Apple SD Gothic Neo\',sans-serif;background-color:#202124; color:#e8eaed; width:400px;">
                <img src="https://bssm.kro.kr/icons/logo.png" alt="로고" style="height:35px; padding-top:12px;">
                <h1 style="font-size:28px;margin-left:25px;margin-right:25px;">BSM ID 복구 메일입니다</h1>
                <h2 style="display:inline-block;font-size:20px;font-weight:bold;text-align:center;margin:0;color:#e8eaed;padding:15px;border-radius:7px;box-shadow:20px 20px 50px rgba(0, 0, 0, 0.5);background-color:rgba(192, 192, 192, 0.2);">${userInfo.user_id}</h2>
                <br><br><br>
                <div style="background-color:rgba(192, 192, 192, 0.2);padding:10px;text-align:left;font-size:14px;">
                    <p style="margin:0;">- 본 이메일은 발신전용 이메일입니다.</p>
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
    await mail.send(userMail, subject, content);
}

const pwEdit = async (res, memberCode, memberPw, memberPwCheck) => {
    if (memberPw != memberPwCheck) {
        throw new BadRequestException('Password not match');
    }
    await repository.updatePWByCode(memberCode, memberPw);
    res.clearCookie('token', {
        domain:'.bssm.kro.kr',
        path:'/',
    });
    res.clearCookie('refreshToken', {
        domain:'.bssm.kro.kr',
        path:'/',
    });
}

const token = async (refreshToken) => {
    // 리프레시 토큰이 없으면
    if (!refreshToken) {
        throw new BadRequestException();
    }
    const result = jwt.verify(refreshToken);
    // 리프레시 토큰이 유효하지 않으면
    if (result=='INVALID') {
        throw new BadRequestException();
    }
    // 리프레시 토큰이 만료되었으면
    if (result=='EXPIRED') {
        throw new UnAuthorizedException();
    }
    // db에서 리프레시 토큰 사용이 가능한지 확인
    const tokenInfo = await tokenRepository.getToken(result.token);
    // 리프레시 토큰이 db에서 사용불가 되었으면
    if (tokenInfo === null) {
        throw new UnAuthorizedException();
    }
    // 유저 정보를 가져옴
    const memberInfo = await repository.getMemberByCode(tokenInfo.member_code);
    if (memberInfo === null) {
        throw new NotFoundException('User not found');
    }
    const payload = {
        isLogin:true,
        memberCode:memberInfo.member_code,
        memberId:memberInfo.member_id,
        memberNickname:memberInfo.member_nickname,
        memberLevel:memberInfo.member_level,
        grade:memberInfo.member_grade,
        classNo:memberInfo.member_class,
        studentNo:memberInfo.member_studentNo
    }
    // 액세스 토큰 재발행
    const jwtToken = jwt.sign(payload, '1h');
    return {
        token:jwtToken.token,
        user:payload
    }
}

module.exports = {
    login,
    viewUser,
    signUp,
    profileUpload,
    validCodeMail,
    pwResetMail,
    findIdMail,
    pwEdit,
    token
}