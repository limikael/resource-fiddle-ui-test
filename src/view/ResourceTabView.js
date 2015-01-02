var xnode = require("xnode");
var xnodec = require("xnodecollection");
var inherits = require("inherits");
var ResourceCategoryView = require("./ResourceCategoryView");

/**
 * The view for the content that goes into one tab.
 * @class ResourceTabView
 */
function ResourceTabView() {
	xnode.Div.call(this);
	this.className = "ui bottom attached active tab segment";

	this.inner = new xnode.Div();
	this.inner.style.position = "relative";
	this.inner.style.height = "calc(100% - 65px)";
	this.inner.style.padding = "1px";
	this.inner.style.overflowY = "scroll";
	this.appendChild(this.inner);

	this.descriptionP = new xnode.P();
	this.inner.appendChild(this.descriptionP);

	this.accordion = new xnode.Div();
	this.accordion.className = "ui styled fluid accordion";
	this.inner.appendChild(this.accordion);
}

inherits(ResourceTabView, xnode.Div);

/**
 * Should this be the active tab?
 * @method setActive
 */
ResourceTabView.prototype.setActive = function(active) {
	if (active) {
		this.style.display = "block";
		this.className = "ui bottom attached active tab segment active";
	} else {
		this.style.display = "none";
		this.className = "ui bottom attached active tab segment";
	}
}

/**
 * Set description.
 * @method setDescription
 */
ResourceTabView.prototype.setDescription = function(description) {
	this.descriptionP.innerHTML = description;
}

/**
 * Get div holding the categories.
 * @method getCategoryHolder
 */
ResourceTabView.prototype.getCategoryHolder = function() {
	return this.accordion;
}

module.exports = ResourceTabView;