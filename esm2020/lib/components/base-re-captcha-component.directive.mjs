import { Directive, EventEmitter, Injector, Input, NgZone, Output, Renderer2, } from "@angular/core";
import { NgControl, } from "@angular/forms";
import { ScriptService } from "../services/script.service";
import * as i0 from "@angular/core";
import * as i1 from "../services/script.service";
export class BaseReCaptchaComponentDirective {
    constructor(renderer, zone, injector, scriptService) {
        this.renderer = renderer;
        this.zone = zone;
        this.injector = injector;
        this.scriptService = scriptService;
        /**
         * Prefix of the captcha element
         */
        this.captchaElemPrefix = "ngx_captcha_id_";
        this.setupCaptcha = true;
        /**
         * Indicates if global domain 'recaptcha.net' should be used instead of default domain ('google.com')
         */
        this.useGlobalDomain = false;
        this.useEnterprise = false;
        /**
         * Type
         */
        this.type = "image";
        /**
         * Tab index
         */
        this.tabIndex = 0;
        /**
         * Called when captcha receives successful response.
         * Captcha response token is passed to event.
         */
        this.success = new EventEmitter();
        /**
         * Called when captcha is loaded. Event receives id of the captcha
         */
        this.load = new EventEmitter();
        /**
         * Called when captcha is reset.
         */
        this.reset = new EventEmitter();
        /**
         * Called when captcha is loaded & ready. I.e. when you need to execute captcha on component load.
         */
        this.ready = new EventEmitter();
        /**
         * Error callback
         */
        this.error = new EventEmitter();
        /**
         * Expired callback
         */
        this.expire = new EventEmitter();
        /**
         * Indicates if captcha should be set on load
         */
        this.setupAfterLoad = false;
        /**
         * If enabled, captcha will reset after receiving success response. This is useful
         * when invisible captcha need to be resolved multiple times on same page
         */
        this.resetCaptchaAfterSuccess = false;
        /**
         * Required by ControlValueAccessor
         */
        this.onChange = (val) => { };
        this.onTouched = (val) => { };
        /**
         * Indicates if captcha is loaded
         */
        this.isLoaded = false;
    }
    ngAfterViewInit() {
        this.control = this.injector.get(NgControl, undefined, { optional: true })?.control;
    }
    ngAfterViewChecked() {
        if (this.setupCaptcha) {
            this.setupCaptcha = false;
            this.setupComponent();
        }
    }
    ngOnChanges(changes) {
        // cleanup scripts if language changed because they need to be reloaded
        if (changes && changes.hl) {
            // cleanup scripts when language changes
            if (!changes.hl.firstChange &&
                changes.hl.currentValue !== changes.hl.previousValue) {
                this.scriptService.cleanup();
            }
        }
        if (changes && changes.useGlobalDomain) {
            // cleanup scripts when domain changes
            if (!changes.useGlobalDomain.firstChange &&
                changes.useGlobalDomain.currentValue !==
                    changes.useGlobalDomain.previousValue) {
                this.scriptService.cleanup();
            }
        }
        this.setupCaptcha = true;
    }
    /**
     * Gets captcha response as per reCaptcha docs
     */
    getResponse() {
        return this.reCaptchaApi.getResponse(this.captchaId);
    }
    /**
     * Gets Id of captcha widget
     */
    getCaptchaId() {
        return this.captchaId;
    }
    /**
     * Resets captcha
     */
    resetCaptcha() {
        this.zone.run(() => {
            // reset captcha using Google js api
            this.reCaptchaApi.reset();
            // required due to forms
            this.onChange(undefined);
            this.onTouched(undefined);
            // trigger reset event
            this.reset.next();
        });
    }
    /**
     * Gets last submitted captcha response
     */
    getCurrentResponse() {
        return this.currentResponse;
    }
    /**
     * Reload captcha. Useful when properties (i.e. theme) changed and captcha need to reflect them
     */
    reloadCaptcha() {
        this.setupComponent();
    }
    ensureCaptchaElem(captchaElemId) {
        const captchaElem = document.getElementById(captchaElemId);
        if (!captchaElem) {
            throw Error(`Captcha element with id '${captchaElemId}' was not found`);
        }
        // assign captcha alem
        this.captchaElem = captchaElem;
    }
    /**
     * Responsible for instantiating captcha element
     */
    renderReCaptcha() {
        // run outside angular zone due to timeout issues when testing
        // details: https://github.com/Enngage/ngx-captcha/issues/26
        this.zone.runOutsideAngular(() => {
            // to fix reCAPTCHA placeholder element must be an element or id
            // https://github.com/Enngage/ngx-captcha/issues/96
            setTimeout(() => {
                this.captchaId = this.reCaptchaApi.render(this.captchaElemId, this.getCaptchaProperties());
                this.ready.next();
            }, 0);
        });
    }
    /**
     * Called when captcha receives response
     * @param callback Callback
     */
    handleCallback(callback) {
        this.currentResponse = callback;
        this.success.next(callback);
        this.zone.run(() => {
            this.onChange(callback);
            this.onTouched(callback);
        });
        if (this.resetCaptchaAfterSuccess) {
            this.resetCaptcha();
        }
    }
    getPseudoUniqueNumber() {
        return new Date().getUTCMilliseconds() + Math.floor(Math.random() * 9999);
    }
    setupComponent() {
        // captcha specific setup
        this.captchaSpecificSetup();
        // create captcha wrapper
        this.createAndSetCaptchaElem();
        this.scriptService.registerCaptchaScript({
            useGlobalDomain: this.useGlobalDomain,
            useEnterprise: this.useEnterprise,
        }, "explicit", (grecaptcha) => {
            this.onloadCallback(grecaptcha);
        }, this.hl);
    }
    /**
     * Called when google's recaptcha script is ready
     */
    onloadCallback(grecapcha) {
        // assign reference to reCaptcha Api once its loaded
        this.reCaptchaApi = grecapcha;
        if (!this.reCaptchaApi) {
            throw Error(`ReCaptcha Api was not initialized correctly`);
        }
        // loaded flag
        this.isLoaded = true;
        // fire load event
        this.load.next();
        // render captcha
        this.renderReCaptcha();
        // setup component if it was flagged as such
        if (this.setupAfterLoad) {
            this.setupAfterLoad = false;
            this.setupComponent();
        }
    }
    generateNewElemId() {
        return this.captchaElemPrefix + this.getPseudoUniqueNumber();
    }
    createAndSetCaptchaElem() {
        // generate new captcha id
        this.captchaElemId = this.generateNewElemId();
        if (!this.captchaElemId) {
            throw Error(`Captcha elem Id is not set`);
        }
        if (!this.captchaWrapperElem) {
            throw Error(`Captcha DOM element is not initialized`);
        }
        // remove old html
        this.captchaWrapperElem.nativeElement.innerHTML = "";
        // create new wrapper for captcha
        const newElem = this.renderer.createElement("div");
        newElem.id = this.captchaElemId;
        this.renderer.appendChild(this.captchaWrapperElem.nativeElement, newElem);
        // when use captcha in cdk stepper then throwing error Captcha element with id 'ngx_captcha_id_XXXX' not found
        // to fix it checking ensureCaptchaElem in timeout so that its check in next call and its able to find element
        setTimeout(() => {
            // update captcha elem
            if (this.captchaElemId) {
                this.ensureCaptchaElem(this.captchaElemId);
            }
        }, 0);
    }
    /**
     * To be aligned with the ControlValueAccessor interface we need to implement this method
     * However as we don't want to update the recaptcha, this doesn't need to be implemented
     */
    writeValue(obj) { }
    /**
     * This method helps us tie together recaptcha and our formControl values
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * At some point we might be interested whether the user has touched our component
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Handles error callback
     */
    handleErrorCallback() {
        this.zone.run(() => {
            this.onChange(undefined);
            this.onTouched(undefined);
        });
        this.error.next();
    }
    /**
     * Handles expired callback
     */
    handleExpireCallback() {
        this.expire.next();
        // reset captcha on expire callback
        this.resetCaptcha();
    }
}
/** @nocollapse */ BaseReCaptchaComponentDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: BaseReCaptchaComponentDirective, deps: [{ token: i0.Renderer2 }, { token: i0.NgZone }, { token: i0.Injector }, { token: i1.ScriptService }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ BaseReCaptchaComponentDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.4", type: BaseReCaptchaComponentDirective, inputs: { siteKey: "siteKey", useGlobalDomain: "useGlobalDomain", useEnterprise: "useEnterprise", type: "type", hl: "hl", tabIndex: "tabIndex" }, outputs: { success: "success", load: "load", reset: "reset", ready: "ready", error: "error", expire: "expire" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: BaseReCaptchaComponentDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.NgZone }, { type: i0.Injector }, { type: i1.ScriptService }]; }, propDecorators: { siteKey: [{
                type: Input
            }], useGlobalDomain: [{
                type: Input
            }], useEnterprise: [{
                type: Input
            }], type: [{
                type: Input
            }], hl: [{
                type: Input
            }], tabIndex: [{
                type: Input
            }], success: [{
                type: Output
            }], load: [{
                type: Output
            }], reset: [{
                type: Output
            }], ready: [{
                type: Output
            }], error: [{
                type: Output
            }], expire: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1yZS1jYXB0Y2hhLWNvbXBvbmVudC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBvbmVudHMvYmFzZS1yZS1jYXB0Y2hhLWNvbXBvbmVudC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdMLFNBQVMsRUFFVCxZQUFZLEVBQ1osUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEVBRU4sTUFBTSxFQUNOLFNBQVMsR0FFVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBR0wsU0FBUyxHQUNWLE1BQU0sZ0JBQWdCLENBQUM7QUFHeEIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDOzs7QUFHM0QsTUFBTSxPQUFnQiwrQkFBK0I7SUFnSW5ELFlBQ1ksUUFBbUIsRUFDbkIsSUFBWSxFQUNaLFFBQWtCLEVBQ2xCLGFBQTRCO1FBSDVCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFqSXhDOztXQUVHO1FBQ2dCLHNCQUFpQixHQUFHLGlCQUFpQixDQUFDO1FBRWpELGlCQUFZLEdBQVksSUFBSSxDQUFDO1FBUXJDOztXQUVHO1FBQ00sb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFFakMsa0JBQWEsR0FBWSxLQUFLLENBQUM7UUFFeEM7O1dBRUc7UUFDTSxTQUFJLEdBQXNCLE9BQU8sQ0FBQztRQU8zQzs7V0FFRztRQUNNLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFFdEI7OztXQUdHO1FBQ08sWUFBTyxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFFL0M7O1dBRUc7UUFDTyxTQUFJLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUUxQzs7V0FFRztRQUNPLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBUSxD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QUVHO0lBQ0ksaUJBQWlCLENBQUMsRUFBTztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7O09BRUc7SUFDTyxtQkFBbUI7UUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVEOztPQUVHO0lBQ08sb0JBQW9CO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFbkIsbUNBQW1DO1FBQ25DLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDOzsrSUFyWm1CLCtCQUErQjttSUFBL0IsK0JBQStCOzJGQUEvQiwrQkFBK0I7a0JBRHBELFNBQVM7d0tBZUMsT0FBTztzQkFBZixLQUFLO2dCQUtHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBRUcsYUFBYTtzQkFBckIsS0FBSztnQkFLRyxJQUFJO3NCQUFaLEtBQUs7Z0JBS0csRUFBRTtzQkFBVixLQUFLO2dCQUtHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBTUksT0FBTztzQkFBaEIsTUFBTTtnQkFLRyxJQUFJO3NCQUFiLE1BQU07Z0JBS0csS0FBSztzQkFBZCxNQUFNO2dCQUtHLEtBQUs7c0JBQWQsTUFBTTtnQkFLRyxLQUFLO3NCQUFkLE1BQU07Z0JBS0csTUFBTTtzQkFBZixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtcbiAgQWJzdHJhY3RDb250cm9sLFxuICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgTmdDb250cm9sLFxufSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcblxuaW1wb3J0IHsgUmVDYXB0Y2hhVHlwZSB9IGZyb20gXCIuLi9tb2RlbHMvcmVjYXB0Y2hhLXR5cGUuZW51bVwiO1xuaW1wb3J0IHsgU2NyaXB0U2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9zY3JpcHQuc2VydmljZVwiO1xuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlUmVDYXB0Y2hhQ29tcG9uZW50RGlyZWN0aXZlXG4gIGltcGxlbWVudHMgT25DaGFuZ2VzLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZFxue1xuICAvKipcbiAgICogUHJlZml4IG9mIHRoZSBjYXB0Y2hhIGVsZW1lbnRcbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSBjYXB0Y2hhRWxlbVByZWZpeCA9IFwibmd4X2NhcHRjaGFfaWRfXCI7XG5cbiAgcHJpdmF0ZSBzZXR1cENhcHRjaGE6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBHb29nbGUncyBzaXRlIGtleS5cbiAgICogWW91IGNhbiBmaW5kIHRoaXMgdW5kZXIgaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9yZWNhcHRjaGFcbiAgICovXG4gIEBJbnB1dCgpIHNpdGVLZXk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiBnbG9iYWwgZG9tYWluICdyZWNhcHRjaGEubmV0JyBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkIG9mIGRlZmF1bHQgZG9tYWluICgnZ29vZ2xlLmNvbScpXG4gICAqL1xuICBASW5wdXQoKSB1c2VHbG9iYWxEb21haW46IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXQoKSB1c2VFbnRlcnByaXNlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFR5cGVcbiAgICovXG4gIEBJbnB1dCgpIHR5cGU6IFwiYXVkaW9cIiB8IFwiaW1hZ2VcIiA9IFwiaW1hZ2VcIjtcblxuICAvKipcbiAgICogTGFuZ3VhZ2UgY29kZS4gQXV0by1kZXRlY3RzIHRoZSB1c2VyJ3MgbGFuZ3VhZ2UgaWYgdW5zcGVjaWZpZWQuXG4gICAqL1xuICBASW5wdXQoKSBobD86IHN0cmluZztcblxuICAvKipcbiAgICogVGFiIGluZGV4XG4gICAqL1xuICBASW5wdXQoKSB0YWJJbmRleCA9IDA7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGNhcHRjaGEgcmVjZWl2ZXMgc3VjY2Vzc2Z1bCByZXNwb25zZS5cbiAgICogQ2FwdGNoYSByZXNwb25zZSB0b2tlbiBpcyBwYXNzZWQgdG8gZXZlbnQuXG4gICAqL1xuICBAT3V0cHV0KCkgc3VjY2VzcyA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBjYXB0Y2hhIGlzIGxvYWRlZC4gRXZlbnQgcmVjZWl2ZXMgaWQgb2YgdGhlIGNhcHRjaGFcbiAgICovXG4gIEBPdXRwdXQoKSBsb2FkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBjYXB0Y2hhIGlzIHJlc2V0LlxuICAgKi9cbiAgQE91dHB1dCgpIHJlc2V0ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBjYXB0Y2hhIGlzIGxvYWRlZCAmIHJlYWR5LiBJLmUuIHdoZW4geW91IG5lZWQgdG8gZXhlY3V0ZSBjYXB0Y2hhIG9uIGNvbXBvbmVudCBsb2FkLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBFcnJvciBjYWxsYmFja1xuICAgKi9cbiAgQE91dHB1dCgpIGVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBFeHBpcmVkIGNhbGxiYWNrXG4gICAqL1xuICBAT3V0cHV0KCkgZXhwaXJlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIGFic3RyYWN0IGNhcHRjaGFXcmFwcGVyRWxlbT86IEVsZW1lbnRSZWY7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiBjYXB0Y2hhIHNob3VsZCBiZSBzZXQgb24gbG9hZFxuICAgKi9cbiAgcHJpdmF0ZSBzZXR1cEFmdGVyTG9hZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBDYXB0Y2hhIGVsZW1lbnRcbiAgICovXG4gIHByb3RlY3RlZCBjYXB0Y2hhRWxlbT86IEhUTUxFbGVtZW50O1xuXG4gIC8qKlxuICAgKiBJZCBvZiB0aGUgY2FwdGNoYSBlbGVtXG4gICAqL1xuICBwcm90ZWN0ZWQgY2FwdGNoYUlkPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBIb2xkcyBsYXN0IHJlc3BvbnNlIHZhbHVlXG4gICAqL1xuICBwcm90ZWN0ZWQgY3VycmVudFJlc3BvbnNlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZiBlbmFibGVkLCBjYXB0Y2hhIHdpbGwgcmVzZXQgYWZ0ZXIgcmVjZWl2aW5nIHN1Y2Nlc3MgcmVzcG9uc2UuIFRoaXMgaXMgdXNlZnVsXG4gICAqIHdoZW4gaW52aXNpYmxlIGNhcHRjaGEgbmVlZCB0byBiZSByZXNvbHZlZCBtdWx0aXBsZSB0aW1lcyBvbiBzYW1lIHBhZ2VcbiAgICovXG4gIHByb3RlY3RlZCByZXNldENhcHRjaGFBZnRlclN1Y2Nlc3MgPSBmYWxzZTtcblxuICAvKipcbiAgICogQ2FwdGNoYSB0eXBlXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVjYXB0Y2hhVHlwZTogUmVDYXB0Y2hhVHlwZTtcblxuICAvKipcbiAgICogUmVxdWlyZWQgYnkgQ29udHJvbFZhbHVlQWNjZXNzb3JcbiAgICovXG4gIHByb3RlY3RlZCBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpID0+IHZvaWQgPSAodmFsKSA9PiB7fTtcbiAgcHJvdGVjdGVkIG9uVG91Y2hlZDogKHZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpID0+IHZvaWQgPSAodmFsKSA9PiB7fTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIGNhcHRjaGEgaXMgbG9hZGVkXG4gICAqL1xuICBwdWJsaWMgaXNMb2FkZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHRvIGdsb2JhbCByZUNhcHRjaGEgQVBJXG4gICAqL1xuICBwdWJsaWMgcmVDYXB0Y2hhQXBpPzogYW55O1xuXG4gIC8qKlxuICAgKiBJZCBvZiB0aGUgRE9NIGVsZW1lbnQgd3JhcHBpbmcgY2FwdGNoYVxuICAgKi9cbiAgcHVibGljIGNhcHRjaGFFbGVtSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEZvcm0gQ29udHJvbCB0byBiZSBlbmFibGUgdXNhZ2UgaW4gcmVhY3RpdmUgZm9ybXNcbiAgICovXG4gIHB1YmxpYyBjb250cm9sPzogQWJzdHJhY3RDb250cm9sIHwgbnVsbDtcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJvdGVjdGVkIHpvbmU6IE5nWm9uZSxcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCBzY3JpcHRTZXJ2aWNlOiBTY3JpcHRTZXJ2aWNlXG4gICkge31cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5jb250cm9sID0gdGhpcy5pbmplY3Rvci5nZXQ8TmdDb250cm9sIHwgdW5kZWZpbmVkPihcbiAgICAgIE5nQ29udHJvbCxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHsgb3B0aW9uYWw6IHRydWUgfVxuICAgICk/LmNvbnRyb2w7XG4gIH1cblxuICBuZ0FmdGVyVmlld0NoZWNrZWQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2V0dXBDYXB0Y2hhKSB7XG4gICAgICB0aGlzLnNldHVwQ2FwdGNoYSA9IGZhbHNlO1xuICAgICAgdGhpcy5zZXR1cENvbXBvbmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHJlQ2FwdGNoYSBwcm9wZXJ0aWVzXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0Q2FwdGNoYVByb3BlcnRpZXMoKTogYW55O1xuXG4gIC8qKlxuICAgKiBVc2VkIGZvciBjYXB0Y2hhIHNwZWNpZmljIHNldHVwXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgY2FwdGNoYVNwZWNpZmljU2V0dXAoKTogdm9pZDtcblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgLy8gY2xlYW51cCBzY3JpcHRzIGlmIGxhbmd1YWdlIGNoYW5nZWQgYmVjYXVzZSB0aGV5IG5lZWQgdG8gYmUgcmVsb2FkZWRcbiAgICBpZiAoY2hhbmdlcyAmJiBjaGFuZ2VzLmhsKSB7XG4gICAgICAvLyBjbGVhbnVwIHNjcmlwdHMgd2hlbiBsYW5ndWFnZSBjaGFuZ2VzXG4gICAgICBpZiAoXG4gICAgICAgICFjaGFuZ2VzLmhsLmZpcnN0Q2hhbmdlICYmXG4gICAgICAgIGNoYW5nZXMuaGwuY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzLmhsLnByZXZpb3VzVmFsdWVcbiAgICAgICkge1xuICAgICAgICB0aGlzLnNjcmlwdFNlcnZpY2UuY2xlYW51cCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzICYmIGNoYW5nZXMudXNlR2xvYmFsRG9tYWluKSB7XG4gICAgICAvLyBjbGVhbnVwIHNjcmlwdHMgd2hlbiBkb21haW4gY2hhbmdlc1xuICAgICAgaWYgKFxuICAgICAgICAhY2hhbmdlcy51c2VHbG9iYWxEb21haW4uZmlyc3RDaGFuZ2UgJiZcbiAgICAgICAgY2hhbmdlcy51c2VHbG9iYWxEb21haW4uY3VycmVudFZhbHVlICE9PVxuICAgICAgICAgIGNoYW5nZXMudXNlR2xvYmFsRG9tYWluLnByZXZpb3VzVmFsdWVcbiAgICAgICkge1xuICAgICAgICB0aGlzLnNjcmlwdFNlcnZpY2UuY2xlYW51cCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0dXBDYXB0Y2hhID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGNhcHRjaGEgcmVzcG9uc2UgYXMgcGVyIHJlQ2FwdGNoYSBkb2NzXG4gICAqL1xuICBnZXRSZXNwb25zZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnJlQ2FwdGNoYUFwaS5nZXRSZXNwb25zZSh0aGlzLmNhcHRjaGFJZCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBJZCBvZiBjYXB0Y2hhIHdpZGdldFxuICAgKi9cbiAgZ2V0Q2FwdGNoYUlkKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuY2FwdGNoYUlkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyBjYXB0Y2hhXG4gICAqL1xuICByZXNldENhcHRjaGEoKTogdm9pZCB7XG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAvLyByZXNldCBjYXB0Y2hhIHVzaW5nIEdvb2dsZSBqcyBhcGlcbiAgICAgIHRoaXMucmVDYXB0Y2hhQXBpLnJlc2V0KCk7XG5cbiAgICAgIC8vIHJlcXVpcmVkIGR1ZSB0byBmb3Jtc1xuICAgICAgdGhpcy5vbkNoYW5nZSh1bmRlZmluZWQpO1xuICAgICAgdGhpcy5vblRvdWNoZWQodW5kZWZpbmVkKTtcblxuICAgICAgLy8gdHJpZ2dlciByZXNldCBldmVudFxuICAgICAgdGhpcy5yZXNldC5uZXh0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBsYXN0IHN1Ym1pdHRlZCBjYXB0Y2hhIHJlc3BvbnNlXG4gICAqL1xuICBnZXRDdXJyZW50UmVzcG9uc2UoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50UmVzcG9uc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVsb2FkIGNhcHRjaGEuIFVzZWZ1bCB3aGVuIHByb3BlcnRpZXMgKGkuZS4gdGhlbWUpIGNoYW5nZWQgYW5kIGNhcHRjaGEgbmVlZCB0byByZWZsZWN0IHRoZW1cbiAgICovXG4gIHJlbG9hZENhcHRjaGEoKTogdm9pZCB7XG4gICAgdGhpcy5zZXR1cENvbXBvbmVudCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGVuc3VyZUNhcHRjaGFFbGVtKGNhcHRjaGFFbGVtSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGNhcHRjaGFFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FwdGNoYUVsZW1JZCk7XG5cbiAgICBpZiAoIWNhcHRjaGFFbGVtKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2FwdGNoYSBlbGVtZW50IHdpdGggaWQgJyR7Y2FwdGNoYUVsZW1JZH0nIHdhcyBub3QgZm91bmRgKTtcbiAgICB9XG5cbiAgICAvLyBhc3NpZ24gY2FwdGNoYSBhbGVtXG4gICAgdGhpcy5jYXB0Y2hhRWxlbSA9IGNhcHRjaGFFbGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3BvbnNpYmxlIGZvciBpbnN0YW50aWF0aW5nIGNhcHRjaGEgZWxlbWVudFxuICAgKi9cbiAgcHJvdGVjdGVkIHJlbmRlclJlQ2FwdGNoYSgpOiB2b2lkIHtcbiAgICAvLyBydW4gb3V0c2lkZSBhbmd1bGFyIHpvbmUgZHVlIHRvIHRpbWVvdXQgaXNzdWVzIHdoZW4gdGVzdGluZ1xuICAgIC8vIGRldGFpbHM6IGh0dHBzOi8vZ2l0aHViLmNvbS9Fbm5nYWdlL25neC1jYXB0Y2hhL2lzc3Vlcy8yNlxuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAvLyB0byBmaXggcmVDQVBUQ0hBIHBsYWNlaG9sZGVyIGVsZW1lbnQgbXVzdCBiZSBhbiBlbGVtZW50IG9yIGlkXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vRW5uZ2FnZS9uZ3gtY2FwdGNoYS9pc3N1ZXMvOTZcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmNhcHRjaGFJZCA9IHRoaXMucmVDYXB0Y2hhQXBpLnJlbmRlcihcbiAgICAgICAgICB0aGlzLmNhcHRjaGFFbGVtSWQsXG4gICAgICAgICAgdGhpcy5nZXRDYXB0Y2hhUHJvcGVydGllcygpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVhZHkubmV4dCgpO1xuICAgICAgfSwgMCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gY2FwdGNoYSByZWNlaXZlcyByZXNwb25zZVxuICAgKiBAcGFyYW0gY2FsbGJhY2sgQ2FsbGJhY2tcbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVDYWxsYmFjayhjYWxsYmFjazogYW55KTogdm9pZCB7XG4gICAgdGhpcy5jdXJyZW50UmVzcG9uc2UgPSBjYWxsYmFjaztcbiAgICB0aGlzLnN1Y2Nlc3MubmV4dChjYWxsYmFjayk7XG5cbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgIHRoaXMub25DaGFuZ2UoY2FsbGJhY2spO1xuICAgICAgdGhpcy5vblRvdWNoZWQoY2FsbGJhY2spO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucmVzZXRDYXB0Y2hhQWZ0ZXJTdWNjZXNzKSB7XG4gICAgICB0aGlzLnJlc2V0Q2FwdGNoYSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0UHNldWRvVW5pcXVlTnVtYmVyKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VVRDTWlsbGlzZWNvbmRzKCkgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA5OTk5KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0dXBDb21wb25lbnQoKTogdm9pZCB7XG4gICAgLy8gY2FwdGNoYSBzcGVjaWZpYyBzZXR1cFxuICAgIHRoaXMuY2FwdGNoYVNwZWNpZmljU2V0dXAoKTtcblxuICAgIC8vIGNyZWF0ZSBjYXB0Y2hhIHdyYXBwZXJcbiAgICB0aGlzLmNyZWF0ZUFuZFNldENhcHRjaGFFbGVtKCk7XG5cbiAgICB0aGlzLnNjcmlwdFNlcnZpY2UucmVnaXN0ZXJDYXB0Y2hhU2NyaXB0KFxuICAgICAge1xuICAgICAgICB1c2VHbG9iYWxEb21haW46IHRoaXMudXNlR2xvYmFsRG9tYWluLFxuICAgICAgICB1c2VFbnRlcnByaXNlOiB0aGlzLnVzZUVudGVycHJpc2UsXG4gICAgICB9LFxuICAgICAgXCJleHBsaWNpdFwiLFxuICAgICAgKGdyZWNhcHRjaGEpID0+IHtcbiAgICAgICAgdGhpcy5vbmxvYWRDYWxsYmFjayhncmVjYXB0Y2hhKTtcbiAgICAgIH0sXG4gICAgICB0aGlzLmhsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBnb29nbGUncyByZWNhcHRjaGEgc2NyaXB0IGlzIHJlYWR5XG4gICAqL1xuICBwcml2YXRlIG9ubG9hZENhbGxiYWNrKGdyZWNhcGNoYTogYW55KTogdm9pZCB7XG4gICAgLy8gYXNzaWduIHJlZmVyZW5jZSB0byByZUNhcHRjaGEgQXBpIG9uY2UgaXRzIGxvYWRlZFxuICAgIHRoaXMucmVDYXB0Y2hhQXBpID0gZ3JlY2FwY2hhO1xuXG4gICAgaWYgKCF0aGlzLnJlQ2FwdGNoYUFwaSkge1xuICAgICAgdGhyb3cgRXJyb3IoYFJlQ2FwdGNoYSBBcGkgd2FzIG5vdCBpbml0aWFsaXplZCBjb3JyZWN0bHlgKTtcbiAgICB9XG5cbiAgICAvLyBsb2FkZWQgZmxhZ1xuICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xuXG4gICAgLy8gZmlyZSBsb2FkIGV2ZW50XG4gICAgdGhpcy5sb2FkLm5leHQoKTtcblxuICAgIC8vIHJlbmRlciBjYXB0Y2hhXG4gICAgdGhpcy5yZW5kZXJSZUNhcHRjaGEoKTtcblxuICAgIC8vIHNldHVwIGNvbXBvbmVudCBpZiBpdCB3YXMgZmxhZ2dlZCBhcyBzdWNoXG4gICAgaWYgKHRoaXMuc2V0dXBBZnRlckxvYWQpIHtcbiAgICAgIHRoaXMuc2V0dXBBZnRlckxvYWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2V0dXBDb21wb25lbnQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlTmV3RWxlbUlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY2FwdGNoYUVsZW1QcmVmaXggKyB0aGlzLmdldFBzZXVkb1VuaXF1ZU51bWJlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVBbmRTZXRDYXB0Y2hhRWxlbSgpOiB2b2lkIHtcbiAgICAvLyBnZW5lcmF0ZSBuZXcgY2FwdGNoYSBpZFxuICAgIHRoaXMuY2FwdGNoYUVsZW1JZCA9IHRoaXMuZ2VuZXJhdGVOZXdFbGVtSWQoKTtcblxuICAgIGlmICghdGhpcy5jYXB0Y2hhRWxlbUlkKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2FwdGNoYSBlbGVtIElkIGlzIG5vdCBzZXRgKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY2FwdGNoYVdyYXBwZXJFbGVtKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2FwdGNoYSBET00gZWxlbWVudCBpcyBub3QgaW5pdGlhbGl6ZWRgKTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgb2xkIGh0bWxcbiAgICB0aGlzLmNhcHRjaGFXcmFwcGVyRWxlbS5uYXRpdmVFbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAvLyBjcmVhdGUgbmV3IHdyYXBwZXIgZm9yIGNhcHRjaGFcbiAgICBjb25zdCBuZXdFbGVtID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG5ld0VsZW0uaWQgPSB0aGlzLmNhcHRjaGFFbGVtSWQ7XG5cbiAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuY2FwdGNoYVdyYXBwZXJFbGVtLm5hdGl2ZUVsZW1lbnQsIG5ld0VsZW0pO1xuXG4gICAgLy8gd2hlbiB1c2UgY2FwdGNoYSBpbiBjZGsgc3RlcHBlciB0aGVuIHRocm93aW5nIGVycm9yIENhcHRjaGEgZWxlbWVudCB3aXRoIGlkICduZ3hfY2FwdGNoYV9pZF9YWFhYJyBub3QgZm91bmRcbiAgICAvLyB0byBmaXggaXQgY2hlY2tpbmcgZW5zdXJlQ2FwdGNoYUVsZW0gaW4gdGltZW91dCBzbyB0aGF0IGl0cyBjaGVjayBpbiBuZXh0IGNhbGwgYW5kIGl0cyBhYmxlIHRvIGZpbmQgZWxlbWVudFxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gdXBkYXRlIGNhcHRjaGEgZWxlbVxuICAgICAgaWYgKHRoaXMuY2FwdGNoYUVsZW1JZCkge1xuICAgICAgICB0aGlzLmVuc3VyZUNhcHRjaGFFbGVtKHRoaXMuY2FwdGNoYUVsZW1JZCk7XG4gICAgICB9XG4gICAgfSwgMCk7XG4gIH1cblxuICAvKipcbiAgICogVG8gYmUgYWxpZ25lZCB3aXRoIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2Ugd2UgbmVlZCB0byBpbXBsZW1lbnQgdGhpcyBtZXRob2RcbiAgICogSG93ZXZlciBhcyB3ZSBkb24ndCB3YW50IHRvIHVwZGF0ZSB0aGUgcmVjYXB0Y2hhLCB0aGlzIGRvZXNuJ3QgbmVlZCB0byBiZSBpbXBsZW1lbnRlZFxuICAgKi9cbiAgcHVibGljIHdyaXRlVmFsdWUob2JqOiBhbnkpOiB2b2lkIHt9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGhlbHBzIHVzIHRpZSB0b2dldGhlciByZWNhcHRjaGEgYW5kIG91ciBmb3JtQ29udHJvbCB2YWx1ZXNcbiAgICovXG4gIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogQXQgc29tZSBwb2ludCB3ZSBtaWdodCBiZSBpbnRlcmVzdGVkIHdoZXRoZXIgdGhlIHVzZXIgaGFzIHRvdWNoZWQgb3VyIGNvbXBvbmVudFxuICAgKi9cbiAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgZXJyb3IgY2FsbGJhY2tcbiAgICovXG4gIHByb3RlY3RlZCBoYW5kbGVFcnJvckNhbGxiYWNrKCk6IHZvaWQge1xuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgdGhpcy5vbkNoYW5nZSh1bmRlZmluZWQpO1xuICAgICAgdGhpcy5vblRvdWNoZWQodW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZXJyb3IubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgZXhwaXJlZCBjYWxsYmFja1xuICAgKi9cbiAgcHJvdGVjdGVkIGhhbmRsZUV4cGlyZUNhbGxiYWNrKCk6IHZvaWQge1xuICAgIHRoaXMuZXhwaXJlLm5leHQoKTtcblxuICAgIC8vIHJlc2V0IGNhcHRjaGEgb24gZXhwaXJlIGNhbGxiYWNrXG4gICAgdGhpcy5yZXNldENhcHRjaGEoKTtcbiAgfVxufVxuIl19