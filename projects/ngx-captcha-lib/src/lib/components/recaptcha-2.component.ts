import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	input,
	OnDestroy,
	viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ReCaptchaType } from '../models/recaptcha-type.enum';
import { BaseReCaptchaComponentDirective } from './base-re-captcha-component.directive';

@Component({
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
})
export class ReCaptcha2Component extends BaseReCaptchaComponentDirective implements OnDestroy {

	/**
	* Name of the global expire callback
	*/
	protected readonly windowOnErrorCallbackProperty = 'ngx_captcha_error_callback';

	/**
	* Name of the global error callback
	*/
	protected readonly windowOnExpireCallbackProperty = 'ngx_captcha_expire_callback';

	/**
	 * Theme
	 */
	readonly theme = input<'dark' | 'light'>('light');

	/**
	* Size
	*/
	readonly size = input<'compact' | 'normal'>('normal');


	readonly captchaWrapperElem = viewChild<ElementRef>('captchaWrapperElem')

	protected recaptchaType: ReCaptchaType = ReCaptchaType.ReCaptcha2;

	ngOnDestroy(): void {
		(window as any)[this.windowOnErrorCallbackProperty] = {};
		(window as any)[this.windowOnExpireCallbackProperty] = {};
	}

	protected captchaSpecificSetup(): void {
		this.#registerCallbacks();
	}

	/**
	 * Gets reCaptcha properties
	*/
	protected getCaptchaProperties(): any {
		return {
			'sitekey': this.siteKey,
			'callback': (response: any) => this.handleCallback(response),
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
	#registerCallbacks(): void {
		(window as any)[this.windowOnErrorCallbackProperty] = super.handleErrorCallback.bind(this);
		(window as any)[this.windowOnExpireCallbackProperty] = super.handleExpireCallback.bind(this);
	}
}
