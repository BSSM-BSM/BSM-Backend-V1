const { NotFoundException } = require('../../../util/exceptions');
const repository = require('./timetable.repository');

const getTimetable = async (grade, classNo) => {
    const timetableInfo = await repository.getTimetable(grade, classNo);
    if(timetableInfo === null){
        throw new NotFoundException();
    }
    if(timetableInfo.monday+timetableInfo.tuesday+timetableInfo.wednesday+timetableInfo.thursday+timetableInfo.friday == ''){
        throw new NotFoundException();
    }
    return {
        timetable:[
            timetableInfo.monday==''? null: timetableInfo.monday.split(','),
            timetableInfo.tuesday==''? null: timetableInfo.tuesday.split(','),
            timetableInfo.wednesday==''? null: timetableInfo.wednesday.split(','),
            timetableInfo.thursday==''? null: timetableInfo.thursday.split(','),
            timetableInfo.friday==''? null: timetableInfo.friday.split(','),
        ]
    }
}

module.exports = {
    getTimetable
}