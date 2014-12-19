function ResourcePaneTabHeaderController(tabHeaderView) {
	this.tabHeaderView = tabHeaderView;
}

ResourcePaneTabHeaderController.prototype.setData = function(categoryModel) {
	if (categoryModel) {
		this.tabHeaderView.setLabel(categoryModel.getLabel());
		this.tabHeaderView.setId(categoryModel.getId());
	}
}

module.exports = ResourcePaneTabHeaderController;