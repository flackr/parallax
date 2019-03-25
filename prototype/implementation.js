((scope) => {
	'use strict';

	const STICKY_POSITION = CSS.supports('position', 'sticky')
		? 'sticky'
		: CSS.supports('position', '-webkit-sticky')
		? '-webkit-sticky'
		: '';

	const USES_STICKY = STICKY_POSITION != '';

	// TODO: Support parallax using perspective.
	if (!USES_STICKY) {
		return;
	}

	class ParallaxContainer extends HTMLElement {
		constructor() {
			super();
		}

		connectedCallback() {
			this.style.display = 'block';
			this.style.position = 'relative';
			this.style.perspective = '1px';
			this.style.perspectiveOrigin = '0% 0%';
		}
	}

	class ParallaxContent extends HTMLElement {
		static get observedAttributes() {
			return ['rate'];
		}
		constructor() {
			super();
			this.resizeCallback_ = this.updateSize_.bind(this);
		}

		connectedCallback() {
			this.style.display = 'block';
			this.style.position = STICKY_POSITION;
			this.style.top = '0';
			this.style.transformOrigin = '0% 0% 0px';
			this.updateSize_();
			// TODO: Use ResizeObserver on own element when available.
			window.addEventListener('resize', this.resizeCallback_);
		}

		disconnectedCallback() {
			window.removeEventListener('resize', this.resizeCallback_);
		}

		attributeChangedCallback(name, oldValue, newValue) {
			let rate = parseFloat(newValue);
			if (rate <= 0) throw new DOMException('Parallax only supports rates between 0 and 1');
			let depth = 1 / (1 - 1 / rate);
			this.style.transform = 'scale(' + (1 - depth) + ') translateZ(' + depth + 'px)';
		}

		updateSize_() {
			// TODO: Support horizontal and writing mode dependent parallax.
			this.style.bottom = 'calc(100% - ' + this.offsetHeight + 'px)';
		}
	}

	scope.ParallaxContainer = ParallaxContainer;
	scope.ParallaxContent = ParallaxContent;
	scope.customElements.define('parallax-container', ParallaxContainer);
	scope.customElements.define('parallax-content', ParallaxContent);
})(self);
