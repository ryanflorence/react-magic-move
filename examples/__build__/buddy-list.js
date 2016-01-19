webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(3);
	var ReactDOM = __webpack_require__(2);
	var MagicMove = __webpack_require__(1);

	var buddies = [
	  { name: 'Ryan' },
	  { name: 'Michael' },
	  { name: 'Vjeux' },
	  { name: 'Pete' },
	  { name: 'David' }
	];

	var getBuddies = function()  {
	  return buddies.map(function(buddy)  {
	    buddy.online = Math.random() > 0.5;
	    return buddy;
	  });
	};

	var App = React.createClass({displayName: "App",
	  getInitialState: function() {
	    return { buddies: getBuddies() };
	  },

	  componentDidMount: function () {
	    setInterval(function()  {
	      this.setState({ buddies: getBuddies() });
	    }.bind(this), 5000);
	  },

	  addBuddy:function (event) {
	    event.preventDefault();
	    var name = event.target.elements[0].value;
	    buddies.push({ name:name, online: true });
	    event.target.reset();
	    this.setState({ buddies:buddies });
	  },

	  renderBuddy:function (buddy) {
	    var status = buddy.online ? 'online' : 'offline';
	    return (
	      React.createElement("div", {className: "Buddy", key: buddy.name}, 
	        React.createElement("span", {className: "status "+status}), 
	        buddy.name
	      )
	    );
	  },

	  renderOnline:function () {
	    return sortBy('name', this.state.buddies.filter(function(buddy)  {
	      return buddy.online;
	    })).map(this.renderBuddy);
	  },

	  renderOffline:function () {
	    return sortBy('name', this.state.buddies.filter(function(buddy)  {
	      return !buddy.online;
	    })).map(this.renderBuddy);
	  },

	  render: function () {
	    return (
	      React.createElement("div", null, 
	        React.createElement("h1", null, "Magic Move"), 
	        React.createElement("form", {onSubmit: this.addBuddy}, 
	          React.createElement("label", null, "Add Buddy: ", React.createElement("input", {name: "name", placeholder: "name"})), ' ', 
	          React.createElement("button", {type: "submit"}, "add")
	        ), 
	        React.createElement(MagicMove, null, 
	          React.createElement("h2", {key: "online"}, "Online"), 
	          this.renderOnline(), 
	          React.createElement("h2", {key: "offline"}, "Offline"), 
	          this.renderOffline()
	        )
	      )
	    );
	  }
	});

	function sortBy(key, arr) {
	  return arr.slice(0).sort(function(a, b)  {
	    return (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
	  });
	}

	ReactDOM.render(React.createElement(App, null), document.getElementById('example'));


/***/ }
]);