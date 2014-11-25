/* @jsx React.DOM */

var React = require('react');
var cloneWithProps = require('react/lib/cloneWithProps');

var Clones = React.createClass({
  childrenWithPositions () {
    return React.Children.map(this.props.children, (child) => {
      var style = this.props.positions[child.key];
      style.position = 'absolute';
      return cloneWithProps(child, { style });
    });
  },

  render () {
    var styles = {
      color: 'red'
    };

    return <div
      className="MagicMoveClones"
      style={styles}
    >{this.childrenWithPositions()}</div>
  }
});

var MagicMove = React.createClass({

  displayName: 'MagicMove',

  componentWillReceiveProps (nextProps) {
    this.props.animating = true;
    this.props.positions = this.getPositions();
    this.renderClones(this.props);
  },

  componentDidUpdate (prevProps) {
    prevProps.positions = this.getPositions();
    this.renderClones(prevProps, () => {
      setTimeout(() => {
        React.unmountComponentAtNode(this.refs.clones.getDOMNode());
      }, 500);
    });
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
        height: rect.height
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
    return (
      <div>
        <div ref="actual">{this.childrenWithRefs()}</div>
        <div ref="clones"></div>
      </div>
    );
  }

});

module.exports = MagicMove;
