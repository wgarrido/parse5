import { StartTagToken } from './tokens';

export default function getTokenAttr(token: StartTagToken, attrName: string) {
    for (const attr of token.attrs) {
        if (attr.name === attrName)
            return attr.value;
    }

    return null;
}
