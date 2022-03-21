const schedule = require('node-schedule');
const webpush = require('../util/push');
const service = require('../api/school/meal/meal.service');

const mealDate = {
    morning:schedule.scheduleJob('0 30 6 * * 1-5', async () => {
        // 아침 식사 1시간전 알림
        const today = new Date();
        const mealInfo = await service.getMeal(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`)
        if (mealInfo === null) {
            return;
        }
        if (mealInfo.morning == "") {
            return;
        }
        const payload = JSON.stringify({
            title:"오늘의 아침",
            body:mealInfo.morning.replaceAll('<br/>', ' '),
            link:"/meal"
        })
        webpush.push(payload, 'meal');
    }),
    lunch:schedule.scheduleJob('0 30 11 * * 1-5', async () => {
        // 점심 식사 1시간전 알림
        const today = new Date();
        const mealInfo = await service.getMeal(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`)
        if (mealInfo === null) {
            return;
        }
        if (mealInfo.lunch == "") {
            return;
        }
        const payload = JSON.stringify({
            title:"오늘의 점심",
            body:mealInfo.lunch.replaceAll('<br/>', ' '),
            link:"/meal"
        })
        webpush.push(payload, 'meal');
    }),
    dinner:schedule.scheduleJob('0 0 17 * * 1-5', async () => {
        // 저녁 식사 1시간전 알림
        const today = new Date();
        const mealInfo = await service.getMeal(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`)
        if (mealInfo === null) {
            return;
        }
        if (mealInfo.dinner == "") {
            return;
        }
        const payload = JSON.stringify({
            title:"오늘의 저녁",
            body:mealInfo.dinner.replaceAll('<br/>', ' '),
            link:"/meal"
        })
        webpush.push(payload, 'meal');
    }),
}
