import db from "../config/database.config";

export class Perfiles {

    // Crea una instancia de la clase perfiles
    private static perfilesInstance: Perfiles;

    private constructor() {}

    /**
     * Regresa la instancia de la clase Perfiles
     */
    public static get instancePerfiles(): Perfiles {
        return this.perfilesInstance || (this.perfilesInstance = new this());
    }

    /**
     * Validar que el perfil no este repetido
     * @param nombre 
     */
    public async checkIsNotRepeat( nombre: string ): Promise<boolean> {

        let response = false;

        response = await db.func('check_valid_perfil', [nombre])
            .then( response => {
                // Si no existe el perfil
                if (response[0].check_valid_perfil === 0) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch( error => {
                return false;
            });
        
        return response;
    }

}