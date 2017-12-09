const React = require('react');
const PropTypes = require('prop-types');

var defaultLoadingComponent = () => React.createElement('div', null, 'Loading');
var defaultBaseComponent = React.PureComponent;

function LoadingHOC(
  {
    LoadingComponent,
    className,
    loadingPropOptional = false,
    fullDisplayName = false
  } = {}
) {
  LoadingComponent = LoadingComponent || defaultLoadingComponent;

  return function(Component = defaultBaseComponent) {
    const Loading = class extends Component {
      renderLoading(props = {}) {
        if (this.props.loading) {
          return React.createElement(
            LoadingComponent,
            Object.assign(props, { className: props.className || className })
          );
        }
        return undefined;
      }
    };

    // Add loading PropType
    Loading.propTypes = Object.assign(Component.propTypes || {}, {
      loading: loadingPropOptional ? PropTypes.bool : PropTypes.bool.isRequired
    });

    // Change the display name
    let displayName = Component.displayName || Component.name;
    Loading.displayName = fullDisplayName ? `Loading(${displayName})` : displayName;

    return Loading;
  };
}

LoadingHOC.getDefaultBaseComponent = function() {
  return defaultBaseComponent;
};
LoadingHOC.setDefaultBaseComponent = function(Component) {
  defaultBaseComponent = Component;
};
LoadingHOC.getDefaultLoadingComponent = function() {
  return defaultLoadingComponent;
};
LoadingHOC.setDefaultLoadingComponent = function(Component) {
  defaultLoadingComponent = Component;
};

module.exports = LoadingHOC;
