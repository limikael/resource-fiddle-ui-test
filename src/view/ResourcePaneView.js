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

	/*	this.tabs = new xnodeui.Tabs();
		this.tabs.style.position = "absolute";
		this.tabs.style.left = 10;
		this.tabs.style.right = 5;
		this.tabs.style.top = 10;
		this.tabs.style.bottom = 10;
		this.appendChild(this.tabs);

		this.tabsHeaderManager = new xnodec.CollectionViewManager(this.tabs.ul);
		this.tabsHeaderManager.setItemRendererClass(ResourceTabHeaderView);

		this.tabsContentManager = new xnodec.CollectionViewManager(this.tabs);
		this.tabsContentManager.setItemRendererClass(ResourceTabView);*/

	this.tabs = new xnodec.CollectionView();
	this.tabs.className = "ui top attached tabular menu";
	this.tabs.setItemRendererClass(ResourceTabHeaderView);
	this.appendChild(this.tabs);

	/*	var a = new xnode.A();
		a.innerHTML = "hello";
		a.className = "active item";
		this.tabs.appendChild(a);

		var a = new xnode.A();
		a.innerHTML = "hello";
		a.className = "item";
		this.tabs.appendChild(a);*/
}

inherits(ResourcePaneView, xnode.Div);

/**
 * Set tabs collection.
 */
ResourcePaneView.prototype.setTabsCollection = function(collection) {
	this.tabs.setDataSource(collection);
	/*	this.tabsContentManager.setDataSource(collection);

		var scope=this;

		collection.on("change",function() {
			scope.tabs.refresh();
		});*/
}

/**
 * Get tabs header manager.
 * @method getTabsHeaderManager
 */
ResourcePaneView.prototype.getTabsHeaderManager = function() {
	return this.tabs;
}

module.exports = ResourcePaneView;