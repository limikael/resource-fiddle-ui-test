var xnode = require("xnode");
var inherits = require("inherits");

function ResourcePaneTabHeaderView() {
	xnode.Li.call(this);

	this.targetId = null;
	this.label = null;
}

inherits(ResourcePaneTabHeaderView, xnode.Li);

ResourcePaneTabHeaderView.prototype.setTargetId = function(id) {
	this.targetId = id;
	this.refresh();
}

ResourcePaneTabHeaderView.prototype.setLabel = function(label) {
	this.label = label;
	this.refresh();
}

ResourcePaneTabHeaderView.prototype.refresh = function() {
	if (this.label && this.targetId) {
		console.log("setting inner, label=" + this.label + " id: " + this.targetId);
		this.innerHTML = "<a href='#" + this.targetId + "'>" + this.label + "</a>";
	}
}

module.exports = ResourcePaneTabHeaderView;