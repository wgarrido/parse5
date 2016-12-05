import { Writable as WritableStream } from 'stream';
import util from 'util';

const DevNullStream = module.exports = function () {
    WritableStream.call(this);
};

util.inherits(DevNullStream, WritableStream);

DevNullStream.prototype._write = (chunk, encoding, cb) => {
    cb();
};
