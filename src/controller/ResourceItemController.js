function ResourceItemController(itemView) {
	this.itemView = itemView;
}

ResourceItemController.prototype.setData = function(itemModel) {
	this.itemModel = itemModel;

	if (this.itemModel) {
		this.itemView.setKey(this.itemModel.getKey());
		this.itemView.setDefaultValue(this.itemModel.getDefaultValue());
		this.itemView.setValue(this.itemModel.getValue());

		this.itemView.setItemType("position");
	}
}

module.exports = ResourceItemController;