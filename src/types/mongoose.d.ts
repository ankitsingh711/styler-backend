// Type definition for mongoose document transform
declare module 'mongoose' {
    interface ToObjectOptions {
        transform?: (doc: any, ret: any, options?: any) => any;
    }
}

export { };
