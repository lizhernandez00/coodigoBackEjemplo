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
exports.CategoriasAdministracion = void 0;
class CategoriasAdministracion {
    /**
     * Devuelve la informacion de todas los categorias con paginacion
     * @param req
     * @param res
     */
    getCategoriasByLimit(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la informacion de todas las categorias activas
     * @param req
     * @param res
     */
    getCategoriasActivas(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la informacion de la categoria mediante el filtro de id
     * @param req
     * @param res
     */
    getCategoriaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la informacion de las categorias por id de paquete
     * @param req
     * @param res
     */
    getCategoriasByPaquete(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve los productos por id de paquete y id de categoria
     * @param req
     * @param res
     */
    getProductosByPaqCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
    * Crea nuevas categorias
    * @param req
    * @param res
    */
    createCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Cambia el status(Activo o Inactivo) de una categoria
     * @param req
     * @param res
     */
    statusCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza la informacion de una categoria
     * @param req
     * @param res
     */
    updateCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve los productos por id de categoria
     * @param req
     * @param res
     */
    getProductosByCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.CategoriasAdministracion = CategoriasAdministracion;
