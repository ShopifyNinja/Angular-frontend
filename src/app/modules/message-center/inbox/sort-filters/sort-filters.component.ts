import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sort-filters',
  templateUrl: './sort-filters.component.html',
  /* styleUrls: ['./sort-filters.component.scss'] */
})
export class SortFiltersComponent implements OnInit {
  @Input() sortBy: string;
  @Input() sortDirection: string;

  @Output() sortChange = new EventEmitter<{sortBy: string, sortDirection: string}>();

  constructor() { }

  ngOnInit(): void { }

  filtersChange(e: any): void {
    const [sortBy, sortDirection] = e.currentTarget.value.split(':');
    this.sortChange.emit({ sortBy, sortDirection });
  }
}
