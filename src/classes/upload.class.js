"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
// AWS SKD
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// S3 Constants
const s3_constants_1 = require("../constants/config/s3.constants");
// Busboy
const busboy_1 = __importDefault(require("busboy"));
class Upload {
    constructor() { }
    static get instanceUpload() {
        return this.uploadInstance || (this.uploadInstance = new this());
    }
    /**
     * Permite iniciar el proceso de carga de imagen
     * Devuelve una promesa por el tiempo de espera
     * de la subida de la imagen a S3 Bucket
     * @param carpeta
     * @param req
     */
    uploadImage(carpeta, req) {
        let busboy = new busboy_1.default({ headers: req.headers });
        let promise = new Promise((resolve, reject) => {
            busboy.on('finish', () => __awaiter(this, void 0, void 0, function* () {
                // Obtiene la imagen del usuario.
                const image = req.files.imagen;
                const response = yield this.uploadImageToS3(carpeta, image);
                if (response !== 'NOK') {
                    resolve(response.Location);
                }
                else {
                    reject('NOK');
                }
            }));
            req.pipe(busboy);
        });
        return promise;
    }
    /**
     * Sube una imagen a S3 Bucket
     * y regresa una promesa con el resultado de la carga de la imagen
     * @param file
     */
    uploadImageToS3(carpeta, image) {
        // Constantes S3
        const s3Constants = s3_constants_1.S3Constants.instanceS3Constants;
        // Se crea una promesa ya que puede devolver un error al subir la imagen
        let promise = new Promise((resolve, reject) => {
            // Configuracion de claves de acceso a S3
            let s3bucket = new aws_sdk_1.default.S3({
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
                s3bucket.upload(params, (err, data) => {
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
exports.Upload = Upload;
