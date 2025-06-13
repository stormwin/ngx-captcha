import { Injectable, NgZone } from "@angular/core";
import * as i0 from "@angular/core";
export class ScriptService {
    constructor(zone) {
        this.zone = zone;
        this.scriptElemId = "ngx-catpcha-script";
        /**
         * Name of the global google recaptcha script
         */
        this.windowGrecaptcha = "grecaptcha";
        /**
         * Name of enterpise property in the global google recaptcha script
         */
        this.windowGrecaptchaEnterprise = "enterprise";
        /**
         * Name of the global callback
         */
        this.windowOnLoadCallbackProperty = "ngx_captcha_onload_callback";
        /**
         * Name of the global callback for enterprise
         */
        this.windowOnLoadEnterpriseCallbackProperty = "ngx_captcha_onload_enterprise_callback";
        this.globalDomain = "recaptcha.net";
        this.defaultDomain = "google.com";
        this.enterpriseApi = "enterprise.js";
        this.defaultApi = "api.js";
    }
    registerCaptchaScript(config, render, onLoad, language) {
        if (this.grecaptchaScriptLoaded(config.useEnterprise)) {
            // recaptcha script is already loaded
            // just call the callback
            if (config.useEnterprise) {
                this.zone.run(() => {
                    onLoad(window[this.windowGrecaptcha][this.windowGrecaptchaEnterprise]);
                });
            }
            else {
                this.zone.run(() => {
                    onLoad(window[this.windowGrecaptcha]);
                });
            }
            return;
        }
        // we need to patch the callback through global variable, otherwise callback is not accessible
        // note: https://github.com/Enngage/ngx-captcha/issues/2
        if (config.useEnterprise) {
            window[this.getCallbackName(true)] = ((() => this.zone.run(onLoad.bind(this, window[this.windowGrecaptcha][this.windowGrecaptchaEnterprise]))));
        }
        else {
            window[this.getCallbackName(false)] = ((() => this.zone.run(onLoad.bind(this, window[this.windowGrecaptcha]))));
        }
        // prepare script elem
        const scriptElem = document.createElement("script");
        scriptElem.id = this.scriptElemId;
        scriptElem.innerHTML = "";
        scriptElem.src = this.getCaptchaScriptUrl(config, render, language);
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
        window[this.getCallbackName()] = undefined;
        window[this.windowGrecaptcha] = undefined;
    }
    /**
     * Indicates if google recaptcha script is available and ready to be used
     */
    grecaptchaScriptLoaded(useEnterprise) {
        if (!window[this.getCallbackName(useEnterprise)] ||
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
    getCallbackName(useEnterprise) {
        return useEnterprise
            ? this.windowOnLoadEnterpriseCallbackProperty
            : this.windowOnLoadCallbackProperty;
    }
    /**
     * Gets language param used in script url
     */
    getLanguageParam(hl) {
        if (!hl) {
            return "";
        }
        return `&hl=${hl}`;
    }
    /**
     * Url to google api script
     */
    getCaptchaScriptUrl(config, render, language) {
        const domain = config.useGlobalDomain
            ? this.globalDomain
            : this.defaultDomain;
        const api = config.useEnterprise ? this.enterpriseApi : this.defaultApi;
        const callback = this.getCallbackName(config.useEnterprise);
        return `https://www.${domain}/recaptcha/${api}?onload=${callback}&render=${render}${this.getLanguageParam(language)}`;
    }
}
/** @nocollapse */ ScriptService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: ScriptService, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ ScriptService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: ScriptService, providedIn: "root" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.4", ngImport: i0, type: ScriptService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root",
                }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZpY2VzL3NjcmlwdC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQU1uRCxNQUFNLE9BQU8sYUFBYTtJQWlDeEIsWUFBc0IsSUFBWTtRQUFaLFNBQUksR0FBSixJQUFJLENBQVE7UUFoQ2pCLGlCQUFZLEdBQVcsb0JBQW9CLENBQUM7UUFFN0Q7O1dBRUc7UUFDZ0IscUJBQWdCLEdBQUcsWUFBWSxDQUFDO1FBRW5EOztXQUVHO1FBQ2dCLCtCQUEwQixHQUFHLFlBQVksQ0FBQztRQUU3RDs7V0FFRztRQUNnQixpQ0FBNEIsR0FDN0MsNkJBQTZCLENBQUM7UUFFaEM7O1dBRUc7UUFDZ0IsMkNBQXNDLEdBQ3ZELHdDQUF3QyxDQUFDO1FBRXhCLGlCQUFZLEdBQVcsZUFBZSxDQUFDO1FBRXZDLGtCQUFhLEdBQVcsWUFBWSxDQUFDO1FBRXJDLGtCQUFhLEdBQVcsZUFBZSxDQUFDO1FBRXhDLGVBQVUsR0FBVyxRQUFRLENBQUM7SUFFWixDQUFDO0lBRXRDLHFCQUFxQixDQUNuQixNQUE4QixFQUM5QixNQUFjLEVBQ2QsTUFBaUMsRUFDakMsUUFBaUI7UUFFakIsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ3JELHFDQUFxQztZQUNyQyx5QkFBeUI7WUFDekIsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFO2dCQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQ2pCLE1BQU0sQ0FDSCxNQUFjLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQ3BDLElBQUksQ0FBQywwQkFBMEIsQ0FDaEMsQ0FDRixDQUFDO2dCQUNKLENBQUMsQ0FBQyxDQUFDO2FB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QXNDO1lBQzdDLENBQUMsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUM7SUFDeEMsQ0FBQztJQUVEOztPQUVHO0lBQ0ssZ0JBQWdCLENBQUMsRUFBVztRQUNsQyxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1AsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUVELE9BQU8sT0FBTyxFQUFFLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQ7O09BRUc7SUFDSyxtQkFBbUIsQ0FDekIsTUFBOEIsRUFDOUIsTUFBYyxFQUNkLFFBQWlCO1FBRWpCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxlQUFlO1lBQ25DLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWTtZQUNuQixDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUN2QixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3hFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTVELE9BQU8sZUFBZSxNQUFNLGNBQWMsR0FBRyxXQUFXLFFBQVEsV0FBVyxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUN2RyxRQUFRLENBQ1QsRUFBRSxDQUFDO0lBQ04sQ0FBQzs7NkhBcktVLGFBQWE7aUlBQWIsYUFBYSxjQUZaLE1BQU07MkZBRVAsYUFBYTtrQkFIekIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUmVjYXB0Y2hhQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9tb2RlbHMvcmVjYXB0Y2hhLWNvbmZpZ3VyYXRpb25cIjtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiBcInJvb3RcIixcbn0pXG5leHBvcnQgY2xhc3MgU2NyaXB0U2VydmljZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2NyaXB0RWxlbUlkOiBzdHJpbmcgPSBcIm5neC1jYXRwY2hhLXNjcmlwdFwiO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBnbG9iYWwgZ29vZ2xlIHJlY2FwdGNoYSBzY3JpcHRcbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSB3aW5kb3dHcmVjYXB0Y2hhID0gXCJncmVjYXB0Y2hhXCI7XG5cbiAgLyoqXG4gICAqIE5hbWUgb2YgZW50ZXJwaXNlIHByb3BlcnR5IGluIHRoZSBnbG9iYWwgZ29vZ2xlIHJlY2FwdGNoYSBzY3JpcHRcbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSB3aW5kb3dHcmVjYXB0Y2hhRW50ZXJwcmlzZSA9IFwiZW50ZXJwcmlzZVwiO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBnbG9iYWwgY2FsbGJhY2tcbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSB3aW5kb3dPbkxvYWRDYWxsYmFja1Byb3BlcnR5ID1cbiAgICBcIm5neF9jYXB0Y2hhX29ubG9hZF9jYWxsYmFja1wiO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBnbG9iYWwgY2FsbGJhY2sgZm9yIGVudGVycHJpc2VcbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSB3aW5kb3dPbkxvYWRFbnRlcnByaXNlQ2FsbGJhY2tQcm9wZXJ0eSA9XG4gICAgXCJuZ3hfY2FwdGNoYV9vbmxvYWRfZW50ZXJwcmlzZV9jYWxsYmFja1wiO1xuXG4gIHByb3RlY3RlZCByZWFkb25seSBnbG9iYWxEb21haW46IHN0cmluZyA9IFwicmVjYXB0Y2hhLm5ldFwiO1xuXG4gIHByb3RlY3RlZCByZWFkb25seSBkZWZhdWx0RG9tYWluOiBzdHJpbmcgPSBcImdvb2dsZS5jb21cIjtcblxuICBwcm90ZWN0ZWQgcmVhZG9ubHkgZW50ZXJwcmlzZUFwaTogc3RyaW5nID0gXCJlbnRlcnByaXNlLmpzXCI7XG5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGRlZmF1bHRBcGk6IHN0cmluZyA9IFwiYXBpLmpzXCI7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHpvbmU6IE5nWm9uZSkge31cblxuICByZWdpc3RlckNhcHRjaGFTY3JpcHQoXG4gICAgY29uZmlnOiBSZWNhcHRjaGFDb25maWd1cmF0aW9uLFxuICAgIHJlbmRlcjogc3RyaW5nLFxuICAgIG9uTG9hZDogKGdyZWNhcHRjaGE6IGFueSkgPT4gdm9pZCxcbiAgICBsYW5ndWFnZT86IHN0cmluZ1xuICApOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ncmVjYXB0Y2hhU2NyaXB0TG9hZGVkKGNvbmZpZy51c2VFbnRlcnByaXNlKSkge1xuICAgICAgLy8gcmVjYXB0Y2hhIHNjcmlwdCBpcyBhbHJlYWR5IGxvYWRlZFxuICAgICAgLy8ganVzdCBjYWxsIHRoZSBjYWxsYmFja1xuICAgICAgaWYgKGNvbmZpZy51c2VFbnRlcnByaXNlKSB7XG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIG9uTG9hZChcbiAgICAgICAgICAgICh3aW5kb3cgYXMgYW55KVt0aGlzLndpbmRvd0dyZWNhcHRjaGFdW1xuICAgICAgICAgICAgICB0aGlzLndpbmRvd0dyZWNhcHRjaGFFbnRlcnByaXNlXG4gICAgICAgICAgICBdXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICBvbkxvYWQoKHdpbmRvdyBhcyBhbnkpW3RoaXMud2luZG93R3JlY2FwdGNoYV0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB3ZSBuZWVkIHRvIHBhdGNoIHRoZSBjYWxsYmFjayB0aHJvdWdoIGdsb2JhbCB2YXJpYWJsZSwgb3RoZXJ3aXNlIGNhbGxiYWNrIGlzIG5vdCBhY2Nlc3NpYmxlXG4gICAgLy8gbm90ZTogaHR0cHM6Ly9naXRodWIuY29tL0VubmdhZ2Uvbmd4LWNhcHRjaGEvaXNzdWVzLzJcbiAgICBpZiAoY29uZmlnLnVzZUVudGVycHJpc2UpIHtcbiAgICAgICh3aW5kb3cgYXMgYW55KVt0aGlzLmdldENhbGxiYWNrTmFtZSh0cnVlKV0gPSA8YW55PihcbiAgICAgICAgKCgpID0+XG4gICAgICAgICAgdGhpcy56b25lLnJ1bihcbiAgICAgICAgICAgIG9uTG9hZC5iaW5kKFxuICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAod2luZG93IGFzIGFueSlbdGhpcy53aW5kb3dHcmVjYXB0Y2hhXVtcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd0dyZWNhcHRjaGFFbnRlcnByaXNlXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIClcbiAgICAgICAgICApKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgKHdpbmRvdyBhcyBhbnkpW3RoaXMuZ2V0Q2FsbGJhY2tOYW1lKGZhbHNlKV0gPSA8YW55PihcbiAgICAgICAgKCgpID0+XG4gICAgICAgICAgdGhpcy56b25lLnJ1bihcbiAgICAgICAgICAgIG9uTG9hZC5iaW5kKHRoaXMsICh3aW5kb3cgYXMgYW55KVt0aGlzLndpbmRvd0dyZWNhcHRjaGFdKVxuICAgICAgICAgICkpXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIHByZXBhcmUgc2NyaXB0IGVsZW1cbiAgICBjb25zdCBzY3JpcHRFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICBzY3JpcHRFbGVtLmlkID0gdGhpcy5zY3JpcHRFbGVtSWQ7XG4gICAgc2NyaXB0RWxlbS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHNjcmlwdEVsZW0uc3JjID0gdGhpcy5nZXRDYXB0Y2hhU2NyaXB0VXJsKGNvbmZpZywgcmVuZGVyLCBsYW5ndWFnZSk7XG4gICAgc2NyaXB0RWxlbS5hc3luYyA9IHRydWU7XG4gICAgc2NyaXB0RWxlbS5kZWZlciA9IHRydWU7XG5cbiAgICAvLyBhZGQgc2NyaXB0IHRvIGhlYWRlclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChzY3JpcHRFbGVtKTtcbiAgfVxuXG4gIGNsZWFudXAoKTogdm9pZCB7XG4gICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc2NyaXB0RWxlbUlkKTtcblxuICAgIGlmIChlbGVtKSB7XG4gICAgICBlbGVtLnJlbW92ZSgpO1xuICAgIH1cbiAgICAod2luZG93IGFzIGFueSlbdGhpcy5nZXRDYWxsYmFja05hbWUoKV0gPSB1bmRlZmluZWQ7XG4gICAgKHdpbmRvdyBhcyBhbnkpW3RoaXMud2luZG93R3JlY2FwdGNoYV0gPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIGdvb2dsZSByZWNhcHRjaGEgc2NyaXB0IGlzIGF2YWlsYWJsZSBhbmQgcmVhZHkgdG8gYmUgdXNlZFxuICAgKi9cbiAgcHJpdmF0ZSBncmVjYXB0Y2hhU2NyaXB0TG9hZGVkKHVzZUVudGVycHJpc2U/OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgaWYgKFxuICAgICAgISh3aW5kb3cgYXMgYW55KVt0aGlzLmdldENhbGxiYWNrTmFtZSh1c2VFbnRlcnByaXNlKV0gfHxcbiAgICAgICEod2luZG93IGFzIGFueSlbdGhpcy53aW5kb3dHcmVjYXB0Y2hhXVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICB1c2VFbnRlcnByaXNlICYmXG4gICAgICAod2luZG93IGFzIGFueSlbdGhpcy53aW5kb3dHcmVjYXB0Y2hhXVt0aGlzLndpbmRvd0dyZWNhcHRjaGFFbnRlcnByaXNlXVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAvLyBpZiBvbmx5IGVudGVycHJpc2Ugc2NyaXB0IGlzIGxvYWRlZCB3ZSBuZWVkIHRvIGNoZWNrIHNvbWUgdjMncyBtZXRob2RcbiAgICB9IGVsc2UgaWYgKCh3aW5kb3cgYXMgYW55KVt0aGlzLndpbmRvd0dyZWNhcHRjaGFdLmV4ZWN1dGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBnbG9iYWwgY2FsbGJhY2sgbmFtZVxuICAgKiBAcGFyYW0gdXNlRW50ZXJwcmlzZSBPcHRpb25hbCBmbGFnIGZvciBlbnRlcnByaXNlIHNjcmlwdFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRDYWxsYmFja05hbWUodXNlRW50ZXJwcmlzZT86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIHJldHVybiB1c2VFbnRlcnByaXNlXG4gICAgICA/IHRoaXMud2luZG93T25Mb2FkRW50ZXJwcmlzZUNhbGxiYWNrUHJvcGVydHlcbiAgICAgIDogdGhpcy53aW5kb3dPbkxvYWRDYWxsYmFja1Byb3BlcnR5O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgbGFuZ3VhZ2UgcGFyYW0gdXNlZCBpbiBzY3JpcHQgdXJsXG4gICAqL1xuICBwcml2YXRlIGdldExhbmd1YWdlUGFyYW0oaGw/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghaGwpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIHJldHVybiBgJmhsPSR7aGx9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcmwgdG8gZ29vZ2xlIGFwaSBzY3JpcHRcbiAgICovXG4gIHByaXZhdGUgZ2V0Q2FwdGNoYVNjcmlwdFVybChcbiAgICBjb25maWc6IFJlY2FwdGNoYUNvbmZpZ3VyYXRpb24sXG4gICAgcmVuZGVyOiBzdHJpbmcsXG4gICAgbGFuZ3VhZ2U/OiBzdHJpbmdcbiAgKTogc3RyaW5nIHtcbiAgICBjb25zdCBkb21haW4gPSBjb25maWcudXNlR2xvYmFsRG9tYWluXG4gICAgICA/IHRoaXMuZ2xvYmFsRG9tYWluXG4gICAgICA6IHRoaXMuZGVmYXVsdERvbWFpbjtcbiAgICBjb25zdCBhcGkgPSBjb25maWcudXNlRW50ZXJwcmlzZSA/IHRoaXMuZW50ZXJwcmlzZUFwaSA6IHRoaXMuZGVmYXVsdEFwaTtcbiAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuZ2V0Q2FsbGJhY2tOYW1lKGNvbmZpZy51c2VFbnRlcnByaXNlKTtcblxuICAgIHJldHVybiBgaHR0cHM6Ly93d3cuJHtkb21haW59L3JlY2FwdGNoYS8ke2FwaX0/b25sb2FkPSR7Y2FsbGJhY2t9JnJlbmRlcj0ke3JlbmRlcn0ke3RoaXMuZ2V0TGFuZ3VhZ2VQYXJhbShcbiAgICAgIGxhbmd1YWdlXG4gICAgKX1gO1xuICB9XG59XG4iXX0=