# react-component-console [![CircleCI](https://circleci.com/gh/haensl/react-component-console.svg?style=svg)](https://circleci.com/gh/haensl/react-component-console)

A console emulator component for React.

[![NPM](https://nodei.co/npm/react-component-console.png?downloads=true)](https://nodei.co/npm/react-component-console/)

[![npm version](https://badge.fury.io/js/react-component-console.svg)](http://badge.fury.io/js/react-component-console)

## Features

* Highly customizable console emulator
* Callbacks

## Quick start

1. Install the `react-component-console` dependency

```bash
npm i -S react-component-console
```

or

```bash
yarn add react-component-console
```

2. Use it in your React app
```javascript
import Console from 'react-component-console';
// ...

class MyComponent extends React.Component {
  // ...

  render() {
    return (
      <Console lines={[
        'Hi!',
        'How are you today?'
      ]} />
    );
  }
}

export default MyComponent;
```

## Customize

The following properties let you customize component behaviour.

- [lines](#lines): The the text to write.
- [callbacks](#callbacks): Supply callbacks for written line(s).
  - [onFinishWritingLine](#callbacks.line): Callback for individual lines.
  - [onFinishWritingLines](#callbacks.lines): Callback for all lines.
- [console](#console): Customize Console behaviour.
  - [append](#console.append): Whether or not to append lines.
  - [typing](#console.typing): Customize how the Console types text.
    - [char](#console.typing.char): Customize how the Console types single characters.
    - [line](#console.typing.line): Customize how the Console handles line breaks.
  - [styling/CSS classes](#console.classes): Customize CSS class names to use for the Console component.
- [line](#line): Customize the Line component.
    - [styling/CSS classes](#line.classes): Customize CSS class names used for the Line component.
- [ps1](#ps1): Customize the PS1 component.
    - [styling/CSS classes](#ps1.classes): Customize CSS class names used for the PS1 component.
    - [content](#ps1.content): Customize the content rendered as PS1.
- [cursor](#cursor): Customize the Cursor component.
    - [styling/CSS classes](#cursor.classes): Customize CSS class names used for the Cursor component.
    - [blinking](#cursor.intervalMs): Customize if/how fast the Cursor blinks.

### <a id="lines"></a>Lines `lines`
Specify the string or array of strings to write.

#### Example

```javascript
<Console lines={[
  'Hi!',
  'How are you today?'
]} />
```

### <a id="callbacks"></a>Callbacks

#### <a id="callbacks.line"></a> `onFinishWritingLine`
Provide a callback which is called for every line that was written. The callback receives the line as parameter.

##### Example

```javascript
<Console
  lines={[
    'Hi!',
    'How are you today?'
  ]}
  onFinishWritingLine={
    (line) => {
      console.info('Console has finished writing line', line);
    }
  }
/>
```

#### <a id="callback.lines"></a> `onFinishWritingLines`
Provide a callback which is called when all lines have been written. The callback receives the lines as parameter.

##### Example

```javascript
<Console
  lines={[
    'Hi!',
    'How are you today?'
  ]}
  onFinishWritingLines={
    (lines) => {
      console.info('Console has finished writing all lines', line);
    }
  }
/>
```
### <a id="console"></a>Console `console`
The console property lets you customize console behaviour.

#### <a id="console.append"></a>Appending `console.append`
Set this property to `true` to append lines instead of writing them one by one.

#### <a id="console.typing"></a>Typing `console.typing`

`react-component-console` features highly cusomizable human-like typing behaviour. The following options let you fine tune typing the way you want.

#### <a id="console.typing.char"></a>`console.typing.char`

This object lets you specify typing behaviour concerning a single character. For every character a new delay is calculated depending on the average character delay and a deviation. If you, e.g. specify an average delay of 100ms and a deviation of 0.2 (or 20%), you end up with character typing delays between 80ms and 120ms.

##### Signature
```javascript
{
  avgMs: 150, // average milliseconds to type a character
  deviation: 0.3, // deviation to apply to avgMs
  minMs: 50, // minimum milliseconds to type a character
  maxMs: Number.MAX_SAFE_INTEGER // maximum milliseconds to type a character
}
```

##### Example
```javascript
<Console
  lines={[
    'Hi!',
    'How are you today?'
  ]}
  console={{
    typing: {
      char: {
        avgMs: 100, // 100 ms average time to write a character
        deviation: 0.2, // deviate typing delay by 20 %
        minMs: 80 // take at least 80ms to write a character
      }
    }
  }}
/>
```

#### <a id="console.typing.line"></a>`console.typing.line`

This object lets you specify details concerning typing of a line. It works analogous to [`console.typing.char`](#console.typing.char) in the sense that you specify the average delay between lines (i.e. how long it takes to hit the return button) and a deviation from this average.

##### Signature
```javascript
{
  delay: {
    avgMs: 1000, // average delay between lines in milliseconds, i.e. time to hit return
    deviation: 0.3, // deviation to apply to avgMs
    minMs: 50, // minimum delay between lines in milliseconds
    maxMs: Number.MAX_SAFE_INTEGER // maximum delay between lines in milliseconds
}
```

##### Example
```javascript
<Console
  lines={[
    'Hi!',
    'How are you today?'
  ]}
  console={{
    typing: {
      line: {
        avgMs: 600, // 600 ms average delay between lines
        deviation: 0.2, // deviate line delay by 20 %
        minMs: 500 // delay at least by 500ms to between lines
      }
    }
  }}
/>
```

#### Styles/CSS-classes
The Console component uses standard CSS classes for styles. You can overwrite any styles in your own stylesheets and you can supply your own class names as well.

#### <a id="console.classes"></a>`console.classes`
Use this object to customize Console component class names.

##### Signature
```javascript
{
  classes: {
    element: 'Console' // class name assigned to the wrapping element
  }
}
```

##### Example
```javascript
<Console
  lines={[
    'Hi!',
    'How are you today?'
  ]}
  console={{
    classes: {
      element: 'My-Console' // use .My-Console instead of the default .Console class name
    }
  }}
/>
```

### <a id="line"></a>Line

The `line` property lets you customize the Line component used by Console to render lines.

#### Styles/CSS-classes

#### <a id="line.classes"></a>`line.classes`
Use this object to customize class names of the Line component. You can overwrite any styles in your own stylesheets and you can supply your own class names.

##### Signature
```javascript
{
  classes: {
    element: 'Console-Line', // class name assigned to the Line element
    content: 'Console-Line-content' // class name assigned to the content, i.e. text, rendered in a line
  }
}
```

##### Example
```javascript
<Console
  lines={[
    'Hi!',
    'How are you today?'
  ]}
  line={{
    classes: {
      element: 'My-Line' // use .My-Line instead of the default .Console-Line class name
    }
  }}
/>
```

### <a id="ps1"></a>PS1

The `ps1` property lets you customize the PS1 component.

#### Styles/CSS classes

#### <a id="ps1.classes"></a>`ps1.classes`
Use this object to customize class names of the PS1 component. You can overwrite any styles in your own stylesheets and you can supply your own class names.

##### Signature
```javascript
{
  classes: {
    element: 'Console-PS1', // class name assigned to the PS1 element
  }
}
```

##### Example
```javascript
<Console
  lines={[
    'Hi!',
    'How are you today?'
  ]}
  ps1={{
    classes: {
      element: 'My-PS1' // use .My-PS1 instead of the default .Console-PS1 class name
    }
  }}
/>
```

#### Content

#### <a id="ps1.content"></a>`ps1.content`

Use this property to customize the PS1 content rendered in the Console.

##### Signature
```javascript
{
  content: '$' // display a dollar sign as PS1
}
```

##### Example
```javascript
<Console
  lines={[
    'Hi!',
    'How are you today?'
  ]}
  ps1={{
    content: '~' // display a tilde instead of the default dollar sign
  }}
/>
```

### <a id="cursor"></a>Cursor

The `cursor` property lets you customize the Cursor component rendered in the Console.

#### Styles/CSS classes

#### <a id="cursor.classes"></a>`cursor.classes`

Use this object to supply your own class names for the Cursor component. You can overwrite any styles in your own stylesheets and you can supply your own class names.

##### Signature
```javascript
{
  classes: {
    blink: 'Console-Cursor--blink', // class name to assign when the Cursor is blinking
    element: 'Console-Cursor', // class name to assign to the Cursor component
    write: 'Console-Cursor--write' // class name to assign when the Cursor is in writing state
  }
}
```

##### Example
```javascript
<Console
  lines={[
    'Hi!',
    'How are you today?'
  ]}
  cursor={{
    classes: {
      blink: 'My-Console-Cursor--isBlinking', // use this instead of the default for blinking state
      element: 'My-Console-Cursor', // use this instead of the default for the Cursor component
      write: 'My-Console-Cursor--isWriting' // use this instead of the default for writing state
    }
  }}
/>
```

#### Blink interval

#### <a id="cursor.intervalMs"></a>`cursor.intervalMs`

Use this property to specify how rapidly the Cursor should blink.

##### Signature
```javascript
{
  intervalMs: 400 // blink for 400ms on and off
}
```

##### Example
```javascript
<Console
  lines={[
    'Hi!',
    'How are you today?'
  ]}
  cursor={{
    intervalMs: 250 // blink faster then the default 400ms
  }}
/>
```

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
