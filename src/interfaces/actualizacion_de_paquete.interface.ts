//
export interface IActualizacionDePaquete {
  id?: string;
  id_usuario: string;
  id_paquete_anterior: string;
  subtotal_anterior: number;
  id_paquete_nuevo: string;
  subtotal_nuevo: number;
  diferencia: number;
  forma_pago: string;
  id_transaccion_openpay?: string;
  fecha_de_actualizacion?: string;
  status_pago?: boolean;
  status?: boolean;
  create_at?: string;
}
//
export interface IFNInGenerarCambioDeSubscripcion {
  id_paquete_nuevo: string;
  id_usuario: string;
  forma_pago: string;
}
//
export interface IFNOutGenerarCambioDeSubscripcion {
  id: string;
  diferencia: number;
  usuarioNombre: string;
  usuarioEmail: string;
  nombrePaquete: string;
}
//
export interface IGenerarCambioDeSubscripcionRespuesta {
  referencia?: string;
  urlFormularioOpenpay?: string;
  barcodeUrl?: string;
  diferenciaAPagar: number;
}
//
export interface IFNInActualizarCambioDeSubscripcion {
  id: string;
  idUsuario: string;
  idTransaccionOpenpay: string;
  campo: string;
}
