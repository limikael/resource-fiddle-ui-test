var xnode = require("xnode");
var inherits = require("inherits");

function ResourceTabHeaderView() {
	xnode.A.call(this);
	this.className = "item";
}

inherits(ResourceTabHeaderView, xnode.A);

ResourceTabHeaderView.prototype.setLabel = function(label) {
	this.innerHTML = label;
}

ResourceTabHeaderView.prototype.setActive = function(active) {
	if (active)
		this.className = "active item";

	else
		this.className = "item";
}

module.exports = ResourceTabHeaderView;