import { NotFoundException } from '../../../util/exceptions';
import * as repository from './timetable.repository';

const getTimetable = async (
    grade: number,
    classNo: number
) => {
    const timetableInfo = await repository.getTimetable(grade, classNo);
    if (timetableInfo === null) {
        throw new NotFoundException();
    }
    const {monday, tuesday, wednesday, thursday, friday} = timetableInfo;
    if (monday+tuesday+wednesday+thursday+friday == '') {
        throw new NotFoundException();
    }
    return {
        timetable:[
            !monday? null: monday.split(','),
            !tuesday? null: tuesday.split(','),
            !wednesday? null: wednesday.split(','),
            !thursday? null: thursday.split(','),
            !friday? null: friday.split(','),
        ]
    }
}

export {
    getTimetable
}