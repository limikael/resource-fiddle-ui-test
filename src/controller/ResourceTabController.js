var ResourceCategoryController = require("./ResourceCategoryController");
var ResourceCategoryView = require("../view/ResourceCategoryView");
var xnodec = require("xnodecollection");

/**
 * Control one resource tab.
 * @method ResourceTabController
 */
function ResourceTabController(tabView) {
	this.tabView = tabView;

	this.categoryManager = new xnodec.CollectionViewManager();
	this.categoryManager.setTarget(tabView.getCategoryHolder());
	this.categoryManager.setItemRendererClass(ResourceCategoryView);
	this.categoryManager.setItemControllerClass(ResourceCategoryController);
}

/**
 * Set data.
 * @method setData
 */
ResourceTabController.prototype.setData = function(categoryModel) {
	if (this.categoryModel) {
		this.categoryModel.off("change", this.onCategoryModelChange, this);
		this.categoryManager.setDataSource(null);
	}

	this.categoryModel = categoryModel;

	if (this.categoryModel) {
		this.categoryModel.on("change", this.onCategoryModelChange, this);
		this.tabView.setActive(categoryModel.isActive());
		this.tabView.setDescription(categoryModel.getDescription());

		this.categoryManager.setDataSource(categoryModel.getCategoryCollection());
	}
}

/**
 * Handle change in the model.
 * @method onCategoryModelChange
 */
ResourceTabController.prototype.onCategoryModelChange = function() {
	this.tabView.setActive(this.categoryModel.isActive());
	this.tabView.setDescription(this.categoryModel.getDescription());
}

module.exports = ResourceTabController;