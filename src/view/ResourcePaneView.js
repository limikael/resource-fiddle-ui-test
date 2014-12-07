var inherits = require("inherits");
var xnode = require("xnode");
var xnodeui = require("xnodeui");

/**
 * The left part of the app, showing the resources.
 * @class ResourcePaneView
 */
function ResourcePaneView() {
	xnode.Div.call(this);

	this.style.position = "absolute";
	this.style.top = 0;
	this.style.left = 0;
	this.style.width = "50%";
	this.style.bottom = 0;

	this.tabs = new xnodeui.Tabs();
	this.tabs.style.position = "absolute";
	this.tabs.style.left = 10;
	this.tabs.style.right = 5;
	this.tabs.style.top = 10;
	this.tabs.style.bottom = 10;

	this.tabViews = [];

	this.tabs.ul.appendChild(new xnode.Li("<a href='#tab1'>test1</a>"));
	this.tabs.ul.appendChild(new xnode.Li("<a href='#tab2'>test2</a>"));

	var div;

	div = new xnode.Div();
	div.id = "tab1";
	this.tabs.appendChild(div)

	div = new xnode.Div();
	div.id = "tab2";
	this.tabs.appendChild(div)

	this.tabs.refresh();

	this.appendChild(this.tabs);
}

inherits(ResourcePaneView, xnode.Div);

/**
 * Create a tab.
 */
ResourcePaneView.prototype.createTab = function(label) {
	var id = "resourcePaneTab" + this.tabViews.length;

	var li = new xnode.Li("<a href='" + id + "'>" + label + "</a>");
	this.tabs.ul.appendChild(li);
}

module.exports = ResourcePaneView;