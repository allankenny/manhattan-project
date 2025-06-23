import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit?: number, trail?: string): string {
    value = value.trim();
    if (!limit) {
      limit = 100;
    }
    if (!trail) {
      trail = '…';
    }
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
