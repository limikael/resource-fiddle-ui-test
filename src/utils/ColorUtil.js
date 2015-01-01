/**
 * Color utilities.
 * @class ColorUtil
 */
function ColorUtil() {}

/**
 * Parse html color.
 * @method parseHTMLColor
 */
ColorUtil.parseHTMLColor = function(htmlColor) {
	if (htmlColor === undefined)
		htmlColor = "";

	var s = htmlColor.toString().trim().replace("#", "");
	var c = {
		red: parseInt(s[0] + s[1], 16),
		green: parseInt(s[2] + s[3], 16),
		blue: parseInt(s[4] + s[5], 16),
	}

	if (isNaN(c.red))
		c.red = 0;

	if (isNaN(c.green))
		c.green = 0;

	if (isNaN(c.blue))
		c.blue = 0;

	return c;
}

module.exports = ColorUtil;