const React = require('react');
const PropTypes = require('prop-types');

const ownSymbol = key => Symbol(`react-hoc-loading/${key}`);

const defaultBaseComponent = ownSymbol('default-base-component');
const defaultLoadingComponent = ownSymbol('default-loading-component');

function LoadingHOC(
  {
    LoadingComponent,
    className,
    loadingPropOptional = false,
    fullDisplayName = false
  } = {}
) {
  LoadingComponent = LoadingComponent || LoadingHOC[defaultLoadingComponent];

  return function(Component = LoadingHOC[defaultBaseComponent]) {
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

LoadingHOC[defaultLoadingComponent] = () => React.createElement('div', null, 'Loading');

LoadingHOC[defaultBaseComponent] = React.PureComponent;

LoadingHOC.setDefaultBaseComponent = function(Component) {
  LoadingHOC[defaultBaseComponent] = Component;
};
LoadingHOC.setDefaultLoadingComponent = function(Component) {
  LoadingHOC[defaultLoadingComponent] = Component;
};

module.exports = LoadingHOC;
