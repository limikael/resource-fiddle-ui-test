var xnode = require("xnode");
var inherits = require("inherits");

function ResourceTabView() {
	xnode.Div.call(this);
}

inherits(ResourceTabView, xnode.Div);

ResourceTabView.prototype.setData = function(data) {
	if (data) {
		this.id = data.id;

		this.innerHTML = "hello world: " + data.label;
	}
}

module.exports = ResourceTabView;