var ResourceTabHeaderController = require("./ResourceTabHeaderController");
var ResourceTabController = require("./ResourceTabController");
var ResourceTabHeaderView = require("../view/ResourceTabHeaderView");
var ResourceTabView = require("../view/ResourceTabView");
var xnodec = require("xnodecollection");

/**
 * App controller
 * @class AppController
 */
function AppController(appModel, appView) {
	this.appModel = appModel;
	this.appView = appView;

	this.tabHeaderManager = new xnodec.CollectionViewManager();
	this.tabHeaderManager.setTarget(this.appView.getResourcePaneView().getTabHeaderHolder());
	this.tabHeaderManager.setItemControllerClass(ResourceTabHeaderController);
	this.tabHeaderManager.setItemRendererClass(ResourceTabHeaderView);
	this.tabHeaderManager.setDataSource(this.appModel.getCategoryCollection());

	this.tabManager = new xnodec.CollectionViewManager();
	this.tabManager.setTarget(this.appView.getResourcePaneView().getTabHolder());
	this.tabManager.setItemControllerClass(ResourceTabController);
	this.tabManager.setItemRendererClass(ResourceTabView);
	this.tabManager.setDataSource(this.appModel.getCategoryCollection());
}

module.exports = AppController;