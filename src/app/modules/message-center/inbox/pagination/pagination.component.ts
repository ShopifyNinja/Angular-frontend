import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessagesFilters } from '../../../../modules/shared/interfaces/messages';
import { MessagesAppService } from '../../../../modules/shared/services/messages-app.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent implements OnInit {
  @Input() type: 'inbox' | 'sent' | 'deleted' | 'draft';

  filters$: Observable<MessagesFilters>;
  total$: Observable<number>;
  totalPages$: Observable<number>;

  constructor(
    private messagesAppService: MessagesAppService,
  ) { }

  ngOnInit(): void {
    this.filters$ = this.filters$ ?? this.messagesAppService.getFiltersObs(this.type);
    this.total$ = this.total$ ?? this.messagesAppService.getTotalObs(this.type);
    // For the total I define a new observable that is a combination of the filters and total values
    this.totalPages$ = this.totalPages$ ?? combineLatest([this.filters$, this.total$])
      .pipe(map(([filters, total]) => {
        const div = total % filters.perPage;
        const pages = Math.floor(total / filters.perPage) + (div ? 1 : 0);
        return pages;
      }));
  }

  hasPrevPage(): boolean {
    return this.messagesAppService.hasPrevPage(this.type);
  }

  onPrevPage(): void {
    if (this.messagesAppService.hasPrevPage(this.type)) {
      this.messagesAppService.prevPage(this.type);
    }
  }

  hasNextPage(): boolean {
    return this.messagesAppService.hasNextPage(this.type);
  }

  onNextPage(): void {
    if (this.messagesAppService.hasNextPage(this.type)) {
      this.messagesAppService.nextPage(this.type);
    }
  }
}
