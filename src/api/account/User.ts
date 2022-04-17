export class User {
    private isLogin: boolean = false;
    private user: {
        code: number | null,
        level: number | null,
        id: string | null,
        nickname: string | null,
        enrolled: number | null,
        grade: number | null,
        classNo: number | null,
        studentNo: number | null,
        name: string | null
    } = {
        code: null,
        level: null,
        id: null,
        nickname: null,
        enrolled: null,
        grade: null,
        classNo: null,
        studentNo: null,
        name: null
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
        this.user = user;
        if (
            typeof this.user.code != 'number' ||
            typeof this.user.level != 'number' ||
            typeof this.user.id != 'string' ||
            typeof this.user.nickname != 'string' ||
            typeof this.user.grade != 'number' ||
            typeof this.user.grade != 'number' ||
            typeof this.user.classNo != 'number' ||
            typeof this.user.studentNo != 'number' ||
            typeof this.user.name != 'string'
        ) {
            this.isLogin = false;
        } else {
            this.isLogin = true;
        }
    }

    getIsLogin() {
        return this.isLogin;
    }
    getUser() {
        return this.user;
    }
};