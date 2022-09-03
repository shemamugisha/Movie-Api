export class GenericResponse<T> {
  message?: string = 'Success';
  payload?: T = null;
  constructor(message?: string, payload?: T) {
    this.message = message;
    this.payload = payload;
  }
}
