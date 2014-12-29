function ResourceTabController(tabView) {
	this.tabView = tabView;
}

ResourceTabController.prototype.setData = function(categoryModel) {
	if (this.categoryModel) {
		this.categoryModel.off("change", this.onCategoryModelChange, this);
	}

	this.categoryModel = categoryModel;

	if (this.categoryModel) {
		this.categoryModel.on("change", this.onCategoryModelChange, this);
		this.tabView.setActive(categoryModel.isActive());

		this.tabView.setLabel(categoryModel.getLabel());
	}
}

ResourceTabController.prototype.onCategoryModelChange = function() {
	this.tabView.setActive(this.categoryModel.isActive());
}

module.exports = ResourceTabController;