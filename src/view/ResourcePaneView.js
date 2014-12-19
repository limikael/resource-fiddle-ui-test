var inherits = require("inherits");
var xnode = require("xnode");
var xnodeui = require("xnodeui");
var xnodec = require("xnodecollection");
var ResourcePaneTabHeaderView = require("./ResourcePaneTabHeaderView");
var ResourcePaneTabContentView = require("./ResourcePaneTabContentView");

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
	this.appendChild(this.tabs);

	this.tabsHeaderManager = new xnodec.CollectionViewManager(this.tabs.ul);
	this.tabsHeaderManager.setItemRendererClass(ResourcePaneTabHeaderView);

	this.tabsContentManager = new xnodec.CollectionViewManager(this.tabs);
	this.tabsContentManager.setItemRendererClass(ResourcePaneTabContentView);
}

inherits(ResourcePaneView, xnode.Div);

/**
 * Set tabs collection.
 */
ResourcePaneView.prototype.setTabsCollection = function(collection) {
	this.tabsHeaderManager.setDataSource(collection);
	this.tabsContentManager.setDataSource(collection);

	var scope=this;

	collection.on("change",function() {
		scope.tabs.refresh();
	});
}

/**
 * Get tabs header manager.
 * @method getTabsHeaderManager
 */
ResourcePaneView.prototype.getTabsHeaderManager = function() {
	return this.tabsHeaderManager;
}

module.exports = ResourcePaneView;