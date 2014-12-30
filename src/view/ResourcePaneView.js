var inherits = require("inherits");
var xnode = require("xnode");
var xnodec = require("xnodecollection");
var ResourceTabHeaderView = require("./ResourceTabHeaderView");
var ResourceTabView = require("./ResourceTabView");

/**
 * The left part of the app, showing the resources.
 * @class ResourcePaneView
 */
function ResourcePaneView() {
	xnode.Div.call(this);

	this.style.position = "absolute";
	this.style.top = "10px";
	this.style.left = "10px";
	this.style.width = "50%";
	this.style.bottom = "10px";

	this.tabHeaders = new xnodec.CollectionView();
	this.tabHeaders.className = "ui top attached tabular menu";
	this.tabHeaders.setItemRendererClass(ResourceTabHeaderView);
	this.appendChild(this.tabHeaders);

	this.tabsManager = new xnodec.CollectionViewManager(this);
	this.tabsManager.setItemRendererClass(ResourceTabView);
}

inherits(ResourcePaneView, xnode.Div);

/**
 * Set tabs collection.
 * @method setTabsCollection
 */
ResourcePaneView.prototype.setTabsCollection = function(collection) {
	this.tabHeaders.setDataSource(collection);
	this.tabsManager.setDataSource(collection);
}

/**
 * Get tabs header manager.
 * @method getTabsHeaderManager
 */
ResourcePaneView.prototype.getTabsHeaderManager = function() {
	return this.tabHeaders;
}

/**
 * Get tabs header manager.
 * @method getTabsManager
 */
ResourcePaneView.prototype.getTabsManager = function() {
	return this.tabsManager;
}

module.exports = ResourcePaneView;