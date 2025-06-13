import { Injectable, NgZone } from "@angular/core";
import { RecaptchaConfiguration } from "../models/recaptcha-configuration";

@Injectable({
	providedIn: "root",
})
export class ScriptService {
	private readonly scriptElemId: string = "ngx-catpcha-script";

	/**
	 * Name of the global google recaptcha script
	 */
	protected readonly windowGrecaptcha = "grecaptcha";

	/**
	 * Name of enterprise property in the global google recaptcha script
	 */
	protected readonly windowGrecaptchaEnterprise = "enterprise";

	/**
	 * Name of the global callback
	 */
	protected readonly windowOnLoadCallbackProperty =
		"ngx_captcha_onload_callback";

	/**
	 * Name of the global callback for enterprise
	 */
	protected readonly windowOnLoadEnterpriseCallbackProperty =
		"ngx_captcha_onload_enterprise_callback";

	protected readonly globalDomain: string = "recaptcha.net";

	protected readonly defaultDomain: string = "google.com";

	protected readonly enterpriseApi: string = "enterprise.js";

	protected readonly defaultApi: string = "api.js";

	registerCaptchaScript(
		config: RecaptchaConfiguration,
		render: string,
		onLoad: (grecaptcha: any) => void,
		language?: string
	): void {
		if (this.#grecaptchaScriptLoaded(config.useEnterprise)) {
			// recaptcha script is already loaded
			// just call the callback
			if (config.useEnterprise) {
				onLoad(
					(window as any)[this.windowGrecaptcha][
					this.windowGrecaptchaEnterprise
					]
				);
			} else {
				onLoad((window as any)[this.windowGrecaptcha]);
			}
			return;
		}

		// we need to patch the callback through global variable, otherwise callback is not accessible
		// note: https://github.com/Enngage/ngx-captcha/issues/2
		if (config.useEnterprise) {
			(window as any)[this.#getCallbackName(true)] = <any>(
				(() =>
					onLoad.bind(
						this,
						(window as any)[this.windowGrecaptcha][
						this.windowGrecaptchaEnterprise
						]
					)
				));
		} else {
			(window as any)[this.#getCallbackName(false)] = <any>(
				(() =>
					onLoad.bind(this, (window as any)[this.windowGrecaptcha])
				));
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

	cleanup(): void {
		const elem = document.getElementById(this.scriptElemId);

		if (elem) {
			elem.remove();
		}
		(window as any)[this.#getCallbackName()] = undefined;
		(window as any)[this.windowGrecaptcha] = undefined;
	}

	/**
	 * Indicates if google recaptcha script is available and ready to be used
	 */
	#grecaptchaScriptLoaded(useEnterprise?: boolean): boolean {
		if (
			!(window as any)[this.#getCallbackName(useEnterprise)] ||
			!(window as any)[this.windowGrecaptcha]
		) {
			return false;
		} else if (
			useEnterprise &&
			(window as any)[this.windowGrecaptcha][this.windowGrecaptchaEnterprise]
		) {
			return true;
			// if only enterprise script is loaded we need to check some v3's method
		} else if ((window as any)[this.windowGrecaptcha].execute) {
			return true;
		}
		return false;
	}

	/**
	 * Gets global callback name
	 * @param useEnterprise Optional flag for enterprise script
	 * @private
	 */
	#getCallbackName(useEnterprise?: boolean): string {
		return useEnterprise
			? this.windowOnLoadEnterpriseCallbackProperty
			: this.windowOnLoadCallbackProperty;
	}

	/**
	 * Url to google api script
	 */
	#getCaptchaScriptUrl(
		config: RecaptchaConfiguration,
		render: string,
		language?: string
	): string {
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
}
