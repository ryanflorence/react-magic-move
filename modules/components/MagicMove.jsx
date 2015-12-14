import React from 'react';
import ReactDOM from 'react-dom';

export const MagicMover = React.createClass({
  getInitialState: function(){
      return {animating: false}
  },
  propTypes: {
    component: React.PropTypes.any
  },
  getDefaultProps: function() {
    return {
      component: 'span'
    };
  },
  componentDidMount: function(){
    // console.log('DID MOUNT');
    this.createPortal();
  },
  componentWillUnmount: function() {
    document.body.removeChild(this.portalNode);
  },
  componentWillReceiveProps: function(nextProps){
    if(this.state.animating){
      return
    }
    this.startAnimation(nextProps);
  },
  startAnimation: function(nextProps){
    this.setState({animating: true});
    this.getChildrenPositions();
    this.cloneChildren(nextProps);
  },
  componentDidUpdate: function(prevProps){
    // console.log('DID UPDATE');
    this.getChildrenPositions();
    this.cloneChildren(prevProps);
  },
  getChildrenPositions: function(){
    var positions = {};
    React.Children.map(this.props.children, (child) => {
      var ref = child.key;
      if(ref){
        var node = this.refs[ref];
        var rect = node.getBoundingClientRect();
        var computedStyle = getComputedStyle(node);
        var marginTop = parseInt(computedStyle.marginTop, 10);
        var marginLeft = parseInt(computedStyle.marginLeft, 10);
        var position = {
          content: child.key,
          top: (rect.top - marginTop),
          left: (rect.left - marginLeft),
          width: rect.width,
          height: rect.height,
          position: 'absolute'
        };
        positions[ref] = position;
      }
    });
    return positions;
  },
  createPortal: function(){
    this.portalNode = this.props.component === 'tbody' ? document.createElement('table'): document.createElement(this.props.component);
    this.portalNode.style.position = 'absolute';
    this.portalNode.style.left = '-9999px';
    document.body.appendChild(this.portalNode);
  },
  finishAnimation: function(){
    this.setState({animating: false});
    this.portalNode.style.position = 'absolute';
  },
  addEndTransitionEvent: function(){
    this._transitionHandler = callOnNthCall(this.props.children.length, this.finishAnimation);
    this.portalNode.addEventListener('transitionend', this._transitionHandler);
  },
  cloneChildren: function(nextProps){
    var props = nextProps || this.props;
    this.addEndTransitionEvent();
    this.portalNode.style.position = '';
    React.Children.map(this.props.children, (child) =>
      ReactDOM.render(<Clones {...props} positions={this.getChildrenPositions()} />, this.portalNode)
    );
  },
  cloneWithRefs: function(){
    return React.Children.map(this.props.children, (child) =>
      React.cloneElement(child, {ref: child.key})
    )
  },
  render: function(){
    var style = {opacity: this.state.animating ? 0 : 1};
    return React.createElement(this.props.component, {style: style}, this.cloneWithRefs());
  }
});

const Clones = React.createClass({
  componentWillReceiveProps: function(nextProps){

  },
  cloneChildrenWithPositions: function(){
    return React.Children.map(this.props.children, (child) => {
      var style = {};
      if(child.key){
        var style = this.props.positions[child.key];
        style.background = '#eee';
        return React.cloneElement(child, {style: style, 'key': child.key})
      }
    });
  },
  childrenWithPositions: function() {
    var children = [];
    React.Children.forEach(this.props.children, (child) => {
      if(child.key){
        var key = child.key;
        var style = this.props.positions[key];
        children.push(React.cloneElement(child, { style, key }));
      }
    });
    return children.sort(function (a, b) {
      return (a.key < b.key) ? -1 : (a.key > b.key) ? 1 : 0;
    });
  },
  render: function(){
    console.log(this.portalNode);
    return React.createElement(this.props.component, null, this.childrenWithPositions());
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