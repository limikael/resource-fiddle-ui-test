var xnode = require("xnode");
var inherits = require("inherits");
var AppView = require("../view/AppView");
var AppModel = require("../model/AppModel");
var AppController = require("../controller/AppController");

/**
 * The main resource fiddle app class.
 * @class App
 */
function App() {
	xnode.Div.call(this);

	this.style.position = "absolute";
	this.style.top = 0;
	this.style.bottom = 0;
	this.style.left = 0;
	this.style.right = 0;

	this.appView = new AppView();
	this.appModel = new AppModel();
	this.appController = new AppController(this.appModel, this.appView);

	this.appendChild(this.appView);
}

inherits(App, xnode.Div);

/**
 * Get model.
 * @method getModel
 */
App.prototype.getModel = function() {
	return this.appModel;
}

module.exports = App;