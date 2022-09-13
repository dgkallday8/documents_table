import { Component, OnInit } from '@angular/core'
import { HttpService } from '../../services/http/http.service'
import { MatTableDataSource } from '@angular/material/table'
import { DataService } from '../../services/data/data.service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { DocumentValue } from '../../types/types'
import { Sort } from '@angular/material/sort'

@UntilDestroy()
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  public columnsToDisplay = ['action', 'type', 'series', 'number', 'date']

  public selectedDocumentId: number | null = null;

  public dataSource: MatTableDataSource<DocumentValue> = new MatTableDataSource<DocumentValue>()

  constructor(
    private _httpService: HttpService,
    private _dataService: DataService,
  ) { }

  ngOnInit(): void {
    this._onChangeFilters()
    this._onChangeSelectId()
  }

  private _onChangeFilters() {
    this._dataService.documents
      .pipe(untilDestroyed(this))
      .subscribe((r: DocumentValue[]) => {
        this.dataSource.data = r
      })
  }

  private _onChangeSelectId() {
    this._dataService.documentId
      .pipe(untilDestroyed(this))
      .subscribe(value => this.selectedDocumentId = value)
  }

  public getDocumentTypeName(type: string) {
    return this._dataService.allDocumentTypes.value.find(doc => doc.value === type)?.name
  }

  selectDocument(id: number) {
    this._dataService.documentId.next(id);
  }

  public sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'type':
          return compare(a.type, b.type, isAsc);
        case 'series':
          return compare(a.series, b.series, isAsc);
        case 'number':
          return compare(a.number, b.number, isAsc);
        case 'date':
          return compare(a.date, b.date, isAsc);
        default:
          return 0;
      }
    });
  }
}


function compare(a: number | string | null, b: number | string | null, isAsc: boolean) {
  if (!a || !b) {
    return 0
  }
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
