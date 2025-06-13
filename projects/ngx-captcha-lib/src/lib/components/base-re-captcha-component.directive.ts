import {
	AfterViewChecked,
	AfterViewInit,
	Directive,
	ElementRef,
	EventEmitter,
	inject,
	Injector,
	input,
	Input,
	NgZone,
	OnChanges,
	output,
	Output,
	Renderer2,
	Signal,
	SimpleChanges,
} from "@angular/core";
import {
	AbstractControl,
	ControlValueAccessor,
	NgControl,
} from "@angular/forms";

import { ReCaptchaType } from "../models/recaptcha-type.enum";
import { ScriptService } from "../services/script.service";

@Directive()
export abstract class BaseReCaptchaComponentDirective
	implements OnChanges, ControlValueAccessor, AfterViewInit, AfterViewChecked {
	/**
	 * Prefix of the captcha element
	 */
	protected readonly captchaElemPrefix = "ngx_captcha_id_";

	#setupCaptcha: boolean = true;

	/**
	 * Google's site key.
	 * You can find this under https://www.google.com/recaptcha
	 */
	readonly siteKey = input<string>();

	/**
	 * Indicates if global domain 'recaptcha.net' should be used instead of default domain ('google.com')
	 */
	readonly useGlobalDomain = input<boolean>(false);

	readonly useEnterprise = input<boolean>(false);

	/**
	 * Type
	 */
	readonly type = input<"audio" | "image">("image");

	/**
	 * Language code. Auto-detects the user's language if unspecified.
	 */
	readonly hl = input<string>();

	/**
	 * Tab index
	 */
	readonly tabIndex = input<number>(0);

	/**
	 * Called when captcha receives successful response.
	 * Captcha response token is passed to event.
	 */
	readonly success = output<string>();

	/**
	 * Called when captcha is loaded. Event receives id of the captcha
	 */
	readonly load = output<void>();

	/**
	 * Called when captcha is reset.
	 */
	readonly reset = output<void>();

	/**
	 * Called when captcha is loaded & ready. I.e. when you need to execute captcha on component load.
	 */
	readonly ready = output<void>();

	/**
	 * Error callback
	 */
	readonly error = output<void>();

	/**
	 * Expired callback
	 */
	readonly expire = output<void>();

	abstract captchaWrapperElem?: Signal<ElementRef<any> | undefined>;

	/**
	 * Indicates if captcha should be set on load
	 */
	#setupAfterLoad = false;

	/**
	 * Captcha element
	 */
	protected captchaElem?: HTMLElement;

	/**
	 * Id of the captcha elem
	 */
	protected captchaId?: number;

	/**
	 * Holds last response value
	 */
	protected currentResponse?: string;

	/**
	 * If enabled, captcha will reset after receiving success response. This is useful
	 * when invisible captcha need to be resolved multiple times on same page
	 */
	protected resetCaptchaAfterSuccess = false;

	/**
	 * Captcha type
	 */
	protected abstract recaptchaType: ReCaptchaType;

	/**
	 * Required by ControlValueAccessor
	 */
	protected onChange: (value: string | undefined) => void = (val) => { };
	protected onTouched: (value: string | undefined) => void = (val) => { };

	/**
	 * Indicates if captcha is loaded
	 */
	isLoaded = false;

	/**
	 * Reference to global reCaptcha API
	 */
	reCaptchaApi?: any;

	/**
	 * Id of the DOM element wrapping captcha
	 */
	captchaElemId?: string;

	/**
	 * Form Control to be enable usage in reactive forms
	 */
	control?: AbstractControl | null;

	readonly #renderer = inject(Renderer2);
	readonly #injector = inject(Injector);
	readonly #scriptService = inject(ScriptService);

	ngAfterViewInit() {
		this.control = this.#injector.get<NgControl | undefined>(
			NgControl,
			undefined,
			{ optional: true }
		)?.control;
	}

	ngAfterViewChecked(): void {
		if (this.#setupCaptcha) {
			this.#setupCaptcha = false;
			this.#setupComponent();
		}
	}

	/**
	 * Gets reCaptcha properties
	 */
	protected abstract getCaptchaProperties(): any;

	/**
	 * Used for captcha specific setup
	 */
	protected abstract captchaSpecificSetup(): void;

	ngOnChanges(changes: SimpleChanges): void {
		// cleanup scripts if language changed because they need to be reloaded
		if (changes && changes["hl"]) {
			// cleanup scripts when language changes
			if (
				!changes["hl"].firstChange &&
				changes["hl"].currentValue !== changes["hl"].previousValue
			) {
				this.#scriptService.cleanup();
			}
		}

		if (changes && changes["useGlobalDomain"]) {
			// cleanup scripts when domain changes
			if (
				!changes["useGlobalDomain"].firstChange &&
				changes["useGlobalDomain"].currentValue !==
				changes["useGlobalDomain"].previousValue
			) {
				this.#scriptService.cleanup();
			}
		}

		this.#setupCaptcha = true;
	}

	/**
	 * Gets captcha response as per reCaptcha docs
	 */
	getResponse(): string {
		return this.reCaptchaApi.getResponse(this.captchaId);
	}

	/**
	 * Gets Id of captcha widget
	 */
	getCaptchaId(): number | undefined {
		return this.captchaId;
	}

	/**
	 * Resets captcha
	 */
	resetCaptcha(): void {
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
	getCurrentResponse(): string | undefined {
		return this.currentResponse;
	}

	/**
	 * Reload captcha. Useful when properties (i.e. theme) changed and captcha need to reflect them
	 */
	reloadCaptcha(): void {
		this.#setupComponent();
	}

	protected ensureCaptchaElem(captchaElemId: string): void {
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
	protected renderReCaptcha(): void {
		// run outside angular zone due to timeout issues when testing
		// details: https://github.com/Enngage/ngx-captcha/issues/26
		// to fix reCAPTCHA placeholder element must be an element or id
		// https://github.com/Enngage/ngx-captcha/issues/96
		setTimeout(() => {
			this.captchaId = this.reCaptchaApi.render(
				this.captchaElemId,
				this.getCaptchaProperties()
			);
			this.ready.emit();
		}, 0);
	}

	/**
	 * Called when captcha receives response
	 * @param callback Callback
	 */
	protected handleCallback(callback: any): void {
		this.currentResponse = callback;
		this.success.emit(callback);

		this.onChange(callback);
		this.onTouched(callback);

		if (this.resetCaptchaAfterSuccess) {
			this.resetCaptcha();
		}
	}

	#getPseudoUniqueNumber(): number {
		return new Date().getUTCMilliseconds() + Math.floor(Math.random() * 9999);
	}

	#setupComponent(): void {
		// captcha specific setup
		this.captchaSpecificSetup();

		// create captcha wrapper
		this.#createAndSetCaptchaElem();

		this.#scriptService.registerCaptchaScript(
			{
				useGlobalDomain: this.useGlobalDomain(),
				useEnterprise: this.useEnterprise(),
			},
			"explicit",
			(grecaptcha) => {
				this.#onloadCallback(grecaptcha);
			},
			this.hl()
		);
	}

	/**
	 * Called when google's recaptcha script is ready
	 */
	#onloadCallback(grecapcha: any): void {
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

	#generateNewElemId(): string {
		return this.captchaElemPrefix + this.#getPseudoUniqueNumber();
	}

	#createAndSetCaptchaElem(): void {
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
      this.captchaWrapperElem()!.nativeElement.innerHTML = "";
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
	writeValue(obj: any): void { }

	/**
	 * This method helps us tie together recaptcha and our formControl values
	 */
	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	/**
	 * At some point we might be interested whether the user has touched our component
	 */
	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	/**
	 * Handles error callback
	 */
	protected handleErrorCallback(): void {
		this.onChange(undefined);
		this.onTouched(undefined);

		this.error.emit();
	}

	/**
	 * Handles expired callback
	 */
	protected handleExpireCallback(): void {
		this.expire.emit();

		// reset captcha on expire callback
		this.resetCaptcha();
	}
}
