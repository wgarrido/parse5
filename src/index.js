import Parser from './parser';
import Serializer from './serializer';
import * as defaultTreeAdapter from './tree_adapters/default';
import * as htmlparser2TreeAdapter from './tree_adapters/htmlparser2';

// Shorthands
export function parse(html, options) {
    const parser = new Parser(options);

    return parser.parse(html);
}

export function parseFragment(fragmentContext, html, options) {
    if (typeof fragmentContext === 'string') {
        options = html;
        html = fragmentContext;
        fragmentContext = null;
    }

    const parser = new Parser(options);

    return parser.parseFragment(html, fragmentContext);
}

export function serialize(node, options) {
    const serializer = new Serializer(node, options);

    return serializer.serialize();
}

// Tree adapters
export const treeAdapters = {
    default: defaultTreeAdapter,
    htmlparser2: htmlparser2TreeAdapter
};

// Streaming
export { default as ParserStream } from './parser/parser_stream';

export { default as PlainTextConversionStream } from './parser/plain_text_conversion_stream';
export { default as SerializerStream } from './serializer/serializer_stream';
export { default as SAXParser } from './sax';
