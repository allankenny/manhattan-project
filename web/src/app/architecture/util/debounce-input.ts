import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

export const debounceInput = (changes: Observable<any>) => changes.pipe(
  debounceTime(400),
  filter(v => (v !== null && v !== undefined) && (!(v instanceof String || typeof v === 'string') || v.length > 0)),
  distinctUntilChanged()
);
