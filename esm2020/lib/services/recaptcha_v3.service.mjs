import { Injectable, NgZone } from "@angular/core";
import { ScriptService } from "./script.service";
import * as i0 from "@angular/core";
import * as i1 from "./script.service";
export class ReCaptchaV3Service {
    constructor(scriptService, zone) {
        this.scriptService = scriptService;
        this.zone = zone;
    }
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
                this.zone.runOutsideAngular(() => {
                    try {
                        grecaptcha
                            .execute(siteKey, { action })
                            .then((token) => this.zone.run(() => resolve(token)));
                    }
                    catch (error) {
                        reject(error);
                    }
                });
            };
            this.scriptService.registerCaptchaScript(configuration, siteKey, onRegister);
        });
    }
}
/** @nocollapse */ ReCaptchaV3Service.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: ReCaptchaV3Service, deps: [{ token: i1.ScriptService }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ ReCaptchaV3Service.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: ReCaptchaV3Service, providedIn: "root" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: ReCaptchaV3Service, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root",
                }]
        }], ctorParameters: function () { return [{ type: i1.ScriptService }, { type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjYXB0Y2hhX3YzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZpY2VzL3JlY2FwdGNoYV92My5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRW5ELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7O0FBTWpELE1BQU0sT0FBTyxrQkFBa0I7SUFDN0IsWUFBc0IsYUFBNEIsRUFBWSxJQUFZO1FBQXBELGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVksU0FBSSxHQUFKLElBQUksQ0FBUTtJQUFHLENBQUM7SUFFOUU7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0gsT0FBTyxDQUNMLE9BQWUsRUFDZixNQUFjLEVBQ2QsUUFBaUMsRUFDakMsTUFBK0IsRUFDL0IsYUFBb0M7UUFFcEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO2FBQzNDLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDZCxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUNmLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUM1RCxDQUFDO0lBQ04sQ0FBQztJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSCxnQkFBZ0IsQ0FDZCxPQUFlLEVBQ2YsTUFBYyxFQUNkLE1BQStCO1FBRS9CLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztZQUVuQyxNQUFNLFVBQVUsR0FBRyxDQUFDLFVBQWUsRUFBRSxFQUFFO2dCQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtvQkFDL0IsSUFBSTt3QkFDRixVQUFVOzZCQUNQLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQzs2QkFDNUIsSUFBSSxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUM5RDtvQkFBQyxPQUFPLEtBQUssRUFBRTt3QkFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ2Y7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUM7WUFFRixJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUN0QyxhQUFhLEVBQ2IsT0FBTyxFQUNQLFVBQVUsQ0FDWCxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOztrSUFuRVUsa0JBQWtCO3NJQUFsQixrQkFBa0IsY0FGakIsTUFBTTsyRkFFUCxrQkFBa0I7a0JBSDlCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgTmdab25lIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcblxuaW1wb3J0IHsgU2NyaXB0U2VydmljZSB9IGZyb20gXCIuL3NjcmlwdC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBSZWNhcHRjaGFDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL21vZGVscy9yZWNhcHRjaGEtY29uZmlndXJhdGlvblwiO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46IFwicm9vdFwiLFxufSlcbmV4cG9ydCBjbGFzcyBSZUNhcHRjaGFWM1NlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NyaXB0U2VydmljZTogU2NyaXB0U2VydmljZSwgcHJvdGVjdGVkIHpvbmU6IE5nWm9uZSkge31cblxuICAvKipcbiAgICogRXhlY3V0ZXMgcmVDYXB0Y2hhIHYzL0VudGVycHJpc2Ugd2l0aCBnaXZlbiBhY3Rpb24gYW5kIHBhc3NlcyB0b2tlbiB2aWEgY2FsbGJhY2suIFlvdSBuZWVkIHRvIHZlcmlmeVxuICAgKiB0aGlzIGNhbGxiYWNrIGluIHlvdXIgYmFja2VuZCB0byBnZXQgbWVhbmluZ2Z1bCByZXN1bHRzLlxuICAgKlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vcmVjYXB0Y2hhL2RvY3MvdjNcbiAgICogRm9yIGVudGVycHJpc2Ugc2VlIGh0dHBzOi8vY2xvdWQuZ29vZ2xlLmNvbS9yZWNhcHRjaGEtZW50ZXJwcmlzZS9kb2NzXG4gICAqXG4gICAqIEBwYXJhbSBzaXRlS2V5IFNpdGUga2V5IGZvdW5kIGluIHlvdXIgZ29vZ2xlIGFkbWluIHBhbmVsXG4gICAqIEBwYXJhbSBhY3Rpb24gQWN0aW9uIHRvIGxvZ1xuICAgKiBAcGFyYW0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24gdG8gdG8gaGFuZGxlIHRva2VuXG4gICAqIEBwYXJhbSBjb25maWcgT3B0aW9uYWwgY29uZmlndXJhdGlvbiBsaWtlIHVzZUdsb2JhbERvbWFpbiB0byBiZSBwcm92aWRlZFxuICAgKiBAcGFyYW0gZXJyb3JDYWxsYmFjayBPcHRpb25hbCBDYWxsYmFjayBmdW5jdGlvbiB0byBoYW5kbGUgZXJyb3JzXG4gICAqL1xuICBleGVjdXRlKFxuICAgIHNpdGVLZXk6IHN0cmluZyxcbiAgICBhY3Rpb246IHN0cmluZyxcbiAgICBjYWxsYmFjazogKHRva2VuOiBzdHJpbmcpID0+IHZvaWQsXG4gICAgY29uZmlnPzogUmVjYXB0Y2hhQ29uZmlndXJhdGlvbixcbiAgICBlcnJvckNhbGxiYWNrPzogKGVycm9yOiBhbnkpID0+IHZvaWRcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5leGVjdXRlQXNQcm9taXNlKHNpdGVLZXksIGFjdGlvbiwgY29uZmlnKVxuICAgICAgLnRoZW4oY2FsbGJhY2spXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PlxuICAgICAgICBlcnJvckNhbGxiYWNrID8gZXJyb3JDYWxsYmFjayhlcnJvcikgOiBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyByZUNhcHRjaGEgdjMvRW50ZXJwcmlzZSB3aXRoIGdpdmVuIGFjdGlvbiBhbmQgcmV0dXJucyB0b2tlbiB2aWEgUHJvbWlzZS4gWW91IG5lZWQgdG8gdmVyaWZ5XG4gICAqIHRoaXMgdG9rZW4gaW4geW91ciBiYWNrZW5kIHRvIGdldCBtZWFuaW5nZnVsIHJlc3VsdHMuXG4gICAqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9yZWNhcHRjaGEvZG9jcy92M1xuICAgKiBGb3IgZW50ZXJwcmlzZSBzZWUgaHR0cHM6Ly9jbG91ZC5nb29nbGUuY29tL3JlY2FwdGNoYS1lbnRlcnByaXNlL2RvY3NcbiAgICpcbiAgICogQHBhcmFtIHNpdGVLZXkgU2l0ZSBrZXkgZm91bmQgaW4geW91ciBnb29nbGUgYWRtaW4gcGFuZWxcbiAgICogQHBhcmFtIGFjdGlvbiBBY3Rpb24gdG8gbG9nXG4gICAqIEBwYXJhbSBjb25maWcgT3B0aW9uYWwgY29uZmlndXJhdGlvbiBsaWtlIHVzZUdsb2JhbERvbWFpbiB0byBiZSBwcm92aWRlZFxuICAgKi9cbiAgZXhlY3V0ZUFzUHJvbWlzZShcbiAgICBzaXRlS2V5OiBzdHJpbmcsXG4gICAgYWN0aW9uOiBzdHJpbmcsXG4gICAgY29uZmlnPzogUmVjYXB0Y2hhQ29uZmlndXJhdGlvblxuICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBjb25maWd1cmF0aW9uID0gY29uZmlnIHx8IHt9O1xuXG4gICAgICBjb25zdCBvblJlZ2lzdGVyID0gKGdyZWNhcHRjaGE6IGFueSkgPT4ge1xuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBncmVjYXB0Y2hhXG4gICAgICAgICAgICAgIC5leGVjdXRlKHNpdGVLZXksIHsgYWN0aW9uIH0pXG4gICAgICAgICAgICAgIC50aGVuKCh0b2tlbjogYW55KSA9PiB0aGlzLnpvbmUucnVuKCgpID0+IHJlc29sdmUodG9rZW4pKSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuc2NyaXB0U2VydmljZS5yZWdpc3RlckNhcHRjaGFTY3JpcHQoXG4gICAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICAgIHNpdGVLZXksXG4gICAgICAgIG9uUmVnaXN0ZXJcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==