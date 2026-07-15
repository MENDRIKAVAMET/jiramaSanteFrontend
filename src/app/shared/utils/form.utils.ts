export class FormUtils {
  static markAllAsTouched(formGroup: { controls: Record<string, { markAsTouched: () => void }> }): void {
    Object.values(formGroup.controls).forEach((control) => control.markAsTouched());
  }

  static hasFieldError(
    control: { invalid: boolean; touched: boolean; errors: Record<string, unknown> | null } | null,
    errorName: string,
  ): boolean {
    return control !== null && control.invalid && control.touched && control.errors?.[errorName] !== undefined;
  }
}
