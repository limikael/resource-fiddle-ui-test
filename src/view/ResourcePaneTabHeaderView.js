var xnode = require("xnode");
var inherits = require("inherits");

function ResourcePaneTabHeaderView() {
	xnode.Li.call(this);
}

inherits(ResourcePaneTabHeaderView, xnode.Li);

ResourcePaneTabHeaderView.prototype.setData = function(data) {
	if (data) {
		this.innerHTML = "<a href='#"+data.id+"'>"+data.label+"</a>";
	}
}

module.exports = ResourcePaneTabHeaderView;