export function registerSpinnerButtonComponent(name: string = 'app-spinner-button') {

  /**
   * A spinner button
   *
   * primary-color - the color of the text. Default is white;
   * secondary-color - the color of the background. Default is #1AAFD0;
   * border-color - the color of the border. Default is transparet;
   *
   */

    // language=html
  const template = `
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
          }

          .container {
            display: grid;
            place-items: center;
            position: relative;
          }

          button {
            background-color: var(--secondary-color);
            border: 1px solid var(--border-color);
            border-radius: 5px;
            cursor: pointer;
            color: var(--primary-color);
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
            border-color: var(--primary-color) transparent var(--primary-color) transparent;
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
              border-color: var(--primary-color) transparent var(--primary-color) transparent;
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

    updateProperties() {
      this.style.setProperty(
        '--primary-color',
        this.getAttribute('primary-color') || 'white');
      this.style.setProperty(
        '--secondary-color',
        this.getAttribute('secondary-color') || '#1AAFD0');
      this.style.setProperty(
        '--border-color',
        this.getAttribute('border-color') || 'transparent');
    }

    connectedCallback() {
      this.updateProperties();
    }

    static observedAttributes = ['primary-color', 'secondary-color', 'border-color', 'disabled'];

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name === 'disabled') {
        if (oldValue === null && newValue !== null) {
          this.button.setAttribute('disabled', '');
          this.button.style.cursor = 'not-allowed';
        } else if (oldValue !== null && newValue == null) {
          this.button.removeAttribute('disabled');
          this.button.style.cursor = 'pointer';
        }
      } else {
        this.updateProperties();
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
