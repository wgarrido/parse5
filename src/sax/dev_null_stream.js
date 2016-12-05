import { Writable as WritableStream } from 'stream';
import util from 'util';

class DevNullStream extends WritableStream {
    constructor() {
        super();
    }

    _write(chunk, encoding, cb) {
        cb();
    }
}

export default DevNullStream;
