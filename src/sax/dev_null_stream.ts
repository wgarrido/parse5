import { Writable as WritableStream } from 'stream';

export default class DevNullStream extends WritableStream {
    _write(chunk: any, encoding: string, cb: Function) {
        cb();
    }
}
