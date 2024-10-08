import {DOCUMENT} from '@angular/common';
import {Directive, inject, Input, NgZone} from '@angular/core';
import {
    tuiIfMap,
    tuiTypedFromEvent,
    tuiZonefreeScheduler,
    tuiZoneOptimized,
} from '@taiga-ui/cdk/observables';
import {tuiInjectElement} from '@taiga-ui/cdk/utils/dom';
import {tuiIsNativeFocused} from '@taiga-ui/cdk/utils/focus';
import {tuiIsPresent, tuiPure} from '@taiga-ui/cdk/utils/miscellaneous';
import {tuiAsDriver, TuiDriver} from '@taiga-ui/core/classes';
import {
    BehaviorSubject,
    debounce,
    distinctUntilChanged,
    fromEvent,
    map,
    merge,
    of,
    skip,
    startWith,
    switchMap,
    timer,
} from 'rxjs';

@Directive({
    standalone: true,
    selector: '[tuiHintDescribe]',
    providers: [tuiAsDriver(TuiHintDescribe)],
})
export class TuiHintDescribe extends TuiDriver {
    private readonly doc = inject(DOCUMENT);
    private readonly el = tuiInjectElement();
    private readonly zone = inject(NgZone);
    private readonly id$ = new BehaviorSubject('');
    private readonly stream$ = this.id$.pipe(
        distinctUntilChanged(),
        tuiIfMap(() => fromEvent(this.doc, 'keydown', {capture: true}), tuiIsPresent),
        switchMap(() =>
            this.focused
                ? of(false)
                : merge(
                      tuiTypedFromEvent(this.doc, 'keyup'),
                      tuiTypedFromEvent(this.element, 'blur'),
                  ).pipe(map(() => this.focused)),
        ),
        debounce((visible) =>
            visible ? timer(1000, tuiZonefreeScheduler(this.zone)) : of(null),
        ),
        startWith(false),
        distinctUntilChanged(),
        skip(1),
        tuiZoneOptimized(),
    );

    public readonly type = 'hint';

    constructor() {
        super((subscriber) => this.stream$.subscribe(subscriber));
    }

    @Input()
    public set tuiHintDescribe(id: string | null | undefined) {
        this.id$.next(id || '');
    }

    @tuiPure
    private get element(): HTMLElement {
        return this.doc.getElementById(this.id$.value || '') || this.el;
    }

    private get focused(): boolean {
        return tuiIsNativeFocused(this.element);
    }
}
