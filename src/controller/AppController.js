var ResourceTabHeaderController = require("./ResourceTabHeaderController");
var ResourceTabController = require("./ResourceTabController");

/**
 * App controller
 * @class AppController
 */
function AppController(appModel, appView) {
	this.appModel = appModel;
	this.appView = appView;

	this.appView.getResourcePaneView().setTabsCollection(this.appModel.getCategoryCollection());

	this.appView.getResourcePaneView().getTabsHeaderManager().setItemControllerClass(ResourceTabHeaderController);
	this.appView.getResourcePaneView().getTabsManager().setItemControllerClass(ResourceTabController);
}

module.exports = AppController;