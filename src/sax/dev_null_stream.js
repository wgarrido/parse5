import { Writable as WritableStream } from 'stream';

export default class DevNullStream extends WritableStream {
    constructor() {
        super();
    }

    _write(chunk, encoding, cb) {
        cb();
    }
}
