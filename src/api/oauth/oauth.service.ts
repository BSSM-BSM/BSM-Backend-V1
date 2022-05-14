import express from 'express';
import { BadRequestException, InternalServerException, NotFoundException, UnAuthorizedException } from '@src/util/exceptions';
import * as oauthClientReposiroty from '@src/api/oauth/repository/client.repository';
import * as oauthScopeReposiroty from '@src/api/oauth/repository/scope.repository';
import * as oauthScopeInfoReposiroty from '@src/api/oauth/repository/scopeInfo.repository';
import * as oauthAuthcodeReposiroty from '@src/api/oauth/repository/authcode.repository';
import * as oauthTokenReposiroty from '@src/api/oauth/repository/token.repository';
import * as accountRepository from '@src/api/account/account.repository';
import crypto from 'crypto';
import { User } from '@src/api/account/User';

let scopeInfoList: {
    info: string,
    name: string,
    description: string
}[] = [];

const getScopeInfoList = async () => {
    const scopeInfo = await oauthScopeInfoReposiroty.getInfoList();
    if (scopeInfo === null) {
        return;
    }
    scopeInfoList = scopeInfo;
}
getScopeInfoList();

const authentication = async (
    clientId: string,
    redirectUri: string
) => {
    const clientInfo = await oauthClientReposiroty.getById(clientId);
    if (clientInfo === null) {
        throw new BadRequestException('Oauth Authentication Failed');
    }
    if (clientInfo.redirectUri != redirectUri) {
        throw new BadRequestException('Oauth Authentication Failed');
    }
    const { domain, serviceName } = clientInfo;

    const scopeInfo = await oauthScopeReposiroty.getById(clientId);
    if (scopeInfo === null) {
        throw new NotFoundException('Failed to load scope info');
    }
    
    return {
        domain,
        serviceName,
        scope: scopeInfoList.filter(e => scopeInfo.some(scope => scope.info == e.info))
    }
}

const authorization = async (
    res: express.Response,
    user: User,
    clientId: string,
    redirectUri: string
) => {
    if (!user.getIsLogin()) {
        throw new UnAuthorizedException();
    }
    const clientInfo = await oauthClientReposiroty.getById(clientId);
    if (clientInfo === null) {
        throw new BadRequestException('Oauth Authentication Failed');
    }
    if (clientInfo.redirectUri != redirectUri) {
        throw new BadRequestException('Oauth Authentication Failed');
    }

    const newAuthcode = crypto.randomBytes(16).toString('hex');
    await oauthAuthcodeReposiroty.createAuthcode(newAuthcode, clientId, user.getUser().code);
    res.redirect(`${clientInfo.redirectUri}?code=${newAuthcode}`);
}

const getToken = async (
    clientId: string,
    clientSecret: string,
    authcode: string
) => {
    const clientInfo = await oauthClientReposiroty.getById(clientId);
    if (clientInfo === null || clientInfo.clientSecret != clientSecret) {
        throw new BadRequestException();
    }

    const authcodeInfo = await oauthAuthcodeReposiroty.getByCode(authcode);
    if (authcodeInfo === null) {
        throw new NotFoundException('Authorization code not found');
    }
    if (authcodeInfo.clientId != clientId) {
        throw new BadRequestException();
    }

    await oauthAuthcodeReposiroty.expireCode(authcode);
    const newToken = crypto.randomBytes(16).toString('hex');
    await oauthTokenReposiroty.createToken(newToken, clientId, authcodeInfo.usercode);

    return {
        token: newToken
    }
}

const getResource = async (
    clientId: string,
    clientSecret: string,
    token: string
) => {
    const clientInfo = await oauthClientReposiroty.getById(clientId);
    if (clientInfo === null || clientInfo.clientSecret != clientSecret) {
        throw new BadRequestException();
    }

    const tokenInfo = await oauthTokenReposiroty.getByToken(token);
    if (tokenInfo === null) {
        throw new NotFoundException('Token not found');
    }
    if (tokenInfo.clientId != clientId) {
        throw new BadRequestException();
    }

    const scopeInfo = await oauthScopeReposiroty.getById(clientId);
    if (scopeInfo === null) {
        throw new NotFoundException('Failed to load scope info');
    }

    const userInfo = await accountRepository.getByUsercode(tokenInfo.usercode);
    if (userInfo === null) {
        throw new NotFoundException('Failed to load user info');
    }
    
    const returnUserInfo: {
        [index:string]: string | number | undefined;
        'code'?: number;
        'nickname'?: string;
        'enrolled'?: number;
        'grade'?: number;
        'classNo'?: number;
        'studentNo'?: number;
        'name'?: string;
        'email'?: string;
    } = {};

    scopeInfoList.filter(e => scopeInfo.some(scope => scope.info == e.info)).forEach(e => {
        if (e.info in userInfo){
            returnUserInfo[e.info] = userInfo[e.info]
        }
    })
    return {
        scope: scopeInfo.map(e => e.info),
        user: returnUserInfo
    }
}

export {
    authentication,
    authorization,
    getToken,
    getResource
}