export class S3Constants {

    // Crea una instancia de la clase S3Constants
    private static s3ConstantsInstance: S3Constants;

    private constructor() {}

    // Devuelve la instancia de la clase S3Constants
    public static get instanceS3Constants(): S3Constants {
        return this.s3ConstantsInstance || (this.s3ConstantsInstance = new this());
    }

    // NOMBRE DEL BUCKET
    public readonly BUCKET_NAME = 'openbis-retail-develop-images';
    // USER KEY IAM
    public readonly IAM_USER_KEY = 'AKIAT45IL5333FE6NNOY';
    // USER SECRET KEY IAM
    public readonly IAM_USER_SECRET = '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';
    

}