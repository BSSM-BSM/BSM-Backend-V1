export class User {
    private isLogin: boolean = false;
    private user: {
        code: number,
        level: number,
        id: string,
        nickname: string,
        enrolled: number,
        grade: number,
        classNo: number,
        studentNo: number,
        name: string
    };

    constructor(user : {
        code: number | null,
        level: number | null,
        id: string | null,
        nickname: string | null,
        enrolled: number | null,
        grade: number | null,
        classNo: number | null,
        studentNo: number | null,
        name: string | null
    }) {
        if (
            typeof user.code != 'number' ||
            typeof user.level != 'number' ||
            typeof user.id != 'string' ||
            typeof user.nickname != 'string' ||
            typeof user.grade != 'number' ||
            typeof user.grade != 'number' ||
            typeof user.classNo != 'number' ||
            typeof user.studentNo != 'number' ||
            typeof user.name != 'string'
        ) {
            this.isLogin = false;
        } else {
            this.isLogin = true;
        }
        this.user = {
            code: Number(user.code),
            level: Number(user.level),
            id: String(user.id),
            nickname: String(user.nickname),
            enrolled: Number(user.enrolled),
            grade: Number(user.grade),
            classNo: Number(user.classNo),
            studentNo: Number(user.studentNo),
            name: String(user.name),
        };
    }

    getIsLogin() {
        return this.isLogin;
    }
    getUser() {
        return this.user;
    }
};