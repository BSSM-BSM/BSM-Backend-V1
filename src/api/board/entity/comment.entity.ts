export interface CommentEntity {
    idx: number;
    usercode: number;
    nickname: string;
    depth: number;
    parent: boolean;
    parent_idx: number;
    is_delete: boolean;
    is_secret: boolean;
    comment: string;
    date: string;
}