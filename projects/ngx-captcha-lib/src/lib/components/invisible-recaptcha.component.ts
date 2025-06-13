import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	input,
	viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ReCaptchaType } from '../models/recaptcha-type.enum';
import { BaseReCaptchaComponentDirective } from './base-re-captcha-component.directive';

@Component({
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
})
export class InvisibleReCaptchaComponent extends BaseReCaptchaComponentDirective {

	/**
	 * This size representing invisible captcha
	 */
	protected readonly size = 'invisible';

	/**
	 * Theme
	 */
	readonly theme = input<'dark' | 'light'>('light');

	/**
	 * Badge
	 */
	readonly badge = input<'bottomright' | 'bottomleft' | 'inline'>('bottomright');

	readonly captchaWrapperElem = viewChild<ElementRef>('captchaWrapperElem')

	protected recaptchaType: ReCaptchaType = ReCaptchaType.InvisibleReCaptcha;

	/**
	 * Programmatically invoke the reCAPTCHA check. Used if the invisible reCAPTCHA is on a div instead of a button.
	 */
	execute(): void {
		// execute captcha
		this.reCaptchaApi.execute(this.captchaId);
	}

	protected captchaSpecificSetup(): void {
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
			'badge': this.badge(),
			'type': this.type(),
			'tabindex': this.tabIndex(),
			'size': this.size,
			'theme': this.theme()
		};
	}
}
