(function custom_accent() {
    "use strict";

    const ACCENT = {
        'example.com': '#FFFFFF'
    }

    const WHITE = chroma('#FFF');
    const BLACK = chroma('#000');

    class CustomAccent {
        constructor() {
            this.#changeAccent();
            chrome.tabs.onActivated.addListener(() => {this.#changeAccent()});
            chrome.tabs.onUpdated.addListener(() => {this.#changeAccent()});
            vivaldi.historyPrivate.onVisitModified.addListener(() => {this.#changeAccent()});
        }

        // actions

        async #changeAccent() {
            if (!(this.#host in ACCENT)) {
                this.#fixAccentFg();
                return;
            }

            const accentBg = chroma(ACCENT[this.#host]);
            const isBright = accentBg.luminance() > 0.4;

            this.#setColor('--colorAccentBg', accentBg);
            this.#setColor('--colorAccentBgDark', accentBg.darken(.4));
            this.#setColor('--colorAccentBgDarker', accentBg.darken(1));
            this.#setColor('--colorAccentBgAlpha', accentBg.alpha(isBright ? .45 : .55));
            this.#setColor('--colorAccentBgAlphaHeavy', accentBg.alpha(isBright ? .25 : .35));

            this.#setColor('--colorAccentFg', isBright ? BLACK : WHITE);
            this.#setColor('--colorAccentFgAlpha', accentBg.alpha(.15));
            this.#setColor('--colorAccentFgAlphaHeavy', accentBg.alpha(.05));
        }

        #fixAccentFg() {
            const accentBg = this.#getColor('--colorAccentBg') ;
            const isBright = chroma(accentBg).luminance() > 0.4;
            this.#setColor('--colorAccentFg', isBright ? BLACK : WHITE);
        }

        #getColor(property) {
            return chroma(this.#browser.style.getPropertyValue(property));
        }

        #setColor(property, color) {
            this.#browser.style.setProperty(property, color.css());
        }
        

        // getters

        get #browser() {
            return document.querySelector('#browser');
        }

        get #urlFieldInput() {
            return document.querySelector('#urlFieldInput');
        }

        get #host() {
            return vivaldi.utilities.getUrlFragments(this.#urlFieldInput.value).host;
        }
    };

    var interval = setInterval(() => {
        if (document.querySelector('#browser')) {
            window.customAccent = new CustomAccent();
            clearInterval(interval);
        }
    }, 100);
})();
