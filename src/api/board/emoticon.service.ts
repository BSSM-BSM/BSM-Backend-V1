import { NotFoundException, InternalServerException, UnAuthorizedException, BadRequestException } from '../../util/exceptions';
import * as emoticonRepository from './repository/emoticon.repository';
import fs from 'fs';
import { User } from '../account/User';

const getemoticon = async (
    id: number
) => {
    const emoticonInfo = await emoticonRepository.getEmoticonById(id);
    if (emoticonInfo === null) {
        throw new NotFoundException();
    }

    const emoticons = await emoticonRepository.getEmoticonsById(id);
    if (emoticons === null) {
        throw new NotFoundException();
    }

    return {
        emoticon: {
            id,
            name:emoticonInfo.name,
            created:emoticonInfo.created,
            description:emoticonInfo.description,
            e:emoticons.map(e => {
                return {
                    idx: e.idx,
                    type: e.type
                }
            })
        }
    }
}

const getemoticons = async () => {
    const emoticonInfo = await emoticonRepository.getEmoticon();
    if (emoticonInfo === null) {
        throw new NotFoundException();
    }
    
    let result: {
        id: number,
        alt: string,
        e: {
            idx: number,
            type: string
        }[]
    }[] = emoticonInfo.map(e => {
        return {
            id: e.id,
            alt: e.name,
            e: []
        }
    })
    const emoticons = await emoticonRepository.getEmoticons();
    if (emoticons === null) {
        throw new NotFoundException();
    }

    let map = [];
    for (let i=0,j=-1; i<emoticons.length; i++) {
        if (map[emoticons[i].id] === undefined) {
            j++;
            map[emoticons[i].id]=j;
        }
        result[j].e.push({
            idx:emoticons[i].idx,
            type:emoticons[i].type
        });
    }
    return {
        emoticon: result
    }
}

const uploadEmoticon = async (
    user: User,
    name: string,
    description: string,
    emoticons: {
        [index: string]: {
            type: string,
            idx: number
        }
    },
    files: Express.Multer.File[],
    file: Express.Multer.File
) => {
    if (!user.getIsLogin()) {
        throw new UnAuthorizedException();
    }
    // 업로드 데이터 체크
    if (!name || !description || !file || !files || !emoticons) {
        throw new BadRequestException();
    }
    if (name.length < 2) {
        throw new BadRequestException();
    }
    if (description.length < 2) {
        throw new BadRequestException();
    }
    if (files.length < 4) {
        throw new BadRequestException();
    }
    
    if (files.length !== (Object.keys(emoticons).length)) {
        throw new BadRequestException();
    }
    let emoticonList = [];
    for (let i=0; i<files.length; i++){
        const e = files[i];
        const name = e.originalname.split('.')[0];
        const ext = e.originalname.split('.')[e.originalname.split('.').length-1];
        if (!emoticons[name]) {
            throw new BadRequestException();
        }
        // 같은 확장자인지, 숫자가 맞는지 체크
        if (ext != emoticons[name].type || !(/^\d+$/.test(String(emoticons[name].idx)))) {
            throw new BadRequestException();
        }
        emoticonList.push({
            idx: emoticons[name].idx,
            type: emoticons[name].type
        });
    }

    const emoticonId = await emoticonRepository.getAutoIncrement();
    if (emoticonId === null) {
        console.error('Emoticon get AUTO_INCREMENT error');
        throw new InternalServerException();
    }

    // 이모티콘 정보 저장 및 폴더 생성
    try {
        await Promise.all([
            emoticonRepository.insertEmoticonInfo(emoticonId, name, description, user.getUser().code),
            emoticonRepository.insertEmoticons(emoticonId, emoticonList),
            fs.promises.mkdir(`public/resource/board/emoticon/${emoticonId}`)
        ])
    } catch (err) {
        console.error(err);
        throw new InternalServerException();
    }

    try {
        // 복사할 파일 리스트 생성
        let copyList = [];
        copyList = files.map(e => {
            const name = e.originalname.split('.')[0];
            return fs.promises.copyFile(e.path, `public/resource/board/emoticon/${emoticonId}/${emoticons[name].idx}.${emoticons[name].type}`)
        })
        copyList.push(fs.promises.copyFile(files[0].path, `public/resource/board/emoticon/${emoticonId}.png`))
        // 파일 복사 프로미스
        await Promise.all(copyList);
    } catch(err) {
        console.error(err)
        throw new InternalServerException();
    }
}
export {
    getemoticon,
    getemoticons,
    uploadEmoticon
}