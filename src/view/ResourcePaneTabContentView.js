var xnode = require("xnode");
var inherits = require("inherits");

function ResourcePaneTabContentView() {
	xnode.Div.call(this);
}

inherits(ResourcePaneTabContentView, xnode.Div);

ResourcePaneTabContentView.prototype.setData = function(data) {
	if (data) {
		this.id = data.id;

		this.innerHTML = "hello world: " + data.label;
	}
}

module.exports = ResourcePaneTabContentView;