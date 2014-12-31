var AppModel = require("./AppModel");
var EventDispatcher = require("yaed");
var inherits = require("inherits");
var xnodec = require("xnodecollection");

/**
 * Get category model.
 * @class CategoryModel
 */
function CategoryModel(label) {
	this.label = label;
	this.parentModel = null;
	this.active = false;
	this.categoryCollection = new xnodec.Collection();
	this.itemCollection = new xnodec.Collection();
	this.description = "";
}

inherits(CategoryModel, EventDispatcher);

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

/**
 * Get description.
 * @method getLabel
 */
CategoryModel.prototype.getDescription = function() {
	return this.description;
}

/**
 * Set description.
 * @method getLabel
 */
CategoryModel.prototype.setDescription = function(description) {
	this.description = description;

	this.trigger("change");
}

/**
 * Get reference to app model.
 * @method getAppModel
 */
CategoryModel.prototype.getAppModel = function() {
	if (!this.parentModel)
		throw new Error("there is no parent!");

	var p = this.parentModel;

	while (p && !(p instanceof AppModel))
		p = p.parentModel;

	return p;
}

/**
 * Set active state.
 * @method setActive
 */
CategoryModel.prototype.setActive = function(value) {
	if (value == this.active)
		return;

	var siblings = this.parentModel.getCategoryCollection();

	for (var i = 0; i < siblings.getLength(); i++)
		if (siblings.getItemAt(i) != this)
			siblings.getItemAt(i).setActive(false);

	this.active = value;
	this.trigger("change");
}

/**
 * Is this category the active one?
 * @method isActive
 */
CategoryModel.prototype.isActive = function() {
	return this.active;
}

/**
 * Get category collection for sub categories.
 * @method getCategoryCollection
 */
CategoryModel.prototype.getCategoryCollection = function() {
	return this.categoryCollection;
}

/**
 * Get item collection.
 * @method getItemCollection
 */
CategoryModel.prototype.getItemCollection = function() {
	return this.itemCollection;
}

/**
 * Add sub category model.
 * @method addCategoryModel
 */
CategoryModel.prototype.addCategoryModel = function(categoryModel) {
	categoryModel.setParentModel(this);
	this.categoryCollection.addItem(categoryModel);

	return categoryModel;
}

/**
 * Create and add a category model.
 * @method createCategory
 */
CategoryModel.prototype.createCategory = function(title) {
	var categoryModel = new CategoryModel(title);

	return this.addCategoryModel(categoryModel);
}

/**
 * Add resource item model.
 * @method addResourceItemModel
 */
CategoryModel.prototype.addResourceItemModel = function(resourceItemModel) {
	this.itemCollection.addItem(resourceItemModel);
}

module.exports = CategoryModel;