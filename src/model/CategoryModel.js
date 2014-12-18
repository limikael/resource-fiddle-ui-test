/**
 * Get category model.
 * @class CategoryModel
 */
function CategoryModel() {
	this.label = "";
}

/**
 * Set reference to parent model.
 * @method getParentModel
 */
CategoryModel.prototype.setParentModel = function(value) {
	this.parentModel = value;
}

/**
 * Get label.
 * @method getLabel
 */
CategoryModel.prototype.getLabel = function() {
	return this.label;
}

CategoryModel.prototype.getId = function() {
	if (!this.id)
		this.id = this.getApp().getNextId();

	return this.id;
}

/**
 * Get reference to app model.
 * @method getAppModel
 */
CategoryModel.prototype.getAppModel = function() {
	var p = this.parent;

	while (p && !(p instanceof AppModel))
		p = p.parent;

	return p;
}

module.exports = CategoryModel;