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

          .active button {
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


          .active .outer-spinner {
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

          .active .inner-spinner {
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
    button: HTMLButtonElement;

    constructor() {
      super();
      const shadow = this.attachShadow({mode: 'open'});
      const container = document.createElement('div');
      container.innerHTML = template;
      shadow.appendChild(container);
      const button = container.getElementsByTagName('button')[0];
      this.button = button;
      const outerSpinner = container.getElementsByClassName('outer-spinner')[0] as HTMLDivElement;
      const innerSpinner = container.getElementsByClassName('inner-spinner')[0] as HTMLDivElement;
      const spinnerWrappers = Array.from(container.getElementsByClassName('spinner-wrapper') as HTMLCollectionOf<HTMLDivElement>);

      function reshape() {
        container.classList.add('active');
        const height = button.clientHeight;
        const width = button.clientWidth;
        spinnerWrappers.forEach((wrapper) => {
          wrapper.style.minHeight = `${height}px`;
          wrapper.style.height = `${height}px`;
          wrapper.style.maxHeight = `${height}px`;

          wrapper.style.minWidth = `${width}px`;
          wrapper.style.width = `${width}px`;
          wrapper.style.maxWidth = `${width}px`;
        });

        button.style.minHeight = `${height}px`;
        button.style.maxHeight = `${height}px`;
        // important for transition to work
        button.style.width = `${width}px`;
        // important for the spinner to stay in the center
        // if we don't do this, container size will change
        container.style.minWidth = `${width}px`;
        container.style.width = `${width}px`;
        container.style.maxWidth = `${width}px`;
        button.style.width = `${height}px`;
        button.style.padding = '0px';

        const outerSpinnerSize = height * 0.8;
        outerSpinner.style.height = `${outerSpinnerSize}px`;
        outerSpinner.style.width = `${outerSpinnerSize}px`;

        const innerSpinnerSize = height * 0.5;
        innerSpinner.style.height = `${innerSpinnerSize}px`;
        innerSpinner.style.width = `${innerSpinnerSize}px`;
        button.removeEventListener('click', reshape);
      }

      button.addEventListener('click', reshape);
    }


    static observedAttributes = ['disabled'];

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name === 'disabled') {
        if (newValue !== null && newValue !== 'false') {
          this.button.setAttribute('disabled', '');
          this.button.style.cursor = 'not-allowed';
        } else if (newValue === null || newValue === 'false') {
          this.button.removeAttribute('disabled');
          this.button.style.cursor = 'pointer';
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
