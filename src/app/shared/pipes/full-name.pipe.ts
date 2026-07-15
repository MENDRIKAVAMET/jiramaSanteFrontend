import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullName',
  standalone: true,
})
export class FullNamePipe implements PipeTransform {
  transform(firstName: string | null | undefined, lastName: string | null | undefined): string {
    const first = firstName?.trim() ?? '';
    const last = lastName?.trim() ?? '';
    return [first, last].filter(Boolean).join(' ') || '—';
  }
}
