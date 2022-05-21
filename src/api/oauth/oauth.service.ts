import express from 'express';
import { BadRequestException, NotFoundException, UnAuthorizedException } from '@src/util/exceptions';
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
    user: User,
    clientId: string,
    redirectURI: string
) => {
    const clientInfo = await oauthClientReposiroty.getById(clientId);
    if (clientInfo === null) {
        throw new BadRequestException('Oauth Authentication Failed');
    }
    if (clientInfo.redirectURI != redirectURI) {
        throw new BadRequestException('Oauth Authentication Failed');
    }
    const { domain, serviceName } = clientInfo;

    const scopeInfo = await oauthScopeReposiroty.getById(clientId);
    if (scopeInfo === null) {
        throw new NotFoundException('Failed to load scope info');
    }
    if (await oauthTokenReposiroty.getByUsercodeAndClientId(user.getUser().code, clientId)) {
        return {
            authorized: true
        }
    }
    
    return {
        authorized: false,
        domain,
        serviceName,
        scope: scopeInfoList.filter(e => scopeInfo.some(scope => scope.info == e.info))
    }
}

const authorization = async (
    user: User,
    clientId: string,
    redirectURI: string
) => {
    if (!user.getIsLogin()) {
        throw new UnAuthorizedException();
    }
    const clientInfo = await oauthClientReposiroty.getById(clientId);
    if (clientInfo === null) {
        throw new BadRequestException('Oauth Authentication Failed');
    }
    if (clientInfo.redirectURI != redirectURI) {
        throw new BadRequestException('Oauth Authentication Failed');
    }

    const newAuthcode = crypto.randomBytes(16).toString('hex');
    await oauthAuthcodeReposiroty.createAuthcode(newAuthcode, clientId, user.getUser().code);
    return {
        redirect: `${clientInfo.redirectURI}?code=${newAuthcode}`
    }
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

    const authorizedInfo = await oauthTokenReposiroty.getByUsercodeAndClientId(authcodeInfo.usercode, clientId);
    if (authorizedInfo !== null) {
        return {
            token: authorizedInfo.token
        }
    }
    
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

const createClient = async (
    user: User,
    domain: string,
    serviceName: string,
    redirectURI: string,
    scope: string | string[]
) => {
    if (!domain || domain.length > 63 || !domainCheck(domain)) {
        throw new BadRequestException('Domain is invalid');
    }
    if (!redirectURI || redirectURI.length > 100 || !uriCheck(domain, redirectURI)) {
        throw new BadRequestException('Redirect uri is invalid');
    }
    if (!serviceName || serviceName.length < 2 || serviceName.length > 32) {
        throw new BadRequestException('Service name is invalid');
    }

    let scopeList;
    try {
        scopeList = (typeof scope == 'string')? JSON.parse(scope): scope;
        if (typeof scopeList != 'object' || !scopeList.length) {
            throw new BadRequestException('Scope is invalid');
        }
    } catch (err) {
        throw new BadRequestException('Scope is invalid');
    }

    const scopeListCheck = scopeList.filter((e: string) => scopeInfoList.some(scopeInfo => e == scopeInfo.info));
    if (scopeListCheck.length != scopeList.length) {
        throw new BadRequestException('Scope is invalid');
    }

    const newClientId = crypto.randomBytes(4).toString('hex');
    const newClientSecret = crypto.randomBytes(16).toString('hex');
    await oauthClientReposiroty.createClient(newClientId, newClientSecret, domain, serviceName, redirectURI, user.getUser().code);
    await oauthScopeReposiroty.insertScope(newClientId, scopeListCheck, user.getUser().code);

    return {
        clientId: newClientId,
        clientSecret: newClientSecret
    }
}

const domainCheck = (str: string): boolean => {
    if (str == 'localhost') {
        return true;
    }
    const pattern = /^([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}?$/;
    return pattern.test(str);
}

const uriCheck = (domain: string, str: string): boolean => {
    const pattern = new RegExp(`(https?\\:\\/\\/)(${domain})(\\:(6[0-5]{2}[0-3][0-5]|[1-5][0-9]{4}|[1-9][0-9]{0,3}))?\\/.*`);
    return pattern.test(str);
}

const deleteClient = async (
    clientId: string,
    user: User
) => {
    const clientInfo = await oauthClientReposiroty.getById(clientId);
    if (clientInfo === null || clientInfo.usercode != user.getUser().code) {
        throw new BadRequestException();
    }
    await oauthClientReposiroty.deleteClient(clientId);
}

const getClientList = async (
    user: User
) => {
    const clientList: [{
        clientId: string;
        clientSecret: string;
        domain: string;
        serviceName: string;
        redirectURI: string;
        scope?: {
            info: string;
            name: string;
            description: string;
        }[]
    }] | null = await oauthClientReposiroty.getByUsercode(user.getUser().code);
    if (clientList === null) {
        return {
            clientList: []
        }
    }

    const scopeList = await oauthScopeReposiroty.getByUsercode(user.getUser().code);
    if (scopeList === null) {
        throw new NotFoundException('Failed to load scope list');
    }
    clientList.forEach((client, i) => {
        const clientScopeList =  scopeList.filter(scope => client.clientId == scope.clientId);
        clientList[i].scope = scopeInfoList.filter(e => clientScopeList.some(scope => scope.info == e.info));
    })
    
    return {
        clientList: clientList.map(client => {
            return {
                ...client
            }
        })
    }
}

const getScopeInfo = () => {
    return {
        scopeInfoList
    }
}

export {
    authentication,
    authorization,
    getToken,
    getResource,
    createClient,
    deleteClient,
    getClientList,
    getScopeInfo
}