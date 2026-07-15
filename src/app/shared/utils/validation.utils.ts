export class ValidationUtils {
  static emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  static phonePattern = /^(\+261|0)?[0-9\s-]{8,14}$/;

  static isValidEmail(email: string): boolean {
    return this.emailPattern.test(email);
  }

  static isValidPhone(phone: string): boolean {
    return this.phonePattern.test(phone);
  }

  static isNotEmpty(value: string | null | undefined): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
  }
}
