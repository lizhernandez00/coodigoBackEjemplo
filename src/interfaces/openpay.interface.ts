//
export interface ICustomer {
  external_id?: string;
  name: string;
  last_name?: string;
  email: string;
  requires_account?: boolean;
}
//
export interface ICrearCargo {
  amount: number;
  confirm?: boolean;
  customer?: ICustomer;
  description: string;
  due_date?: string;
  method: string;
  order_id?: string;
  redirect_url?: string;
  send_email?: boolean;
}
//
export interface ICardPointsR {
  used: number;
  remaining: number;
  amount: number;
  caption?: string;
}
//
export interface IPaymentMethodR {
  type: string;
  reference: string;
  barcode_url: string;
  url: string;
}
//
export interface IRespuestaTransaccionR {
  id: string;
  authorization: string;
  transaction_type: string;
  operation_type: string;
  method: string;
  creation_date: string;
  order_id: string;
  status: string;
  amount: number;
  description: string;
  error_message: string;
  customer_id: string;
  currency: string;
  bank_account: any;
  card: any;
  card_points: ICardPointsR;
  payment_method: IPaymentMethodR;
  customer: ICustomer;
}
//
export interface IRespuestaErrorR {
  category: string;
  error_code: number;
  description: string;
  http_code: string;
  request_id: string;
  fraud_rules: string[];
}
//
