import { GenericFrontError } from "./GenericFrontError";

export class ResponseError extends GenericFrontError {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(response: any, status: number, message?: string) {
    if (!message) {
      console.error(response);
      message = response.message;
    }
    super(response, message);
    this.name = "ResponseError";
    this.status = status;
    this.response = response;
  }

  status: number;
  response: any;
}
