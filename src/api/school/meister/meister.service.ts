import { BadRequestException, NotFoundException, InternalServerException } from '../../../util/exceptions';
import * as repository from './meister.repository';
import request from 'request'
import iconv from 'iconv-lite';

const getPoint = async (
    grade: number,
    classNo: number,
    studentNo: number,
    pw: string,
    defaultPW: string
) => {
    let options, hakgwa;
    if (grade == 1) {
        hakgwa = '공통과정';
    } else {
        if (classNo <= 2) {
            hakgwa = '소프트웨어개발과';
        } else {
            hakgwa = '임베디드소프트웨어과';
        }
    }
    if (defaultPW) {
        const uniqNo = await repository.getMeisterNo(grade, classNo, studentNo);
        if (uniqNo === null) {
            throw new NotFoundException();
        }
        pw = String(uniqNo);
    }

    options = {
        uri: 'https://bssm.meistergo.co.kr/inc/common_json.php', 
        method: 'POST',
        encoding: null,
        form:{
            caseBy: 'login',
            pw: pw,
            lgtype: 'S',
            hakgwa: hakgwa,
            hak: grade,
            ban: classNo,
            bun: studentNo
        }
    }
    if (iconv.decode(await getHttp(options), 'euc-kr')!='true') {
        throw new BadRequestException();
    }
    options = {
        uri: 'https://bssm.meistergo.co.kr/ss/ss_a40j.php', 
        method: 'POST',
        encoding: null,
        form:{
            caseBy: 'listview',
            pageNumber: 1,
            onPageCnt: 100,
        }
    }
    const result = iconv.decode(await getHttp(options), 'euc-kr');
    // logout
    options = {
        uri: 'https://bssm.meistergo.co.kr/logout.php', 
        method: 'GET',
    }
    getHttp(options);
    return result;
}

const getScore = async (
    grade: number,
    classNo: number,
    studentNo: number
) => {
    const uniqNo = await repository.getMeisterNo(grade, classNo, studentNo)
    if (uniqNo === null) {
        throw new NotFoundException();
    }
    const options = {
        uri:'https://bssm.meistergo.co.kr/_suCert/bssm/B002/jnv_201j.php',
        method:'POST',
        encoding:null,
        form:{
            caseBy: 'getViewer',
            uniqNo: uniqNo
        }
    }
    return iconv.decode(await getHttp(options), 'euc-kr');
}

const getHttp = (options: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        request(options, (err: Error, res: request.Response, body: string) => {
            if (err) {
                throw new InternalServerException();
            }
            resolve(Buffer.from(body));
        });
    })
}

export {
    getPoint,
    getScore
}