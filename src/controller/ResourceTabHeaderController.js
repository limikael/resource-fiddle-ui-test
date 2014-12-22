function ResourceTabHeaderController(tabHeaderView) {
	this.tabHeaderView = tabHeaderView;
}

ResourceTabHeaderController.prototype.setData = function(categoryModel) {
	if (categoryModel) {
		this.tabHeaderView.setLabel(categoryModel.getLabel());
		this.tabHeaderView.setTargetId(categoryModel.getId());
	}
}

module.exports = ResourceTabHeaderController;