import { NotFoundException, BadRequestException, UnAuthorizedException, ConflictException, InternalServerException } from '../../util/exceptions';
import express from 'express';
import * as accountRepository from './account.repository';
import * as tokenRepository from './token.repository';
import * as jwt from '../../util/jwt';
import crypto from 'crypto';
import sharp from 'sharp';
import * as mail from '../../util/mail';
import { User } from './User';

const login = async (
    res: express.Response,
    userId: string,
    userPw: string
) => {
    const userInfo = await accountRepository.getById(userId);
    if (userInfo === null) {
        throw new BadRequestException();
    }
    if (userInfo.pw != crypto.createHash('sha3-256').update(userInfo.pwSalt + userPw).digest('hex')) {
        throw new BadRequestException();
    }
    const user = new User(userInfo);
    if (!user.getIsLogin()) {
        throw new InternalServerException('Failed to login');
    }

    const jwtToken = await jwt.login(user, '1h');
    res.cookie('token', jwtToken.token, {
        domain: '.bssm.kro.kr',
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 1000*60*60// 1시간 동안 저장 1000ms*60초*60분
    });
    res.cookie('refreshToken', jwtToken.refreshToken, {
        domain: '.bssm.kro.kr',
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 24*60*1000*60*60// 60일간 저장 24시간*60일*1000ms*60초*60분
    });
    return {
        token: jwtToken.token,
        refreshToken: jwtToken.refreshToken    
    }
}

const viewUser = async (
    user: User,
    viewUsercode: number
) => {
    const userInfo = await accountRepository.getByUsercode(viewUsercode);
    let viewUser: {
        userType: string,
        usercode: number,
        nickname?: string,
        level?: number,
        created?: string;
        enrolled?: number;
        grade?: number;
        classNo?: number;
        studentNo?: number;
        name?: string;
        permission?: boolean
    } = {
        userType: 'none',
        usercode: viewUsercode
    };
    if (userInfo === null) {
        if (viewUsercode == 0) {
            viewUser.userType = "deleted";
        } else if (viewUsercode == -1) {
            viewUser.userType = "anonymous";
        } else {
            viewUser.userType = "none";
        }
        return {
            user: viewUser
        };
    }
    viewUser.userType = "active";
    viewUser.nickname = userInfo.nickname;
    viewUser.level = userInfo.level;
    viewUser.created = userInfo.created;
    viewUser.enrolled = userInfo.enrolled;
    viewUser.grade = userInfo.grade;
    viewUser.classNo = userInfo.classNo;
    viewUser.studentNo = userInfo.studentNo;
    viewUser.name = userInfo.name;
    if (user.getUser().code>0 && userInfo.code == user.getUser().code) {
        viewUser.permission = true;
    } else {
        viewUser.permission = false;
    }
    return {
        user: viewUser
    };
}

const signUp = async (
    userId: string,
    userPw: string,
    userPwCheck: string,
    userNickname: string,
    authcode: string
) => {
    if (userPw != userPwCheck) {
        throw new BadRequestException('Password not match');
    }
    const [existId, existNickname] = await Promise.all([
        accountRepository.getById(userId),
        accountRepository.getByNickname(userNickname)
    ]);
    if (existId) {
        throw new ConflictException('Existing id');
    }
    if (existNickname) {
        throw new ConflictException('Existing nickname');
    }

    //인증코드로 유저정보를 가져옴
    const studentInfo = await accountRepository.getStudentByCode(authcode);
    if (studentInfo === null) {
        throw new NotFoundException('Code not found');
    }
    if (!studentInfo.codeAvailable) {
        throw new BadRequestException('Code already used');
    }
    
    await accountRepository.updateCodeAvailable(authcode, false);
    await accountRepository.signUp(
        studentInfo.level,
        userId,
        userPw,
        userNickname,
        studentInfo.uniqNo,
    );
}

const profileUpload = async (
    filename: string
) => {
    const fileDir='public/resource/user/profile_images/';
    await sharp(fileDir+filename)
    .resize({width:128,height:128})
    .png()
    .toFile(fileDir+filename.split('.')[0].split('-')[1]+'.png', (err: any) => {
        if (err) {
            throw new InternalServerException('Failed to upload profile');
        }
    })
}

const authcodeMail = async (
    studentEnrolled: number,
    studentGrade: number,
    studentClass: number,
    studentNo: number,
    studentName: string
) => {
    const studentInfo = await accountRepository.getStudent(studentEnrolled, studentGrade, studentClass, studentNo, studentName);
    if (studentInfo === null) {
        throw new NotFoundException('User not found');
    }

    const userMail = studentInfo.email;
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
                <h2 style="display:inline-block;font-size:20px;font-weight:bold;text-align:center;margin:0;color:#e8eaed;padding:15px;border-radius:7px;box-shadow:20px 20px 50px rgba(0, 0, 0, 0.5);background-color:rgba(192, 192, 192, 0.2);">${studentInfo.authCode}</h2>
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

const pwResetMail = async (
    userId: string
) => {
    const userInfo = await accountRepository.getById(userId);
    if (userInfo === null) {
        throw new NotFoundException('User not found');
    }

    const token = jwt.sign({
        isLogin: false,
        pwEdit: userInfo.code
    }, '300s');
    const userMail = userInfo.email;
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
                <a href="https://bssm.kro.kr/pwReset?token=${token}" style="display:inline-block;font-size:20px;text-decoration:none;font-weight:bold;text-align:center;margin:0;color:#e8eaed;padding:15px;border-radius:7px;box-shadow:20px 20px 50px rgba(0, 0, 0, 0.5);background-color:rgba(192, 192, 192, 0.2);">비밀번호 재설정</a>
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

const findIdMail = async (
    studentEnrolled: number,
    studentGrade: number,
    studentClass: number,
    studentNo: number,
    studentName: string
) => {
    const userInfo = await accountRepository.getUser(studentEnrolled, studentGrade, studentClass, studentNo, studentName);
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
                <h2 style="display:inline-block;font-size:20px;font-weight:bold;text-align:center;margin:0;color:#e8eaed;padding:15px;border-radius:7px;box-shadow:20px 20px 50px rgba(0, 0, 0, 0.5);background-color:rgba(192, 192, 192, 0.2);">${userInfo.id}</h2>
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

const pwEdit = async (
    res: express.Response,
    token: string,
    userPw: string,
    userPwCheck: string
) => {
    const jwtValue = jwt.verify(token);
    const user = new User(jwtValue);

    if (jwtValue == 'EXPIRED') {
        throw new UnAuthorizedException('Token expired');
    }
    if (!(jwtValue.pwEdit || user.getIsLogin())) {
        throw new BadRequestException();
    }
    const usercode = user.getIsLogin()? user.getUser().code: jwtValue.pwEdit;

    if (userPw != userPwCheck) {
        throw new BadRequestException('Password not match');
    }
    await accountRepository.updatePWByCode(usercode, userPw);
    res.clearCookie('token', {
        domain:'.bssm.kro.kr',
        path:'/',
    });
    res.clearCookie('refreshToken', {
        domain:'.bssm.kro.kr',
        path:'/',
    });
}

const nicknameEdit = async (
    res: express.Response,
    user: User,
    nickname: string
) => {
    if (!user.getIsLogin()) {
        throw new BadRequestException();
    }
    if (await accountRepository.getByNickname(nickname)) {
        throw new ConflictException('Existing nickname');
    }

    await accountRepository.updateNicknameByCode(user.getUser().code, nickname);

    const userInfo = await accountRepository.getByUsercode(user.getUser().code);
    if (userInfo === null) {
        throw new InternalServerException('Failed to update user information');
    }
    const newUser = new User(userInfo);
    if (!newUser.getIsLogin()) {
        throw new InternalServerException('Failed to update user information');
    }
    const payload = newUser.getUser();

    // 액세스 토큰 재발행
    const token = jwt.sign(payload, '1h');
    res.cookie('token', token, {
        domain: '.bssm.kro.kr',
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 1000*60*60// 1시간 동안 저장 1000ms*60초*60분
    });
    return {
        token,
        user: payload
    }
}

const token = async (
    refreshToken: string
) => {
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
    const userInfo = await accountRepository.getByUsercode(tokenInfo.usercode);
    if (userInfo === null) {
        throw new NotFoundException('User not found');
    }
    const user = new User(userInfo);
    if (!user.getIsLogin()) {
        throw new InternalServerException('Failed to refresh');
    }
    const payload = user.getUser();
    // 액세스 토큰 재발행
    const token = jwt.sign(payload, '1h');
    return {
        token,
        user: payload
    }
}
export {
    login,
    viewUser,
    signUp,
    profileUpload,
    authcodeMail,
    pwResetMail,
    findIdMail,
    pwEdit,
    nicknameEdit,
    token
}