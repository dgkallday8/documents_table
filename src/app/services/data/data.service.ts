import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { DocumentType, DocumentValue, Organization } from '../../types/types'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() { }
  public initialDocuments = new BehaviorSubject<DocumentValue[]>([])
  public documents = new BehaviorSubject<DocumentValue[]>([])
  public showOnlyActiveDocuments = new BehaviorSubject<boolean>(false)
  public documentId = new BehaviorSubject<number | null>(null)
  public allDocumentTypes = new BehaviorSubject<DocumentType[]>([])
  public organizations = new BehaviorSubject<Organization[]>([])
}
