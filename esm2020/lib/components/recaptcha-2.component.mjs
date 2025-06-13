import { Component, ElementRef, forwardRef, Injector, Input, NgZone, Renderer2, ViewChild, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ReCaptchaType } from '../models/recaptcha-type.enum';
import { ScriptService } from '../services/script.service';
import { BaseReCaptchaComponentDirective } from './base-re-captcha-component.directive';
import * as i0 from "@angular/core";
import * as i1 from "../services/script.service";
export class ReCaptcha2Component extends BaseReCaptchaComponentDirective {
    constructor(renderer, zone, injector, scriptService) {
        super(renderer, zone, injector, scriptService);
        this.renderer = renderer;
        this.zone = zone;
        this.injector = injector;
        this.scriptService = scriptService;
        /**
        * Name of the global expire callback
        */
        this.windowOnErrorCallbackProperty = 'ngx_captcha_error_callback';
        /**
        * Name of the global error callback
        */
        this.windowOnExpireCallbackProperty = 'ngx_captcha_expire_callback';
        /**
         * Theme
         */
        this.theme = 'light';
        /**
        * Size
        */
        this.size = 'normal';
        this.recaptchaType = ReCaptchaType.ReCaptcha2;
    }
    ngOnChanges(changes) {
        super.ngOnChanges(changes);
    }
    ngOnDestroy() {
        window[this.windowOnErrorCallbackProperty] = {};
        window[this.windowOnExpireCallbackProperty] = {};
    }
    captchaSpecificSetup() {
        this.registerCallbacks();
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
            'theme': this.theme,
            'type': this.type,
            'size': this.size,
            'tabindex': this.tabIndex
        };
    }
    /**
     * Registers global callbacks
    */
    registerCallbacks() {
        window[this.windowOnErrorCallbackProperty] = super.handleErrorCallback.bind(this);
        window[this.windowOnExpireCallbackProperty] = super.handleExpireCallback.bind(this);
    }
}
/** @nocollapse */ ReCaptcha2Component.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: ReCaptcha2Component, deps: [{ token: i0.Renderer2 }, { token: i0.NgZone }, { token: i0.Injector }, { token: i1.ScriptService }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ ReCaptcha2Component.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.4", type: ReCaptcha2Component, selector: "ngx-recaptcha2", inputs: { theme: "theme", size: "size" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef((() => ReCaptcha2Component)),
            multi: true,
        }
    ], viewQueries: [{ propertyName: "captchaWrapperElem", first: true, predicate: ["captchaWrapperElem"], descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `
  <div #captchaWrapperElem></div>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: ReCaptcha2Component, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngx-recaptcha2',
                    template: `
  <div #captchaWrapperElem></div>`,
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef((() => ReCaptcha2Component)),
                            multi: true,
                        }
                    ]
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.NgZone }, { type: i0.Injector }, { type: i1.ScriptService }]; }, propDecorators: { theme: [{
                type: Input
            }], size: [{
                type: Input
            }], captchaWrapperElem: [{
                type: ViewChild,
                args: ['captchaWrapperElem', { static: false }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjYXB0Y2hhLTIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL3JlY2FwdGNoYS0yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEVBR04sU0FBUyxFQUVULFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDOzs7QUFjeEYsTUFBTSxPQUFPLG1CQUFvQixTQUFRLCtCQUErQjtJQTBCdEUsWUFDWSxRQUFtQixFQUNuQixJQUFZLEVBQ1osUUFBa0IsRUFDbEIsYUFBNEI7UUFFdEMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBTHJDLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUE1QnhDOztVQUVFO1FBQ2lCLGtDQUE2QixHQUFHLDRCQUE0QixDQUFDO1FBRWhGOztVQUVFO1FBQ2lCLG1DQUE4QixHQUFHLDZCQUE2QixDQUFDO1FBRWxGOztXQUVHO1FBQ00sVUFBSyxHQUFxQixPQUFPLENBQUM7UUFFM0M7O1VBRUU7UUFDTyxTQUFJLEdBQXlCLFFBQVEsQ0FBQztRQUlyQyxrQkFBYSxHQUFrQixhQUFhLENBQUMsVUFBVSxDQUFDO0lBU2xFLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsV0FBVztRQUNSLE1BQWMsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDeEQsTUFBYyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUM1RCxDQUFDO0lBRVMsb0JBQW9CO1FBQzVCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRDs7TUFFRTtJQUNRLG9CQUFvQjtRQUM1QixPQUFPO1lBQ0wsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3ZCLFVBQVUsRUFBRSxDQUFDLFFBQWEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqRixrQkFBa0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUMxRSxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUN2RSxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDbkIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNqQixVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDMUIsQ0FBQztJQUNKLENBQUM7SUFFRDs7TUFFRTtJQUNNLGlCQUFpQjtRQUN0QixNQUFjLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRixNQUFjLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvRixDQUFDOzttSUF0RVUsbUJBQW1CO3VIQUFuQixtQkFBbUIsbUZBUm5CO1FBQ1Q7WUFDRSxPQUFPLEVBQUUsaUJBQWlCO1lBQzFCLFdBQVcsRUFBRSxVQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLEVBQUM7WUFDbEQsS0FBSyxFQUFFLElBQUk7U0FDWjtLQUNGLGdNQVJTO2tDQUNzQjsyRkFTckIsbUJBQW1CO2tCQVovQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFFBQVEsRUFBRTtrQ0FDc0I7b0JBQ2hDLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixXQUFXLEVBQUUsVUFBVSxFQUFDLEdBQUcsRUFBRSxvQkFBb0IsRUFBQzs0QkFDbEQsS0FBSyxFQUFFLElBQUk7eUJBQ1o7cUJBQ0Y7aUJBQ0Y7d0tBZ0JVLEtBQUs7c0JBQWIsS0FBSztnQkFLRyxJQUFJO3NCQUFaLEtBQUs7Z0JBRTZDLGtCQUFrQjtzQkFBcEUsU0FBUzt1QkFBQyxvQkFBb0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IFJlQ2FwdGNoYVR5cGUgfSBmcm9tICcuLi9tb2RlbHMvcmVjYXB0Y2hhLXR5cGUuZW51bSc7XG5pbXBvcnQgeyBTY3JpcHRTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvc2NyaXB0LnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzZVJlQ2FwdGNoYUNvbXBvbmVudERpcmVjdGl2ZSB9IGZyb20gJy4vYmFzZS1yZS1jYXB0Y2hhLWNvbXBvbmVudC5kaXJlY3RpdmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtcmVjYXB0Y2hhMicsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgI2NhcHRjaGFXcmFwcGVyRWxlbT48L2Rpdj5gLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFJlQ2FwdGNoYTJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFJlQ2FwdGNoYTJDb21wb25lbnQgZXh0ZW5kcyBCYXNlUmVDYXB0Y2hhQ29tcG9uZW50RGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuXG4gIC8qKlxuICAqIE5hbWUgb2YgdGhlIGdsb2JhbCBleHBpcmUgY2FsbGJhY2tcbiAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHdpbmRvd09uRXJyb3JDYWxsYmFja1Byb3BlcnR5ID0gJ25neF9jYXB0Y2hhX2Vycm9yX2NhbGxiYWNrJztcblxuICAvKipcbiAgKiBOYW1lIG9mIHRoZSBnbG9iYWwgZXJyb3IgY2FsbGJhY2tcbiAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHdpbmRvd09uRXhwaXJlQ2FsbGJhY2tQcm9wZXJ0eSA9ICduZ3hfY2FwdGNoYV9leHBpcmVfY2FsbGJhY2snO1xuXG4gIC8qKlxuICAgKiBUaGVtZVxuICAgKi9cbiAgQElucHV0KCkgdGhlbWU6ICdkYXJrJyB8ICdsaWdodCcgPSAnbGlnaHQnO1xuXG4gIC8qKlxuICAqIFNpemVcbiAgKi9cbiAgQElucHV0KCkgc2l6ZTogJ2NvbXBhY3QnIHwgJ25vcm1hbCcgPSAnbm9ybWFsJztcblxuICBAVmlld0NoaWxkKCdjYXB0Y2hhV3JhcHBlckVsZW0nLCB7IHN0YXRpYzogZmFsc2V9KSBjYXB0Y2hhV3JhcHBlckVsZW0/OiBFbGVtZW50UmVmO1xuXG4gIHByb3RlY3RlZCByZWNhcHRjaGFUeXBlOiBSZUNhcHRjaGFUeXBlID0gUmVDYXB0Y2hhVHlwZS5SZUNhcHRjaGEyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByb3RlY3RlZCB6b25lOiBOZ1pvbmUsXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgc2NyaXB0U2VydmljZTogU2NyaXB0U2VydmljZSxcbiAgKSB7XG4gICAgc3VwZXIocmVuZGVyZXIsIHpvbmUsIGluamVjdG9yLCBzY3JpcHRTZXJ2aWNlKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uQ2hhbmdlcyhjaGFuZ2VzKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICh3aW5kb3cgYXMgYW55KVt0aGlzLndpbmRvd09uRXJyb3JDYWxsYmFja1Byb3BlcnR5XSA9IHt9O1xuICAgICh3aW5kb3cgYXMgYW55KVt0aGlzLndpbmRvd09uRXhwaXJlQ2FsbGJhY2tQcm9wZXJ0eV0gPSB7fTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjYXB0Y2hhU3BlY2lmaWNTZXR1cCgpOiB2b2lkIHtcbiAgICB0aGlzLnJlZ2lzdGVyQ2FsbGJhY2tzKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyByZUNhcHRjaGEgcHJvcGVydGllc1xuICAqL1xuICBwcm90ZWN0ZWQgZ2V0Q2FwdGNoYVByb3BlcnRpZXMoKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3NpdGVrZXknOiB0aGlzLnNpdGVLZXksXG4gICAgICAnY2FsbGJhY2snOiAocmVzcG9uc2U6IGFueSkgPT4gdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLmhhbmRsZUNhbGxiYWNrKHJlc3BvbnNlKSksXG4gICAgICAnZXhwaXJlZC1jYWxsYmFjayc6ICgpID0+IHRoaXMuem9uZS5ydW4oKCkgPT4gdGhpcy5oYW5kbGVFeHBpcmVDYWxsYmFjaygpKSxcbiAgICAgICdlcnJvci1jYWxsYmFjayc6ICgpID0+IHRoaXMuem9uZS5ydW4oKCkgPT4gdGhpcy5oYW5kbGVFcnJvckNhbGxiYWNrKCkpLFxuICAgICAgJ3RoZW1lJzogdGhpcy50aGVtZSxcbiAgICAgICd0eXBlJzogdGhpcy50eXBlLFxuICAgICAgJ3NpemUnOiB0aGlzLnNpemUsXG4gICAgICAndGFiaW5kZXgnOiB0aGlzLnRhYkluZGV4XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgZ2xvYmFsIGNhbGxiYWNrc1xuICAqL1xuICBwcml2YXRlIHJlZ2lzdGVyQ2FsbGJhY2tzKCk6IHZvaWQge1xuICAgICh3aW5kb3cgYXMgYW55KVt0aGlzLndpbmRvd09uRXJyb3JDYWxsYmFja1Byb3BlcnR5XSA9IHN1cGVyLmhhbmRsZUVycm9yQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAod2luZG93IGFzIGFueSlbdGhpcy53aW5kb3dPbkV4cGlyZUNhbGxiYWNrUHJvcGVydHldID0gc3VwZXIuaGFuZGxlRXhwaXJlQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgfVxufVxuXG4iXX0=