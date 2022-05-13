import { InternalServerException } from '../../../util/exceptions';
const pool = require('../../util/db');

const getById = async (
    clientId: string
): Promise<{
    clientSecret: string,
    domain: string,
    serviceName: string,
    redirectUri: string,
} | null> => {
    const getQuery='SELECT client_secret clientSecret, domain, service_name serviceName, redirect_uri redirectUri FROM oauth_client WHERE client_id=?';
    // SELECT 
    //     client_secret clientSecret, 
    //     domain, 
    //     service_name serviceName, 
    //     redirect_uri redirectUri 
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

export {
    getById
}