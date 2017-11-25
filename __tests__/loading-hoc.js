import React from 'react';
import PropTypes from 'prop-types';
import chai from 'chai';
import loading from '../index';
import reactTestUtils from 'react-dom/test-utils';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { exec } from 'child_process';

configure({ adapter: new Adapter() });

class TestClass extends React.Component {
  render() {
    return (
      <div>
        { this.renderLoading() }
      </div>
    );
  }
}

TestClass.propTypes = {
  prop: PropTypes.object
};

describe('loading-hoc', () => {
  test('exports', () => {
    chai.assert.isFunction(loading);
  });

  test('doesnt throw', () => {
    chai.assert.doesNotThrow(() => loading()());
  });

  describe('defaults', () => {
    const Loading = loading()(TestClass);

    test('creates an element', () => {
      chai.assert.ok(reactTestUtils.isElement(<Loading loading />));
    });

    test('renders it withouth loading', () => {
      let wrapper = shallow(<Loading loading={false} />);
      chai.expect(wrapper.children()).to.have.length(0);
    });

    test('renders it with loading', () => {
      let wrapper = shallow(<Loading loading />);
      chai.expect(wrapper.children()).to.have.length(1);
      chai.expect(wrapper.html()).to.equal('<div><div>Loading</div></div>');
    });

    describe('has the proper displayName', () => {
      test('by component name', () => {
        chai.expect(Loading).to.have.property('displayName', 'TestClass');
      });
      test('by displayName', () => {
        class AnotherTest extends React.Component { }
        AnotherTest.displayName = '__Test__';

        chai.expect(loading()(AnotherTest)).to.have.property('displayName', '__Test__');
      });
    });
  });

  test('custom loading component', () => {
    const Loading = loading({ LoadingComponent: () => <span>loading...</span> })(TestClass);
    let wrapper = shallow(<Loading loading />);
    chai.expect(wrapper.children()).to.have.length(1);
    chai.expect(wrapper.html()).to.equal('<div><span>loading...</span></div>');
  });

  test('className', () => {
    const Loading = loading({ 
      LoadingComponent: ({ className }) => <span className={className}>loading...</span>,
      className: '__test_class__'
    })(TestClass);
    let wrapper = shallow(<Loading loading />);
    chai.expect(wrapper.children()).to.have.length(1);
    chai.expect(wrapper.html()).to.equal('<div><span class="__test_class__">loading...</span></div>');
  });

  test('optional propType', () => {
    const Loading = loading({ loadingPropOptional: true })(TestClass);
    const consoleMock = jest.spyOn(global.console, 'error');
    consoleMock.mockClear();
    shallow(<Loading />);
    expect(consoleMock).toHaveBeenCalledTimes(0);
  });

  test('full displayName', () => {
    const Loading = loading({ fullDisplayName: true })(TestClass);
    chai.expect(Loading).to.have.property('displayName', 'Loading(TestClass)');
  })

  test('changes default component', () => {
    let baseComponentSymbol = Object.getOwnPropertySymbols(loading)
      .find(s => s.toString() === 'Symbol(react-hoc-loading/default-base-component)');
    chai.expect(loading[baseComponentSymbol]).not.to.equal(React.Component);
    loading.setDefaultBaseComponent(React.Component);
    chai.expect(loading[baseComponentSymbol]).to.equal(React.Component);
  });

  test('changes default loading component', () => {
    loading.setDefaultLoadingComponent(() => <span>__test__</span>);
    const Loading = loading()(TestClass);
    let wrapper = shallow(<Loading loading />);
    chai.expect(wrapper.html()).to.equal('<div><span>__test__</span></div>');
  });

  describe('propTypes', () => {
    const Loading = loading()(TestClass);

    beforeEach(() => {
      // Awfull but necessary hack to prevent React from catching the component
      // https://github.com/facebook/react/issues/7047#issuecomment-228614964
      TestClass.displayName = Math.random().toString();
    });
    test('sets propTypes', () => {
      chai.expect(Loading.propTypes).to.have.property('loading', PropTypes.bool.isRequired);
    });

    test('propTypes fails', () => {
      const consoleMock = jest.spyOn(global.console, 'error');
      consoleMock.mockClear();
      shallow(<Loading />);
      expect(consoleMock).toHaveBeenCalledTimes(1);
      chai.expect(consoleMock.mock.calls[0][0])
        .to.be.a('string')
        .and.have.string('Failed prop type')
        .and.have.string('The prop `loading` is marked as required in');
    });

    test('propTypes does not fail', () => {
      const consoleMock = jest.spyOn(global.console, 'error');
      consoleMock.mockClear();
      shallow(<Loading loading={false} />);
      expect(consoleMock).toHaveBeenCalledTimes(0);
    });
  });
});
