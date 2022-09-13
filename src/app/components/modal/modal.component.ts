import { Component, OnInit, Inject } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { HttpService } from '../../services/http/http.service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { DataService } from '../../services/data/data.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { DocumentType, Organization } from '../../types/types'

@UntilDestroy()
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  public modalForm = this._fb.group({
    mainDoc: true,
    oldDoc: false,
    type: [null, Validators.required],
    series: null,
    number: [null, Validators.required],
    date: null,
    organization: null,
    code: null,
  })

  public types!: DocumentType[];

  public organizations: Organization[] = []

  constructor(
    private _fb: FormBuilder,
    private _httpService: HttpService,
    private _dataService: DataService,
    private _dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public docId: number
  ) { }

  ngOnInit(): void {
    this.types = this._dataService.allDocumentTypes.value;
    this._onGetOrganizations()
    const currentDoc = this._dataService.documents.value.find(doc => doc.id === this.docId)

    if (currentDoc) {
      // @ts-ignore
      this.modalForm.patchValue({ ...currentDoc })
    }
  }

  private _onGetOrganizations() {
    this._dataService.organizations
      .pipe(untilDestroyed(this))
      .subscribe(value => this.organizations = value)
  }

  public addDoc() {
    if (this.disableHandler) {
      return
    }
    this._httpService
      .setData({
        id: Date.now(),
        type: this.modalForm.value.type || '',
        series: this.modalForm.value.series || '',
        number: this.modalForm.value.number || '',
        date: this.modalForm.value.date || '',
        oldDoc: this.modalForm.value.oldDoc || false,
        organization: this.modalForm.value.organization || '',
        code: this.modalForm.value.code || '',
        mainDoc: this.modalForm.value.mainDoc || null
      })
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._dialogRef.close()
      })
  }

  public editDoc(id: number) {
    if (this.disableHandler) {
      return
    }
    this._httpService
      .editDocument(id, {
        id,
        type: this.modalForm.value.type || '',
        series: this.modalForm.value.series || '',
        number: this.modalForm.value.number || '',
        date: this.modalForm.value.date || '',
        oldDoc: this.modalForm.value.oldDoc || false,
        organization: this.modalForm.value.organization || '',
        code: this.modalForm.value.code || '',
        mainDoc: this.modalForm.value.mainDoc || null
      })
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._dialogRef.close()
      })
  }

  public get disableHandler() {
    return this.modalForm.invalid
  }
}


