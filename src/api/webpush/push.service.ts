import { BadRequestException } from '../../util/exceptions';
import * as repository from './push.repository';
import { User } from "../account/User";

const register = async (
    endpoint: string,
    auth: string,
    p256dh: string,
    user: User
) => {
    if (!endpoint || !auth || !p256dh) {
        throw new BadRequestException();
    }
    repository.register(endpoint, auth, p256dh, user.getUser().code);
}

export {
    register
}