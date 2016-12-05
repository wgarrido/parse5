import Parser from './parser';
import Serializer from './serializer';

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
    default: require('./tree_adapters/default'),
    htmlparser2: require('./tree_adapters/htmlparser2')
};

// Streaming
export const ParserStream = require('./parser/parser_stream');

export const PlainTextConversionStream = require('./parser/plain_text_conversion_stream');
export const SerializerStream = require('./serializer/serializer_stream');
export const SAXParser = require('./sax');
