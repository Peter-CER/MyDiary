// <app-timeline> — wrapper for timeline
class AppTimeline extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.setAttribute('role', 'navigation');
        this.setAttribute('aria-label', 'Date timeline');
    }
}

// <app-main> — main wrapper for editor + média
class AppMain extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.setAttribute('role', 'main-content');
    }
}

// <nameday-info> — standalone nameday fetcher with Shadow DOM
class NamedayInfo extends HTMLElement {

    // Observe the 'date' attribute so attributeChangedCallback fires on change
    static get observedAttributes() {
        return ['date'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    // Register online/offline listeners and do the initial fetch when element is added to DOM
    connectedCallback() {
        this.onOnline = () => this.fetchData(this.getAttribute('date'));
        this.onOffline = () => this.renderOffline();
        window.addEventListener('online', this.onOnline);
        window.addEventListener('offline', this.onOffline);

        if (this.getAttribute('date')) {
            this.fetchData(this.getAttribute('date'));
        }
    }

    // Clean up listeners when element is removed from DOM
    disconnectedCallback() {
        window.removeEventListener('online', this.onOnline);
        window.removeEventListener('offline', this.onOffline);
    }

    // Re-fetch whenever the date attribute changes (e.g. user navigates to another day)
    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'date' && newVal && newVal !== oldVal) {
            this.fetchData(newVal);
        }
    }

    async fetchData(date) {
        if (!date) return;

        // Show offline message instead of fetching if browser has no connection
        if (!navigator.onLine) {
            this.renderOffline();
            return;
        }

        try {
            const res = await fetch(`https://svatkyapi.netlify.app/api/day/${date}`);
            const data = await res.json();
            this.renderName(data.name);
        } catch {
            // On error just render nothing
            this.shadow.innerHTML = '';
        }
    }

    // Render the name day result
    renderName(name) {
        this.shadow.innerHTML = `
            <style>
                :host { display: block; text-align: center; margin-bottom: 12px; }
                span { font-size: 1.5rem; font-weight: 600; color: #333; letter-spacing: 0.5px; }
            </style>
            <span>Name day: ${name}</span>
        `;
    }

    // Render the offline fallback message
    renderOffline() {
        this.shadow.innerHTML = `
            <style>
                :host { display: block; text-align: center; margin-bottom: 12px; }
                span { font-size: 1.2rem; font-weight: 400; color: #aaa; font-style: italic; }
            </style>
            <span>Go online to find who has namesday today</span>
        `;
    }
}

customElements.define('app-timeline', AppTimeline);
customElements.define('app-main', AppMain);
customElements.define('nameday-info', NamedayInfo);
