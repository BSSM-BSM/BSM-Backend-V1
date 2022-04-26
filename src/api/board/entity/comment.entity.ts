export interface CommentEntity {
    idx: number,
    usercode: number,
    nickname: string,
    depth: number,
    parent: boolean,
    parent_idx: number,
    deleted: boolean,
    comment: string,
    date: string
}