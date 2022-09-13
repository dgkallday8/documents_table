import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { HttpService } from '../../services/http/http.service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { DocumentType, DocumentValue, FieldName, Organization } from '../../types/types'
import { FormBuilder } from '@angular/forms'
import { DataService } from '../../services/data/data.service'

@UntilDestroy()
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  constructor(
    private _httpService: HttpService,
    private _fb: FormBuilder,
    private _dataService: DataService,
    private _cdr:ChangeDetectorRef,
  ) { }

  public types: DocumentType[] = [];


  public filtersForm = this._fb.group({
    type: null,
    number: null,
  })

  ngOnInit(): void {
    this._getDocumentTypes();
    this._getData();
    this._getOrganizations()
  }

  private _getDocumentTypes() {
    this._httpService
      .getData<DocumentType[]>(FieldName.Types)
      .pipe(untilDestroyed(this))
      .subscribe((r: DocumentType[]) => {
        this.types = r;
        this._dataService.allDocumentTypes.next(r)
      })
  }

  private _getData() {
    this._httpService
      .getData<DocumentValue[]>(FieldName.Documents)
      .pipe(untilDestroyed(this))
      .subscribe((r) => {
        this._dataService.initialDocuments.next(r)
        this._dataService.documents.next(r)
      })
  }

  private _getOrganizations() {
    this._httpService
      .getData<Organization[]>(FieldName.Organizations)
      .pipe(untilDestroyed(this))
      .subscribe((r: Organization[]) => {
        this._dataService.organizations.next(r)
      })
  }

  public search() {
    const filteredData = this._dataService.documents.value.filter((field: DocumentValue) => {
      if (this.filtersForm.controls.number.value && !this.filtersForm.controls.type.value) {
        return field.number?.includes(this.filtersForm.controls.number.value);
      }

      if (!this.filtersForm.controls.number.value && this.filtersForm.controls.type.value) {
        return field.type === this.filtersForm.controls.type.value
      }

      return field.type === this.filtersForm.controls.type.value &&
        this.filtersForm.controls.number.value && field.number?.includes(this.filtersForm.controls.number.value)
    })
    this._dataService.documents.next(filteredData)
  }


  public resetFilters() {
    this.filtersForm.reset()
    this._dataService.documents.next(this._dataService.initialDocuments.value)
    this._dataService.showOnlyActiveDocuments.next(false)
    this._dataService.documentId.next(null)
  }

  public update() {
    this._getData()
  }
}
