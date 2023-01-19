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
exports.Perfiles = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
class Perfiles {
    constructor() { }
    /**
     * Regresa la instancia de la clase Perfiles
     */
    static get instancePerfiles() {
        return this.perfilesInstance || (this.perfilesInstance = new this());
    }
    /**
     * Validar que el perfil no este repetido
     * @param nombre
     */
    checkIsNotRepeat(nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = false;
            response = yield database_config_1.default.func('check_valid_perfil', [nombre])
                .then(response => {
                // Si no existe el perfil
                if (response[0].check_valid_perfil === 0) {
                    return true;
                }
                else {
                    return false;
                }
            })
                .catch(error => {
                return false;
            });
            return response;
        });
    }
}
exports.Perfiles = Perfiles;
