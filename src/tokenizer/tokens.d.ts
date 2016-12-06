import { NAMESPACES as NS } from '../common/html';

export interface Attr {
    name: string;
    value: string;
    prefix?: string;
    namespace?: NS;
}

interface TagToken {
    tagName: string;
}

export interface StartTagToken extends TagToken {
    attrs: Attr[];
    selfClosing: boolean;
}

export interface EndTagToken extends TagToken {}
