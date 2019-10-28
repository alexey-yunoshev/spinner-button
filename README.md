# Spinner button web component

![Spinner demo](demo/demo.gif)

Attributes:
* **primary-color** the color of the border and text. Default is white;
* **secondary-color** the color of the background. Default is #1AAFD0;

### Examples

#### With ES modules
```html
<!doctype html>
<html>
<head>
  <title>Example</title>
  <script type="module">
      import {registerSpinnerButtonComponent} from "./node_modules/@ayunoshev/spinner-button/dist/index.js";

      registerSpinnerButtonComponent();
      registerSpinnerButtonComponent('spinner-button');
  </script>
</head>
<body  style="background-color: black;
              display: grid;
              grid-template-columns: repeat(2, max-content);
              grid-gap: 20px">

<app-spinner-button id="btn">call api</app-spinner-button>
<spinner-button primary-color="#c3003a" secondary-color="black">submit</spinner-button>

<script>
    document.getElementById('btn').addEventListener('click', () => {
        console.log('doing something async...')
    });
</script>

</body>
</html>
```

#### With Angular
In `main.ts`: 
```typescript
import {registerSpinnerButtonComponent} from '@ayunoshev/spinner-button';

registerSpinnerButtonComponent();
```

And then in the module in which you're going to use the component:
```typescript
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class SomeModule {
}
```
