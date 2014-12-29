var xnode = require("xnode");
var inherits = require("inherits");

function ResourceTabView() {
	xnode.Div.call(this);
	this.className = "ui bottom attached active tab segment";

	//this.innerHTML = "hello";

	this.inner = new xnode.Div();
	this.inner.style.position = "relative";
	this.inner.style.height = "calc(100% - 65px)";
	this.inner.style.padding = "1px";
	this.inner.style.overflowY = "scroll";
	this.appendChild(this.inner);
}

inherits(ResourceTabView, xnode.Div);

ResourceTabView.prototype.setActive = function(active) {
	if (active) {
		this.style.display = "block";
		this.className = "ui bottom attached active tab segment active";
	} else {
		this.style.display = "none";
		this.className = "ui bottom attached active tab segment";
	}
}

ResourceTabView.prototype.setLabel = function(label) {
	//this.innerHTML = label;
}

module.exports = ResourceTabView;