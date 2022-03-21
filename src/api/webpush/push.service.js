const { BadRequestException } = require('../../util/exceptions');
const repository = require('./push.repository');

const register = async (endpoint, auth, p256dh, memberCode) => {
    if (!endpoint || !auth || !p256dh) {
        throw new BadRequestException();
    }
    repository.register(endpoint, auth, p256dh, memberCode);
}

module.exports = {
    register
}