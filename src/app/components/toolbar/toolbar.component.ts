import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ModalComponent } from '../modal/modal.component'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { DataService } from '../../services/data/data.service'
import { FormBuilder } from '@angular/forms'
import { MatCheckboxChange } from '@angular/material/checkbox'
import { HttpService } from '../../services/http/http.service'

@UntilDestroy()
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Output() public emitter = new EventEmitter();

  public selectedDocumentId: number | null = null;

  public form = this._fb.group({ onlyActive: false })

  constructor(
    private _dialog: MatDialog,
    private _dataService: DataService,
    private _httpService: HttpService,
    private _fb: FormBuilder,
) { }

  ngOnInit(): void {
    this._onChangeOnlyActiveValue()
    this._onChangeSelectId()
  }

  private _onChangeOnlyActiveValue() {
    this._dataService.showOnlyActiveDocuments
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        this.form.controls.onlyActive.patchValue(value)
      })
  }

  private _onChangeSelectId() {
    this._dataService.documentId
      .pipe(untilDestroyed(this))
      .subscribe(value => this.selectedDocumentId = value)
  }

  public showOnlyActive(e: MatCheckboxChange) {
    this._dataService.showOnlyActiveDocuments.next(e.checked)
    if (e.checked) {
      this._dataService.documents.next(this._dataService.documents.value.filter(item => item.oldDoc))
    } else {
      this._dataService.documents.next(this._dataService.initialDocuments.value)
    }
  }

  public addDocument() {
    this._dialog.open(ModalComponent)
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.emitter.emit()
      })
  }

  editDocument(id: number | null) {
    if (!id) {
      return
    }
    this._dialog.open(ModalComponent, {data: id})
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.emitter.emit()
      })
  }

  remove(id: number | null) {
    if (!id) {
      return
    }
    this._httpService
      .removeDocument(id)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.emitter.emit()
      })
  }
}
