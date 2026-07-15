import { HttpParams } from '@angular/common/http';
import { PaginationParams } from '../models';

export function toHttpParams(params: PaginationParams): HttpParams {
  let httpParams = new HttpParams()
    .set('page', params.page.toString())
    .set('pageSize', params.pageSize.toString());

  if (params.sortBy) {
    httpParams = httpParams.set('sortBy', params.sortBy);
  }
  if (params.sortOrder) {
    httpParams = httpParams.set('sortOrder', params.sortOrder);
  }
  if (params.search) {
    httpParams = httpParams.set('search', params.search);
  }

  return httpParams;
}
