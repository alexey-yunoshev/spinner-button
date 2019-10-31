export function registerSpinnerButtonComponent(name: string = 'app-spinner-button') {

    // language=html
  const template = `
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
          }

          .container {
            --_background-color: var(--spinner-button-background-color, #232f3e);
            --_background-color--disabled: var(--spinner-button-background-color--disabled, #3b4b5a);
            --_border-color: var(--spinner-button-border-color, transparent);
            --_text-color: var(--spinner-button-text-color, #e5e5e5);
            --_text-color--disabled: var(--spinner-button-text-color--disabled, #576a7c);
            --_outer-spinner-color: var(--spinner-button-outer-spinner-color, #e5e5e5);
            --_inner-spinner-color: var(--spinner-button-inner-spinner-color, #e5e5e5);
            display: grid;
            place-items: center;
            position: relative;
          }

          button {
            background-color: var(--_background-color);
            border: 1px solid var(--_border-color);
            border-radius: 5px;
            cursor: pointer;
            color: var(--_text-color);;
            font-family: Roboto, "Helvetica Neue", sans-serif;
            font-size: 14px;
            font-weight: 600;
            height: 100%;
            outline: none;
            padding: 9px 19px;
            position: relative;
            transition: all 250ms, color 0s;
            width: 100%;
          }

          button[disabled] {
            background-color: var(--_background-color--disabled);
            color: var(--_text-color--disabled);
          }

          [active] button {
            border-radius: 50%;
            border-color: transparent;
            color: transparent;
            font-size: 0;
          }

          .spinner-wrapper {
            display: grid;
            height: 0;
            left: 0;
            place-items: center;
            position: absolute;
            top: 0;
            width: 0;
          }

          .outer-spinner {
            animation: outer .6s linear infinite;
            border-radius: 50%;
            border-width: 2px;
            border-style: solid;
            border-color: transparent;
            height: 0;
            transition: all 450ms;
            width: 0;
          }


          [active] .outer-spinner {
            border-color: var(--_outer-spinner-color) transparent var(--_outer-spinner-color) transparent;
          }

          .inner-spinner {
            animation: inner 1s linear infinite;
            border-style: solid;
            border-width: 1px;
            border-radius: 50%;
            border-color: transparent;
            display: block;
            transition: all 450ms;
            width: 0;
          }

          [active] .inner-spinner {
            border-color: var(--_inner-spinner-color) transparent var(--_inner-spinner-color) transparent;
          }

          @keyframes outer {
            0% {
              transform: rotate(0) scale(1);
            }
            100% {
              transform: rotate(360deg) scale(1);
            }
          }

          @keyframes inner {
            0% {
              transform: rotate(0) scale(1);
            }
            100% {
              transform: rotate(-360deg) scale(1);
            }
          }
        </style>

        <div class="container">
          <button>
            <slot></slot>
          </button>
          <div class="spinner-wrapper">
            <div class="outer-spinner">
            </div>
          </div>
          <div class="spinner-wrapper">
            <div class="inner-spinner">
            </div>
          </div>
        </div>
    `;

  class AppSpinnerButton extends HTMLElement {
    container: HTMLDivElement;
    button: HTMLButtonElement;
    outerSpinner: HTMLDivElement;
    innerSpinner: HTMLDivElement;
    spinnerWrappers: HTMLDivElement[];

    height = 0;
    width = 0;

    constructor() {
      super();
      const shadow = this.attachShadow({mode: 'open'});
      this.container = document.createElement('div');
      this.container.innerHTML = template;
      shadow.appendChild(this.container);
      this.button = this.container.getElementsByTagName('button')[0];
      this.outerSpinner = this.container.getElementsByClassName('outer-spinner')[0] as HTMLDivElement;
      this.innerSpinner = this.container.getElementsByClassName('inner-spinner')[0] as HTMLDivElement;
      this.spinnerWrappers = Array.from(this.container.getElementsByClassName('spinner-wrapper') as HTMLCollectionOf<HTMLDivElement>);
      this.button.addEventListener('click', this.activate.bind(this));
    }

    connectedCallback() {
      this.height = this.button.clientHeight;
      this.width = this.button.clientWidth;
      const height = this.height;
      // + 2 because of border width
      const width = this.width + 2;
      // important for the spinner to stay in the center
      // if we don't do this, container size will change
      this.container.style.minWidth = `${width}px`;
      this.container.style.width = `${width}px`;
      this.container.style.maxWidth = `${width}px`;
      //
      this.button.style.minHeight = `${height}px`;
      this.button.style.maxHeight = `${height}px`;
      //
      // // important for transition to work
      this.button.style.width = `${width}px`;
      //

    }

    activate() {
      const hasAttributeActive = this.getAttribute('active');
      if (hasAttributeActive === null) {
        this.setAttribute('active', '');
      }
      this.container.setAttribute('active', '');

      const height = this.height;
      const width = this.width + 2;

      this.spinnerWrappers.forEach((wrapper) => {
        wrapper.style.minHeight = `${height}px`;
        wrapper.style.height = `${height}px`;
        wrapper.style.maxHeight = `${height}px`;

        wrapper.style.minWidth = `${width}px`;
        wrapper.style.width = `${width}px`;
        wrapper.style.maxWidth = `${width}px`;
      });

      this.button.style.width = `${height}px`;
      this.button.style.padding = '0px';

      const outerSpinnerSize = height * 0.8;
      this.outerSpinner.style.height = `${outerSpinnerSize}px`;
      this.outerSpinner.style.width = `${outerSpinnerSize}px`;

      const innerSpinnerSize = height * 0.5;
      this.innerSpinner.style.height = `${innerSpinnerSize}px`;
      this.innerSpinner.style.width = `${innerSpinnerSize}px`;
      this.button.removeEventListener('click', this.activate);
    }

    disactivate() {
      this.removeAttribute('active');
      this.container.removeAttribute('active');

      const width = this.width + 2;

      this.button.style.width = `${width}px`;
      this.button.style.padding = '9px 19px';

      this.outerSpinner.style.height = `0px`;
      this.outerSpinner.style.width = `0px`;

      this.innerSpinner.style.height = `0px`;
      this.innerSpinner.style.width = `0px`;

      this.button.addEventListener('click', this.activate.bind(this));

      // should wait for the spinner to disappear
      // otherwise looks ugly
      setTimeout(() => {
        this.spinnerWrappers.forEach((wrapper) => {
          wrapper.style.minHeight = `0px`;
          wrapper.style.height = `0px`;
          wrapper.style.maxHeight = `0px`;
          wrapper.style.minWidth = `0px`;
          wrapper.style.width = `0px`;
          wrapper.style.maxWidth = `0px`;
        });
      }, 300);
    }


    static observedAttributes = ['disabled', 'active'];

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name === 'disabled') {
        if (newValue !== null && newValue !== 'false') {
          this.button.setAttribute('disabled', '');
          this.button.style.cursor = 'default';
        } else if (newValue === null || newValue === 'false') {
          this.button.removeAttribute('disabled');
          this.button.style.cursor = 'pointer';
        }
      } else if (name === 'active') {
        if (newValue !== null && newValue !== 'false') {
          this.activate();
        } else if (newValue === null || newValue === 'false') {
          this.disactivate();
        }
      }
    }

    disconnectedCallback() {
      // TODO remove event listener from button to avoid memory leak
    }

  }

  try {
    customElements.define(name, AppSpinnerButton);
  } catch (e) {
    throw new Error(e);
  }
}
