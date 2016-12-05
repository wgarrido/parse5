import { Readable as ReadableStream } from 'stream';
import Serializer from './index';

export default class SerializerStream extends ReadableStream {
    constructor(node, options) {
        super();

        this.serializer = new Serializer(node, options);

        Object.defineProperty(this.serializer, 'html', {
            //NOTE: To make `+=` concat operator work properly we define
            //getter which always returns empty string
            get() {
                return '';
            },
            set: this.push.bind(this)
        });
    }

    //Readable stream implementation
    _read() {
        this.serializer.serialize();
        this.push(null);
    }
}
