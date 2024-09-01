import { encode, decode } from '@msgpack/msgpack';
import pako from 'pako';

export function serialize(data: any): Uint8Array {
    return encode(data);
}

export function deserialize(buffer: Uint8Array): any {
    return decode(buffer);
}

export function compress(data: Uint8Array): Uint8Array {
    return pako.deflate(data);
}

export function decompress(data: Uint8Array): Uint8Array {
    return pako.inflate(data);
}