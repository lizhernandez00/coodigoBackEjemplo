// Json Web Token
import jsonwebtoken from 'jsonwebtoken';

// Moment
import moment from 'moment';
// Constants
import { Constants } from '../constants/constants.constants';

export class Token extends Constants{

    // Crea una instancia de la clase Token
    private static tokenInstance: Token;

    private constructor() {
        super();
    }

    /**
     * Devuelve la instancia de la clase Token
     */
    public static get instanceToken(): Token {
        return this.tokenInstance || (this.tokenInstance = new this());
    }

    /**
     * Genera un token mediante los datos del usuario
     * @param user 
     */
    public generateToken(user: any): string {

        let payload = {
            sub: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            iat: moment().unix(),
            exp: moment().add(100, 'days').unix()
        };

        return jsonwebtoken.sign(payload, this.token.SECRET_KEY);
    }

    /**
     * Genera un token mediante los datos del admin
     * @param admin 
     */
    public generateTokenAdmin(admin: any): string {

        let payload = {
            sub: admin.id,
            nombre: admin.nombre,
            apellido: admin.apellido,
            email: admin.email,
            iat: moment().unix(),
            exp: moment().add(100, 'days').unix()
        };

        return jsonwebtoken.sign(payload, this.token.SECRET_KEY);
    }

}