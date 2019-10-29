export function registerSpinnerButtonComponent(name: string = 'app-spinner-button') {

  /**
   * A spinner button
   *
   * primary-color - the color of the border and text. Default is white;
   * secondary-color - the color of the background. Default is #1AAFD0;
   *
   */

  class AppSpinnerButton extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({mode: 'open'});
      const container = document.createElement('div');
      const style = document.createElement('style');
      // language=css
      style.textContent = `
          * {
              box-sizing: border-box;
              margin: 0;
          }

          div {
              display: grid;
              place-items: center;
              width: fit-content;
          }

          button {
              background-color: var(--secondary-color);
              border: 1px solid var(--primary-color);
              border-radius: 5px;
              cursor: pointer;
              color: var(--primary-color);
              font-family: Helvetica, sans-serif;
              font-weight: bold;
              outline: none;
              padding: 5px 10px;
              position: relative;
              text-transform: uppercase;
              transition: all 250ms, color 0s;
              width: fit-content;
          }

          .active {
              border-radius: 50%;
              border-color: transparent;
              color: transparent;
              font-size: 0;
          }

          button::after {
              animation: outer .7s linear infinite;
              content: " ";
              border-radius: 50%;
              border-width: 2px;
              border-style: solid;
              border-color: transparent;
              display: block;
              left: 45%;
              /* Some hack to make height equal to the percentage we specified */
              padding-bottom: 0;
              position: absolute;
              top: 25%;
              transition: all 450ms;
              width: 0;
          }


          button.active::after {
              --size: 65%;
              left: 9%;
              border-color: var(--primary-color) transparent var(--primary-color) transparent;
              padding-bottom: var(--size);
              top: 7%;
              width: var(--size);
          }

          button::before {
              animation: inner 1s linear infinite;
              content: " ";
              border-style: solid;
              border-width: 1px;
              border-radius: 50%;
              border-color: transparent;
              display: block;
              left: 45%;
              padding-bottom: 0;
              position: absolute;
              top: 25%;
              transition: all 450ms;
              width: 0;
          }

          button.active::before {
              --size: 47%;
              left: 22%;
              border-color: var(--primary-color) transparent var(--primary-color) transparent;
              padding-bottom: var(--size);
              top: 21%;
              width: var(--size);
          }

          @keyframes outer {
              0% {
                  transform: rotate(0) scale(1);
              }
              50% {
                  transform: rotate(180deg) scale(1.15);
              }
              100% {
                  transform: rotate(360deg) scale(1);
              }
          }

          @keyframes inner {
              0% {
                  transform: rotate(0) scale(1);
              }
              50% {
                  transform: rotate(-180deg) scale(0.9);
              }
              100% {
                  transform: rotate(-360deg) scale(1);
              }
          }
      `;
      shadow.appendChild(style);
      const button = document.createElement('button');

      /**
       * Trying hard to make our spinner stay where it should
       * Regrettably, even then the whole thing stays rather brittle
       */
      function reshape() {
        button.classList.add('active');
        button.style.minHeight = `${button.clientHeight}px`;
        button.style.maxHeight = `${button.clientHeight}px`;
        // important for transition to work
        button.style.width = `${button.clientWidth}px`;
        // important for the spinner to stay in the center
        container.style.minWidth = `${button.clientWidth}px`;
        container.style.width = `${button.clientWidth}px`;
        container.style.maxWidth = `${button.clientWidth}px`;

        button.style.width = `${button.clientHeight + 2}px`;
        button.style.maxWidth = `${button.clientWidth + 2}px`;
        button.removeEventListener('click', reshape);
      }
      button.addEventListener('click', reshape);
      button.appendChild(document.createElement('slot'));
      container.appendChild(button);
      shadow.appendChild(container);
    }

    connectedCallback() {
      this.style.setProperty(
        '--primary-color',
        this.getAttribute('primary-color') || 'white');
      this.style.setProperty(
        '--secondary-color',
        this.getAttribute('secondary-color') || '#1AAFD0');
    }
  }

  try {
    customElements.define(name, AppSpinnerButton);
  } catch (e) {
    throw new Error(e);
  }
}
