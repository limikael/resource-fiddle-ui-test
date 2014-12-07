(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
	/**
	 * The basic xnode class.
	 * It sets the underlying node element by calling
	 * document.createElement
	 */
	function XNode(type, content) {
		this.node = document.createElement(type);

		if (content !== undefined)
			this.node.innerHTML = content;
	}

	/**
	 * This method creates an extended class using
	 * the XNode class defined above.
	 */
	function createExtendedXNodeElement(elementType, content) {
		var f = function(content) {
			XNode.call(this, elementType, content);
		};

		f.prototype = Object.create(XNode.prototype);
		f.prototype.constructor = f;

		return f;
	}

	/**
	 * Create a read only property that returns the
	 * value of the corresponding property of the
	 * underlying node object.
	 */
	function createXNodeReadOnlyProperty(propertyName) {
		Object.defineProperty(XNode.prototype, propertyName, {
			get: function() {
				return this.node[propertyName];
			}
		});
	}

	/**
	 * Create a read write property that operates on
	 * the corresponding property of the underlying
	 * node object.
	 */
	function createXNodeReadWriteProperty(propertyName) {
		Object.defineProperty(XNode.prototype, propertyName, {
			get: function() {
				return this.node[propertyName];
			},

			set: function(value) {
				this.node[propertyName] = value;
			}
		});
	}

	/**
	 * Create a method that routes the call through, down
	 * to the same method on the underlying node object.
	 */
	function createXNodeMethod(methodName) {
		XNode.prototype[methodName] = function() {
			return this.node[methodName].apply(this.node, arguments);
		}
	}

	/**
	 * Modify the Node.property function, so that it accepts
	 * XNode objects. All XNode objects will be changed to
	 * the underlying node objects, and the corresponding
	 * method will be called.
	 */
	function createNodeToXNodeMethodWrapper(methodName) {
		var originalFunction = Node.prototype[methodName];

		Node.prototype[methodName] = function() {
			for (var a in arguments) {
				if (arguments[a] instanceof XNode)
					arguments[a] = arguments[a].node;
			}

			return originalFunction.apply(this, arguments);
		}
	}

	/**
	 * Set up read only properties.
	 */
	createXNodeReadOnlyProperty("style");

	/**
	 * Set up read/write properties.
	 */
	createXNodeReadWriteProperty("innerHTML");
	createXNodeReadWriteProperty("href");
	createXNodeReadWriteProperty("id");

	/**
	 * Set up methods to be routed to the underlying node object.
	 */
	createXNodeMethod("appendChild");
	createXNodeMethod("removeChild");
	createXNodeMethod("addEventListener");
	createXNodeMethod("removeEventListener");

	/**
	 * Set up methods on Node.property.
	 */
	createNodeToXNodeMethodWrapper("appendChild");
	createNodeToXNodeMethodWrapper("removeChild");

	/**
	 * Create event listener aliases.
	 */
	XNode.prototype.on = XNode.prototype.addEventListener;
	XNode.prototype.off = XNode.prototype.removeEventListener;

	/**
	 * Work both as a npm module and standalone.
	 */
	var target;

	if (typeof module !== "undefined" && module.exports) {
		target = {};
		module.exports = target;
	} else {
		xnode = {};
		target = xnode;
	}

	/**
	 * Create extended classes.
	 */
	target.Div = createExtendedXNodeElement("div");
	target.Button = createExtendedXNodeElement("button");
	target.Ul = createExtendedXNodeElement("ul");
	target.Li = createExtendedXNodeElement("li");
	target.A = createExtendedXNodeElement("a");
	target.Option = createExtendedXNodeElement("option");
	target.Select = createExtendedXNodeElement("select");
	target.Input = createExtendedXNodeElement("input");

})();
},{}],2:[function(require,module,exports){
var xnode = require("xnode");
var inherits = require("inherits");
var xnodeui = {};

/**
 * Create a class that extends a jquery ui widget.
 * @method createExtendedXNodeUIElement
 */
function createExtendedXNodeUIElement(jqueryuiType, baseClass) {
	if (!baseClass)
		baseClass = xnode.Div;

	function cls() {
		baseClass.call(this);

		switch (jqueryuiType) {
			case "tabs":
				this.ul = new xnode.Ul();
				this.appendChild(this.ul);
				break;
		}

		this.jqueryuiType = jqueryuiType;
		this.jqueryElement = $(this.node);
		this.jqueryElement[this.jqueryuiType]();
	}

	inherits(cls, baseClass);

	cls.prototype.addEventListener = function(e, f) {
		xnode.Div.prototype.addEventListener.call(this, e, f);
		this.jqueryElement.on(e, f);
	}

	cls.prototype.removeEventListener = function(e, f) {
		xnode.Div.prototype.removeEventListener.call(this, e, f);
		this.jqueryElement.off(e, f);
	}

	cls.prototype.on = cls.prototype.addEventListener;
	cls.prototype.off = cls.prototype.removeEventListener;

	return cls;
}

/**
 * Create a property on an extended jquery ui class.
 * @method createXNodeUIProperty
 */
function createXNodeUIProperty(cls, prototypeName) {
	Object.defineProperty(cls.prototype, prototypeName, {
		get: function() {
			return this.jqueryElement[this.jqueryuiType]("option", prototypeName)
		},

		set: function(value) {
			this.jqueryElement[this.jqueryuiType]("option", prototypeName, value)
		}
	});
}

/**
 * Create several proprties on an extended jquery ui class.
 * @method createXNodeUIProperties
 */
function createXNodeUIProperties(cls, proprtyNames) {
	for (var i = 0; i < proprtyNames.length; i++)
		createXNodeUIProperty(cls, proprtyNames[i]);
}

/**
 * Create a method on an extended jquery ui class.
 * @method createXNodeUIMethod
 */
function createXNodeUIMethod(cls, methodName) {
	cls.prototype[methodName] = function() {
		if (arguments.length == 0)
			return this.jqueryElement[this.jqueryuiType](methodName);

		else if (arguments.length == 1)
			return this.jqueryElement[this.jqueryuiType](methodName, arguments[0]);

		else if (arguments.length == 2)
			return this.jqueryElement[this.jqueryuiType](methodName, arguments[0], arguments[1]);

		else
			throw new Error("that many arguments?");
	}
}

/**
 * Create a method on an extended jquery ui class.
 * @method createXNodeUIMethods
 */
function createXNodeUIMethods(cls, methodNames) {
	for (var i = 0; i < methodNames.length; i++)
		createXNodeUIMethod(cls, methodNames[i]);
}

/**
 * Accordion class.
 * @class Accordion
 */
xnodeui.Accordion = createExtendedXNodeUIElement("accordion");

createXNodeUIProperties(xnodeui.Accordion, [
	"active", "animate", "collapsible", "disabled",
	"event", "header", "heightStyle", "icons"
]);

createXNodeUIMethods(xnodeui.Accordion, [
	"destroy", "disable", "enable", "instance",
	"option", "refresh", "widget"
]);

/**
 * Autocomplete class.
 * @class Autocomplete
 */
xnodeui.Autocomplete = createExtendedXNodeUIElement("autocomplete");

createXNodeUIProperties(xnodeui.Autocomplete, [
	"appendTo", "autoFocus", "delay", "disabled",
	"minLength", "position", "source"
]);

createXNodeUIMethods(xnodeui.Autocomplete, [
	"close", "destroy", "disable", "enable",
	"instance", "option", "search", "widget"
]);

/**
 * Button class.
 * @class xnodeui.Button
 */
xnodeui.Button = createExtendedXNodeUIElement("button", xnode.Button);

createXNodeUIProperties(xnodeui.Button, [
	"disabled", "icons", "label", "text"
]);

createXNodeUIMethods(xnodeui.Button, [
	"destroy", "disable", "enable", "instance",
	"option", "refresh", "widget"
]);

/**
 * Buttonset class.
 * @class xnodeui.Buttonset
 */
xnodeui.Buttonset = createExtendedXNodeUIElement("buttonset");

createXNodeUIProperties(xnodeui.Buttonset, [
	"disabled", "items"
]);

createXNodeUIMethods(xnodeui.Autocomplete, [
	"destroy", "disable", "enable", "instance",
	"option", "refresh", "widget"
]);

/**
 * Slider class.
 * @class xnodeui.Slider
 */
xnodeui.Slider = createExtendedXNodeUIElement("slider");

createXNodeUIProperties(xnodeui.Slider, [
	"animate", "disabled", "max", "min",
	"orientation", "range", "step", "value",
	"values"
]);

createXNodeUIMethods(xnodeui.Slider, [
	"destroy", "disable", "enable", "instance",
	"option", "widget" /*, "value", "values" */
]);

/**
 * Tabs class.
 * @class xnodeui.Tabs
 */
xnodeui.Tabs = createExtendedXNodeUIElement("tabs");

createXNodeUIProperties(xnodeui.Tabs, [
	"active", "collapsible", "disabled", "event",
	"heightStyle", "hide", "show"
]);

createXNodeUIMethods(xnodeui.Tabs, [
	"destroy", "disable", "enable", "instance",
	"load", "option", "refresh", "widget"
]);

/**
 * Datepicker class.
 * @class xnodeui.Datepicker
 */
xnodeui.Datepicker = createExtendedXNodeUIElement("datepicker");

createXNodeUIProperties(xnodeui.Datepicker, [
	"altField", "altFormat", "appendText", "autoSize",
	"beforeShow", "beforeShowDay", "buttonImage", "buttonImageOnly",
	"buttonText", "calculateWeek", "changeMonth", "changeYear",
	"closeText", "constrainInput", "currentText", "dateFormat",
	"dayNames", "dayNamesMin", "dayNamesShort", "defaultDate",
	"duration", "firstDay", "gotoCurrent", "hideIfNoPrevNext",
	"isRTL", "maxDate", "minDate", "monthNames",
	"monthNamesShort", "navigationAsDateFormat", "nextText",
	"numberOfMonths", "onChangeMonthYear",
	"onClose", "onSelect", "prevText", "selectOtherMonths",
	"shortYearCutoff", "showAnim", "showButtonPanel", "showCurrentAtPos",
	"showMonthAfterYear", "showOn", "showOptions", "showOtherMonths",
	"showWeek", "stepMonths", "weekHeader", "yearRange",
	"yearSuffix"
]);

createXNodeUIMethods(xnodeui.Datepicker, [
	"destroy", "dialog", "getDate", "hide",
	"isDisabled", "option", "refresh", "setDate",
	"show", "widget"
]);

/**
 * Dialog class.
 * @class xnodeui.Dialog
 */
xnodeui.Dialog = createExtendedXNodeUIElement("dialog");

createXNodeUIProperties(xnodeui.Dialog, [
	"appendTo", "autoOpen", "buttons", "closeOnEscape",
	"closeText", "dialogClass", "draggable", "height",
	"hide", "maxHeight", "maxWidth", "minHeight",
	"minWidth", "modal", "position", "resizable",
	"show", "title", "width"
]);

createXNodeUIMethods(xnodeui.Dialog, [
	"close", "destroy", "instance", "isOpen",
	"moveToTop", "open", "option", "widget"
]);

/**
 * Menu class.
 * @class xnodeui.Menu
 */
xnodeui.Menu = createExtendedXNodeUIElement("menu", xnode.Ul);

createXNodeUIProperties(xnodeui.Menu, [
	"disabled", "icons", "items", "menus",
	"position", "role"
]);

createXNodeUIMethods(xnodeui.Menu, [
	"blur", "collapse", "collapseAll", "destroy",
	"disable", "enable", "expand", "focus",
	"instance", "isFirstItem", "isLastItem", "next",
	"nextPage", "option", "previous", "previousPage",
	"refresh", "select", "widget"
]);

/**
 * Progressbar class.
 * @class xnodeui.Progressbar
 */
xnodeui.Progressbar = createExtendedXNodeUIElement("progressbar");

createXNodeUIProperties(xnodeui.Progressbar, [
	"disabled", "max", "value"
]);

createXNodeUIMethods(xnodeui.Progressbar, [
	"destroy", "disable", "enable", "instance",
	"option", "widget" /*, "value"*/
]);

/**
 * Selectmenu class.
 * @class xnodeui.Selectmenu
 */
xnodeui.Selectmenu = createExtendedXNodeUIElement("selectmenu", xnode.Select);

createXNodeUIProperties(xnodeui.Selectmenu, [
	"appendTo", "disabled", "icons", "position",
	"width"
]);

createXNodeUIMethods(xnodeui.Selectmenu, [
	"close", "destroy", "disable", "enable",
	"instance", "menuWidget", "open", "option",
	"refresh", "widget"
]);

/**
 * Spinner class.
 * @class xnodeui.Spinner
 */
xnodeui.Spinner = createExtendedXNodeUIElement("spinner", xnode.Input);

createXNodeUIProperties(xnodeui.Spinner, [
	"culture", "disabled", "icons", "incremental",
	"max", "min", "numberFormat", "page",
	"step"
]);

createXNodeUIMethods(xnodeui.Spinner, [
	"destroy", "disable", "enable", "instance",
	"isValid", "option", "pageDown", "pageUp",
	"stepDown", "stepUp", "value", "widget"
]);

module.exports = xnodeui;
},{"inherits":6,"xnode":1}],3:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");
var xnodeui = require("xnodeui");
var ResourcePaneView = require("./ResourcePaneView");

/**
 * Main application view.
 * @class AppView
 */
function AppView() {
	xnode.Div.call(this);

	this.style.position = "absolute";
	this.style.top = 0;
	this.style.left = 0;
	this.style.right = 0;
	this.style.bottom = 0;

	this.resourcePaneView = new ResourcePaneView();
	this.appendChild(this.resourcePaneView);
}

inherits(AppView, xnode.Div);

module.exports = AppView;
},{"./ResourcePaneView":4,"inherits":6,"xnode":1,"xnodeui":2}],4:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");
var xnodeui = require("xnodeui");

/**
 * The left part of the app, showing the resources.
 * @class ResourcePaneView
 */
function ResourcePaneView() {
	xnode.Div.call(this);

	this.style.position = "absolute";
	this.style.top = 0;
	this.style.left = 0;
	this.style.width = "50%";
	this.style.bottom = 0;

	this.tabs = new xnodeui.Tabs();
	this.tabs.style.position = "absolute";
	this.tabs.style.left = 10;
	this.tabs.style.right = 5;
	this.tabs.style.top = 10;
	this.tabs.style.bottom = 10;

	this.tabViews = [];

	this.tabs.ul.appendChild(new xnode.Li("<a href='#tab1'>test1</a>"));
	this.tabs.ul.appendChild(new xnode.Li("<a href='#tab2'>test2</a>"));

	var div;

	div = new xnode.Div();
	div.id = "tab1";
	this.tabs.appendChild(div)

	div = new xnode.Div();
	div.id = "tab2";
	this.tabs.appendChild(div)

	this.tabs.refresh();

	this.appendChild(this.tabs);
}

inherits(ResourcePaneView, xnode.Div);

/**
 * Create a tab.
 */
ResourcePaneView.prototype.createTab = function(label) {
	var id = "resourcePaneTab" + this.tabViews.length;

	var li = new xnode.Li("<a href='" + id + "'>" + label + "</a>");
	this.tabs.ul.appendChild(li);
}

module.exports = ResourcePaneView;
},{"inherits":6,"xnode":1,"xnodeui":2}],5:[function(require,module,exports){
var AppView = require("../src/view/AppView");

window.onload = function() {
	var appView = new AppView();
	document.body.appendChild(appView);

/*	appView.getResourcePaneView().createTab("Hello1");
	appView.getResourcePaneView().createTab("Hello2");*/
}
},{"../src/view/AppView":3}],6:[function(require,module,exports){
module.exports = function(child, parent, proto) {
	var descriptors = {};
	extd(child.prototype, descriptors);
	if (proto) extd(proto, descriptors);
	child.prototype = Object.create(parent.prototype, descriptors);
	child.super = parent;
};

function extd(obj, dest) {
	Object.getOwnPropertyNames(obj).forEach(function(name) {
		dest[name] = Object.getOwnPropertyDescriptor(obj, name);
	});
}

},{}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMveG5vZGUvc3JjL3hub2RlLmpzIiwibm9kZV9tb2R1bGVzL3hub2RldWkvc3JjL3hub2RldWkuanMiLCJzcmMvdmlldy9BcHBWaWV3LmpzIiwic3JjL3ZpZXcvUmVzb3VyY2VQYW5lVmlldy5qcyIsInRlc3Qvdmlld3Rlc3QuanMiLCIuLi8uLi8uLi8uLi91c3IvbGliL25vZGVqcy9pbmhlcml0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpIHtcblx0LyoqXG5cdCAqIFRoZSBiYXNpYyB4bm9kZSBjbGFzcy5cblx0ICogSXQgc2V0cyB0aGUgdW5kZXJseWluZyBub2RlIGVsZW1lbnQgYnkgY2FsbGluZ1xuXHQgKiBkb2N1bWVudC5jcmVhdGVFbGVtZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBYTm9kZSh0eXBlLCBjb250ZW50KSB7XG5cdFx0dGhpcy5ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuXHRcdGlmIChjb250ZW50ICE9PSB1bmRlZmluZWQpXG5cdFx0XHR0aGlzLm5vZGUuaW5uZXJIVE1MID0gY29udGVudDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIG1ldGhvZCBjcmVhdGVzIGFuIGV4dGVuZGVkIGNsYXNzIHVzaW5nXG5cdCAqIHRoZSBYTm9kZSBjbGFzcyBkZWZpbmVkIGFib3ZlLlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoZWxlbWVudFR5cGUsIGNvbnRlbnQpIHtcblx0XHR2YXIgZiA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcblx0XHRcdFhOb2RlLmNhbGwodGhpcywgZWxlbWVudFR5cGUsIGNvbnRlbnQpO1xuXHRcdH07XG5cblx0XHRmLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoWE5vZGUucHJvdG90eXBlKTtcblx0XHRmLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGY7XG5cblx0XHRyZXR1cm4gZjtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSByZWFkIG9ubHkgcHJvcGVydHkgdGhhdCByZXR1cm5zIHRoZVxuXHQgKiB2YWx1ZSBvZiB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBvZiB0aGVcblx0ICogdW5kZXJseWluZyBub2RlIG9iamVjdC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVhOb2RlUmVhZE9ubHlQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoWE5vZGUucHJvdG90eXBlLCBwcm9wZXJ0eU5hbWUsIHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm5vZGVbcHJvcGVydHlOYW1lXTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSByZWFkIHdyaXRlIHByb3BlcnR5IHRoYXQgb3BlcmF0ZXMgb25cblx0ICogdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgb2YgdGhlIHVuZGVybHlpbmdcblx0ICogbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KHByb3BlcnR5TmFtZSkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShYTm9kZS5wcm90b3R5cGUsIHByb3BlcnR5TmFtZSwge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubm9kZVtwcm9wZXJ0eU5hbWVdO1xuXHRcdFx0fSxcblxuXHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHR0aGlzLm5vZGVbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG1ldGhvZCB0aGF0IHJvdXRlcyB0aGUgY2FsbCB0aHJvdWdoLCBkb3duXG5cdCAqIHRvIHRoZSBzYW1lIG1ldGhvZCBvbiB0aGUgdW5kZXJseWluZyBub2RlIG9iamVjdC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVhOb2RlTWV0aG9kKG1ldGhvZE5hbWUpIHtcblx0XHRYTm9kZS5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLm5vZGVbbWV0aG9kTmFtZV0uYXBwbHkodGhpcy5ub2RlLCBhcmd1bWVudHMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBNb2RpZnkgdGhlIE5vZGUucHJvcGVydHkgZnVuY3Rpb24sIHNvIHRoYXQgaXQgYWNjZXB0c1xuXHQgKiBYTm9kZSBvYmplY3RzLiBBbGwgWE5vZGUgb2JqZWN0cyB3aWxsIGJlIGNoYW5nZWQgdG9cblx0ICogdGhlIHVuZGVybHlpbmcgbm9kZSBvYmplY3RzLCBhbmQgdGhlIGNvcnJlc3BvbmRpbmdcblx0ICogbWV0aG9kIHdpbGwgYmUgY2FsbGVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlTm9kZVRvWE5vZGVNZXRob2RXcmFwcGVyKG1ldGhvZE5hbWUpIHtcblx0XHR2YXIgb3JpZ2luYWxGdW5jdGlvbiA9IE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuXG5cdFx0Tm9kZS5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdGZvciAodmFyIGEgaW4gYXJndW1lbnRzKSB7XG5cdFx0XHRcdGlmIChhcmd1bWVudHNbYV0gaW5zdGFuY2VvZiBYTm9kZSlcblx0XHRcdFx0XHRhcmd1bWVudHNbYV0gPSBhcmd1bWVudHNbYV0ubm9kZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG9yaWdpbmFsRnVuY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHVwIHJlYWQgb25seSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVSZWFkT25seVByb3BlcnR5KFwic3R5bGVcIik7XG5cblx0LyoqXG5cdCAqIFNldCB1cCByZWFkL3dyaXRlIHByb3BlcnRpZXMuXG5cdCAqL1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwiaW5uZXJIVE1MXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwiaHJlZlwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImlkXCIpO1xuXG5cdC8qKlxuXHQgKiBTZXQgdXAgbWV0aG9kcyB0byBiZSByb3V0ZWQgdG8gdGhlIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcImFwcGVuZENoaWxkXCIpO1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcInJlbW92ZUNoaWxkXCIpO1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcImFkZEV2ZW50TGlzdGVuZXJcIik7XG5cdGNyZWF0ZVhOb2RlTWV0aG9kKFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiKTtcblxuXHQvKipcblx0ICogU2V0IHVwIG1ldGhvZHMgb24gTm9kZS5wcm9wZXJ0eS5cblx0ICovXG5cdGNyZWF0ZU5vZGVUb1hOb2RlTWV0aG9kV3JhcHBlcihcImFwcGVuZENoaWxkXCIpO1xuXHRjcmVhdGVOb2RlVG9YTm9kZU1ldGhvZFdyYXBwZXIoXCJyZW1vdmVDaGlsZFwiKTtcblxuXHQvKipcblx0ICogQ3JlYXRlIGV2ZW50IGxpc3RlbmVyIGFsaWFzZXMuXG5cdCAqL1xuXHRYTm9kZS5wcm90b3R5cGUub24gPSBYTm9kZS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0WE5vZGUucHJvdG90eXBlLm9mZiA9IFhOb2RlLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXG5cdC8qKlxuXHQgKiBXb3JrIGJvdGggYXMgYSBucG0gbW9kdWxlIGFuZCBzdGFuZGFsb25lLlxuXHQgKi9cblx0dmFyIHRhcmdldDtcblxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdHRhcmdldCA9IHt9O1xuXHRcdG1vZHVsZS5leHBvcnRzID0gdGFyZ2V0O1xuXHR9IGVsc2Uge1xuXHRcdHhub2RlID0ge307XG5cdFx0dGFyZ2V0ID0geG5vZGU7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGV4dGVuZGVkIGNsYXNzZXMuXG5cdCAqL1xuXHR0YXJnZXQuRGl2ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJkaXZcIik7XG5cdHRhcmdldC5CdXR0b24gPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImJ1dHRvblwiKTtcblx0dGFyZ2V0LlVsID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJ1bFwiKTtcblx0dGFyZ2V0LkxpID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJsaVwiKTtcblx0dGFyZ2V0LkEgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImFcIik7XG5cdHRhcmdldC5PcHRpb24gPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcIm9wdGlvblwiKTtcblx0dGFyZ2V0LlNlbGVjdCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwic2VsZWN0XCIpO1xuXHR0YXJnZXQuSW5wdXQgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImlucHV0XCIpO1xuXG59KSgpOyIsInZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZXVpID0ge307XG5cbi8qKlxuICogQ3JlYXRlIGEgY2xhc3MgdGhhdCBleHRlbmRzIGEganF1ZXJ5IHVpIHdpZGdldC5cbiAqIEBtZXRob2QgY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudFxuICovXG5mdW5jdGlvbiBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KGpxdWVyeXVpVHlwZSwgYmFzZUNsYXNzKSB7XG5cdGlmICghYmFzZUNsYXNzKVxuXHRcdGJhc2VDbGFzcyA9IHhub2RlLkRpdjtcblxuXHRmdW5jdGlvbiBjbHMoKSB7XG5cdFx0YmFzZUNsYXNzLmNhbGwodGhpcyk7XG5cblx0XHRzd2l0Y2ggKGpxdWVyeXVpVHlwZSkge1xuXHRcdFx0Y2FzZSBcInRhYnNcIjpcblx0XHRcdFx0dGhpcy51bCA9IG5ldyB4bm9kZS5VbCgpO1xuXHRcdFx0XHR0aGlzLmFwcGVuZENoaWxkKHRoaXMudWwpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHR0aGlzLmpxdWVyeXVpVHlwZSA9IGpxdWVyeXVpVHlwZTtcblx0XHR0aGlzLmpxdWVyeUVsZW1lbnQgPSAkKHRoaXMubm9kZSk7XG5cdFx0dGhpcy5qcXVlcnlFbGVtZW50W3RoaXMuanF1ZXJ5dWlUeXBlXSgpO1xuXHR9XG5cblx0aW5oZXJpdHMoY2xzLCBiYXNlQ2xhc3MpO1xuXG5cdGNscy5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGUsIGYpIHtcblx0XHR4bm9kZS5EaXYucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIuY2FsbCh0aGlzLCBlLCBmKTtcblx0XHR0aGlzLmpxdWVyeUVsZW1lbnQub24oZSwgZik7XG5cdH1cblxuXHRjbHMucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihlLCBmKSB7XG5cdFx0eG5vZGUuRGl2LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyLmNhbGwodGhpcywgZSwgZik7XG5cdFx0dGhpcy5qcXVlcnlFbGVtZW50Lm9mZihlLCBmKTtcblx0fVxuXG5cdGNscy5wcm90b3R5cGUub24gPSBjbHMucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cdGNscy5wcm90b3R5cGUub2ZmID0gY2xzLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXG5cdHJldHVybiBjbHM7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgcHJvcGVydHkgb24gYW4gZXh0ZW5kZWQganF1ZXJ5IHVpIGNsYXNzLlxuICogQG1ldGhvZCBjcmVhdGVYTm9kZVVJUHJvcGVydHlcbiAqL1xuZnVuY3Rpb24gY3JlYXRlWE5vZGVVSVByb3BlcnR5KGNscywgcHJvdG90eXBlTmFtZSkge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoY2xzLnByb3RvdHlwZSwgcHJvdG90eXBlTmFtZSwge1xuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5qcXVlcnlFbGVtZW50W3RoaXMuanF1ZXJ5dWlUeXBlXShcIm9wdGlvblwiLCBwcm90b3R5cGVOYW1lKVxuXHRcdH0sXG5cblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR0aGlzLmpxdWVyeUVsZW1lbnRbdGhpcy5qcXVlcnl1aVR5cGVdKFwib3B0aW9uXCIsIHByb3RvdHlwZU5hbWUsIHZhbHVlKVxuXHRcdH1cblx0fSk7XG59XG5cbi8qKlxuICogQ3JlYXRlIHNldmVyYWwgcHJvcHJ0aWVzIG9uIGFuIGV4dGVuZGVkIGpxdWVyeSB1aSBjbGFzcy5cbiAqIEBtZXRob2QgY3JlYXRlWE5vZGVVSVByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoY2xzLCBwcm9wcnR5TmFtZXMpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcnR5TmFtZXMubGVuZ3RoOyBpKyspXG5cdFx0Y3JlYXRlWE5vZGVVSVByb3BlcnR5KGNscywgcHJvcHJ0eU5hbWVzW2ldKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBtZXRob2Qgb24gYW4gZXh0ZW5kZWQganF1ZXJ5IHVpIGNsYXNzLlxuICogQG1ldGhvZCBjcmVhdGVYTm9kZVVJTWV0aG9kXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVhOb2RlVUlNZXRob2QoY2xzLCBtZXRob2ROYW1lKSB7XG5cdGNscy5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKVxuXHRcdFx0cmV0dXJuIHRoaXMuanF1ZXJ5RWxlbWVudFt0aGlzLmpxdWVyeXVpVHlwZV0obWV0aG9kTmFtZSk7XG5cblx0XHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpXG5cdFx0XHRyZXR1cm4gdGhpcy5qcXVlcnlFbGVtZW50W3RoaXMuanF1ZXJ5dWlUeXBlXShtZXRob2ROYW1lLCBhcmd1bWVudHNbMF0pO1xuXG5cdFx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKVxuXHRcdFx0cmV0dXJuIHRoaXMuanF1ZXJ5RWxlbWVudFt0aGlzLmpxdWVyeXVpVHlwZV0obWV0aG9kTmFtZSwgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xuXG5cdFx0ZWxzZVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwidGhhdCBtYW55IGFyZ3VtZW50cz9cIik7XG5cdH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBtZXRob2Qgb24gYW4gZXh0ZW5kZWQganF1ZXJ5IHVpIGNsYXNzLlxuICogQG1ldGhvZCBjcmVhdGVYTm9kZVVJTWV0aG9kc1xuICovXG5mdW5jdGlvbiBjcmVhdGVYTm9kZVVJTWV0aG9kcyhjbHMsIG1ldGhvZE5hbWVzKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbWV0aG9kTmFtZXMubGVuZ3RoOyBpKyspXG5cdFx0Y3JlYXRlWE5vZGVVSU1ldGhvZChjbHMsIG1ldGhvZE5hbWVzW2ldKTtcbn1cblxuLyoqXG4gKiBBY2NvcmRpb24gY2xhc3MuXG4gKiBAY2xhc3MgQWNjb3JkaW9uXG4gKi9cbnhub2RldWkuQWNjb3JkaW9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcImFjY29yZGlvblwiKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5BY2NvcmRpb24sIFtcblx0XCJhY3RpdmVcIiwgXCJhbmltYXRlXCIsIFwiY29sbGFwc2libGVcIiwgXCJkaXNhYmxlZFwiLFxuXHRcImV2ZW50XCIsIFwiaGVhZGVyXCIsIFwiaGVpZ2h0U3R5bGVcIiwgXCJpY29uc1wiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5BY2NvcmRpb24sIFtcblx0XCJkZXN0cm95XCIsIFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLCBcImluc3RhbmNlXCIsXG5cdFwib3B0aW9uXCIsIFwicmVmcmVzaFwiLCBcIndpZGdldFwiXG5dKTtcblxuLyoqXG4gKiBBdXRvY29tcGxldGUgY2xhc3MuXG4gKiBAY2xhc3MgQXV0b2NvbXBsZXRlXG4gKi9cbnhub2RldWkuQXV0b2NvbXBsZXRlID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcImF1dG9jb21wbGV0ZVwiKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5BdXRvY29tcGxldGUsIFtcblx0XCJhcHBlbmRUb1wiLCBcImF1dG9Gb2N1c1wiLCBcImRlbGF5XCIsIFwiZGlzYWJsZWRcIixcblx0XCJtaW5MZW5ndGhcIiwgXCJwb3NpdGlvblwiLCBcInNvdXJjZVwiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5BdXRvY29tcGxldGUsIFtcblx0XCJjbG9zZVwiLCBcImRlc3Ryb3lcIiwgXCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsXG5cdFwiaW5zdGFuY2VcIiwgXCJvcHRpb25cIiwgXCJzZWFyY2hcIiwgXCJ3aWRnZXRcIlxuXSk7XG5cbi8qKlxuICogQnV0dG9uIGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuQnV0dG9uXG4gKi9cbnhub2RldWkuQnV0dG9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcImJ1dHRvblwiLCB4bm9kZS5CdXR0b24pO1xuXG5jcmVhdGVYTm9kZVVJUHJvcGVydGllcyh4bm9kZXVpLkJ1dHRvbiwgW1xuXHRcImRpc2FibGVkXCIsIFwiaWNvbnNcIiwgXCJsYWJlbFwiLCBcInRleHRcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuQnV0dG9uLCBbXG5cdFwiZGVzdHJveVwiLCBcImRpc2FibGVcIiwgXCJlbmFibGVcIiwgXCJpbnN0YW5jZVwiLFxuXHRcIm9wdGlvblwiLCBcInJlZnJlc2hcIiwgXCJ3aWRnZXRcIlxuXSk7XG5cbi8qKlxuICogQnV0dG9uc2V0IGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuQnV0dG9uc2V0XG4gKi9cbnhub2RldWkuQnV0dG9uc2V0ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcImJ1dHRvbnNldFwiKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5CdXR0b25zZXQsIFtcblx0XCJkaXNhYmxlZFwiLCBcIml0ZW1zXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLkF1dG9jb21wbGV0ZSwgW1xuXHRcImRlc3Ryb3lcIiwgXCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsIFwiaW5zdGFuY2VcIixcblx0XCJvcHRpb25cIiwgXCJyZWZyZXNoXCIsIFwid2lkZ2V0XCJcbl0pO1xuXG4vKipcbiAqIFNsaWRlciBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLlNsaWRlclxuICovXG54bm9kZXVpLlNsaWRlciA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJzbGlkZXJcIik7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuU2xpZGVyLCBbXG5cdFwiYW5pbWF0ZVwiLCBcImRpc2FibGVkXCIsIFwibWF4XCIsIFwibWluXCIsXG5cdFwib3JpZW50YXRpb25cIiwgXCJyYW5nZVwiLCBcInN0ZXBcIiwgXCJ2YWx1ZVwiLFxuXHRcInZhbHVlc1wiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5TbGlkZXIsIFtcblx0XCJkZXN0cm95XCIsIFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLCBcImluc3RhbmNlXCIsXG5cdFwib3B0aW9uXCIsIFwid2lkZ2V0XCIgLyosIFwidmFsdWVcIiwgXCJ2YWx1ZXNcIiAqL1xuXSk7XG5cbi8qKlxuICogVGFicyBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLlRhYnNcbiAqL1xueG5vZGV1aS5UYWJzID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcInRhYnNcIik7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuVGFicywgW1xuXHRcImFjdGl2ZVwiLCBcImNvbGxhcHNpYmxlXCIsIFwiZGlzYWJsZWRcIiwgXCJldmVudFwiLFxuXHRcImhlaWdodFN0eWxlXCIsIFwiaGlkZVwiLCBcInNob3dcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuVGFicywgW1xuXHRcImRlc3Ryb3lcIiwgXCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsIFwiaW5zdGFuY2VcIixcblx0XCJsb2FkXCIsIFwib3B0aW9uXCIsIFwicmVmcmVzaFwiLCBcIndpZGdldFwiXG5dKTtcblxuLyoqXG4gKiBEYXRlcGlja2VyIGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuRGF0ZXBpY2tlclxuICovXG54bm9kZXVpLkRhdGVwaWNrZXIgPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwiZGF0ZXBpY2tlclwiKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5EYXRlcGlja2VyLCBbXG5cdFwiYWx0RmllbGRcIiwgXCJhbHRGb3JtYXRcIiwgXCJhcHBlbmRUZXh0XCIsIFwiYXV0b1NpemVcIixcblx0XCJiZWZvcmVTaG93XCIsIFwiYmVmb3JlU2hvd0RheVwiLCBcImJ1dHRvbkltYWdlXCIsIFwiYnV0dG9uSW1hZ2VPbmx5XCIsXG5cdFwiYnV0dG9uVGV4dFwiLCBcImNhbGN1bGF0ZVdlZWtcIiwgXCJjaGFuZ2VNb250aFwiLCBcImNoYW5nZVllYXJcIixcblx0XCJjbG9zZVRleHRcIiwgXCJjb25zdHJhaW5JbnB1dFwiLCBcImN1cnJlbnRUZXh0XCIsIFwiZGF0ZUZvcm1hdFwiLFxuXHRcImRheU5hbWVzXCIsIFwiZGF5TmFtZXNNaW5cIiwgXCJkYXlOYW1lc1Nob3J0XCIsIFwiZGVmYXVsdERhdGVcIixcblx0XCJkdXJhdGlvblwiLCBcImZpcnN0RGF5XCIsIFwiZ290b0N1cnJlbnRcIiwgXCJoaWRlSWZOb1ByZXZOZXh0XCIsXG5cdFwiaXNSVExcIiwgXCJtYXhEYXRlXCIsIFwibWluRGF0ZVwiLCBcIm1vbnRoTmFtZXNcIixcblx0XCJtb250aE5hbWVzU2hvcnRcIiwgXCJuYXZpZ2F0aW9uQXNEYXRlRm9ybWF0XCIsIFwibmV4dFRleHRcIixcblx0XCJudW1iZXJPZk1vbnRoc1wiLCBcIm9uQ2hhbmdlTW9udGhZZWFyXCIsXG5cdFwib25DbG9zZVwiLCBcIm9uU2VsZWN0XCIsIFwicHJldlRleHRcIiwgXCJzZWxlY3RPdGhlck1vbnRoc1wiLFxuXHRcInNob3J0WWVhckN1dG9mZlwiLCBcInNob3dBbmltXCIsIFwic2hvd0J1dHRvblBhbmVsXCIsIFwic2hvd0N1cnJlbnRBdFBvc1wiLFxuXHRcInNob3dNb250aEFmdGVyWWVhclwiLCBcInNob3dPblwiLCBcInNob3dPcHRpb25zXCIsIFwic2hvd090aGVyTW9udGhzXCIsXG5cdFwic2hvd1dlZWtcIiwgXCJzdGVwTW9udGhzXCIsIFwid2Vla0hlYWRlclwiLCBcInllYXJSYW5nZVwiLFxuXHRcInllYXJTdWZmaXhcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuRGF0ZXBpY2tlciwgW1xuXHRcImRlc3Ryb3lcIiwgXCJkaWFsb2dcIiwgXCJnZXREYXRlXCIsIFwiaGlkZVwiLFxuXHRcImlzRGlzYWJsZWRcIiwgXCJvcHRpb25cIiwgXCJyZWZyZXNoXCIsIFwic2V0RGF0ZVwiLFxuXHRcInNob3dcIiwgXCJ3aWRnZXRcIlxuXSk7XG5cbi8qKlxuICogRGlhbG9nIGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuRGlhbG9nXG4gKi9cbnhub2RldWkuRGlhbG9nID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcImRpYWxvZ1wiKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5EaWFsb2csIFtcblx0XCJhcHBlbmRUb1wiLCBcImF1dG9PcGVuXCIsIFwiYnV0dG9uc1wiLCBcImNsb3NlT25Fc2NhcGVcIixcblx0XCJjbG9zZVRleHRcIiwgXCJkaWFsb2dDbGFzc1wiLCBcImRyYWdnYWJsZVwiLCBcImhlaWdodFwiLFxuXHRcImhpZGVcIiwgXCJtYXhIZWlnaHRcIiwgXCJtYXhXaWR0aFwiLCBcIm1pbkhlaWdodFwiLFxuXHRcIm1pbldpZHRoXCIsIFwibW9kYWxcIiwgXCJwb3NpdGlvblwiLCBcInJlc2l6YWJsZVwiLFxuXHRcInNob3dcIiwgXCJ0aXRsZVwiLCBcIndpZHRoXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLkRpYWxvZywgW1xuXHRcImNsb3NlXCIsIFwiZGVzdHJveVwiLCBcImluc3RhbmNlXCIsIFwiaXNPcGVuXCIsXG5cdFwibW92ZVRvVG9wXCIsIFwib3BlblwiLCBcIm9wdGlvblwiLCBcIndpZGdldFwiXG5dKTtcblxuLyoqXG4gKiBNZW51IGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuTWVudVxuICovXG54bm9kZXVpLk1lbnUgPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwibWVudVwiLCB4bm9kZS5VbCk7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuTWVudSwgW1xuXHRcImRpc2FibGVkXCIsIFwiaWNvbnNcIiwgXCJpdGVtc1wiLCBcIm1lbnVzXCIsXG5cdFwicG9zaXRpb25cIiwgXCJyb2xlXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLk1lbnUsIFtcblx0XCJibHVyXCIsIFwiY29sbGFwc2VcIiwgXCJjb2xsYXBzZUFsbFwiLCBcImRlc3Ryb3lcIixcblx0XCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsIFwiZXhwYW5kXCIsIFwiZm9jdXNcIixcblx0XCJpbnN0YW5jZVwiLCBcImlzRmlyc3RJdGVtXCIsIFwiaXNMYXN0SXRlbVwiLCBcIm5leHRcIixcblx0XCJuZXh0UGFnZVwiLCBcIm9wdGlvblwiLCBcInByZXZpb3VzXCIsIFwicHJldmlvdXNQYWdlXCIsXG5cdFwicmVmcmVzaFwiLCBcInNlbGVjdFwiLCBcIndpZGdldFwiXG5dKTtcblxuLyoqXG4gKiBQcm9ncmVzc2JhciBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLlByb2dyZXNzYmFyXG4gKi9cbnhub2RldWkuUHJvZ3Jlc3NiYXIgPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwicHJvZ3Jlc3NiYXJcIik7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuUHJvZ3Jlc3NiYXIsIFtcblx0XCJkaXNhYmxlZFwiLCBcIm1heFwiLCBcInZhbHVlXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLlByb2dyZXNzYmFyLCBbXG5cdFwiZGVzdHJveVwiLCBcImRpc2FibGVcIiwgXCJlbmFibGVcIiwgXCJpbnN0YW5jZVwiLFxuXHRcIm9wdGlvblwiLCBcIndpZGdldFwiIC8qLCBcInZhbHVlXCIqL1xuXSk7XG5cbi8qKlxuICogU2VsZWN0bWVudSBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLlNlbGVjdG1lbnVcbiAqL1xueG5vZGV1aS5TZWxlY3RtZW51ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcInNlbGVjdG1lbnVcIiwgeG5vZGUuU2VsZWN0KTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5TZWxlY3RtZW51LCBbXG5cdFwiYXBwZW5kVG9cIiwgXCJkaXNhYmxlZFwiLCBcImljb25zXCIsIFwicG9zaXRpb25cIixcblx0XCJ3aWR0aFwiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5TZWxlY3RtZW51LCBbXG5cdFwiY2xvc2VcIiwgXCJkZXN0cm95XCIsIFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLFxuXHRcImluc3RhbmNlXCIsIFwibWVudVdpZGdldFwiLCBcIm9wZW5cIiwgXCJvcHRpb25cIixcblx0XCJyZWZyZXNoXCIsIFwid2lkZ2V0XCJcbl0pO1xuXG4vKipcbiAqIFNwaW5uZXIgY2xhc3MuXG4gKiBAY2xhc3MgeG5vZGV1aS5TcGlubmVyXG4gKi9cbnhub2RldWkuU3Bpbm5lciA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJzcGlubmVyXCIsIHhub2RlLklucHV0KTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5TcGlubmVyLCBbXG5cdFwiY3VsdHVyZVwiLCBcImRpc2FibGVkXCIsIFwiaWNvbnNcIiwgXCJpbmNyZW1lbnRhbFwiLFxuXHRcIm1heFwiLCBcIm1pblwiLCBcIm51bWJlckZvcm1hdFwiLCBcInBhZ2VcIixcblx0XCJzdGVwXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLlNwaW5uZXIsIFtcblx0XCJkZXN0cm95XCIsIFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLCBcImluc3RhbmNlXCIsXG5cdFwiaXNWYWxpZFwiLCBcIm9wdGlvblwiLCBcInBhZ2VEb3duXCIsIFwicGFnZVVwXCIsXG5cdFwic3RlcERvd25cIiwgXCJzdGVwVXBcIiwgXCJ2YWx1ZVwiLCBcIndpZGdldFwiXG5dKTtcblxubW9kdWxlLmV4cG9ydHMgPSB4bm9kZXVpOyIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciB4bm9kZXVpID0gcmVxdWlyZShcInhub2RldWlcIik7XG52YXIgUmVzb3VyY2VQYW5lVmlldyA9IHJlcXVpcmUoXCIuL1Jlc291cmNlUGFuZVZpZXdcIik7XG5cbi8qKlxuICogTWFpbiBhcHBsaWNhdGlvbiB2aWV3LlxuICogQGNsYXNzIEFwcFZpZXdcbiAqL1xuZnVuY3Rpb24gQXBwVmlldygpIHtcblx0eG5vZGUuRGl2LmNhbGwodGhpcyk7XG5cblx0dGhpcy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0dGhpcy5zdHlsZS50b3AgPSAwO1xuXHR0aGlzLnN0eWxlLmxlZnQgPSAwO1xuXHR0aGlzLnN0eWxlLnJpZ2h0ID0gMDtcblx0dGhpcy5zdHlsZS5ib3R0b20gPSAwO1xuXG5cdHRoaXMucmVzb3VyY2VQYW5lVmlldyA9IG5ldyBSZXNvdXJjZVBhbmVWaWV3KCk7XG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5yZXNvdXJjZVBhbmVWaWV3KTtcbn1cblxuaW5oZXJpdHMoQXBwVmlldywgeG5vZGUuRGl2KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBWaWV3OyIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciB4bm9kZXVpID0gcmVxdWlyZShcInhub2RldWlcIik7XG5cbi8qKlxuICogVGhlIGxlZnQgcGFydCBvZiB0aGUgYXBwLCBzaG93aW5nIHRoZSByZXNvdXJjZXMuXG4gKiBAY2xhc3MgUmVzb3VyY2VQYW5lVmlld1xuICovXG5mdW5jdGlvbiBSZXNvdXJjZVBhbmVWaWV3KCkge1xuXHR4bm9kZS5EaXYuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHR0aGlzLnN0eWxlLnRvcCA9IDA7XG5cdHRoaXMuc3R5bGUubGVmdCA9IDA7XG5cdHRoaXMuc3R5bGUud2lkdGggPSBcIjUwJVwiO1xuXHR0aGlzLnN0eWxlLmJvdHRvbSA9IDA7XG5cblx0dGhpcy50YWJzID0gbmV3IHhub2RldWkuVGFicygpO1xuXHR0aGlzLnRhYnMuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMudGFicy5zdHlsZS5sZWZ0ID0gMTA7XG5cdHRoaXMudGFicy5zdHlsZS5yaWdodCA9IDU7XG5cdHRoaXMudGFicy5zdHlsZS50b3AgPSAxMDtcblx0dGhpcy50YWJzLnN0eWxlLmJvdHRvbSA9IDEwO1xuXG5cdHRoaXMudGFiVmlld3MgPSBbXTtcblxuXHR0aGlzLnRhYnMudWwuYXBwZW5kQ2hpbGQobmV3IHhub2RlLkxpKFwiPGEgaHJlZj0nI3RhYjEnPnRlc3QxPC9hPlwiKSk7XG5cdHRoaXMudGFicy51bC5hcHBlbmRDaGlsZChuZXcgeG5vZGUuTGkoXCI8YSBocmVmPScjdGFiMic+dGVzdDI8L2E+XCIpKTtcblxuXHR2YXIgZGl2O1xuXG5cdGRpdiA9IG5ldyB4bm9kZS5EaXYoKTtcblx0ZGl2LmlkID0gXCJ0YWIxXCI7XG5cdHRoaXMudGFicy5hcHBlbmRDaGlsZChkaXYpXG5cblx0ZGl2ID0gbmV3IHhub2RlLkRpdigpO1xuXHRkaXYuaWQgPSBcInRhYjJcIjtcblx0dGhpcy50YWJzLmFwcGVuZENoaWxkKGRpdilcblxuXHR0aGlzLnRhYnMucmVmcmVzaCgpO1xuXG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy50YWJzKTtcbn1cblxuaW5oZXJpdHMoUmVzb3VyY2VQYW5lVmlldywgeG5vZGUuRGl2KTtcblxuLyoqXG4gKiBDcmVhdGUgYSB0YWIuXG4gKi9cblJlc291cmNlUGFuZVZpZXcucHJvdG90eXBlLmNyZWF0ZVRhYiA9IGZ1bmN0aW9uKGxhYmVsKSB7XG5cdHZhciBpZCA9IFwicmVzb3VyY2VQYW5lVGFiXCIgKyB0aGlzLnRhYlZpZXdzLmxlbmd0aDtcblxuXHR2YXIgbGkgPSBuZXcgeG5vZGUuTGkoXCI8YSBocmVmPSdcIiArIGlkICsgXCInPlwiICsgbGFiZWwgKyBcIjwvYT5cIik7XG5cdHRoaXMudGFicy51bC5hcHBlbmRDaGlsZChsaSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VQYW5lVmlldzsiLCJ2YXIgQXBwVmlldyA9IHJlcXVpcmUoXCIuLi9zcmMvdmlldy9BcHBWaWV3XCIpO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdHZhciBhcHBWaWV3ID0gbmV3IEFwcFZpZXcoKTtcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhcHBWaWV3KTtcblxuLypcdGFwcFZpZXcuZ2V0UmVzb3VyY2VQYW5lVmlldygpLmNyZWF0ZVRhYihcIkhlbGxvMVwiKTtcblx0YXBwVmlldy5nZXRSZXNvdXJjZVBhbmVWaWV3KCkuY3JlYXRlVGFiKFwiSGVsbG8yXCIpOyovXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50LCBwcm90bykge1xuXHR2YXIgZGVzY3JpcHRvcnMgPSB7fTtcblx0ZXh0ZChjaGlsZC5wcm90b3R5cGUsIGRlc2NyaXB0b3JzKTtcblx0aWYgKHByb3RvKSBleHRkKHByb3RvLCBkZXNjcmlwdG9ycyk7XG5cdGNoaWxkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGFyZW50LnByb3RvdHlwZSwgZGVzY3JpcHRvcnMpO1xuXHRjaGlsZC5zdXBlciA9IHBhcmVudDtcbn07XG5cbmZ1bmN0aW9uIGV4dGQob2JqLCBkZXN0KSB7XG5cdE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG5cdFx0ZGVzdFtuYW1lXSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBuYW1lKTtcblx0fSk7XG59XG4iXX0=
