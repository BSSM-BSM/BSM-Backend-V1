import express from 'express';
import { BadRequestException, UnAuthorizedException } from '@src/util/exceptions';
import * as oauthClientReposiroty from '@src/api/oauth/repository/client.repository';
import * as oauthScopeReposiroty from '@src/api/oauth/repository/scope.repository';
import * as oauthScopeInfoReposiroty from '@src/api/oauth/repository/scopeInfo.repository';
import * as oauthAuthcodeReposiroty from '@src/api/oauth/repository/authcode.repository';
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
        throw new BadRequestException('Oauth Authentication Failed');
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

    const authcode = crypto.randomBytes(32).toString('hex');
    await oauthAuthcodeReposiroty.createAuthcode(authcode, user.getUser().code);
    res.redirect(`${clientInfo.redirectUri}?code=${authcode}`);
}

export {
    authentication,
    authorization
}