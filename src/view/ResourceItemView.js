var inherits = require("inherits");
var xnode = require("xnode");
var ResourceColorValueView = require("./ResourceColorValueView");

function ResourceItemView() {
	xnode.Tr.call(this);

	this.style.height = "50px";

	this.keyTd = new xnode.Td();
	this.keyTd.style.width = "50%";
	this.appendChild(this.keyTd);

	this.valueTd = new xnode.Td();
	this.valueTd.style.position="relative";
	this.valueTd.style.width = "50%";
	this.appendChild(this.valueTd);

	this.valueView = null;
	this.itemType = null;
	this.value = null;
	this.defaultValue = null;

	/*this.defaultTd = new xnode.Td();
	this.defaultTd.style.width = "25%";
	this.appendChild(this.defaultTd);

	this.valueTd = new xnode.Td();
	this.valueTd.style.width = "25%";
	this.appendChild(this.valueTd);

	this.valueDiv = new xnode.Div();
	this.valueDiv.className = "ui input fluid mini";
	this.valueTd.appendChild(this.valueDiv);

	this.valueInput = new xnode.Input();
	this.valueInput.type = "text";
	this.valueDiv.appendChild(this.valueInput);*/
}

inherits(ResourceItemView, xnode.Tr);

ResourceItemView.prototype.setKey = function(value) {
	this.keyTd.innerHTML = value;
}

ResourceItemView.prototype.setDefaultValue = function(defaultValue) {
	this.defaultValue = defaultValue;

	if (this.valueView)
		this.valueView.setDefaultValue(this.defaultValue);
}

ResourceItemView.prototype.setValue = function(value) {
	this.value = value;

	if (this.valueView)
		this.valueView.setValue(this.value);
}

ResourceItemView.prototype.setItemType = function(itemType) {
	if (itemType == this.itemType)
		return;

	if (this.valueView)
		this.valueTd.removeChild(this.valueView);

	this.valueView = null;
	this.itemType = itemType;

	switch (this.itemType) {
		case "position":
			this.valueView = new ResourceColorValueView();
	}

	if (this.valueView) {
		this.valueTd.appendChild(this.valueView);
		this.valueView.setDefaultValue(this.defaultValue);
		this.valueView.setValue(this.value);
	}
}

module.exports = ResourceItemView;