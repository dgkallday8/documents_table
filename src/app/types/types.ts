export enum FieldName {
  Documents = 'documents',
  Types = 'types',
  Organizations = 'organizations'
}

export interface DocumentValue {
  id: number,
  type: string | null,
  series: string | null,
  number: string | null,
  date: string | null,
  oldDoc: boolean | null,
  code: string | null,
  mainDoc: boolean | null,
  organization: string | null
}

export interface Organization {
  id: number,
  name: string
}

export interface DocumentType {
  id: number,
  value: string,
  name: string
}
