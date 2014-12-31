var xnode = require("xnode");
var inherits = require("inherits");

/**
 * The tab header.
 * @class ResourceTabHeaderView
 */
function ResourceTabHeaderView() {
	xnode.A.call(this);
	this.className = "item";
}

inherits(ResourceTabHeaderView, xnode.A);

/**
 * Set label.
 * @class setLabel
 */
ResourceTabHeaderView.prototype.setLabel = function(label) {
	this.innerHTML = label;
}

/**
 * Set active state.
 * @class setActive
 */
ResourceTabHeaderView.prototype.setActive = function(active) {
	if (active)
		this.className = "active item";

	else
		this.className = "item";
}

module.exports = ResourceTabHeaderView;