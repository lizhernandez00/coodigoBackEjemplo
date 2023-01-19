"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Constants = void 0;
class S3Constants {
    constructor() {
        // NOMBRE DEL BUCKET
        this.BUCKET_NAME = 'openbis-retail-develop-images';
        // USER KEY IAM
        this.IAM_USER_KEY = 'AKIAT45IL5333FE6NNOY';
        // USER SECRET KEY IAM
        this.IAM_USER_SECRET = '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';
    }
    // Devuelve la instancia de la clase S3Constants
    static get instanceS3Constants() {
        return this.s3ConstantsInstance || (this.s3ConstantsInstance = new this());
    }
}
exports.S3Constants = S3Constants;
