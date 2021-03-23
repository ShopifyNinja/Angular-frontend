import {
  animate,
  query,
  style,
  transition,
  trigger,
  group
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    // Set a default  style for enter and leave
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        opacity: 0,
        transform: 'scale(1) translateY(100%)',
      }),
    ]),
    // Animate the new page in
    query(':enter', [
      animate('400ms ease', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
    ])
  ]),
]);

export const sliderAnimation =
  trigger('sliderAnimation', [
    transition(':increment', slideTo('right') ),
    transition(':decrement', slideTo('left') ),
  ]);

function slideTo(direction) {
  const optional = { optional: true };
  return [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        [direction]: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ [direction]: '-100%' })
    ]),
    group([
      query(':leave', [
        animate('300ms ease', style({ [direction]: '100%' }))
      ], optional),
      query(':enter', [
        animate('300ms ease', style({ [direction]: '0%' })),
      ], optional)
    ]),
    // Normalize the page style... Might not be necessary

    // Required only if you have child animations on the page
    // query(':leave', animateChild()),
    // query(':enter', animateChild()),
  ];
}
