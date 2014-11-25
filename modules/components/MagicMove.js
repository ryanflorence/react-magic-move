/* @jsx React.DOM */
var React = require('react');
var cloneWithProps = require('react/lib/cloneWithProps');

var Clones = React.createClass({
  displayName: 'MagicMoveClones',

  childrenWithPositions () {
    return React.Children.map(this.props.children, (child) => {
      var style = this.props.positions[child.key];
      return cloneWithProps(child, { style });
    });
  },

  render () {
    return (
      <div className="MagicMoveClones">
        {this.childrenWithPositions()}
      </div>
    );
  }
});

var MagicMove = React.createClass({

  displayName: 'MagicMove',

  getInitialState () {
    return {
      animating: false
    };
  },

  componentDidMount () {
    this.makePortal();
  },

  componentWillUnmount () {
    document.body.removeChild(this.portalNode);
  },

  componentWillReceiveProps () {
    this.startAnimation();
  },

  componentDidUpdate (prevProps) {
    if (this.state.animating)
      this.renderClonesToNewPositions(prevProps);
  },

  makePortal () {
    this.portalNode = document.createElement('div');
    document.body.appendChild(this.portalNode);
    this.addTransitionEndEvent();
  },

  addTransitionEndEvent() {
    this.portalNode.addEventListener('transitionend',
      debounce(this.finishAnimation));
  },

  startAnimation () {
    if (this.state.animating)
      return;
    this.props.animating = true;
    this.props.positions = this.getPositions();
    this.renderClones(this.props);
    this.setState({ animating: true });
  },

  renderClonesToNewPositions (prevProps) {
    prevProps.positions = this.getPositions();
    this.renderClones(prevProps);
  },

  finishAnimation () {
    React.unmountComponentAtNode(this.portalNode);
    this.setState({ animating: false });
  },

  getPositions () {
    var positions = {};
    React.Children.forEach(this.props.children, (child) => {
      var ref = child.key;
      var node = this.refs[ref].getDOMNode();
      var rect = node.getBoundingClientRect();
      var computedStyle = getComputedStyle(node);
      var marginTop = parseInt(computedStyle.marginTop, 10);
      var marginLeft = parseInt(computedStyle.marginLeft, 10);
      var position = {
        top: (rect.top - marginTop),
        left: (rect.left - marginLeft),
        width: rect.width,
        height: rect.height,
        position: 'absolute'
      };
      positions[ref] = position;
    });
    return positions;
  },

  renderClones (props, cb) {
    React.render(<Clones {...props}/>, this.portalNode, cb);
  },

  childrenWithRefs () {
    return React.Children.map(this.props.children, (child) => {
      return cloneWithProps(child, { ref: child.key});
    });
  },

  render () {
    var style = { opacity: this.state.animating ? 0 : 1 };
    return (
      <div style={style}>
        {this.childrenWithRefs()}
      </div>
    );
  }
});

function debounce(fn) {
  var timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(fn, 0);
  }
}

module.exports = MagicMove;
