var inherits = require("inherits");
var xnode = require("xnode");
var xnodeui = require("xnodeui");
var ResourcePaneView = require("./ResourcePaneView");

/**
 * Main application view.
 * @class AppView
 */
function AppView() {
	xnode.Div.call(this);

	this.style.position = "absolute";
	this.style.top = 0;
	this.style.left = 0;
	this.style.right = 0;
	this.style.bottom = 0;

	this.resourcePaneView = new ResourcePaneView();
	this.appendChild(this.resourcePaneView);
}

inherits(AppView, xnode.Div);

module.exports = AppView;