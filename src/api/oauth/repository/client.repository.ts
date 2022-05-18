import { InternalServerException } from '@src/util/exceptions';
const pool = require('@src/util/db');

const getById = async (
    clientId: string
): Promise<{
    clientSecret: string,
    domain: string,
    serviceName: string,
    redirectURI: string,
    usercode: number
} | null> => {
    const getQuery='SELECT client_secret clientSecret, domain, service_name serviceName, redirect_uri redirectURI, usercode FROM oauth_client WHERE client_id=?';
    // SELECT 
    //     client_secret clientSecret, 
    //     domain, 
    //     service_name serviceName, 
    //     redirect_uri redirectURI, 
    //     usercode 
    // FROM oauth_client 
    // WHERE client_id=?
    try {
        const [rows] = await pool.query(getQuery, [clientId]);
        if (rows.length)
            return rows[0];
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const getByUsercode = async (
    usercode: number
): Promise<[{
    clientId: string,
    clientSecret: string,
    domain: string,
    serviceName: string,
    redirectURI: string,
}] | null> => {
    const getQuery='SELECT client_id clientId, client_secret clientSecret, domain, service_name serviceName, redirect_uri redirectURI FROM oauth_client WHERE usercode=?';
    // SELECT 
    //     client_id clientId, 
    //     client_secret clientSecret, 
    //     domain, 
    //     service_name serviceName, 
    //     redirect_uri redirectURI 
    // FROM oauth_client 
    // WHERE usercode=?
    try {
        const [rows] = await pool.query(getQuery, [usercode]);
        if (rows.length)
            return rows;
        else
            return null;
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

const createClient = async (
    clientId: string,
    clientSecret: string,
    domain: string,
    serviceName: string,
    redirectURI: string,
    usercode: number
): Promise<void> => {
    const insertQuery='INSERT INTO oauth_client (client_id, client_secret, `domain`, service_name, redirect_uri, usercode) VALUES(?, ?, ?, ?, ?, ?)';
    // INSERT INTO oauth_client (
    //     client_id, 
    //     client_secret, 
    //     `domain`, 
    //     service_name, 
    //     redirect_uri, 
    //     usercode) 
    // VALUES(?, ?, ?, ?, ?, ?)
    try {
        await pool.query(insertQuery, [clientId, clientSecret, domain, serviceName, redirectURI, usercode]);
    } catch(err) {
        console.error(err);
        throw new InternalServerException();
    }
}

export {
    getById,
    getByUsercode,
    createClient
}