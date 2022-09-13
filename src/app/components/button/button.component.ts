import { Component, Input, OnInit } from '@angular/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { DataService } from '../../services/data/data.service'

@UntilDestroy()
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() public text!: string;

  @Input() public bgColor!: string;

  @Input() public textColor?: string;

  @Input() public canDisabled?: boolean

  @Input() public disableHandlerValue?: boolean

  public selectId: number | null = null;

  constructor(
    private _dataService: DataService,
  ) { }

  ngOnInit(): void {
    this._onChangeSelectId()
  }

  private _onChangeSelectId() {
    this._dataService.documentId
      .pipe(untilDestroyed(this))
      .subscribe(value => {
          this.selectId = value
      })
  }

}
