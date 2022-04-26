export interface CommentDTO {
    idx: number,
    usercode: number,
    nickname: string,
    depth: number,
    deleted: boolean,
    comment: string,
    date: string,
    permission: boolean
    child?: CommentDTO[]
}