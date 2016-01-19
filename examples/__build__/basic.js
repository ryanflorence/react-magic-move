webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(3);
	var ReactDOM = __webpack_require__(2);
	var MagicMove = __webpack_require__(1);

	var App = React.createClass({displayName: "App",
	  getInitialState: function() {
	    return { order: 'alphabetical' };
	  },

	  sort: function(order) {
	    if (order == 'alphabetical' && order == this.state.order)
	      return;
	    this.setState({order: order});
	  },

	  renderStates: function() {
	    var states = this.state.order === 'random' ? shuffled() : alphabetical();
	    return states.map(function(state) {
	      return React.createElement("div", {className: "State", key: state.abbr}, state.abbr);
	    });
	  },

	  render: function() {
	    return (
	      React.createElement("div", null, 
	        React.createElement("h1", null, "Magic Move"), 
	        React.createElement("div", null, 
	          React.createElement("button", {onClick: this.sort.bind(this, 'random')}, "Random"), 
	          React.createElement("button", {onClick: this.sort.bind(this, 'alphabetical')}, "Alphabetical")
	        ), 

	        React.createElement(MagicMove, null, 
	          this.renderStates()
	        )
	      )
	    );
	  }
	});

	ReactDOM.render(React.createElement(App, null), document.getElementById('example'));

	function shuffled() {
	  return shuffle(getStates());
	}

	function alphabetical() {
	  return sortBy(getStates(), 'name');
	}

	function getStates() {
	  return [
	    { abbr: "AL", name: "Alabama"},
	    { abbr: "AK", name: "Alaska"},
	    { abbr: "AZ", name: "Arizona"},
	    { abbr: "AR", name: "Arkansas"},
	    { abbr: "CA", name: "California"},
	    { abbr: "CO", name: "Colorado"},
	    { abbr: "CT", name: "Connecticut"},
	    { abbr: "DE", name: "Delaware"},
	    { abbr: "FL", name: "Florida"},
	    { abbr: "GA", name: "Georgia"},
	    { abbr: "HI", name: "Hawaii"},
	    { abbr: "ID", name: "Idaho"},
	    { abbr: "IL", name: "Illinois"},
	    { abbr: "IN", name: "Indiana"},
	    { abbr: "IA", name: "Iowa"},
	    { abbr: "KS", name: "Kansas"},
	    { abbr: "KY", name: "Kentucky"},
	    { abbr: "LA", name: "Louisiana"},
	    { abbr: "ME", name: "Maine"},
	    { abbr: "MD", name: "Maryland"},
	    { abbr: "MA", name: "Massachusetts"},
	    { abbr: "MI", name: "Michigan"},
	    { abbr: "MN", name: "Minnesota"},
	    { abbr: "MS", name: "Mississippi"},
	    { abbr: "MO", name: "Missouri"},
	    { abbr: "MT", name: "Montana"},
	    { abbr: "NE", name: "Nebraska"},
	    { abbr: "NV", name: "Nevada"},
	    { abbr: "NH", name: "New Hampshire"},
	    { abbr: "NJ", name: "New Jersey"},
	    { abbr: "NM", name: "New Mexico"},
	    { abbr: "NY", name: "New York"},
	    { abbr: "NC", name: "North Carolina"},
	    { abbr: "ND", name: "North Dakota"},
	    { abbr: "OH", name: "Ohio"},
	    { abbr: "OK", name: "Oklahoma"},
	    { abbr: "OR", name: "Oregon"},
	    { abbr: "PA", name: "Pennsylvania"},
	    { abbr: "RI", name: "Rhode Island"},
	    { abbr: "SC", name: "South Carolina"},
	    { abbr: "SD", name: "South Dakota"},
	    { abbr: "TN", name: "Tennessee"},
	    { abbr: "TX", name: "Texas"},
	    { abbr: "UT", name: "Utah"},
	    { abbr: "VT", name: "Vermont"},
	    { abbr: "VA", name: "Virginia"},
	    { abbr: "WA", name: "Washington"},
	    { abbr: "WV", name: "West Virginia"},
	    { abbr: "WI", name: "Wisconsin"},
	    { abbr: "WY", name: "Wyoming"}
	  ];
	}

	function underscore(str) {
	  return str.toLowerCase().replace(/ /, '_');
	}

	function stateImage(state) {
	  return "http://www.50states.com/maps/"+underscore(state)+".gif";
	}

	function sortBy(arr, prop) {
	  return arr.slice(0).sort(function(a, b) {
	    if (a[prop] < b[prop]) return -1;
	    if (a[prop] > b[prop]) return 1;
	    return 0;
	  });
	}

	function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;
	  while (0 !== currentIndex) {
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }
	  return array;
	}


/***/ }
]);