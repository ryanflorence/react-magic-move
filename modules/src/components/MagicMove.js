var React = require('react');
var ReactDOM = require('react-dom');

var Clones = React.createClass({
  displayName: 'MagicMoveClones',

  childrenWithPositions () {
    var children = [];
    React.Children.forEach(this.props.children, (child) => {
      var style = this.props.positions[child.key];
      var key = child.key;
      children.push(React.cloneElement(child, { style, key }));
    });
    return children.sort(function (a, b) {
      return (a.key < b.key) ? -1 : (a.key > b.key) ? 1 : 0;
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
    this.renderClonesInitially();
  },

  componentWillUnmount () {
    document.body.removeChild(this.portalNode);
  },

  componentWillReceiveProps (nextProps) {
    this.startAnimation(nextProps);
  },

  componentDidUpdate (prevProps) {
    if (this.state.animating)
      this.renderClonesToNewPositions(prevProps);
  },

  makePortal () {
    this.portalNode = document.createElement('div');
    this.portalNode.style.left = '-9999px';
    document.body.appendChild(this.portalNode);
  },

  addTransitionEndEvent () {
    // if you click RIGHT before the transition is done, the animation jumps,
    // its because the transitionend event fires even though its not quite
    // done, not sure how to hack around it yet.
    this._transitionHandler = callOnNthCall(this.props.children.length, this.finishAnimation);
    this.portalNode.addEventListener('transitionend', this._transitionHandler);
  },

  removeTransitionEndEvent () {
    this.portalNode.removeEventListener('transitionend', this._transitionHandler);
  },

  startAnimation (nextProps) {
    if (this.state.animating)
      return;
    this.addTransitionEndEvent();
    var updatedProps = Object.assign({}, nextProps, {
        animating: true,
        positions: this.getPositions()
    });
    this.renderClones(updatedProps, () => {
      this.setState({ animating: true });
    });
  },

  renderClonesToNewPositions (prevProps) {
    var positions = this.getPositions();
    var updatedProps = Object.assign({}, prevProps, { positions });
    this.renderClones(updatedProps);
  },

  finishAnimation () {
    this.removeTransitionEndEvent();
    this.portalNode.style.position = 'absolute';
    this.setState({ animating: false });
  },

  getPositions () {
    var positions = {};
    React.Children.forEach(this.props.children, (child) => {
      var ref = child.key;
      var node = this.refs[ref];
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

  renderClonesInitially () {
    var positions = this.getPositions();
    var updatedProps = Object.assign({}, this.props, {
        positions
    });
    ReactDOM.render(<Clones {...updatedProps}/>, this.portalNode);
  },

  renderClones (props, cb) {
    this.portalNode.style.position = '';
    ReactDOM.render(<Clones {...props}/>, this.portalNode, cb);
  },

  childrenWithRefs () {
    return React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { ref: child.key });
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

function callOnNthCall(n, fn) {
  var calls = 0;
  return function () {
    calls++;
    if (calls === n) {
      calls = 0;
      return fn.apply(this, arguments);
    }
  };
}

module.exports = MagicMove;
