import { Component, OnInit, ViewChild } from '@angular/core'
import { FiltersComponent } from '../../components/filters/filters.component'
import { HttpService } from '../../services/http/http.service'
import { FieldName, Organization } from '../../types/types'
import { untilDestroyed } from '@ngneat/until-destroy'
import { DataService } from '../../services/data/data.service'

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  @ViewChild(FiltersComponent) public filtersComponent!: FiltersComponent;

  constructor() { }

  public ngOnInit(): void {
  }



  public update() {
    this.filtersComponent.update()
    this.filtersComponent.resetFilters()
  }
}
