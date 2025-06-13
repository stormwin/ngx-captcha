import { Component, ElementRef, forwardRef, Injector, Input, NgZone, Renderer2, ViewChild, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ReCaptchaType } from '../models/recaptcha-type.enum';
import { ScriptService } from '../services/script.service';
import { BaseReCaptchaComponentDirective } from './base-re-captcha-component.directive';
import * as i0 from "@angular/core";
import * as i1 from "../services/script.service";
export class InvisibleReCaptchaComponent extends BaseReCaptchaComponentDirective {
    constructor(renderer, zone, injector, scriptService) {
        super(renderer, zone, injector, scriptService);
        this.renderer = renderer;
        this.zone = zone;
        this.injector = injector;
        this.scriptService = scriptService;
        /**
         * This size representing invisible captcha
         */
        this.size = 'invisible';
        /**
         * Theme
         */
        this.theme = 'light';
        /**
         * Badge
         */
        this.badge = 'bottomright';
        this.recaptchaType = ReCaptchaType.InvisibleReCaptcha;
    }
    ngOnChanges(changes) {
        super.ngOnChanges(changes);
    }
    /**
     * Programatically invoke the reCAPTCHA check. Used if the invisible reCAPTCHA is on a div instead of a button.
     */
    execute() {
        // execute captcha
        this.zone.runOutsideAngular(() => this.reCaptchaApi.execute(this.captchaId));
    }
    captchaSpecificSetup() {
    }
    /**
    * Gets reCaptcha properties
    */
    getCaptchaProperties() {
        return {
            'sitekey': this.siteKey,
            'callback': (response) => this.zone.run(() => this.handleCallback(response)),
            'expired-callback': () => this.zone.run(() => this.handleExpireCallback()),
            'error-callback': () => this.zone.run(() => this.handleErrorCallback()),
            'badge': this.badge,
            'type': this.type,
            'tabindex': this.tabIndex,
            'size': this.size,
            'theme': this.theme
        };
    }
}
/** @nocollapse */ InvisibleReCaptchaComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: InvisibleReCaptchaComponent, deps: [{ token: i0.Renderer2 }, { token: i0.NgZone }, { token: i0.Injector }, { token: i1.ScriptService }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ InvisibleReCaptchaComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.4", type: InvisibleReCaptchaComponent, selector: "ngx-invisible-recaptcha", inputs: { theme: "theme", badge: "badge" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef((() => InvisibleReCaptchaComponent)),
            multi: true,
        }
    ], viewQueries: [{ propertyName: "captchaWrapperElem", first: true, predicate: ["captchaWrapperElem"], descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `
  <div #captchaWrapperElem></div>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: InvisibleReCaptchaComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngx-invisible-recaptcha',
                    template: `
  <div #captchaWrapperElem></div>`,
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef((() => InvisibleReCaptchaComponent)),
                            multi: true,
                        }
                    ]
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.NgZone }, { type: i0.Injector }, { type: i1.ScriptService }]; }, propDecorators: { theme: [{
                type: Input
            }], badge: [{
                type: Input
            }], captchaWrapperElem: [{
                type: ViewChild,
                args: ['captchaWrapperElem', { static: false }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52aXNpYmxlLXJlY2FwdGNoYS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBvbmVudHMvaW52aXNpYmxlLXJlY2FwdGNoYS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLFFBQVEsRUFDUixLQUFLLEVBQ0wsTUFBTSxFQUVOLFNBQVMsRUFFVCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQzs7O0FBY3hGLE1BQU0sT0FBTywyQkFBNEIsU0FBUSwrQkFBK0I7SUFxQjlFLFlBQ1ksUUFBbUIsRUFDbkIsSUFBWSxFQUNaLFFBQWtCLEVBQ2xCLGFBQTRCO1FBRXRDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUxyQyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBdkJ4Qzs7V0FFRztRQUNnQixTQUFJLEdBQUcsV0FBVyxDQUFDO1FBRXRDOztXQUVHO1FBQ00sVUFBSyxHQUFxQixPQUFPLENBQUM7UUFFM0M7O1dBRUc7UUFDTSxVQUFLLEdBQTRDLGFBQWEsQ0FBQztRQUk5RCxrQkFBYSxHQUFrQixhQUFhLENBQUMsa0JBQWtCLENBQUM7SUFTMUUsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7T0FFRztJQUNILE9BQU87UUFDTCxrQkFBa0I7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRVMsb0JBQW9CO0lBQzlCLENBQUM7SUFFRDs7TUFFRTtJQUNRLG9CQUFvQjtRQUM1QixPQUFPO1lBQ0wsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3ZCLFVBQVUsRUFBRSxDQUFDLFFBQWEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqRixrQkFBa0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUMxRSxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUN2RSxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDbkIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2pCLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN6QixNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLO1NBQ3BCLENBQUM7SUFDSixDQUFDOzsySUE1RFUsMkJBQTJCOytIQUEzQiwyQkFBMkIsOEZBUjNCO1FBQ1Q7WUFDRSxPQUFPLEVBQUUsaUJBQWlCO1lBQzFCLFdBQVcsRUFBRSxVQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsMkJBQTJCLEVBQUM7WUFDMUQsS0FBSyxFQUFFLElBQUk7U0FDWjtLQUNGLGdNQVJTO2tDQUNzQjsyRkFTckIsMkJBQTJCO2tCQVp2QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx5QkFBeUI7b0JBQ25DLFFBQVEsRUFBRTtrQ0FDc0I7b0JBQ2hDLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixXQUFXLEVBQUUsVUFBVSxFQUFDLEdBQUcsRUFBRSw0QkFBNEIsRUFBQzs0QkFDMUQsS0FBSyxFQUFFLElBQUk7eUJBQ1o7cUJBQ0Y7aUJBQ0Y7d0tBV1UsS0FBSztzQkFBYixLQUFLO2dCQUtHLEtBQUs7c0JBQWIsS0FBSztnQkFFOEMsa0JBQWtCO3NCQUFyRSxTQUFTO3VCQUFDLG9CQUFvQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IFJlQ2FwdGNoYVR5cGUgfSBmcm9tICcuLi9tb2RlbHMvcmVjYXB0Y2hhLXR5cGUuZW51bSc7XG5pbXBvcnQgeyBTY3JpcHRTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvc2NyaXB0LnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzZVJlQ2FwdGNoYUNvbXBvbmVudERpcmVjdGl2ZSB9IGZyb20gJy4vYmFzZS1yZS1jYXB0Y2hhLWNvbXBvbmVudC5kaXJlY3RpdmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtaW52aXNpYmxlLXJlY2FwdGNoYScsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgI2NhcHRjaGFXcmFwcGVyRWxlbT48L2Rpdj5gLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEludmlzaWJsZVJlQ2FwdGNoYUNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgSW52aXNpYmxlUmVDYXB0Y2hhQ29tcG9uZW50IGV4dGVuZHMgQmFzZVJlQ2FwdGNoYUNvbXBvbmVudERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG5cbiAgLyoqXG4gICAqIFRoaXMgc2l6ZSByZXByZXNlbnRpbmcgaW52aXNpYmxlIGNhcHRjaGFcbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSBzaXplID0gJ2ludmlzaWJsZSc7XG5cbiAgLyoqXG4gICAqIFRoZW1lXG4gICAqL1xuICBASW5wdXQoKSB0aGVtZTogJ2RhcmsnIHwgJ2xpZ2h0JyA9ICdsaWdodCc7XG5cbiAgLyoqXG4gICAqIEJhZGdlXG4gICAqL1xuICBASW5wdXQoKSBiYWRnZTogJ2JvdHRvbXJpZ2h0JyB8ICdib3R0b21sZWZ0JyB8ICdpbmxpbmUnID0gJ2JvdHRvbXJpZ2h0JztcblxuICBAVmlld0NoaWxkKCdjYXB0Y2hhV3JhcHBlckVsZW0nLCB7IHN0YXRpYzogZmFsc2UgfSkgY2FwdGNoYVdyYXBwZXJFbGVtPzogRWxlbWVudFJlZjtcblxuICBwcm90ZWN0ZWQgcmVjYXB0Y2hhVHlwZTogUmVDYXB0Y2hhVHlwZSA9IFJlQ2FwdGNoYVR5cGUuSW52aXNpYmxlUmVDYXB0Y2hhO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByb3RlY3RlZCB6b25lOiBOZ1pvbmUsXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgc2NyaXB0U2VydmljZTogU2NyaXB0U2VydmljZVxuICApIHtcbiAgICBzdXBlcihyZW5kZXJlciwgem9uZSwgaW5qZWN0b3IsIHNjcmlwdFNlcnZpY2UpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHN1cGVyLm5nT25DaGFuZ2VzKGNoYW5nZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb2dyYW1hdGljYWxseSBpbnZva2UgdGhlIHJlQ0FQVENIQSBjaGVjay4gVXNlZCBpZiB0aGUgaW52aXNpYmxlIHJlQ0FQVENIQSBpcyBvbiBhIGRpdiBpbnN0ZWFkIG9mIGEgYnV0dG9uLlxuICAgKi9cbiAgZXhlY3V0ZSgpOiB2b2lkIHtcbiAgICAvLyBleGVjdXRlIGNhcHRjaGFcbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gdGhpcy5yZUNhcHRjaGFBcGkuZXhlY3V0ZSh0aGlzLmNhcHRjaGFJZCkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNhcHRjaGFTcGVjaWZpY1NldHVwKCk6IHZvaWQge1xuICB9XG5cbiAgLyoqXG4gICogR2V0cyByZUNhcHRjaGEgcHJvcGVydGllc1xuICAqL1xuICBwcm90ZWN0ZWQgZ2V0Q2FwdGNoYVByb3BlcnRpZXMoKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3NpdGVrZXknOiB0aGlzLnNpdGVLZXksXG4gICAgICAnY2FsbGJhY2snOiAocmVzcG9uc2U6IGFueSkgPT4gdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLmhhbmRsZUNhbGxiYWNrKHJlc3BvbnNlKSksXG4gICAgICAnZXhwaXJlZC1jYWxsYmFjayc6ICgpID0+IHRoaXMuem9uZS5ydW4oKCkgPT4gdGhpcy5oYW5kbGVFeHBpcmVDYWxsYmFjaygpKSxcbiAgICAgICdlcnJvci1jYWxsYmFjayc6ICgpID0+IHRoaXMuem9uZS5ydW4oKCkgPT4gdGhpcy5oYW5kbGVFcnJvckNhbGxiYWNrKCkpLFxuICAgICAgJ2JhZGdlJzogdGhpcy5iYWRnZSxcbiAgICAgICd0eXBlJzogdGhpcy50eXBlLFxuICAgICAgJ3RhYmluZGV4JzogdGhpcy50YWJJbmRleCxcbiAgICAgICdzaXplJzogdGhpcy5zaXplLFxuICAgICAgJ3RoZW1lJzogdGhpcy50aGVtZVxuICAgIH07XG4gIH1cblxuXG59XG5cbiJdfQ==