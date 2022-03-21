const { NotFoundException } = require('../../util/exceptions');

const getVersion = (isApp: string, os:string) => {
    switch (isApp) {
        case 'web':
            return {
                versionCode:4,
                versionName:'1.4.0'
            }
        case 'app':
            switch (os) {
                case 'android':
                    return {
                        versionCode:8,
                        versionName:'1.0.0\n안드로이드 네이티브 앱은 지원이 종료되었습니다\n웹 앱을 다운 받아주세요'
                    }
            }
    }
    throw new NotFoundException();
}

module.exports = {
    getVersion
}