var ResourcePaneTabHeaderController = require("./ResourcePaneTabHeaderController");

/**
 * App controller
 * @class AppController
 */
function AppController(appModel, appView) {
	this.appModel = appModel;
	this.appView = appView;

	this.appView.getResourcePaneView().setTabsCollection(this.appModel.getCategoryCollection());
	this.appView.getResourcePaneView().getTabsHeaderManager().setItemControllerClass(ResourcePaneTabHeaderController);
}

module.exports = AppController;