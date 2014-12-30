/**
 * Control a resource category.
 * @method ResourceTabController
 */
function ResourceCategoryController(categoryView) {
	this.categoryView = categoryView;
	//	this.categoryView.getCategoryManager().setItemControllerClass(ResourceCategoryController);

	this.categoryView.on("titleClick", this.onCategoryViewTitleClick, this);
}

/**
 * Set data.
 * @method setData
 */
ResourceCategoryController.prototype.setData = function(categoryModel) {
	if (this.categoryModel) {
		this.categoryModel.off("change", this.onCategoryModelChange, this);
		//this.categoryView.setCategoryCollection(null);
	}

	this.categoryModel = categoryModel;

	if (this.categoryModel) {
		this.categoryModel.on("change", this.onCategoryModelChange, this);
		this.categoryView.setActive(categoryModel.isActive());
		this.categoryView.setLabel(categoryModel.getLabel());

		//this.tabView.setCategoryCollection(categoryModel.getCategoryCollection());
	}
}

/**
 * Handle change in the model.
 * @method onCategoryModelChange
 */
ResourceCategoryController.prototype.onCategoryModelChange = function() {
	this.categoryView.setActive(this.categoryModel.isActive());
}

/**
 *
 */
ResourceCategoryController.prototype.onCategoryViewTitleClick=function() {
	this.categoryModel.setActive(true);
}

module.exports = ResourceCategoryController;