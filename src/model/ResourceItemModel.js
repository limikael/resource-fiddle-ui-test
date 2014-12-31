/**
 * ResourceItemModel
 * @class ResourceItemModel
 */
function ResourceItemModel(key, defaultValue, value, type) {
	this.key = key;
	this.defaultValue = defaultValue;
	this.value = value;

	this.itemType = type;

	if (!this.itemType)
		this.itemType = "position";
}

/**
 * Get key.
 * @method getKey
 */
ResourceItemModel.prototype.getKey = function() {
	return this.key;
}

/**
 * Get default value.
 * @method getDefaultValue
 */
ResourceItemModel.prototype.getDefaultValue = function() {
	return this.defaultValue;
}

/**
 * Get customized value.
 * @method getValue
 */
ResourceItemModel.prototype.getValue = function() {
	return this.value;
}

/**
 * Set value.
 * @method setValue
 */
ResourceItemModel.prototype.setValue = function(value) {
	this.value = value;
}

/**
 * Get item type.
 * @method getItemType
 */
ResourceItemModel.prototype.getItemType = function() {
	return this.itemType;
}

module.exports = ResourceItemModel;