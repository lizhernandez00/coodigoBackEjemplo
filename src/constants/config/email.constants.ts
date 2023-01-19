export class EmailConstants {
  // Crea una instancia de la clase EmailConstants
  private static emailConstantsInstance: EmailConstants;

  /**
   * EMAIL_LIST
   */
  public readonly EMAIL_LIST = {
    liberaSistema: "ventas@openbis.com.mx",
    copiaRegistro: "ventas@openbis.com.mx"
  };

  // SUBJECT
  public readonly SUBJECT: string = "Recuperación de contraseña";
  // SUBJECT WELCOME
  public readonly SUBJECT_WELCOME: string = "Registro exitoso Openbis";
  // EMAIL
  public readonly EMAIL: string = "contactoweb@openbis.com.mx";
  // PASSWORD
  public readonly PASSWORD_EMAIL: string = "9Jopen*mF5.0wb";
  // SERVICE EMAIL
  public readonly SERVICE_EMAIL: string = "";

  private constructor() {}

  /**
   *Crea una instancia de la clase Email Constants
   *
   * @readonly
   * @static
   * @type {EmailConstants}
   * @memberof EmailConstants
   */
  public static get instanceEmailConstants(): EmailConstants {
    return (
      this.emailConstantsInstance || (this.emailConstantsInstance = new this())
    );
  }
}
