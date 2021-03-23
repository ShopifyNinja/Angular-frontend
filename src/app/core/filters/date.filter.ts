import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateOrTimeFilter' })
export class DateOrTimePipe implements PipeTransform {
  transform(value: number): number {
    console.log(value);
    return value;
  }
}
