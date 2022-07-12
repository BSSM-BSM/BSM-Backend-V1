export interface CommentDTO {
    idx: number;
    usercode: number;
    nickname: string;
    depth: number;
    is_delete: boolean;
    is_secret: boolean;
    comment: string;
    date: string;
    permission: boolean;
    child?: CommentDTO[];
}