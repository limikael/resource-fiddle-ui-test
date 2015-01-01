var inherits = require("inherits");
var xnode = require("xnode");
var ColorUtil = require("../utils/ColorUtil");

/**
 * The value view for a color. This should have a color picker!
 * Candidates:
 *   - http://www.digitalmagicpro.com/jPicker/
 * @class ResourceColorValueView
 */
function ResourceColorValueView() {
	xnode.Div.call(this);

	this.defaultValueView = new xnode.Div();
	this.defaultValueView.style.position = "absolute";
	this.defaultValueView.style.height = "25px";
	this.defaultValueView.style.width = "70px";
	this.defaultValueView.style.top = "12px";
	this.defaultValueView.style.background = "#ff0000"
	this.defaultValueView.style.borderRadius = "5px";
	this.defaultValueView.style.padding = "3px";
	this.defaultValueView.style.textAlign = "center";
	this.defaultValueView.style.border = "1px solid #e0e0e0";

	this.appendChild(this.defaultValueView);

	this.valueInput = new xnode.Input();
	this.valueInput.style.position = "absolute";
	this.valueInput.style.left = "calc(50% - 10px)";
	this.valueInput.style.height = "25px";
	this.valueInput.style.width = "70px";
	this.valueInput.style.top = "12px";
	this.valueInput.style.background = "#ff0000"
	this.valueInput.style.borderRadius = "5px";
	this.valueInput.style.padding = "3px";
	this.valueInput.style.textAlign = "center";
	this.valueInput.style.border = "1px solid #e0e0e0";
	this.valueInput.style.outline = 0;

	this.valueInput.addEventListener("change", this.onValueInputChange.bind(this));

	this.appendChild(this.valueInput);
}

inherits(ResourceColorValueView, xnode.Div);

/**
 * Set color value for default.
 * @method setDefaultValue
 */
ResourceColorValueView.prototype.setDefaultValue = function(defaultValue) {
	this.defaultValue = defaultValue;
	this.defaultValueView.innerHTML = defaultValue;
	this.updateBackgroundColors();
}

/**
 * Set color value for current.
 * @method setValue
 */
ResourceColorValueView.prototype.setValue = function(value) {
	this.value = value;
	this.valueInput.value = value;
	this.updateBackgroundColors();
}

/**
 * Value input change.
 * @method onValueInputChange
 */
ResourceColorValueView.prototype.onValueInputChange = function(value) {
	this.value = this.valueInput.value;
	this.updateBackgroundColors();
}

/**
 * Update background colors.
 * @method updateBackgroundColors
 * @private
 */
ResourceColorValueView.prototype.updateBackgroundColors = function() {
	this.defaultValueView.style.background = this.defaultValue;
	this.valueInput.style.background = this.value;

	var c = ColorUtil.parseHTMLColor(this.defaultValue);
	var avg = (c.red + c.green + c.blue) / 3;

	if (avg > 128)
		this.defaultValueView.style.color = "#000000";

	else
		this.defaultValueView.style.color = "#ffffff";

	var c = ColorUtil.parseHTMLColor(this.value);
	var avg = (c.red + c.green + c.blue) / 3;

	if (avg > 128)
		this.valueInput.style.color = "#000000";

	else
		this.valueInput.style.color = "#ffffff";
}

module.exports = ResourceColorValueView;