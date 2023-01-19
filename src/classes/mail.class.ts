// NodeMailer
import nodemailer from "nodemailer";
// Constants
import { Constants } from "../constants/constants.constants";
// Class
import { Server } from "./server.class";

export class Mail extends Constants {
  // Crea la instancia de la clase Mail
  private static mailInstance: Mail;
  public headerImg: string = 'https://openbis.com.mx/assets/encabezado_mail_openbis.jpg';

  // Datos del servicio de correo
  private transporter = nodemailer.createTransport({
    host: "smtp.ionos.mx",
    port: 587,
    // secure: true, // upgrade later with STARTTLS
    auth: {
      user: this.email.EMAIL,
      pass: this.email.PASSWORD_EMAIL
    },
    // debug: true, // show debug output
    logger: true, // log information in console,
    requireTLS: true
  });

  private constructor() {
    super();
  }

  /**
   * Devuelve la instancia de la clase mail
   */
  public static get instanceMail() {
    return this.mailInstance || (this.mailInstance = new this());
  }

  /**
   * Envia el email para recuperar el password
   * @param email
   */
  public sendMail(email: string): Promise<any> {
    // Instancia de la clase server
    const server = Server.instanceServer;

    const mailOptions = {
      from: this.email.EMAIL,
      to: email,
      subject: this.email.SUBJECT,
      html: ` Hola buen día.
                    <br>
                    Para recuperar su contraseña es necesario dar clic en el siguiente enlace:
                    <br>
                    https://openbis.com.mx/login/reset/update-password/${email}`
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }





  /**
   * Objeto con la informacion del usuario
   * @param data
   */
  public sendMailContacto(data: any): Promise<any> {

    const mailOptions = {
      from: this.email.EMAIL,
      to: 'contactoweb@openbis.com.mx',
      subject: 'Contacto OpenBis',
      html: ` Hola buen día.
                    <br>
                    Han dejado la siguiente información en el formulario de contacto:
                    <br>
                    <br> - Nombre: ${data.nombre}
                    <br> - Teléfono: ${data.telefono}
                    <br> - Correo: ${data.correo}
                    <br> - Paquete: ${data.paquete}
                    <br> - Mensaje: ${data.mensaje}
                    <br>`
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });

  }


  /**
   * Envia el email para recuperar el password
   * @param email
   */
  public sendMailRecovery(email: string, token: string): Promise<any> {
    // Instancia de la clase server
    const server = Server.instanceServer;

    const mailOptions = {
      from: this.email.EMAIL,
      to: email,
      subject: this.email.SUBJECT,
      html: ` Hola buen día.
                    <br>
                    Para recuperar su contraseña es necesario dar clic en el siguiente enlace:
                    <br>
                    www.openbis.com.mx/password/actualizar/${token}`
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * Envia el email para recuperar el password
   * @param email
   */
  public sendMailWelcome(email: string): Promise<any> {
    // Instancia de la clase server
    const server = Server.instanceServer;

    const mailOptions = {
      from: this.email.EMAIL,
      to: email,
      subject: this.email.SUBJECT_WELCOME,
      html: `
            <html>
            <head>
            <title>Bienvenido | Openbis</title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <style type="text/css">
            body,td,th {
                font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
            }
            </style>
            </head>
            <body>
            ​
            <table width="1200" border="0" align="center" cellpadding="0" cellspacing="0" id="Tabla_01">
                <tr>
                  <td align="center">Si no puede ver completo este mensaje, da click AQUI</td>
              </tr>
                <tr>
                    <td><a href="http://openbis.com.mx"><img src="${this.headerImg}" width="1200" height="168" alt=""></a></td>
                </tr>
                <tr>
                    <td align="center" style="color:#4d4d4d"><h1>
                    BIENVENIDO<br>
            ¡Estás a solo un paso!
                        </h1></td>
                </tr>
                <tr>
                  <td align="center" style="color:#4d4d4d">
                  <table width="60%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="color:#4d4d4d; text-align:center;">
            <p>
            Agradecemos profundamente generar tu cuenta con Openbis, éste es el comienzo para que tu negocio CREZCA, te acompañaremos en este camino.
            <br><br>
            Contamos con diferentes soluciones como son, MI NEGOCIO TPV, ADMINISTRACIÓN DE INMUEBLES, CONTROL DE ALMACÉN Y GESTIÓN DE PROYECTOS.
            <br><br>
            Todo con el soporte, actualización y garantía de UELIT Group.<br><br>
            ​
            <h2>Tus datos son los siguientes:</h2>
            Email: ${email}
            <br><br>
            <h3>INICIA SESIÓN AQUÍ</h3>
            </p>
                </td>
              </tr>
            </table>
                  </td>
              </tr>
                <tr>
                  <td style="text-align:right; color:#4d4d4d">
                      Gracias por registrarte<br>
                      - Equipo Openbis
                  </td>
              </tr>
                <tr>
                    <td><a href="http://openbis.com.mx/mitpv"><img src="https://layoutopenbis.firebaseapp.com/mailb/index_03.gif" width="1200" height="614" alt=""></a></td>
                </tr>
                <tr>
                    <td><a href="http://openbis.com.mx"><img src="https://layoutopenbis.firebaseapp.com/mailb/index_04.jpg" width="1200" height="226" alt=""></a></td>
                </tr>
                <tr>
                  <td bgcolor="#4d4d4d" style="padding:40px;"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td width="50%" style="text-align:center;"><img src="http://openbis.com.mx/assets/imagenes/logotipo-openbis-blanco.png"></td>
                      <td width="50%" align="center" style="color:#FFF; text-align:center; font-size:24px">
                        +524425389664<br>
                        info@openbis.com.mx<br>
                        <a href="https://openbis.com.mx/documentos/aviso.pdf">Aviso de privacidad</a>  
                      </td>
                    </tr>
                  </table></td>
              </tr>
            </table>
            </body>
            </html> 
                    `
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * Envia el email de bienvenida para tipo de pago transferencia y tienda
   * @param email
   */
  public sendMailPaquete(
    email: string,
    tipo: string,
    id_usuario: string,
    nombre: string,
    link: string
  ): Promise<any> {
    // Instancia de la clase server
    const server = Server.instanceServer;

    let htmlMessage: string = "";

    if (tipo == "Transferencia" || tipo === "Transferencia" || tipo == "Oxxo" || tipo === "Oxxo") {
      htmlMessage = `
            <html>
            <head>
            <title>Bienvenido a Openbis Mi Negocio TPV</title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <style type="text/css">
            body,td,th {
            	font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
            }
            </style>
            </head>
            <body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
            ​
            <table id="Tabla_01" width="1200" border="0" cellpadding="0" cellspacing="0" align="center">
            	<tr>
            		<td>
            			<a href="https://www.openbis.com.mx"><img src="${this.headerImg}" width="100%" alt=""></a></td>
            	</tr>
            	<tr>
            		<td align="center" style="color:#4d4d4d"><h1>
                    BIENVENIDO<br>
            ¡Estás a solo un paso!
                        </h1></td>
            	</tr>
            	<tr>
            	  <td align="center">
                  <table width="70%" border="0" cellspacing="0" cellpadding="0">
                  	<tr>
                		<td style="color:#4d4d4d"><h3>Estimad@: ${nombre} </h3></td>
                		<td align="right" style="color:#4d4d4d"><h3>ID cliente: ${id_usuario} </h3></td>
              		</tr>
            	  </table>
                  </td>
              	</tr>
            ​
              	<tr>
            	  <td align="center">
                  <table width="60%" border="0" cellspacing="0" cellpadding="0">
              		<tr>
                		<td style="color:#4d4d4d; text-align:center; font-size: 16px; padding: 20px 0;">
            				<p>Agradecemos profundamente generar tu cuenta con <strong>Openbis Mi Negocio TPV</strong>, éste es el comienzo para que <strong>tu negocio CREZCA</strong> y te acompañaremos en este camino.<br>
            				Todo con el soporte, actualización y garantía de <strong>UELIT Group</strong>.
            				<br><br>
            				Recuerda realizar tu pago para terminar el proceso de compra.<br>
            				</p>
            				
                		</td>
              		</tr>
            	  </table>
                  </td>
              	</tr>

            	<tr>
            		<td style="color: #4d4d4d; text-align: center; padding: 20px 0;">
            			Posterior a tu pago envíanos tu comprobante al correo:
            			<h1><a href="mailto:pagos@openbis.com.mx" style="color: #4d4d4d;">pagos@openbis.com.mx</a></h1>
            			Te enviaremos un correo para iniciar sesión
            		</td>
            	</tr>
            	<tr>
            		<td>
            			<a href="mailto:pagos@openbis.com.mx"><img src="https://layoutopenbis.firebaseapp.com/mailb/banco_05.jpg" width="100%" alt=""></a></td>
            	</tr>
            	<tr>
            	  <td bgcolor="#4d4d4d" style="padding:40px;"><table width="100%" border="0" cellspacing="0" cellpadding="0">
            	    <tr>
            	      <td width="50%" style="text-align:center;"><img src="http://openbis.com.mx/assets/imagenes/logotipo-openbis-blanco.png"></td>
                    <td width="50%" align="center" style="color:#FFF; text-align:center; font-size:24px">
                      +52 442 538 9664<br>
                      info@openbis.com.mx<br>
                      <a href="https://openbis.com.mx/documentos/aviso.pdf">Aviso de privacidad</a>
                    </td>
                    </tr>
                  </table></td>
              </tr>
            </table>
            <!-- End Save for Web Slices -->
            </body>

            `;
    } else if (tipo == "Tienda" || tipo === "Tienda") {
      htmlMessage = `
           <html>
           <head>
           <title>Bienvenido a Openbis Mi Negocio TPV</title>
           <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
           <style type="text/css">
           body,td,th {
           	font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
           }
           </style>
           </head>
           <body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
           ​
           <table id="Tabla_01" width="1200" border="0" cellpadding="0" cellspacing="0" align="center">
           	<tr>
           		<td>
           			<a href="https://www.openbis.com.mx"><img src="${this.headerImg}" width="100%" alt=""></a></td>
           	</tr>
           	<tr>
           		<td align="center" style="color:#4d4d4d"><h1>
                   BIENVENIDO<br>
           ¡Estás a solo un paso!
                       </h1></td>
           	</tr>
           	<tr>
           	  <td align="center">
                 <table width="70%" border="0" cellspacing="0" cellpadding="0">
                 	<tr>
               		<td style="color:#4d4d4d"><h3>Estimad@: ${nombre}</h3></td>
               		<td align="right" style="color:#4d4d4d"><h3>ID cliente: ${id_usuario}</h3></td>
             		</tr>
           	  </table>
                 </td>
             	</tr>
             	<tr>
           	  <td align="center">
                 <table width="60%" border="0" cellspacing="0" cellpadding="0">
             		<tr>
               		<td style="color:#4d4d4d; text-align:center; font-size: 16px; padding: 20px 0;">
           				<p>Agradecemos profundamente generar tu cuenta con <strong>Openbis Mi Negocio TPV</strong>, éste es el comienzo para que <strong>tu negocio CREZCA</strong> y te acompañaremos en este camino.<br>
           				Todo con el soporte, actualización y garantía de <strong>UELIT Group</strong>.
           				<br><br>
           				Recuerda realizar tu pago para terminar el proceso de compra.<br>
           				</p>
               		</td>
             		</tr>
           	  </table>
                 </td>
             	</tr>
           	<tr>
           		<td>
           			<a href="https://openbis.com.mx/login"><img src="https://layoutopenbis.firebaseapp.com/mailb/tienda_04.jpg" width="1200" height="252" alt=""></a></td>
           	</tr>
           	<tr>
           		<td>
           			<a href="mailto:pagos@openbis.com.mx"><img src="https://layoutopenbis.firebaseapp.com/mailb/tienda_06.jpg" width="100%" alt=""></a></td>
           	</tr>
           	<tr>
           	  <td bgcolor="#4d4d4d" style="padding:40px;"><table width="100%" border="0" cellspacing="0" cellpadding="0">
           	    <tr>
           	      <td width="50%" style="text-align:center;"><img src="http://openbis.com.mx/assets/imagenes/logotipo-openbis-blanco.png"></td>
                   <td width="50%" align="center" style="color:#FFF; text-align:center; font-size:24px">
                    +52 442 538 9664<br>
                    info@openbis.com.mx<br>
                    <a href="https://openbis.com.mx/documentos/aviso.pdf">Aviso de privacidad</a>
                  </td>
                   </tr>
                 </table></td>
             </tr>
           </table>
           <!-- End Save for Web Slices -->
           </body>
           </html>
            `;
    } else if (tipo == "gratuito" || tipo === "gratuito") {
      htmlMessage = `
            <html>
            <head>
            <title>Bienvenido a Openbis Mi Negocio TPV</title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <style type="text/css">
            body,td,th {
            	font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
            }
            </style>
            </head>
            <body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
            ​
            <table id="Tabla_01" width="1200" border="0" cellpadding="0" cellspacing="0" align="center">
            	<tr>
            		<td>
            			<a href="https://www.openbis.com.mx"><img src="${this.headerImg}" width="100%" alt=""></a></td>
            	</tr>
            	<tr>
            		<td align="center" style="color:#4d4d4d"><h1>
                    BIENVENIDO<br>
            ¡Estás a solo un paso!
                        </h1></td>
            	</tr>
            	<tr>
            	  <td align="center">
                  <table width="70%" border="0" cellspacing="0" cellpadding="0">
                  	<tr>
                		<td style="color:#4d4d4d"><h3>Estimad@: ${nombre} </h3></td>
                		<td align="right" style="color:#4d4d4d"><h3>ID cliente: ${id_usuario} </h3></td>
              		</tr>
            	  </table>
                  </td>
              	</tr>
            ​
              	<tr>
            	  <td align="center">
                  <table width="60%" border="0" cellspacing="0" cellpadding="0">
              		<tr>
                		<td style="color:#4d4d4d; text-align:center; font-size: 16px; padding: 20px 0;">
            				<p>Agradecemos profundamente generar tu cuenta con <strong>Openbis Mi Negocio TPV</strong>, éste es el comienzo para que <strong>tu negocio CREZCA</strong> y te acompañaremos en este camino.<br>
            				Todo con el soporte, actualización y garantía de <strong>UELIT Group</strong>.
            				<br><br>
                    <strong>Te has registrado en un PLAN GRATUITO por 14 d&iacute;as.</strong>
            				</p>
            				
                		</td>
              		</tr>
            	  </table>
                  </td>
              	</tr>

            	<tr>
            		<td style="color: #4d4d4d; text-align: center; padding: 20px 0;">
                  El plan gratuito tiene las características de Plan Básico y algunas<BR>
                  funcionalidades están limitadas.
            		</td>
            	</tr>
            	<tr>
            		<td style="color: #4d4d4d; text-align: center; padding: 20px 0;">
                  Si tienes dudas por favor comunícate a los teléfonos de contacto o al correo: soporte@openbis.com.mx<BR>
                  Con gusto te asesoramos!
                </td>
              </tr>
              <tr>
            		<td style="color: #4d4d4d; text-align: center; padding: 20px 0;">
                  <br><a href="https://openbis.com.mx/documentos/terminos_contrato.pdf">Contrato</a>
                </td>
            	</tr>
            	<tr>
                <td bgcolor="#4d4d4d" style="padding:40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
            	      <tr>
            	        <td width="50%" style="text-align:center;"><img src="http://openbis.com.mx/assets/imagenes/logotipo-openbis-blanco.png"></td>
                      <td width="50%" align="center" style="color:#FFF; text-align:center; font-size:24px">
                        +52 442 538 9664<br>
                        info@openbis.com.mx<br>
                        <a href="https://openbis.com.mx/documentos/aviso.pdf">Aviso de privacidad</a>
                      </td>
                  </tr>
                  </table></td>
              </tr>
            </table>
            <!-- End Save for Web Slices -->
            </body>

            `;
    }

    const mailOptions = {
      from: this.email.EMAIL,
      to: email,
      subject: this.email.SUBJECT_WELCOME,
      html: htmlMessage
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * Envia el email de bienvenida para tipo de pago tarjeta
   * @param email
   */
  public sendMailPaqueteTarjeta(
    email: string,
    tipo: string,
    id_usuario: string,
    nombre: string,
    data: any[],
    conceptos: any[]
  ): Promise<any> {
    // Instancia de la clase server
    const server = Server.instanceServer;

    let htmlMessage: string = "";
    let total = 0;

    if (tipo == "Tarjeta" || tipo === "Tarjeta") {
      htmlMessage = `
            <html>
            <head>
            <title>Bienvenido a Openbis Mi Negocio TPV</title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <style type="text/css">
            body,td,th {
              font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
            }
            </style>
            </head>
            <body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
            ​
            <table id="Tabla_01" width="700" border="0" cellpadding="0" cellspacing="0" align="center">
              <tr>
                <td>
                  <a href="https://www.openbis.com.mx"><img src="${this.headerImg}" width="100%" alt=""></a></td>
              </tr>
              <tr>
                <td align="center" style="color:#4d4d4d"><h1>
                    BIENVENIDO<br>
            ¡Estás a solo un paso!
                        </h1></td>
              </tr>
              <tr>
                <td align="center">
                  <table width="70%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                    <td style="color:#4d4d4d"><h3>Estimad@ ${nombre} </h3></td>
                    <td align="right" style="color:#4d4d4d"><h3>ID cliente: ${id_usuario}</h3></td>
                  </tr>
                </table>
                  </td>
                </tr>
                <tr>
                <td align="center">
                  <table width="60%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="color:#4d4d4d; text-align:center; font-size: 16px; padding: 20px 0;">
                    <p>Agradecemos profundamente generar tu cuenta con <strong>Openbis Mi Negocio TPV</strong>, éste es el comienzo para que <strong>tu negocio CREZCA</strong> y te acompañaremos en este camino.<br>
                    Todo con el soporte, actualización y garantía de <strong>UELIT Group</strong>.
                    </p>
                    </td>
                  </tr>
                </table>
                  </td>
                </tr>
              <tr>

                <td>
                  <table width="600" border="0" cellspacing="0" cellpadding="0" align="center">
              <tr>
                <td height="41"><h3>Resumen de orden de compra</h3></td>
              </tr>
              <tr>
                <td><p>Estimad@ ${nombre}, su orden de compra ha sido completada.<br />
                A continuación le mostramos los productos adquiridos.</p></td>
              </tr>
              <tr>
                <td><table width="600" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td height="31"><strong>Producto</strong></td>
                    <td><strong>Precio</strong></td>
                    <td><strong>cantidad</strong></td>
                    <td><strong>Subtotal</strong></td>
                  </tr>
                  <tr>
                    <td colspan="5" height="2" bgcolor="#FFCC00"></td>
                    </tr>`;

      for (let index = 0; index < conceptos.length; index++) {
        total =
          total + conceptos[index].valorUnitario * conceptos[index].cantidad;

        htmlMessage =
          htmlMessage +
          `<tr>
                    <td height="33">
                    <strong>${conceptos[index].descripcion}</strong></td>
                    <td>${conceptos[index].valorUnitario}</td>
                    <td>${conceptos[index].cantidad}</td>
                    <td>${conceptos[index].valorUnitario *
                      conceptos[index].cantidad}</td>
                  </tr> `;
      }

      htmlMessage =
        htmlMessage +
        `<tr>
                    <td colspan="5" height="2" bgcolor="#333333"></td>
                    </tr>
                  <tr>
                    <td colspan="4">&nbsp;</td>
                    <td><strong>Total: ${total}</strong></td>
                  </tr>
                </table></td>
              </tr>
              <tr>
                <td>
                  <table width="600" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td height="37">Información de pago:</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td><div align="right">- Alias de la tarjeta: </div></td>
                    <td>&nbsp;</td>
                    <td>${data[0].tarjeta}</td>
                  </tr>
                  <tr>
                    <td><div align="right">- Código de autorización:</div></td>
                    <td>&nbsp;</td>
                    <td>${data[0].cod_aut}</td>
                  </tr>
                  <tr>
                    <td><div align="right">- Estatus:</div></td>
                    <td>&nbsp;</td>
                    <td>${data[0].status}<strong></strong></td>
                  </strong>
                </table>
              </td>
              </tr>
            </table>
                </td>


              </tr>
              <tr>
                <td>
                  <a href="https://www.openbis.com.mx/login"><img src="https://layoutopenbis.firebaseapp.com/mailb/tarjeta_04.jpg" width="1200" height="198" alt=""></a></td>
              </tr>
              <tr>
                <td>
                  <a href="mailto:pagos@openbis.com.mx"><img src="https://layoutopenbis.firebaseapp.com/mailb/tarjeta_05.jpg" width="100%" alt=""></a></td>
              </tr>
              <tr>
                <td bgcolor="#4d4d4d" style="padding:40px;"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="50%" style="text-align:center;"><img src="http://openbis.com.mx/assets/imagenes/logotipo-openbis-blanco.png"></td>
                    <td width="50%" align="center" style="color:#FFF; text-align:center; font-size:24px">
                      +52 442 538 9664<br>
                      info@openbis.com.mx <br>
                      <a href="https://openbis.com.mx/documentos/aviso.pdf">Aviso de privacidad</a>
                    </td>
                    </tr>
                  </table></td>
              </tr>
            </table>
            <!-- End Save for Web Slices -->
            </body>
            </html>
            `;
    }

    const mailOptions = {
      from: this.email.EMAIL,
      to: email,
      subject: this.email.SUBJECT_WELCOME,
      html: htmlMessage
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }


  /**
   * sendMailCuentaLiberada
   * @param data datos
   */
  public sendMailCuentaLiberada(data: any): Promise<any> {


    let htmlMessage: string = `
    <html>
    <head>
    <title>Bienvenido a Openbis Mi Negocio TPV</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style type="text/css">
    body,td,th {
      font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    }
    </style>
    </head>
      <body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
    ​
        <table id="Tabla_01" width="1200" border="0" cellpadding="0" cellspacing="0" align="center">
          <tr>
            <td>
              <a href="https://www.openbis.com.mx"><img src="${this.headerImg}" width="100%" alt=""></a></td>
          </tr>
          <tr>
            <td>
              <p>
                <b>Estimado Usuario: ${data.usuario}
                  <br/>A partir de este momento su cuenta esta activada.
                  <br/>Plan adquirido:  ${data.plan}
                  <br/>Vigente hasta: ${data.vigencia}
                </b>
              </p>
              <p style="text-align: center;">
                Agradecemos profundamente haya decidido el uso de OPENBIS TPV como su herramienta
                <br/>online para la administraci&oacute;n de su negocio.
                <br/>Comience a disfrutar de las ventajas de tener OPENBIS TPV como aliado tecnol&oacute;gico.
              </p>
              <p style="text-align: center;">
                Consulte caracter&iacute;sticas del plan contratado en: https://openbis.com.mx/tienda
              </p>

              <p style="text-align: center; background-color: orange; color: black; padding: 4px;">
                <a style="color: black;" href="https://openbis-sistema.web.app/login/auth">
                  <b>Comience a administrar su negocio dando click aqui</b>
                </a>
              </p>

              <p style="text-align: center; color: black; padding: 4px;">
                Descargue la aplicaci&oacute;n para su dispositivo Android en Playstore, es gratuita.
              </p>

              <p>
                <BR/>
                Cualquier duda cont&aacute;ctenos, con gusto le ayudamos.
                <BR/>
                (+52) 442.538.9664, soporte.usuarios@openbis.com.mx
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `;

    const mailOptions = {
      from: this.email.EMAIL,
      to: data.correo,
      subject: "Cuenta Openbis liberada",
      html: htmlMessage
    };
    
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }






}
