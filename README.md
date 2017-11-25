# react-hoc-loading
![Travis][travis-badge] [![Coverage Status][coveralls-badge]][coveralls] [![Maintainability][codeclimate-badge]][codeclimate] ![Dependencies][dependencies-badge]

HOC to set React components to be loading. Aimed at reusing code for the common pattern of showing a loading image/message when an asynchronous operation is running and a component depends on it.

## Install

```bash
npm install --save react-hoc-loading
```

## Use

With [decorators][decorators].

```javascript
import Loading from 'react-hoc-loading';
import React from 'react';

@Loading({ LoadingComponent: <span>Loading...</span> })
class MyComponent extends React.Component {
  render() {
    return (
      <div>
        {this.renderLoading()}
       </div>
    );
  }
}

<MyComponent loading={false}> // <div></div>
<MyComponent loading> // <div><span>Loading...</span></div>
```

#### Set a default `LoadingComponent` globally with `.setDefaultLoadingComponent`

```javascript
Loading.setDefaultLoadingComponent(() => <img src="loading.gif" />);

@Loading()
class MyComponent extends React.Component { ... }

<MyComponent loading> // <div><img src="loading.gif" /></div>
```

#### Use different CSS classes for different components with the `className` option

```javascript
Loading.setDefaultLoadingComponent(className => <img className={className} src="loading.gif" />);

@Loading({ className: "my-class" })
class MyComponent extends React.Component { ... }

<MyComponent loading> // <div><img className="my-class" src="loading.gif" /></div>
```

#### Pass props to the `LoadingComponent` when calling `this.renderLoading`

```javascript
Loading.setDefaultLoadingComponent((message, className) => (
  <div>
    <div>
      <img className={className} src="loading.gif" />
     </div>
    <p>{message}</p>
  </div>
));

@Loading({ className: 'my-class' })
class MyComponent extends React.Component {
  render() {
    return (
      <div>
        { this.renderLoading({ message: 'Fetching data from the server', className: 'my-other-class' }) }
      </div>
    );
  }
}

<MyComponent loading>
// Will render
<div>
  <div>
    <img className="my-other-class" src="loading.gif" />
  </div>
  <p>Fetching data from the server</p>
</div>
```

*Note:* The `className` prop passed to `this.renderLoading` overrides the `className` option.

## Reference

#### `Loading`

```javascript 
(options: LoadingOptions) => (Component: React.ComponentType<any>) => React.ComponentType<any>
```

A function that takes some `options` and returns a HOC that will extend `Component` with the `renderLoading` method.

#### `#renderLoading`

```javascript
(props: object) => React.Element<typeof LoadingComponent>
```

It is a method of the extended component returned by `Loading()()`. Returns the `LoadingComponent` element if `this.props.loading` is true. The `className` passed to `renderLoading` will override the one passed in `LoadingOptions`.

#### `LoadingOptions`

```javascript
type LoadingOptions = {
  LoadingComponent: React.ComponentType<any>?,
  className: string?,
  loadingPropOptional: boolean,
  fullDisplayName: boolean
};
```

|Option|Default|Description|
|-|-|-|
|`LoadingComponent`|Set with `Loading.setDefaultLoadingComponent`|The component that will be rendered when calling `renderLoading`|
|`className`|`undefined`|A CSS class that will be passed to the component rendered with `renderLoading`|
|`loadingPropOptional`|`false`|Makes the `loading` property of the resulting `Component` optional instead of required using PropTypes|
|`fullDisplayName`|`false`|If true the `displayName` of the resulting component will be `'Loadable(Component)'` instead of `'Component'`|

#### `Loading.setDefaultLoadingComponent`

```javascript
(DefaultComponent: React.ComponentType<any>) => void
```

Sets the default `LoadingComponent` option globally.

#### `Loading.setDefaultBaseComponent`

```javascript
(DefaultBaseComponent: React.ComponentType<any>) => void
```

Sets the default component passed to the HOC as its first argument. Be default it is `React.PureComponent`, but you will  always pass your own component to the HOC unless you're doing something funky.

[coveralls]: https://coveralls.io/github/MarcoScabbiolo/react-hoc-loading?branch=master
[coveralls-badge]: https://coveralls.io/repos/github/MarcoScabbiolo/react-hoc-loading/badge.svg?branch=master
[travis-badge]: https://travis-ci.org/MarcoScabbiolo/react-loading-hoc.svg?branch=master
[dependencies-badge]: https://david-dm.org/MarcoScabbiolo/react-hoc-loading.svg
[codeclimate-badge]: https://api.codeclimate.com/v1/badges/a7b8a58c28791334fc94/maintainability
[codeclimate]: https://codeclimate.com/github/MarcoScabbiolo/react-hoc-loading/maintainability
[decorators]: https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841
