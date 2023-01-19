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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagenesAdministracion = void 0;
class ImagenesAdministracion {
    /**
     * Devuelve la informacion de todas los imagenes con paginacion
     * @param req
     * @param res
     */
    getImagenesByLimit(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la informacion de la imagen mediante el filtro de id
     * @param req
     * @param res
     */
    getImagenById(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
    * Crea nuevas imagens
    * @param req
    * @param res
    */
    createImagen(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Borra(desactiva) una imagen
     * @param req
     * @param res
     */
    deleteImagen(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza la informacion de una imagen
     * @param req
     * @param res
     */
    updateImagen(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.ImagenesAdministracion = ImagenesAdministracion;
