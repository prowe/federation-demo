const util = require('util');
const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require("apollo-server");

const client = jwksClient({
    jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
});

function getKey(header, callback){
    client.getSigningKey(header.kid, function(err, key) {
        if (err) {
            callback(err);
        } else {
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        }
    });
}

const verifyAsync = util.promisify(jwt.verify);

module.exports = async function buildContext({req}) {
    const header = req.headers.authorization;
    const schemePrefix = 'Bearer ';
    if (!header.startsWith(schemePrefix)) {
        throw new AuthenticationError('No token provided');
    }
    const token = header.substr(schemePrefix.length);
    if (!token) {
        throw new AuthenticationError('No token provided');
    }

    try {
        const user = await verifyAsync(token, getKey, {
            algorithms: ['RS256']
        });
        return {
            user,
            token
        };

    } catch (e) {
        throw new AuthenticationError(e.message);
    }
}