import * as i0 from '@angular/core';
import { Injectable, input, output, inject, Renderer2, Injector, Directive, viewChild, ChangeDetectionStrategy, Component } from '@angular/core';
import { NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';

class ScriptService {
    scriptElemId = "ngx-catpcha-script";
    /**
     * Name of the global google recaptcha script
     */
    windowGrecaptcha = "grecaptcha";
    /**
     * Name of enterprise property in the global google recaptcha script
     */
    windowGrecaptchaEnterprise = "enterprise";
    /**
     * Name of the global callback
     */
    windowOnLoadCallbackProperty = "ngx_captcha_onload_callback";
    /**
     * Name of the global callback for enterprise
     */
    windowOnLoadEnterpriseCallbackProperty = "ngx_captcha_onload_enterprise_callback";
    globalDomain = "recaptcha.net";
    defaultDomain = "google.com";
    enterpriseApi = "enterprise.js";
    defaultApi = "api.js";
    registerCaptchaScript(config, render, onLoad, language) {
        if (this.#grecaptchaScriptLoaded(config.useEnterprise)) {
            // recaptcha script is already loaded
            // just call the callback
            if (config.useEnterprise) {
                onLoad(window[this.windowGrecaptcha][this.windowGrecaptchaEnterprise]);
            }
            else {
                onLoad(window[this.windowGrecaptcha]);
            }
            return;
        }
        // we need to patch the callback through global variable, otherwise callback is not accessible
        // note: https://github.com/Enngage/ngx-captcha/issues/2
        if (config.useEnterprise) {
            window[this.#getCallbackName(true)] = ((() => onLoad.bind(this, window[this.windowGrecaptcha][this.windowGrecaptchaEnterprise])));
        }
        else {
            window[this.#getCallbackName(false)] = ((() => onLoad.bind(this, window[this.windowGrecaptcha])));
        }
        // prepare script elem
        const scriptElem = document.createElement("script");
        scriptElem.id = this.scriptElemId;
        scriptElem.innerHTML = "";
        scriptElem.src = this.#getCaptchaScriptUrl(config, render, language);
        scriptElem.async = true;
        scriptElem.defer = true;
        // add script to header
        document.getElementsByTagName("head")[0].appendChild(scriptElem);
    }
    cleanup() {
        const elem = document.getElementById(this.scriptElemId);
        if (elem) {
            elem.remove();
        }
        window[this.#getCallbackName()] = undefined;
        window[this.windowGrecaptcha] = undefined;
    }
    /**
     * Indicates if google recaptcha script is available and ready to be used
     */
    #grecaptchaScriptLoaded(useEnterprise) {
        if (!window[this.#getCallbackName(useEnterprise)] ||
            !window[this.windowGrecaptcha]) {
            return false;
        }
        else if (useEnterprise &&
            window[this.windowGrecaptcha][this.windowGrecaptchaEnterprise]) {
            return true;
            // if only enterprise script is loaded we need to check some v3's method
        }
        else if (window[this.windowGrecaptcha].execute) {
            return true;
        }
        return false;
    }
    /**
     * Gets global callback name
     * @param useEnterprise Optional flag for enterprise script
     * @private
     */
    #getCallbackName(useEnterprise) {
        return useEnterprise
            ? this.windowOnLoadEnterpriseCallbackProperty
            : this.windowOnLoadCallbackProperty;
    }
    /**
     * Url to google api script
     */
    #getCaptchaScriptUrl(config, render, language) {
        const domain = config.useGlobalDomain
            ? this.globalDomain
            : this.defaultDomain;
        const api = config.useEnterprise ? this.enterpriseApi : this.defaultApi;
        const callback = this.#getCallbackName(config.useEnterprise);
        const captchaUrl = new URL(`https://www.${domain}`);
        captchaUrl.pathname = `recaptcha/${api}`;
        captchaUrl.searchParams.set('onload', callback);
        captchaUrl.searchParams.set('render', render);
        if (language) {
            captchaUrl.searchParams.set('hl', language);
        }
        return captchaUrl.href;
    }
    static ɵfac = function ScriptService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ScriptService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ScriptService, factory: ScriptService.ɵfac, providedIn: "root" });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ScriptService, [{
        type: Injectable,
        args: [{
                providedIn: "root",
            }]
    }], null, null); })();

class BaseReCaptchaComponentDirective {
    /**
     * Prefix of the captcha element
     */
    captchaElemPrefix = "ngx_captcha_id_";
    #setupCaptcha = true;
    /**
     * Google's site key.
     * You can find this under https://www.google.com/recaptcha
     */
    siteKey = input();
    /**
     * Indicates if global domain 'recaptcha.net' should be used instead of default domain ('google.com')
     */
    useGlobalDomain = input(false);
    useEnterprise = input(false);
    /**
     * Type
     */
    type = input("image");
    /**
     * Language code. Auto-detects the user's language if unspecified.
     */
    hl = input();
    /**
     * Tab index
     */
    tabIndex = input(0);
    /**
     * Called when captcha receives successful response.
     * Captcha response token is passed to event.
     */
    success = output();
    /**
     * Called when captcha is loaded. Event receives id of the captcha
     */
    load = output();
    /**
     * Called when captcha is reset.
     */
    reset = output();
    /**
     * Called when captcha is loaded & ready. I.e. when you need to execute captcha on component load.
     */
    ready = output();
    /**
     * Error callback
     */
    error = output();
    /**
     * Expired callback
     */
    expire = output();
    /**
     * Indicates if captcha should be set on load
     */
    #setupAfterLoad = false;
    /**
     * Captcha element
     */
    captchaElem;
    /**
     * Id of the captcha elem
     */
    captchaId;
    /**
     * Holds last response value
     */
    currentResponse;
    /**
     * If enabled, captcha will reset after receiving success response. This is useful
     * when invisible captcha need to be resolved multiple times on same page
     */
    resetCaptchaAfterSuccess = false;
    /**
     * Required by ControlValueAccessor
     */
    onChange = (val) => { };
    onTouched = (val) => { };
    /**
     * Indicates if captcha is loaded
     */
    isLoaded = false;
    /**
     * Reference to global reCaptcha API
     */
    reCaptchaApi;
    /**
     * Id of the DOM element wrapping captcha
     */
    captchaElemId;
    /**
     * Form Control to be enable usage in reactive forms
     */
    control;
    #renderer = inject(Renderer2);
    #injector = inject(Injector);
    #scriptService = inject(ScriptService);
    ngAfterViewInit() {
        this.control = this.#injector.get(NgControl, undefined, { optional: true })?.control;
    }
    ngAfterViewChecked() {
        if (this.#setupCaptcha) {
            this.#setupCaptcha = false;
            this.#setupComponent();
        }
    }
    ngOnChanges(changes) {
        // cleanup scripts if language changed because they need to be reloaded
        if (changes && changes["hl"]) {
            // cleanup scripts when language changes
            if (!changes["hl"].firstChange &&
                changes["hl"].currentValue !== changes["hl"].previousValue) {
                this.#scriptService.cleanup();
            }
        }
        if (changes && changes["useGlobalDomain"]) {
            // cleanup scripts when domain changes
            if (!changes["useGlobalDomain"].firstChange &&
                changes["useGlobalDomain"].currentValue !==
                    changes["useGlobalDomain"].previousValue) {
                this.#scriptService.cleanup();
            }
        }
        this.#setupCaptcha = true;
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
        // reset captcha using Google js api
        this.reCaptchaApi.reset();
        // required due to forms
        this.onChange(undefined);
        this.onTouched(undefined);
        // trigger reset event
        this.reset.emit();
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
        this.#setupComponent();
    }
    ensureCaptchaElem(captchaElemId) {
        const captchaElem = document.getElementById(captchaElemId);
        if (!captchaElem) {
            throw Error(`Captcha element with id '${captchaElemId}' was not found`);
        }
        // assign captcha element
        this.captchaElem = captchaElem;
    }
    /**
     * Responsible for instantiating captcha element
     */
    renderReCaptcha() {
        // run outside angular zone due to timeout issues when testing
        // details: https://github.com/Enngage/ngx-captcha/issues/26
        // to fix reCAPTCHA placeholder element must be an element or id
        // https://github.com/Enngage/ngx-captcha/issues/96
        setTimeout(() => {
            this.captchaId = this.reCaptchaApi.render(this.captchaElemId, this.getCaptchaProperties());
            this.ready.emit();
        }, 0);
    }
    /**
     * Called when captcha receives response
     * @param callback Callback
     */
    handleCallback(callback) {
        this.currentResponse = callback;
        this.success.emit(callback);
        this.onChange(callback);
        this.onTouched(callback);
        if (this.resetCaptchaAfterSuccess) {
            this.resetCaptcha();
        }
    }
    #getPseudoUniqueNumber() {
        return new Date().getUTCMilliseconds() + Math.floor(Math.random() * 9999);
    }
    #setupComponent() {
        // captcha specific setup
        this.captchaSpecificSetup();
        // create captcha wrapper
        this.#createAndSetCaptchaElem();
        this.#scriptService.registerCaptchaScript({
            useGlobalDomain: this.useGlobalDomain(),
            useEnterprise: this.useEnterprise(),
        }, "explicit", (grecaptcha) => {
            this.#onloadCallback(grecaptcha);
        }, this.hl());
    }
    /**
     * Called when google's recaptcha script is ready
     */
    #onloadCallback(grecapcha) {
        // assign reference to reCaptcha Api once its loaded
        this.reCaptchaApi = grecapcha;
        if (!this.reCaptchaApi) {
            throw Error(`ReCaptcha Api was not initialized correctly`);
        }
        // loaded flag
        this.isLoaded = true;
        // fire load event
        this.load.emit();
        // render captcha
        this.renderReCaptcha();
        // setup component if it was flagged as such
        if (this.#setupAfterLoad) {
            this.#setupAfterLoad = false;
            this.#setupComponent();
        }
    }
    #generateNewElemId() {
        return this.captchaElemPrefix + this.#getPseudoUniqueNumber();
    }
    #createAndSetCaptchaElem() {
        // generate new captcha id
        this.captchaElemId = this.#generateNewElemId();
        if (!this.captchaElemId) {
            throw Error(`Captcha elem Id is not set`);
        }
        if (!this.captchaWrapperElem?.()) {
            throw Error(`Captcha DOM element is not initialized`);
        }
        // remove old html
        if (this.captchaWrapperElem()) {
            this.captchaWrapperElem().nativeElement.innerHTML = "";
        }
        // create new wrapper for captcha
        const newElem = this.#renderer.createElement("div");
        newElem.id = this.captchaElemId;
        this.#renderer.appendChild(this.captchaWrapperElem()?.nativeElement, newElem);
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
        this.onChange(undefined);
        this.onTouched(undefined);
        this.error.emit();
    }
    /**
     * Handles expired callback
     */
    handleExpireCallback() {
        this.expire.emit();
        // reset captcha on expire callback
        this.resetCaptcha();
    }
    static ɵfac = function BaseReCaptchaComponentDirective_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BaseReCaptchaComponentDirective)(); };
    static ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: BaseReCaptchaComponentDirective, inputs: { siteKey: [1, "siteKey"], useGlobalDomain: [1, "useGlobalDomain"], useEnterprise: [1, "useEnterprise"], type: [1, "type"], hl: [1, "hl"], tabIndex: [1, "tabIndex"] }, outputs: { success: "success", load: "load", reset: "reset", ready: "ready", error: "error", expire: "expire" }, features: [i0.ɵɵNgOnChangesFeature] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BaseReCaptchaComponentDirective, [{
        type: Directive
    }], null, null); })();

var ReCaptchaType;
(function (ReCaptchaType) {
    ReCaptchaType[ReCaptchaType["InvisibleReCaptcha"] = 0] = "InvisibleReCaptcha";
    ReCaptchaType[ReCaptchaType["ReCaptcha2"] = 1] = "ReCaptcha2";
})(ReCaptchaType || (ReCaptchaType = {}));

const _c0$1 = ["captchaWrapperElem"];
class InvisibleReCaptchaComponent extends BaseReCaptchaComponentDirective {
    /**
     * This size representing invisible captcha
     */
    size = 'invisible';
    /**
     * Theme
     */
    theme = input('light');
    /**
     * Badge
     */
    badge = input('bottomright');
    captchaWrapperElem = viewChild('captchaWrapperElem');
    recaptchaType = ReCaptchaType.InvisibleReCaptcha;
    /**
     * Programmatically invoke the reCAPTCHA check. Used if the invisible reCAPTCHA is on a div instead of a button.
     */
    execute() {
        // execute captcha
        this.reCaptchaApi.execute(this.captchaId);
    }
    captchaSpecificSetup() {
    }
    /**
    * Gets reCaptcha properties
    */
    getCaptchaProperties() {
        return {
            'sitekey': this.siteKey,
            'callback': (response) => this.handleCallback(response),
            'expired-callback': () => this.handleExpireCallback(),
            'error-callback': () => this.handleErrorCallback(),
            'badge': this.badge,
            'type': this.type,
            'tabindex': this.tabIndex,
            'size': this.size,
            'theme': this.theme
        };
    }
    static ɵfac = /*@__PURE__*/ (() => { let ɵInvisibleReCaptchaComponent_BaseFactory; return function InvisibleReCaptchaComponent_Factory(__ngFactoryType__) { return (ɵInvisibleReCaptchaComponent_BaseFactory || (ɵInvisibleReCaptchaComponent_BaseFactory = i0.ɵɵgetInheritedFactory(InvisibleReCaptchaComponent)))(__ngFactoryType__ || InvisibleReCaptchaComponent); }; })();
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: InvisibleReCaptchaComponent, selectors: [["ngx-invisible-recaptcha"]], viewQuery: function InvisibleReCaptchaComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuerySignal(ctx.captchaWrapperElem, _c0$1, 5);
        } if (rf & 2) {
            i0.ɵɵqueryAdvance();
        } }, inputs: { theme: [1, "theme"], badge: [1, "badge"] }, features: [i0.ɵɵProvidersFeature([
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: InvisibleReCaptchaComponent,
                    multi: true,
                }
            ]), i0.ɵɵInheritDefinitionFeature], decls: 2, vars: 0, consts: [["captchaWrapperElem", ""]], template: function InvisibleReCaptchaComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelement(0, "div", null, 0);
        } }, encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(InvisibleReCaptchaComponent, [{
        type: Component,
        args: [{
                selector: 'ngx-invisible-recaptcha',
                template: `
  <div #captchaWrapperElem></div>`,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: InvisibleReCaptchaComponent,
                        multi: true,
                    }
                ]
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(InvisibleReCaptchaComponent, { className: "InvisibleReCaptchaComponent", filePath: "lib/components/invisible-recaptcha.component.ts", lineNumber: 26 }); })();

const _c0 = ["captchaWrapperElem"];
class ReCaptcha2Component extends BaseReCaptchaComponentDirective {
    /**
    * Name of the global expire callback
    */
    windowOnErrorCallbackProperty = 'ngx_captcha_error_callback';
    /**
    * Name of the global error callback
    */
    windowOnExpireCallbackProperty = 'ngx_captcha_expire_callback';
    /**
     * Theme
     */
    theme = input('light');
    /**
    * Size
    */
    size = input('normal');
    captchaWrapperElem = viewChild('captchaWrapperElem');
    recaptchaType = ReCaptchaType.ReCaptcha2;
    ngOnDestroy() {
        window[this.windowOnErrorCallbackProperty] = {};
        window[this.windowOnExpireCallbackProperty] = {};
    }
    captchaSpecificSetup() {
        this.#registerCallbacks();
    }
    /**
     * Gets reCaptcha properties
    */
    getCaptchaProperties() {
        return {
            'sitekey': this.siteKey,
            'callback': (response) => this.handleCallback(response),
            'expired-callback': () => this.handleExpireCallback(),
            'error-callback': () => this.handleErrorCallback(),
            'theme': this.theme,
            'type': this.type,
            'size': this.size,
            'tabindex': this.tabIndex
        };
    }
    /**
     * Registers global callbacks
    */
    #registerCallbacks() {
        window[this.windowOnErrorCallbackProperty] = super.handleErrorCallback.bind(this);
        window[this.windowOnExpireCallbackProperty] = super.handleExpireCallback.bind(this);
    }
    static ɵfac = /*@__PURE__*/ (() => { let ɵReCaptcha2Component_BaseFactory; return function ReCaptcha2Component_Factory(__ngFactoryType__) { return (ɵReCaptcha2Component_BaseFactory || (ɵReCaptcha2Component_BaseFactory = i0.ɵɵgetInheritedFactory(ReCaptcha2Component)))(__ngFactoryType__ || ReCaptcha2Component); }; })();
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ReCaptcha2Component, selectors: [["ngx-recaptcha2"]], viewQuery: function ReCaptcha2Component_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuerySignal(ctx.captchaWrapperElem, _c0, 5);
        } if (rf & 2) {
            i0.ɵɵqueryAdvance();
        } }, inputs: { theme: [1, "theme"], size: [1, "size"] }, features: [i0.ɵɵProvidersFeature([
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: ReCaptcha2Component,
                    multi: true,
                }
            ]), i0.ɵɵInheritDefinitionFeature], decls: 2, vars: 0, consts: [["captchaWrapperElem", ""]], template: function ReCaptcha2Component_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelement(0, "div", null, 0);
        } }, encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ReCaptcha2Component, [{
        type: Component,
        args: [{
                selector: 'ngx-recaptcha2',
                template: `
  <div #captchaWrapperElem></div>`,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: ReCaptcha2Component,
                        multi: true,
                    }
                ]
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ReCaptcha2Component, { className: "ReCaptcha2Component", filePath: "lib/components/recaptcha-2.component.ts", lineNumber: 27 }); })();

class ReCaptchaV3Service {
    #scriptService = inject(ScriptService);
    /**
     * Executes reCaptcha v3/Enterprise with given action and passes token via callback. You need to verify
     * this callback in your backend to get meaningful results.
     *
     * For more information see https://developers.google.com/recaptcha/docs/v3
     * For enterprise see https://cloud.google.com/recaptcha-enterprise/docs
     *
     * @param siteKey Site key found in your google admin panel
     * @param action Action to log
     * @param callback Callback function to to handle token
     * @param config Optional configuration like useGlobalDomain to be provided
     * @param errorCallback Optional Callback function to handle errors
     */
    execute(siteKey, action, callback, config, errorCallback) {
        this.executeAsPromise(siteKey, action, config)
            .then(callback)
            .catch((error) => errorCallback ? errorCallback(error) : console.error(error));
    }
    /**
     * Executes reCaptcha v3/Enterprise with given action and returns token via Promise. You need to verify
     * this token in your backend to get meaningful results.
     *
     * For more information see https://developers.google.com/recaptcha/docs/v3
     * For enterprise see https://cloud.google.com/recaptcha-enterprise/docs
     *
     * @param siteKey Site key found in your google admin panel
     * @param action Action to log
     * @param config Optional configuration like useGlobalDomain to be provided
     */
    executeAsPromise(siteKey, action, config) {
        return new Promise((resolve, reject) => {
            const configuration = config || {};
            const onRegister = (grecaptcha) => {
                try {
                    grecaptcha
                        .execute(siteKey, { action })
                        .then((token) => resolve(token));
                }
                catch (error) {
                    reject(error);
                }
            };
            this.#scriptService.registerCaptchaScript(configuration, siteKey, onRegister);
        });
    }
    static ɵfac = function ReCaptchaV3Service_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ReCaptchaV3Service)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ReCaptchaV3Service, factory: ReCaptchaV3Service.ɵfac, providedIn: "root" });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ReCaptchaV3Service, [{
        type: Injectable,
        args: [{
                providedIn: "root",
            }]
    }], null, null); })();

/*
 * Public API
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BaseReCaptchaComponentDirective, InvisibleReCaptchaComponent, ReCaptcha2Component, ReCaptchaType, ReCaptchaV3Service, ScriptService };
//# sourceMappingURL=ngx-captcha.mjs.map
