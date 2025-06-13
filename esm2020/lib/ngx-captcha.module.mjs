import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InvisibleReCaptchaComponent } from './components/invisible-recaptcha.component';
import { ReCaptcha2Component } from './components/recaptcha-2.component';
import { ReCaptchaV3Service } from './services/recaptcha_v3.service';
import { ScriptService } from './services/script.service';
import * as i0 from "@angular/core";
export class NgxCaptchaModule {
}
/** @nocollapse */ NgxCaptchaModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: NgxCaptchaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ NgxCaptchaModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.0.4", ngImport: i0, type: NgxCaptchaModule, declarations: [ReCaptcha2Component,
        InvisibleReCaptchaComponent], imports: [CommonModule], exports: [ReCaptcha2Component,
        InvisibleReCaptchaComponent] });
/** @nocollapse */ NgxCaptchaModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: NgxCaptchaModule, providers: [
        ScriptService,
        ReCaptchaV3Service
    ], imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: NgxCaptchaModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [
                        ReCaptcha2Component,
                        InvisibleReCaptchaComponent
                    ],
                    providers: [
                        ScriptService,
                        ReCaptchaV3Service
                    ],
                    exports: [
                        ReCaptcha2Component,
                        InvisibleReCaptchaComponent
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNhcHRjaGEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9uZ3gtY2FwdGNoYS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDekYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDekUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDckUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDOztBQW1CMUQsTUFBTSxPQUFPLGdCQUFnQjs7Z0lBQWhCLGdCQUFnQjtpSUFBaEIsZ0JBQWdCLGlCQVp6QixtQkFBbUI7UUFDbkIsMkJBQTJCLGFBSjNCLFlBQVksYUFXWixtQkFBbUI7UUFDbkIsMkJBQTJCO2lJQUdsQixnQkFBZ0IsYUFUaEI7UUFDVCxhQUFhO1FBQ2Isa0JBQWtCO0tBQ25CLFlBVEMsWUFBWTsyRkFlSCxnQkFBZ0I7a0JBakI1QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3FCQUNiO29CQUNELFlBQVksRUFBRTt3QkFDWixtQkFBbUI7d0JBQ25CLDJCQUEyQjtxQkFDNUI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULGFBQWE7d0JBQ2Isa0JBQWtCO3FCQUNuQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsbUJBQW1CO3dCQUNuQiwyQkFBMkI7cUJBQzVCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEludmlzaWJsZVJlQ2FwdGNoYUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9pbnZpc2libGUtcmVjYXB0Y2hhLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBSZUNhcHRjaGEyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3JlY2FwdGNoYS0yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBSZUNhcHRjaGFWM1NlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3JlY2FwdGNoYV92My5zZXJ2aWNlJztcbmltcG9ydCB7IFNjcmlwdFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3NjcmlwdC5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBSZUNhcHRjaGEyQ29tcG9uZW50LFxuICAgIEludmlzaWJsZVJlQ2FwdGNoYUNvbXBvbmVudFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBTY3JpcHRTZXJ2aWNlLFxuICAgIFJlQ2FwdGNoYVYzU2VydmljZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgUmVDYXB0Y2hhMkNvbXBvbmVudCxcbiAgICBJbnZpc2libGVSZUNhcHRjaGFDb21wb25lbnRcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hDYXB0Y2hhTW9kdWxlIHtcbn1cblxuXG4iXX0=