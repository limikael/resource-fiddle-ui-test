var inherits = require("inherits");
var xnode = require("xnode");

function ResourceItemView() {
	xnode.Tr.call(this);

	this.style.height="50px";

	this.keyTd = new xnode.Td();
	this.keyTd.style.width="50%";
	this.appendChild(this.keyTd);

	this.defaultTd = new xnode.Td();
	this.defaultTd.style.width="25%";
	this.appendChild(this.defaultTd);

	this.valueTd = new xnode.Td();
	this.valueTd.style.width="25%";
	this.appendChild(this.valueTd);

	this.valueDiv = new xnode.Div();
	this.valueDiv.className = "ui input fluid mini";
	this.valueTd.appendChild(this.valueDiv);

	this.valueInput = new xnode.Input();
	this.valueInput.type = "text";
	this.valueDiv.appendChild(this.valueInput);

}

inherits(ResourceItemView, xnode.Tr);

ResourceItemView.prototype.setKey = function(value) {
	this.keyTd.innerHTML = value;
}

ResourceItemView.prototype.setDefaultValue = function(value) {
	this.defaultTd.innerHTML = value;
}

ResourceItemView.prototype.setValue = function(value) {
	this.valueInput.value=value;
}

module.exports = ResourceItemView;