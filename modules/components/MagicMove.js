/* @jsx React.DOM */

var React = require('react');
var cloneWithProps = require('react/lib/cloneWithProps');

var Clones = React.createClass({
  childrenWithPositions () {
    return React.Children.map(this.props.children, (child) => {
      var style = this.props.positions[child.key];
      return cloneWithProps(child, { style });
    });
  },

  render () {
    return <div
      className="MagicMoveClones"
    >{this.childrenWithPositions()}</div>
  }
});

function debounce(fn) {
  var timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(fn, 0);
  }
}

var MagicMove = React.createClass({

  displayName: 'MagicMove',

  getInitialState () {
    return {
      animating: false
    };
  },

  componentDidMount () {
    this.addTransitionEndEvent();
  },

  componentWillReceiveProps () {
    this.startAnimation();
  },

  componentDidUpdate (prevProps) {
    if (this.state.animating)
      this.renderClonesToNewPositions(prevProps);
  },

  addTransitionEndEvent() {
    this.refs.clones.getDOMNode().
      addEventListener('transitionend', debounce(this.finishAnimation));
  },

  finishAnimation () {
    React.unmountComponentAtNode(this.refs.clones.getDOMNode());
    this.setState({ animating: false });
  },

  startAnimation () {
    this.props.animating = true;
    this.props.positions = this.getPositions();
    this.renderClones(this.props);
    this.setState({ animating: true });
  },

  renderClonesToNewPositions (prevProps) {
    prevProps.positions = this.getPositions();
    this.renderClones(prevProps);
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
    React.render(<Clones {...props}/>, this.refs.clones.getDOMNode(), cb);
  },

  childrenWithRefs () {
    return React.Children.map(this.props.children, (child) => {
      return cloneWithProps(child, { ref: child.key});
    });
  },

  render () {
    var style = { opacity: this.state.animating ? 0 : 1 };
    return (
      <div>
        <div ref="actual" style={style}>{this.childrenWithRefs()}</div>
        <div ref="clones"></div>
      </div>
    );
  }

});

module.exports = MagicMove;
