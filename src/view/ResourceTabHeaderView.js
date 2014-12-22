var xnode = require("xnode");
var inherits = require("inherits");

function ResourceTabHeaderView() {
	xnode.Li.call(this);

	this.targetId = null;
	this.label = null;
}

inherits(ResourceTabHeaderView, xnode.Li);

ResourceTabHeaderView.prototype.setTargetId = function(id) {
	this.targetId = id;
	this.refresh();
}

ResourceTabHeaderView.prototype.setLabel = function(label) {
	this.label = label;
	this.refresh();
}

ResourceTabHeaderView.prototype.refresh = function() {
	if (this.label && this.targetId) {
		this.innerHTML = "<a href='#" + this.targetId + "'>" + this.label + "</a>";
	}
}

module.exports = ResourceTabHeaderView;