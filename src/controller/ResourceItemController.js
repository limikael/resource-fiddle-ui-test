/**
 * Control a resource item.
 * @class ResourceItemController
 */
function ResourceItemController(itemView) {
	this.itemView = itemView;
}

/**
 * Set item model to serve as data.
 * @method setData
 */
ResourceItemController.prototype.setData = function(itemModel) {
	this.itemModel = itemModel;

	if (this.itemModel) {
		this.itemView.setKey(this.itemModel.getKey());
		this.itemView.setDefaultValue(this.itemModel.getDefaultValue());
		this.itemView.setValue(this.itemModel.getValue());

		this.itemView.setItemType(this.itemModel.getItemType());
	}
}

module.exports = ResourceItemController;