# Spinner button web component

![Spinner demo](demo/demo.gif)

[Codepen](https://codepen.io/alexey-yunoshev/pen/ZEEJmKJ)


### Installation
```shell script
$ npm install @ayunoshev/spinner-button
```

### Usage
To stylize, pass some or all of the custom properties from the first example.
To activate spinner programmatically, use method `activate()`, to stop spinning -
`desactivate()`. See [Codepen](https://codepen.io/alexey-yunoshev/pen/ZEEJmKJ)


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
  <style>
    .my-style {
      --spinner-button-background-color: black;
      --spinner-button-background-color--disabled: black;
      --spinner-button-border-color: #FF1569;
      --spinner-button-text-color: #FF1569;
      --spinner-button-text-color--disabled: #1F1F1F;
      --spinner-button-inner-spinner-color: #FF1569;
      --spinner-button-outer-spinner-color: #FF1569;
    }
  </style>
</head>
<body
    style="background-color:black;
           display: grid;
           grid-template-columns: repeat(3, max-content);
           grid-gap: 20px">

<app-spinner-button id="btn">Call api</app-spinner-button>
<spinner-button class="my-style">Submit</spinner-button>

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

Inside some component template of that module:
```html
<app-spinner-button [attr.disabled]="!form.valid">Submit
</app-spinner-button>
```
