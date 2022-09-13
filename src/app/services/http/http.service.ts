import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { MAIN_URL } from '../../constants/constants'
import { DocumentValue, FieldName } from '../../types/types'

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private _http: HttpClient) { }

  public getData<R>(fieldName: FieldName): Observable<R> {
    return this._http.get<R>(`${MAIN_URL}/${fieldName}`);
  }

  public setData(data: DocumentValue) {
    return this._http.post(`${MAIN_URL}/documents/`, data)
  }

  public removeDocument(id: number) {
    return this._http.delete(`${MAIN_URL}/documents/${id}`)
  }

  public editDocument(id: number, data: DocumentValue) {
    return this._http.put(`${MAIN_URL}/documents/${id}`, data)
  }
}

