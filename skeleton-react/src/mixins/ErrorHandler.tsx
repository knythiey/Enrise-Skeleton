class ErrorHandler {
  errors: { [key: string]: string } = {};

  constructor(errors: any) {
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }

  getErrorsCount() {
    return Object.keys(this.errors).length;
  }

  getKey(key: string) {
    return this.errors[key] !== undefined ? this.errors[key] : null;
  }

  reset() {
    this.errors = {};
  }

  removeKey(key: string) {
    if (this.errors[key] !== undefined) delete this.errors[key];
  }

  hasKey(key: string) {
    return this.errors[key] !== undefined;
  }
}

export default ErrorHandler;
