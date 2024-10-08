import {Directive} from '@angular/core';
import {AbstractTuiTextfieldHost} from '@taiga-ui/legacy/classes';
import {tuiAsTextfieldHost} from '@taiga-ui/legacy/tokens';

import type {TuiInputComponent} from './input.component';

@Directive({
    standalone: false,
    selector: 'tui-input',
    providers: [tuiAsTextfieldHost(TuiInputDirective)],
})
export class TuiInputDirective extends AbstractTuiTextfieldHost<TuiInputComponent> {
    public onValueChange(value: string): void {
        this.host.onValueChange(value);
    }
}
