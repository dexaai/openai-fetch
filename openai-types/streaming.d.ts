                              
import { ReadableStream, type Response } from "./_shims/index.js";
export declare class Stream<Item> implements AsyncIterable<Item> {
    private iterator;
    controller: AbortController;
    constructor(iterator: () => AsyncIterator<Item>, controller: AbortController);
    static fromSSEResponse<Item>(response: Response, controller: AbortController): Stream<Item>;
    static fromReadableStream<Item>(readableStream: ReadableStream, controller: AbortController): Stream<Item>;
    [Symbol.asyncIterator](): AsyncIterator<Item>;
    tee(): [Stream<Item>, Stream<Item>];
    toReadableStream(): ReadableStream;
}
//# sourceMappingURL=streaming.d.ts.map