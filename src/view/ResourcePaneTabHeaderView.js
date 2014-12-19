var xnode = require("xnode");
var inherits = require("inherits");

function ResourcePaneTabHeaderView() {
	xnode.Li.call(this);

	this.id = null;
	this.label = null;
}

inherits(ResourcePaneTabHeaderView, xnode.Li);

/*ResourcePaneTabHeaderView.prototype.setData = function(data) {
	if (data) {
		this.innerHTML = "<a href='#" + data.id + "'>" + data.label + "</a>";
	}
}*/

ResourcePaneTabHeaderView.prototype.setId = function(id) {
	this.id = id;
	this.refresh();
}

ResourcePaneTabHeaderView.prototype.setLabel = function(label) {
	this.label = label;
	this.refresh();
}

ResourcePaneTabHeaderView.prototype.refresh = function() {
	if (this.label && this.id) {
		console.log("setting inner, label=" + this.label + " id: " + this.id);
		this.innerHTML = "<a href='#" + this.id + "'>" + this.label + "</a>";
	}
}

module.exports = ResourcePaneTabHeaderView;