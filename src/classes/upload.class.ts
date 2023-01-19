// AWS SKD
import AWS from 'aws-sdk';
// S3 Constants
import { S3Constants } from '../constants/config/s3.constants';
// Busboy
import Busboy from 'busboy';

export class Upload {

    // Crea una instancia de la clase Upload
    private static uploadInstance: Upload;

    private constructor() { }

    public static get instanceUpload() {
        return this.uploadInstance || (this.uploadInstance = new this());
    }

    /**
     * Permite iniciar el proceso de carga de imagen
     * Devuelve una promesa por el tiempo de espera
     * de la subida de la imagen a S3 Bucket
     * @param carpeta 
     * @param req 
     */
    public uploadImage(carpeta: string, req: any): Promise<any> {

        let busboy = new Busboy({ headers: req.headers });

        let promise = new Promise((resolve, reject) => {
            busboy.on('finish', async () => {
                // Obtiene la imagen del usuario.
                const image = req.files.imagen;

                const response = await this.uploadImageToS3(carpeta, image);
                
                if ( response !== 'NOK' ) {
                    resolve(response.Location)
                } else {
                    reject('NOK');
                }

            });
            req.pipe(busboy);
        });

        return promise;
    }

    /**
     * Sube una imagen a S3 Bucket
     * y regresa una promesa con el resultado de la carga de la imagen
     * @param file 
     */
    public uploadImageToS3(carpeta: string, image: any): Promise<any> {
        // Constantes S3
        const s3Constants = S3Constants.instanceS3Constants;
        // Se crea una promesa ya que puede devolver un error al subir la imagen
        let promise = new Promise((resolve, reject) => {

            // Configuracion de claves de acceso a S3
            let s3bucket = new AWS.S3({
                secretAccessKey: s3Constants.IAM_USER_SECRET,
                accessKeyId: s3Constants.IAM_USER_KEY
            });
            // Crea el bucket que contendra los archivos que se subiran
            s3bucket.createBucket(() => {
                var params = {
                    Bucket: s3Constants.BUCKET_NAME,
                    Key: `${carpeta}/images/${image.name}`,
                    Body: image.data,
                    ACL: 'public-read'
                };
                // Sube la imagen al bucket creado
                s3bucket.upload(params, (err: any, data: any) => {
                    if (err) {
                        reject('NOK');
                    }
                    resolve(data);
                });
            });
        });

        return promise;
    }


}