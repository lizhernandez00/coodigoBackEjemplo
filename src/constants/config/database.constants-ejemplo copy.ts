/**
 * INSTRUCCIONES ***IMPORTANTE***
 * El proyecto funcionara despues de completar los siguientes pasos
 * 1. Copie este archivo y renombre la copia a: database.constants.ts
 * 2. Abra el nuevo archivo
 * 3. Edite los parametros segun corresponda
 * 4. Guarde los cambios
 * 5. No borre el archivo: database.constants-ejemplo.ts
 */
export class DatabaseConstants {
  /**
   * HOST DATABASE
   * IP o dominio, donde esta ubicada la base de datos
   * por defecto: localhost
   */
  public static readonly HOST: string = "localhost";

  /**
   * PORT DATABASE
   * puerto donde escucha la base de datos
   * por defecto: 5432
   */
  public static readonly PORT_DATABASE: string = "5432";

  /**
   * USER DATABASE
   * usuario de la base de datos
   * por defecto: root
   */
  public static readonly USER_DATABASE: string = "root";

  /**
   * PASSWORD DATABASE
   * contraseña de la base de datos
   */
  public static readonly PASSWORD_DATABASE: string = "[EDITE AQUI]";
  /**
   * NAME DATABASE
   * nombre de la base de datos
   */
  public static readonly DATABASE: string = "[EDITE AQUI]";

  constructor() {}
}
