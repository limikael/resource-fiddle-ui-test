(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
	createXNodeReadWriteProperty("value");
	createXNodeReadWriteProperty("type");

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
},{}],4:[function(require,module,exports){
/**
 * AS3/jquery style event dispatcher. Slightly modified. The
 * jquery style on/off/trigger style of adding listeners is
 * currently the preferred one.
 *
 * The on method for adding listeners takes an extra parameter which is the
 * scope in which listeners should be called. So this:
 *
 *     object.on("event", listener, this);
 *
 * Has the same function when adding events as:
 *
 *     object.on("event", listener.bind(this));
 *
 * However, the difference is that if we use the second method it
 * will not be possible to remove the listeners later, unless
 * the closure created by bind is stored somewhere. If the
 * first method is used, we can remove the listener with:
 *
 *     object.off("event", listener, this);
 *
 * @class EventDispatcher
 */
function EventDispatcher() {
	this.listenerMap = {};
}

/**
 * Add event listener.
 * @method addEventListener
 */
EventDispatcher.prototype.addEventListener = function(eventType, listener, scope) {
	if (!this.listenerMap)
		this.listenerMap = {};

	if (!eventType)
		throw new Error("Event type required for event dispatcher");

	if (!listener)
		throw new Error("Listener required for event dispatcher");

	this.removeEventListener(eventType, listener, scope);

	if (!this.listenerMap.hasOwnProperty(eventType))
		this.listenerMap[eventType] = [];

	this.listenerMap[eventType].push({
		listener: listener,
		scope: scope
	});
}

/**
 * Remove event listener.
 * @method removeEventListener
 */
EventDispatcher.prototype.removeEventListener = function(eventType, listener, scope) {
	if (!this.listenerMap)
		this.listenerMap = {};

	if (!this.listenerMap.hasOwnProperty(eventType))
		return;

	var listeners = this.listenerMap[eventType];

	for (var i = 0; i < listeners.length; i++) {
		var listenerObj = listeners[i];

		if (listener == listenerObj.listener && scope == listenerObj.scope) {
			listeners.splice(i, 1);
			i--;
		}
	}

	if (!listeners.length)
		delete this.listenerMap[eventType];
}

/**
 * Dispatch event.
 * @method dispatchEvent
 */
EventDispatcher.prototype.dispatchEvent = function(event /* ... */ ) {
	if (!this.listenerMap)
		this.listenerMap = {};

	var eventType;
	var listenerParams;

	if (typeof event == "string") {
		eventType = event;

		if (arguments.length > 1)
			listenerParams = Array.prototype.slice.call(arguments, 1);

		else listenerParams = [{
			type: eventType,
			target: this
		}];
	} else {
		eventType = event.type;
		event.target = this;
		listenerParams = [event];
	}

	if (!this.listenerMap.hasOwnProperty(eventType))
		return;

	for (var i in this.listenerMap[eventType]) {
		var listenerObj = this.listenerMap[eventType][i];
		listenerObj.listener.apply(listenerObj.scope, listenerParams);
	}
}

/**
 * Jquery style alias for addEventListener
 * @method on
 */
EventDispatcher.prototype.on = EventDispatcher.prototype.addEventListener;

/**
 * Jquery style alias for removeEventListener
 * @method off
 */
EventDispatcher.prototype.off = EventDispatcher.prototype.removeEventListener;

/**
 * Jquery style alias for dispatchEvent
 * @method trigger
 */
EventDispatcher.prototype.trigger = EventDispatcher.prototype.dispatchEvent;

/**
 * Make something an event dispatcher. Can be used for multiple inheritance.
 * @method init
 * @static
 */
EventDispatcher.init = function(cls) {
	cls.prototype.addEventListener = EventDispatcher.prototype.addEventListener;
	cls.prototype.removeEventListener = EventDispatcher.prototype.removeEventListener;
	cls.prototype.dispatchEvent = EventDispatcher.prototype.dispatchEvent;
	cls.prototype.on = EventDispatcher.prototype.on;
	cls.prototype.off = EventDispatcher.prototype.off;
	cls.prototype.trigger = EventDispatcher.prototype.trigger;
}

if (typeof module !== 'undefined') {
	module.exports = EventDispatcher;
}
},{}],5:[function(require,module,exports){
var inherits = require("inherits");
var EventDispatcher = require("yaed");

/**
 * Collection.
 * @class Collection
 */
function Collection() {
	this.items = [];
}

inherits(Collection, EventDispatcher);

/**
 * Add item at end.
 * @method addItem
 */
Collection.prototype.addItem = function(item) {
	this.items.push(item);

	this.triggerChange("add", item, this.items.length - 1);
}

/**
 * Add item at index.
 * @method addItem
 */
Collection.prototype.addItemAt = function(index, item) {
	if (index < 0)
		index = 0;

	if (index > this.items.length)
		index = this.items.length;

	var after = this.items.splice(index);
	this.items.push(item);
	this.items = this.items.concat(after);

	this.triggerChange("add", item, index);
}

/**
 * Get length.
 * @method getLength
 */
Collection.prototype.getLength = function() {
	return this.items.length;
}

/**
 * Get item at index.
 * @method getItemAt
 */
Collection.prototype.getItemAt = function(index) {
	return this.items[index];
}

/**
 * Find item index.
 * @method getItemIndex
 */
Collection.prototype.getItemIndex = function(item) {
	return this.items.indexOf(item);
}

/**
 * Remove item at.
 * @method removeItemAt
 */
Collection.prototype.removeItemAt = function(index) {
	if (index < 0 || index >= this.items.length)
		return;

	var item = this.getItemAt(index);

	this.items.splice(index, 1);
	this.triggerChange("remove", item, index);
}

/**
 * Remove item.
 * @method removeItem
 */
Collection.prototype.removeItem = function(item) {
	var index = this.getItemIndex(item);

	this.removeItemAt(index);
}

/**
 * Trigger change event.
 * @method triggerChange
 * @private
 */
Collection.prototype.triggerChange = function(eventKind, item, index) {
	this.trigger({
		type: eventKind,
		item: item,
		index: index
	});

	this.trigger({
		type: "change",
		kind: eventKind,
		item: item,
		index: index
	});
}

module.exports = Collection;
},{"inherits":1,"yaed":4}],6:[function(require,module,exports){
var EventDispatcher = require("yaed");
var xnode = require("xnode");
var inherits = require("inherits");
var CollectionViewManager=require("./CollectionViewManager");

/**
 * CollectionView.
 * @class CollectionView
 */
function CollectionView() {
	xnode.Div.call(this);

	this.manager=new CollectionViewManager(this);
}

inherits(CollectionView, xnode.Div);

/**
 * Set item renderer class.
 * @method setItemRendererClass
 */
CollectionView.prototype.setItemRendererClass = function(value) {
	this.manager.setItemRendererClass(value);
}

/**
 * Set item renderer factory.
 * @method setItemRendererFactory
 */
CollectionView.prototype.setItemRendererFactory = function(value) {
	this.manager.setItemRendererFactory(value);
}

/**
 * Set item controller class.
 * @method setItemRendererClass
 */
CollectionView.prototype.setItemControllerClass = function(value) {
	this.manager.setItemControllerClass(value);
}

/**
 * Set item controller factory.
 * @method setItemRendererFactory
 */
CollectionView.prototype.setItemControllerFactory = function(value) {
	this.manager.setItemControllerFactory(value);
}

/**
 * Set data source.
 * @method setDataSource
 */
CollectionView.prototype.setDataSource = function(value) {
	this.manager.setDataSource(value);
}

module.exports = CollectionView;
},{"./CollectionViewManager":7,"inherits":1,"xnode":3,"yaed":4}],7:[function(require,module,exports){
var EventDispatcher = require("yaed");
var xnode = require("xnode");
var inherits = require("inherits");

/**
 * CollectionViewManager.
 * @class CollectionViewManager
 */
function CollectionViewManager(target) {
	this.itemRenderers = [];
	this.itemRendererClass = null;
	this.itemRendererFactory = null;
	this.itemControllerClass = null;
	this.itemControllerFactory = null;
	this.dataSource = null;
	this.target = null;

	this.setTarget(target);
}

/**
 * Set target.
 * @method setTarget
 */
CollectionViewManager.prototype.setTarget = function(value) {
	this.removeAllItemRenderers();
	this.target=value;
	this.removeAllItemRenderers();
}

/**
 * Set item renderer class.
 * @method setItemRendererClass
 */
CollectionViewManager.prototype.setItemRendererClass = function(value) {
	if (value && typeof value != "function")
		throw new Error("The item renderer class should be a function");

	this.itemRendererClass = value;
	this.refreshAllItemRenderers();
}

/**
 * Set item renderer factory.
 * @method setItemRendererFactory
 */
CollectionViewManager.prototype.setItemRendererFactory = function(value) {
	if (value && typeof value != "function")
		throw new Error("The item renderer factory should be a function");

	this.itemRendererFactory = value;
	this.refreshAllItemRenderers();
}

/**
 * Set item controller class.
 * @method setItemRendererClass
 */
CollectionViewManager.prototype.setItemControllerClass = function(value) {
	if (value && typeof value != "function")
		throw new Error("The item renderer class should be a function");

	this.itemControllerClass = value;
	this.refreshAllItemRenderers();
}

/**
 * Set item controller factory.
 * @method setItemRendererFactory
 */
CollectionViewManager.prototype.setItemControllerFactory = function(value) {
	if (value && typeof value != "function")
		throw new Error("The item renderer factory should be a function");

	this.itemControllerFactory = value;
	this.refreshAllItemRenderers();
}

/**
 * Set data source.
 * @method setDataSource
 */
CollectionViewManager.prototype.setDataSource = function(value) {
	if (this.dataSource) {
		this.dataSource.off("change", this.onDataSourceChange, this);
	}

	this.dataSource = value;

	if (this.dataSource) {
		this.dataSource.on("change", this.onDataSourceChange, this);
	}

	this.refreshAllItemRenderers();
}

/**
 * Something in the data source was changed.
 * @method onDataSourceChange
 * @private
 */
CollectionViewManager.prototype.onDataSourceChange = function() {
	this.refreshAllItemRenderers();
}

/**
 * Remove all item renderers.
 * @method removeAllItemRenderers
 * @private
 */
CollectionViewManager.prototype.removeAllItemRenderers = function() {
	for (var i = 0; i < this.itemRenderers.length; i++) {
		if (this.itemRenderers[i].__controller)
			this.itemRenderers[i].__controller.setData(null);

		else
			this.itemRenderers[i].setData(null);

		this.target.removeChild(this.itemRenderers[i]);
	}

	this.itemRenderers = [];
}

/**
 * Refresh all item renderers.
 * @method refreshAllItemRenderers
 * @private
 */
CollectionViewManager.prototype.refreshAllItemRenderers = function() {
	this.removeAllItemRenderers();

	if (!this.dataSource)
		return;

	if (!this.itemRendererClass && !this.itemRendererFactory)
		return;

	if (!this.target)
		return;

	for (var i = 0; i < this.dataSource.getLength(); i++) {
		var data = this.dataSource.getItemAt(i);
		var renderer = this.createItemRenderer();

		if (this.itemControllerClass || this.itemControllerFactory) {
			renderer.__controller = this.createItemController(renderer);
			renderer.__controller.setData(data);
		} else {
			renderer.setData(data);
		}

		this.itemRenderers.push(renderer);
		this.target.appendChild(renderer);
	}
}

/**
 * Create item renderer.
 * @method createItemRenderer
 * @private
 */
CollectionViewManager.prototype.createItemRenderer = function() {
	if (this.itemRendererFactory)
		return this.itemRendererFactory();

	if (this.itemRendererClass)
		return new this.itemRendererClass();

	throw new Error("Can't create item renderer!");
}

/**
 * Create item controller.
 * @method createItemController
 * @private
 */
CollectionViewManager.prototype.createItemController = function(renderer) {
	if (this.itemControllerFactory)
		return this.itemControllerFactory(renderer);

	if (this.itemControllerClass)
		return new this.itemControllerClass(renderer);

	throw new Error("Can't create item controller!");
}

module.exports = CollectionViewManager;
},{"inherits":1,"xnode":3,"yaed":4}],8:[function(require,module,exports){
module.exports = {
	Collection: require("./Collection"),
	CollectionView: require("./CollectionView"),
	CollectionViewManager: require("./CollectionViewManager")
};
},{"./Collection":5,"./CollectionView":6,"./CollectionViewManager":7}],9:[function(require,module,exports){
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
},{"inherits":1,"xnode":2}],10:[function(require,module,exports){
var xnode = require("xnode");
var inherits = require("inherits");
var AppView = require("../view/AppView");
var AppModel = require("../model/AppModel");
var AppController = require("../controller/AppController");

/**
 * The main resource fiddle app class.
 * @class App
 */
function App() {
	xnode.Div.call(this);

	this.style.position = "absolute";
	this.style.top = 0;
	this.style.bottom = 0;
	this.style.left = 0;
	this.style.right = 0;

	this.appView = new AppView();
	this.appModel = new AppModel();
	this.appController = new AppController(this.appModel, this.appView);

	this.appendChild(this.appView);
}

inherits(App, xnode.Div);

/**
 * Get model.
 * @method getModel
 */
App.prototype.getModel = function() {
	return this.appModel;
}

module.exports = App;
},{"../controller/AppController":11,"../model/AppModel":14,"../view/AppView":16,"inherits":1,"xnode":2}],11:[function(require,module,exports){
var ResourceTabHeaderController = require("./ResourceTabHeaderController");

/**
 * App controller
 * @class AppController
 */
function AppController(appModel, appView) {
	this.appModel = appModel;
	this.appView = appView;

	this.appView.getResourcePaneView().setTabsCollection(this.appModel.getCategoryCollection());
	this.appView.getResourcePaneView().getTabsHeaderManager().setItemControllerClass(ResourceTabHeaderController);
}

module.exports = AppController;
},{"./ResourceTabHeaderController":12}],12:[function(require,module,exports){
function ResourceTabHeaderController(tabHeaderView) {
	this.tabHeaderView = tabHeaderView;
}

ResourceTabHeaderController.prototype.setData = function(categoryModel) {
	if (categoryModel) {
		this.tabHeaderView.setLabel(categoryModel.getLabel());
		this.tabHeaderView.setTargetId(categoryModel.getId());
	}
}

module.exports = ResourceTabHeaderController;
},{}],13:[function(require,module,exports){
fiddleui = {
	App: require("./app/App"),
	CategoryModel: require("./model/CategoryModel")
};
},{"./app/App":10,"./model/CategoryModel":15}],14:[function(require,module,exports){
var xnodec = require("xnodecollection");

/**
 * AppModel
 * @class AppModel
 */
function AppModel() {
	this.categoryCollection = new xnodec.Collection();

	this.idCount = 0;
}

/**
 * Get category collection.
 * @method getCategoryCollection
 */
AppModel.prototype.getCategoryCollection = function() {
	return this.categoryCollection;
}

/**
 * Get something usable for a unique id.
 * @method getNextId
 */
AppModel.prototype.getNextId = function() {
	this.idCount++;

	return "elem" + this.idCount;
}

/**
 * Add category model.
 * @method addCategoryModel
 */
AppModel.prototype.addCategoryModel = function(categoryModel) {
	categoryModel.setParentModel(this);
	this.categoryCollection.addItem(categoryModel);
}

module.exports = AppModel;
},{"xnodecollection":8}],15:[function(require,module,exports){
var AppModel = require("./AppModel");

/**
 * Get category model.
 * @class CategoryModel
 */
function CategoryModel(label) {
	this.label = label;
	this.parentModel = null;
}

/**
 * Set reference to parent model.
 * @method getParentModel
 */
CategoryModel.prototype.setParentModel = function(value) {
	this.parentModel = value;
}

/**
 * Get label.
 * @method getLabel
 */
CategoryModel.prototype.getLabel = function() {
	return this.label;
}

/**
 * Get id.
 */
CategoryModel.prototype.getId = function() {
	if (!this.id)
		this.id = this.getAppModel().getNextId();

	return this.id;
}

/**
 * Get reference to app model.
 * @method getAppModel
 */
CategoryModel.prototype.getAppModel = function() {
	if (!this.parentModel)
		throw new Error("there is no parent!");

	var p = this.parentModel;

	while (p && !(p instanceof AppModel))
		p = p.parentModel;

	return p;
}

module.exports = CategoryModel;
},{"./AppModel":14}],16:[function(require,module,exports){
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

AppView.prototype.getResourcePaneView = function() {
	return this.resourcePaneView;
}

module.exports = AppView;
},{"./ResourcePaneView":17,"inherits":1,"xnode":2,"xnodeui":9}],17:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");
var xnodeui = require("xnodeui");
var xnodec = require("xnodecollection");
var ResourceTabHeaderView = require("./ResourceTabHeaderView");
var ResourceTabView = require("./ResourceTabView");

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
	this.appendChild(this.tabs);

	this.tabsHeaderManager = new xnodec.CollectionViewManager(this.tabs.ul);
	this.tabsHeaderManager.setItemRendererClass(ResourceTabHeaderView);

	this.tabsContentManager = new xnodec.CollectionViewManager(this.tabs);
	this.tabsContentManager.setItemRendererClass(ResourceTabView);
}

inherits(ResourcePaneView, xnode.Div);

/**
 * Set tabs collection.
 */
ResourcePaneView.prototype.setTabsCollection = function(collection) {
	this.tabsHeaderManager.setDataSource(collection);
	this.tabsContentManager.setDataSource(collection);

	var scope=this;

	collection.on("change",function() {
		scope.tabs.refresh();
	});
}

/**
 * Get tabs header manager.
 * @method getTabsHeaderManager
 */
ResourcePaneView.prototype.getTabsHeaderManager = function() {
	return this.tabsHeaderManager;
}

module.exports = ResourcePaneView;
},{"./ResourceTabHeaderView":18,"./ResourceTabView":19,"inherits":1,"xnode":2,"xnodecollection":8,"xnodeui":9}],18:[function(require,module,exports){
var xnode = require("xnode");
var inherits = require("inherits");

function ResourceTabHeaderView() {
	xnode.Li.call(this);

	this.targetId = null;
	this.label = null;
}

inherits(ResourceTabHeaderView, xnode.Li);

ResourceTabHeaderView.prototype.setTargetId = function(id) {
	this.targetId = id;
	this.refresh();
}

ResourceTabHeaderView.prototype.setLabel = function(label) {
	this.label = label;
	this.refresh();
}

ResourceTabHeaderView.prototype.refresh = function() {
	if (this.label && this.targetId) {
		this.innerHTML = "<a href='#" + this.targetId + "'>" + this.label + "</a>";
	}
}

module.exports = ResourceTabHeaderView;
},{"inherits":1,"xnode":2}],19:[function(require,module,exports){
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
},{"inherits":1,"xnode":2}]},{},[13])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy94bm9kZS9zcmMveG5vZGUuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL25vZGVfbW9kdWxlcy94bm9kZS9zcmMveG5vZGUuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL25vZGVfbW9kdWxlcy95YWVkL3NyYy9FdmVudERpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3hub2RlY29sbGVjdGlvbi9zcmMvQ29sbGVjdGlvblZpZXcuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uVmlld01hbmFnZXIuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94bm9kZXVpL3NyYy94bm9kZXVpLmpzIiwic3JjL2FwcC9BcHAuanMiLCJzcmMvY29udHJvbGxlci9BcHBDb250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyLmpzIiwic3JjL2ZpZGRsZXVpLmpzIiwic3JjL21vZGVsL0FwcE1vZGVsLmpzIiwic3JjL21vZGVsL0NhdGVnb3J5TW9kZWwuanMiLCJzcmMvdmlldy9BcHBWaWV3LmpzIiwic3JjL3ZpZXcvUmVzb3VyY2VQYW5lVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlVGFiSGVhZGVyVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlVGFiVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIoZnVuY3Rpb24oKSB7XG5cdC8qKlxuXHQgKiBUaGUgYmFzaWMgeG5vZGUgY2xhc3MuXG5cdCAqIEl0IHNldHMgdGhlIHVuZGVybHlpbmcgbm9kZSBlbGVtZW50IGJ5IGNhbGxpbmdcblx0ICogZG9jdW1lbnQuY3JlYXRlRWxlbWVudFxuXHQgKi9cblx0ZnVuY3Rpb24gWE5vZGUodHlwZSwgY29udGVudCkge1xuXHRcdHRoaXMubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cblx0XHRpZiAoY29udGVudCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0dGhpcy5ub2RlLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBtZXRob2QgY3JlYXRlcyBhbiBleHRlbmRlZCBjbGFzcyB1c2luZ1xuXHQgKiB0aGUgWE5vZGUgY2xhc3MgZGVmaW5lZCBhYm92ZS5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KGVsZW1lbnRUeXBlLCBjb250ZW50KSB7XG5cdFx0dmFyIGYgPSBmdW5jdGlvbihjb250ZW50KSB7XG5cdFx0XHRYTm9kZS5jYWxsKHRoaXMsIGVsZW1lbnRUeXBlLCBjb250ZW50KTtcblx0XHR9O1xuXG5cdFx0Zi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFhOb2RlLnByb3RvdHlwZSk7XG5cdFx0Zi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBmO1xuXG5cdFx0cmV0dXJuIGY7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcmVhZCBvbmx5IHByb3BlcnR5IHRoYXQgcmV0dXJucyB0aGVcblx0ICogdmFsdWUgb2YgdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgb2YgdGhlXG5cdCAqIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZVJlYWRPbmx5UHJvcGVydHkocHJvcGVydHlOYW1lKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFhOb2RlLnByb3RvdHlwZSwgcHJvcGVydHlOYW1lLCB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5ub2RlW3Byb3BlcnR5TmFtZV07XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcmVhZCB3cml0ZSBwcm9wZXJ0eSB0aGF0IG9wZXJhdGVzIG9uXG5cdCAqIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5IG9mIHRoZSB1bmRlcmx5aW5nXG5cdCAqIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoWE5vZGUucHJvdG90eXBlLCBwcm9wZXJ0eU5hbWUsIHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm5vZGVbcHJvcGVydHlOYW1lXTtcblx0XHRcdH0sXG5cblx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0dGhpcy5ub2RlW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBtZXRob2QgdGhhdCByb3V0ZXMgdGhlIGNhbGwgdGhyb3VnaCwgZG93blxuXHQgKiB0byB0aGUgc2FtZSBtZXRob2Qgb24gdGhlIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZU1ldGhvZChtZXRob2ROYW1lKSB7XG5cdFx0WE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5ub2RlW21ldGhvZE5hbWVdLmFwcGx5KHRoaXMubm9kZSwgYXJndW1lbnRzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogTW9kaWZ5IHRoZSBOb2RlLnByb3BlcnR5IGZ1bmN0aW9uLCBzbyB0aGF0IGl0IGFjY2VwdHNcblx0ICogWE5vZGUgb2JqZWN0cy4gQWxsIFhOb2RlIG9iamVjdHMgd2lsbCBiZSBjaGFuZ2VkIHRvXG5cdCAqIHRoZSB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0cywgYW5kIHRoZSBjb3JyZXNwb25kaW5nXG5cdCAqIG1ldGhvZCB3aWxsIGJlIGNhbGxlZC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZU5vZGVUb1hOb2RlTWV0aG9kV3JhcHBlcihtZXRob2ROYW1lKSB7XG5cdFx0dmFyIG9yaWdpbmFsRnVuY3Rpb24gPSBOb2RlLnByb3RvdHlwZVttZXRob2ROYW1lXTtcblxuXHRcdE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRmb3IgKHZhciBhIGluIGFyZ3VtZW50cykge1xuXHRcdFx0XHRpZiAoYXJndW1lbnRzW2FdIGluc3RhbmNlb2YgWE5vZGUpXG5cdFx0XHRcdFx0YXJndW1lbnRzW2FdID0gYXJndW1lbnRzW2FdLm5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB1cCByZWFkIG9ubHkgcHJvcGVydGllcy5cblx0ICovXG5cdGNyZWF0ZVhOb2RlUmVhZE9ubHlQcm9wZXJ0eShcInN0eWxlXCIpO1xuXG5cdC8qKlxuXHQgKiBTZXQgdXAgcmVhZC93cml0ZSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImlubmVySFRNTFwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImhyZWZcIik7XG5cdGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkoXCJpZFwiKTtcblxuXHQvKipcblx0ICogU2V0IHVwIG1ldGhvZHMgdG8gYmUgcm91dGVkIHRvIHRoZSB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJhcHBlbmRDaGlsZFwiKTtcblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJyZW1vdmVDaGlsZFwiKTtcblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJhZGRFdmVudExpc3RlbmVyXCIpO1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcInJlbW92ZUV2ZW50TGlzdGVuZXJcIik7XG5cblx0LyoqXG5cdCAqIFNldCB1cCBtZXRob2RzIG9uIE5vZGUucHJvcGVydHkuXG5cdCAqL1xuXHRjcmVhdGVOb2RlVG9YTm9kZU1ldGhvZFdyYXBwZXIoXCJhcHBlbmRDaGlsZFwiKTtcblx0Y3JlYXRlTm9kZVRvWE5vZGVNZXRob2RXcmFwcGVyKFwicmVtb3ZlQ2hpbGRcIik7XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBldmVudCBsaXN0ZW5lciBhbGlhc2VzLlxuXHQgKi9cblx0WE5vZGUucHJvdG90eXBlLm9uID0gWE5vZGUucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cdFhOb2RlLnByb3RvdHlwZS5vZmYgPSBYTm9kZS5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblxuXHQvKipcblx0ICogV29yayBib3RoIGFzIGEgbnBtIG1vZHVsZSBhbmQgc3RhbmRhbG9uZS5cblx0ICovXG5cdHZhciB0YXJnZXQ7XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IHRhcmdldDtcblx0fSBlbHNlIHtcblx0XHR4bm9kZSA9IHt9O1xuXHRcdHRhcmdldCA9IHhub2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBleHRlbmRlZCBjbGFzc2VzLlxuXHQgKi9cblx0dGFyZ2V0LkRpdiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwiZGl2XCIpO1xuXHR0YXJnZXQuQnV0dG9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdHRhcmdldC5VbCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwidWxcIik7XG5cdHRhcmdldC5MaSA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwibGlcIik7XG5cdHRhcmdldC5BID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJhXCIpO1xuXHR0YXJnZXQuT3B0aW9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJvcHRpb25cIik7XG5cdHRhcmdldC5TZWxlY3QgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcInNlbGVjdFwiKTtcblx0dGFyZ2V0LklucHV0ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJpbnB1dFwiKTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdC8qKlxuXHQgKiBUaGUgYmFzaWMgeG5vZGUgY2xhc3MuXG5cdCAqIEl0IHNldHMgdGhlIHVuZGVybHlpbmcgbm9kZSBlbGVtZW50IGJ5IGNhbGxpbmdcblx0ICogZG9jdW1lbnQuY3JlYXRlRWxlbWVudFxuXHQgKi9cblx0ZnVuY3Rpb24gWE5vZGUodHlwZSwgY29udGVudCkge1xuXHRcdHRoaXMubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cblx0XHRpZiAoY29udGVudCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0dGhpcy5ub2RlLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBtZXRob2QgY3JlYXRlcyBhbiBleHRlbmRlZCBjbGFzcyB1c2luZ1xuXHQgKiB0aGUgWE5vZGUgY2xhc3MgZGVmaW5lZCBhYm92ZS5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KGVsZW1lbnRUeXBlLCBjb250ZW50KSB7XG5cdFx0dmFyIGYgPSBmdW5jdGlvbihjb250ZW50KSB7XG5cdFx0XHRYTm9kZS5jYWxsKHRoaXMsIGVsZW1lbnRUeXBlLCBjb250ZW50KTtcblx0XHR9O1xuXG5cdFx0Zi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFhOb2RlLnByb3RvdHlwZSk7XG5cdFx0Zi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBmO1xuXG5cdFx0cmV0dXJuIGY7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcmVhZCBvbmx5IHByb3BlcnR5IHRoYXQgcmV0dXJucyB0aGVcblx0ICogdmFsdWUgb2YgdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgb2YgdGhlXG5cdCAqIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZVJlYWRPbmx5UHJvcGVydHkocHJvcGVydHlOYW1lKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFhOb2RlLnByb3RvdHlwZSwgcHJvcGVydHlOYW1lLCB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5ub2RlW3Byb3BlcnR5TmFtZV07XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcmVhZCB3cml0ZSBwcm9wZXJ0eSB0aGF0IG9wZXJhdGVzIG9uXG5cdCAqIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5IG9mIHRoZSB1bmRlcmx5aW5nXG5cdCAqIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoWE5vZGUucHJvdG90eXBlLCBwcm9wZXJ0eU5hbWUsIHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm5vZGVbcHJvcGVydHlOYW1lXTtcblx0XHRcdH0sXG5cblx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0dGhpcy5ub2RlW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBtZXRob2QgdGhhdCByb3V0ZXMgdGhlIGNhbGwgdGhyb3VnaCwgZG93blxuXHQgKiB0byB0aGUgc2FtZSBtZXRob2Qgb24gdGhlIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZU1ldGhvZChtZXRob2ROYW1lKSB7XG5cdFx0WE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5ub2RlW21ldGhvZE5hbWVdLmFwcGx5KHRoaXMubm9kZSwgYXJndW1lbnRzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogTW9kaWZ5IHRoZSBOb2RlLnByb3BlcnR5IGZ1bmN0aW9uLCBzbyB0aGF0IGl0IGFjY2VwdHNcblx0ICogWE5vZGUgb2JqZWN0cy4gQWxsIFhOb2RlIG9iamVjdHMgd2lsbCBiZSBjaGFuZ2VkIHRvXG5cdCAqIHRoZSB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0cywgYW5kIHRoZSBjb3JyZXNwb25kaW5nXG5cdCAqIG1ldGhvZCB3aWxsIGJlIGNhbGxlZC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZU5vZGVUb1hOb2RlTWV0aG9kV3JhcHBlcihtZXRob2ROYW1lKSB7XG5cdFx0dmFyIG9yaWdpbmFsRnVuY3Rpb24gPSBOb2RlLnByb3RvdHlwZVttZXRob2ROYW1lXTtcblxuXHRcdE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRmb3IgKHZhciBhIGluIGFyZ3VtZW50cykge1xuXHRcdFx0XHRpZiAoYXJndW1lbnRzW2FdIGluc3RhbmNlb2YgWE5vZGUpXG5cdFx0XHRcdFx0YXJndW1lbnRzW2FdID0gYXJndW1lbnRzW2FdLm5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB1cCByZWFkIG9ubHkgcHJvcGVydGllcy5cblx0ICovXG5cdGNyZWF0ZVhOb2RlUmVhZE9ubHlQcm9wZXJ0eShcInN0eWxlXCIpO1xuXG5cdC8qKlxuXHQgKiBTZXQgdXAgcmVhZC93cml0ZSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImlubmVySFRNTFwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImhyZWZcIik7XG5cdGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkoXCJpZFwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcInZhbHVlXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwidHlwZVwiKTtcblxuXHQvKipcblx0ICogU2V0IHVwIG1ldGhvZHMgdG8gYmUgcm91dGVkIHRvIHRoZSB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJhcHBlbmRDaGlsZFwiKTtcblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJyZW1vdmVDaGlsZFwiKTtcblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJhZGRFdmVudExpc3RlbmVyXCIpO1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcInJlbW92ZUV2ZW50TGlzdGVuZXJcIik7XG5cblx0LyoqXG5cdCAqIFNldCB1cCBtZXRob2RzIG9uIE5vZGUucHJvcGVydHkuXG5cdCAqL1xuXHRjcmVhdGVOb2RlVG9YTm9kZU1ldGhvZFdyYXBwZXIoXCJhcHBlbmRDaGlsZFwiKTtcblx0Y3JlYXRlTm9kZVRvWE5vZGVNZXRob2RXcmFwcGVyKFwicmVtb3ZlQ2hpbGRcIik7XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBldmVudCBsaXN0ZW5lciBhbGlhc2VzLlxuXHQgKi9cblx0WE5vZGUucHJvdG90eXBlLm9uID0gWE5vZGUucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cdFhOb2RlLnByb3RvdHlwZS5vZmYgPSBYTm9kZS5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblxuXHQvKipcblx0ICogV29yayBib3RoIGFzIGEgbnBtIG1vZHVsZSBhbmQgc3RhbmRhbG9uZS5cblx0ICovXG5cdHZhciB0YXJnZXQ7XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IHRhcmdldDtcblx0fSBlbHNlIHtcblx0XHR4bm9kZSA9IHt9O1xuXHRcdHRhcmdldCA9IHhub2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBleHRlbmRlZCBjbGFzc2VzLlxuXHQgKi9cblx0dGFyZ2V0LkRpdiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwiZGl2XCIpO1xuXHR0YXJnZXQuQnV0dG9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdHRhcmdldC5VbCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwidWxcIik7XG5cdHRhcmdldC5MaSA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwibGlcIik7XG5cdHRhcmdldC5BID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJhXCIpO1xuXHR0YXJnZXQuT3B0aW9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJvcHRpb25cIik7XG5cdHRhcmdldC5TZWxlY3QgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcInNlbGVjdFwiKTtcblx0dGFyZ2V0LklucHV0ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJpbnB1dFwiKTtcbn0pKCk7IiwiLyoqXG4gKiBBUzMvanF1ZXJ5IHN0eWxlIGV2ZW50IGRpc3BhdGNoZXIuIFNsaWdodGx5IG1vZGlmaWVkLiBUaGVcbiAqIGpxdWVyeSBzdHlsZSBvbi9vZmYvdHJpZ2dlciBzdHlsZSBvZiBhZGRpbmcgbGlzdGVuZXJzIGlzXG4gKiBjdXJyZW50bHkgdGhlIHByZWZlcnJlZCBvbmUuXG4gKlxuICogVGhlIG9uIG1ldGhvZCBmb3IgYWRkaW5nIGxpc3RlbmVycyB0YWtlcyBhbiBleHRyYSBwYXJhbWV0ZXIgd2hpY2ggaXMgdGhlXG4gKiBzY29wZSBpbiB3aGljaCBsaXN0ZW5lcnMgc2hvdWxkIGJlIGNhbGxlZC4gU28gdGhpczpcbiAqXG4gKiAgICAgb2JqZWN0Lm9uKFwiZXZlbnRcIiwgbGlzdGVuZXIsIHRoaXMpO1xuICpcbiAqIEhhcyB0aGUgc2FtZSBmdW5jdGlvbiB3aGVuIGFkZGluZyBldmVudHMgYXM6XG4gKlxuICogICAgIG9iamVjdC5vbihcImV2ZW50XCIsIGxpc3RlbmVyLmJpbmQodGhpcykpO1xuICpcbiAqIEhvd2V2ZXIsIHRoZSBkaWZmZXJlbmNlIGlzIHRoYXQgaWYgd2UgdXNlIHRoZSBzZWNvbmQgbWV0aG9kIGl0XG4gKiB3aWxsIG5vdCBiZSBwb3NzaWJsZSB0byByZW1vdmUgdGhlIGxpc3RlbmVycyBsYXRlciwgdW5sZXNzXG4gKiB0aGUgY2xvc3VyZSBjcmVhdGVkIGJ5IGJpbmQgaXMgc3RvcmVkIHNvbWV3aGVyZS4gSWYgdGhlXG4gKiBmaXJzdCBtZXRob2QgaXMgdXNlZCwgd2UgY2FuIHJlbW92ZSB0aGUgbGlzdGVuZXIgd2l0aDpcbiAqXG4gKiAgICAgb2JqZWN0Lm9mZihcImV2ZW50XCIsIGxpc3RlbmVyLCB0aGlzKTtcbiAqXG4gKiBAY2xhc3MgRXZlbnREaXNwYXRjaGVyXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RGlzcGF0Y2hlcigpIHtcblx0dGhpcy5saXN0ZW5lck1hcCA9IHt9O1xufVxuXG4vKipcbiAqIEFkZCBldmVudCBsaXN0ZW5lci5cbiAqIEBtZXRob2QgYWRkRXZlbnRMaXN0ZW5lclxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudFR5cGUsIGxpc3RlbmVyLCBzY29wZSkge1xuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXApXG5cdFx0dGhpcy5saXN0ZW5lck1hcCA9IHt9O1xuXG5cdGlmICghZXZlbnRUeXBlKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIkV2ZW50IHR5cGUgcmVxdWlyZWQgZm9yIGV2ZW50IGRpc3BhdGNoZXJcIik7XG5cblx0aWYgKCFsaXN0ZW5lcilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJMaXN0ZW5lciByZXF1aXJlZCBmb3IgZXZlbnQgZGlzcGF0Y2hlclwiKTtcblxuXHR0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBsaXN0ZW5lciwgc2NvcGUpO1xuXG5cdGlmICghdGhpcy5saXN0ZW5lck1hcC5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKVxuXHRcdHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXSA9IFtdO1xuXG5cdHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXS5wdXNoKHtcblx0XHRsaXN0ZW5lcjogbGlzdGVuZXIsXG5cdFx0c2NvcGU6IHNjb3BlXG5cdH0pO1xufVxuXG4vKipcbiAqIFJlbW92ZSBldmVudCBsaXN0ZW5lci5cbiAqIEBtZXRob2QgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudFR5cGUsIGxpc3RlbmVyLCBzY29wZSkge1xuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXApXG5cdFx0dGhpcy5saXN0ZW5lck1hcCA9IHt9O1xuXG5cdGlmICghdGhpcy5saXN0ZW5lck1hcC5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKVxuXHRcdHJldHVybjtcblxuXHR2YXIgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGxpc3RlbmVyT2JqID0gbGlzdGVuZXJzW2ldO1xuXG5cdFx0aWYgKGxpc3RlbmVyID09IGxpc3RlbmVyT2JqLmxpc3RlbmVyICYmIHNjb3BlID09IGxpc3RlbmVyT2JqLnNjb3BlKSB7XG5cdFx0XHRsaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0aS0tO1xuXHRcdH1cblx0fVxuXG5cdGlmICghbGlzdGVuZXJzLmxlbmd0aClcblx0XHRkZWxldGUgdGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdO1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGV2ZW50LlxuICogQG1ldGhvZCBkaXNwYXRjaEV2ZW50XG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKGV2ZW50IC8qIC4uLiAqLyApIHtcblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwKVxuXHRcdHRoaXMubGlzdGVuZXJNYXAgPSB7fTtcblxuXHR2YXIgZXZlbnRUeXBlO1xuXHR2YXIgbGlzdGVuZXJQYXJhbXM7XG5cblx0aWYgKHR5cGVvZiBldmVudCA9PSBcInN0cmluZ1wiKSB7XG5cdFx0ZXZlbnRUeXBlID0gZXZlbnQ7XG5cblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpXG5cdFx0XHRsaXN0ZW5lclBhcmFtcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cblx0XHRlbHNlIGxpc3RlbmVyUGFyYW1zID0gW3tcblx0XHRcdHR5cGU6IGV2ZW50VHlwZSxcblx0XHRcdHRhcmdldDogdGhpc1xuXHRcdH1dO1xuXHR9IGVsc2Uge1xuXHRcdGV2ZW50VHlwZSA9IGV2ZW50LnR5cGU7XG5cdFx0ZXZlbnQudGFyZ2V0ID0gdGhpcztcblx0XHRsaXN0ZW5lclBhcmFtcyA9IFtldmVudF07XG5cdH1cblxuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXAuaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSlcblx0XHRyZXR1cm47XG5cblx0Zm9yICh2YXIgaSBpbiB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV0pIHtcblx0XHR2YXIgbGlzdGVuZXJPYmogPSB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV1baV07XG5cdFx0bGlzdGVuZXJPYmoubGlzdGVuZXIuYXBwbHkobGlzdGVuZXJPYmouc2NvcGUsIGxpc3RlbmVyUGFyYW1zKTtcblx0fVxufVxuXG4vKipcbiAqIEpxdWVyeSBzdHlsZSBhbGlhcyBmb3IgYWRkRXZlbnRMaXN0ZW5lclxuICogQG1ldGhvZCBvblxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLm9uID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyO1xuXG4vKipcbiAqIEpxdWVyeSBzdHlsZSBhbGlhcyBmb3IgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuICogQG1ldGhvZCBvZmZcbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5vZmYgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cbi8qKlxuICogSnF1ZXJ5IHN0eWxlIGFsaWFzIGZvciBkaXNwYXRjaEV2ZW50XG4gKiBAbWV0aG9kIHRyaWdnZXJcbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS50cmlnZ2VyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50O1xuXG4vKipcbiAqIE1ha2Ugc29tZXRoaW5nIGFuIGV2ZW50IGRpc3BhdGNoZXIuIENhbiBiZSB1c2VkIGZvciBtdWx0aXBsZSBpbmhlcml0YW5jZS5cbiAqIEBtZXRob2QgaW5pdFxuICogQHN0YXRpY1xuICovXG5FdmVudERpc3BhdGNoZXIuaW5pdCA9IGZ1bmN0aW9uKGNscykge1xuXHRjbHMucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cdGNscy5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblx0Y2xzLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50O1xuXHRjbHMucHJvdG90eXBlLm9uID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5vbjtcblx0Y2xzLnByb3RvdHlwZS5vZmYgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLm9mZjtcblx0Y2xzLnByb3RvdHlwZS50cmlnZ2VyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS50cmlnZ2VyO1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBFdmVudERpc3BhdGNoZXI7XG59IiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCJ5YWVkXCIpO1xuXG4vKipcbiAqIENvbGxlY3Rpb24uXG4gKiBAY2xhc3MgQ29sbGVjdGlvblxuICovXG5mdW5jdGlvbiBDb2xsZWN0aW9uKCkge1xuXHR0aGlzLml0ZW1zID0gW107XG59XG5cbmluaGVyaXRzKENvbGxlY3Rpb24sIEV2ZW50RGlzcGF0Y2hlcik7XG5cbi8qKlxuICogQWRkIGl0ZW0gYXQgZW5kLlxuICogQG1ldGhvZCBhZGRJdGVtXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmFkZEl0ZW0gPSBmdW5jdGlvbihpdGVtKSB7XG5cdHRoaXMuaXRlbXMucHVzaChpdGVtKTtcblxuXHR0aGlzLnRyaWdnZXJDaGFuZ2UoXCJhZGRcIiwgaXRlbSwgdGhpcy5pdGVtcy5sZW5ndGggLSAxKTtcbn1cblxuLyoqXG4gKiBBZGQgaXRlbSBhdCBpbmRleC5cbiAqIEBtZXRob2QgYWRkSXRlbVxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5hZGRJdGVtQXQgPSBmdW5jdGlvbihpbmRleCwgaXRlbSkge1xuXHRpZiAoaW5kZXggPCAwKVxuXHRcdGluZGV4ID0gMDtcblxuXHRpZiAoaW5kZXggPiB0aGlzLml0ZW1zLmxlbmd0aClcblx0XHRpbmRleCA9IHRoaXMuaXRlbXMubGVuZ3RoO1xuXG5cdHZhciBhZnRlciA9IHRoaXMuaXRlbXMuc3BsaWNlKGluZGV4KTtcblx0dGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuXHR0aGlzLml0ZW1zID0gdGhpcy5pdGVtcy5jb25jYXQoYWZ0ZXIpO1xuXG5cdHRoaXMudHJpZ2dlckNoYW5nZShcImFkZFwiLCBpdGVtLCBpbmRleCk7XG59XG5cbi8qKlxuICogR2V0IGxlbmd0aC5cbiAqIEBtZXRob2QgZ2V0TGVuZ3RoXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmdldExlbmd0aCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XG59XG5cbi8qKlxuICogR2V0IGl0ZW0gYXQgaW5kZXguXG4gKiBAbWV0aG9kIGdldEl0ZW1BdFxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5nZXRJdGVtQXQgPSBmdW5jdGlvbihpbmRleCkge1xuXHRyZXR1cm4gdGhpcy5pdGVtc1tpbmRleF07XG59XG5cbi8qKlxuICogRmluZCBpdGVtIGluZGV4LlxuICogQG1ldGhvZCBnZXRJdGVtSW5kZXhcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuZ2V0SXRlbUluZGV4ID0gZnVuY3Rpb24oaXRlbSkge1xuXHRyZXR1cm4gdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xufVxuXG4vKipcbiAqIFJlbW92ZSBpdGVtIGF0LlxuICogQG1ldGhvZCByZW1vdmVJdGVtQXRcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUucmVtb3ZlSXRlbUF0ID0gZnVuY3Rpb24oaW5kZXgpIHtcblx0aWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLml0ZW1zLmxlbmd0aClcblx0XHRyZXR1cm47XG5cblx0dmFyIGl0ZW0gPSB0aGlzLmdldEl0ZW1BdChpbmRleCk7XG5cblx0dGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHR0aGlzLnRyaWdnZXJDaGFuZ2UoXCJyZW1vdmVcIiwgaXRlbSwgaW5kZXgpO1xufVxuXG4vKipcbiAqIFJlbW92ZSBpdGVtLlxuICogQG1ldGhvZCByZW1vdmVJdGVtXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbihpdGVtKSB7XG5cdHZhciBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KGl0ZW0pO1xuXG5cdHRoaXMucmVtb3ZlSXRlbUF0KGluZGV4KTtcbn1cblxuLyoqXG4gKiBUcmlnZ2VyIGNoYW5nZSBldmVudC5cbiAqIEBtZXRob2QgdHJpZ2dlckNoYW5nZVxuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUudHJpZ2dlckNoYW5nZSA9IGZ1bmN0aW9uKGV2ZW50S2luZCwgaXRlbSwgaW5kZXgpIHtcblx0dGhpcy50cmlnZ2VyKHtcblx0XHR0eXBlOiBldmVudEtpbmQsXG5cdFx0aXRlbTogaXRlbSxcblx0XHRpbmRleDogaW5kZXhcblx0fSk7XG5cblx0dGhpcy50cmlnZ2VyKHtcblx0XHR0eXBlOiBcImNoYW5nZVwiLFxuXHRcdGtpbmQ6IGV2ZW50S2luZCxcblx0XHRpdGVtOiBpdGVtLFxuXHRcdGluZGV4OiBpbmRleFxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsZWN0aW9uOyIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwieWFlZFwiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciBDb2xsZWN0aW9uVmlld01hbmFnZXI9cmVxdWlyZShcIi4vQ29sbGVjdGlvblZpZXdNYW5hZ2VyXCIpO1xuXG4vKipcbiAqIENvbGxlY3Rpb25WaWV3LlxuICogQGNsYXNzIENvbGxlY3Rpb25WaWV3XG4gKi9cbmZ1bmN0aW9uIENvbGxlY3Rpb25WaWV3KCkge1xuXHR4bm9kZS5EaXYuY2FsbCh0aGlzKTtcblxuXHR0aGlzLm1hbmFnZXI9bmV3IENvbGxlY3Rpb25WaWV3TWFuYWdlcih0aGlzKTtcbn1cblxuaW5oZXJpdHMoQ29sbGVjdGlvblZpZXcsIHhub2RlLkRpdik7XG5cbi8qKlxuICogU2V0IGl0ZW0gcmVuZGVyZXIgY2xhc3MuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckNsYXNzXG4gKi9cbkNvbGxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXRJdGVtUmVuZGVyZXJDbGFzcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMubWFuYWdlci5zZXRJdGVtUmVuZGVyZXJDbGFzcyh2YWx1ZSk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gcmVuZGVyZXIgZmFjdG9yeS5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyRmFjdG9yeVxuICovXG5Db2xsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0SXRlbVJlbmRlcmVyRmFjdG9yeSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMubWFuYWdlci5zZXRJdGVtUmVuZGVyZXJGYWN0b3J5KHZhbHVlKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSBjb250cm9sbGVyIGNsYXNzLlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJDbGFzc1xuICovXG5Db2xsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0SXRlbUNvbnRyb2xsZXJDbGFzcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMubWFuYWdlci5zZXRJdGVtQ29udHJvbGxlckNsYXNzKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSBjb250cm9sbGVyIGZhY3RvcnkuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckZhY3RvcnlcbiAqL1xuQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLnNldEl0ZW1Db250cm9sbGVyRmFjdG9yeSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMubWFuYWdlci5zZXRJdGVtQ29udHJvbGxlckZhY3RvcnkodmFsdWUpO1xufVxuXG4vKipcbiAqIFNldCBkYXRhIHNvdXJjZS5cbiAqIEBtZXRob2Qgc2V0RGF0YVNvdXJjZVxuICovXG5Db2xsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0RGF0YVNvdXJjZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMubWFuYWdlci5zZXREYXRhU291cmNlKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsZWN0aW9uVmlldzsiLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcInlhZWRcIik7XG52YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG5cbi8qKlxuICogQ29sbGVjdGlvblZpZXdNYW5hZ2VyLlxuICogQGNsYXNzIENvbGxlY3Rpb25WaWV3TWFuYWdlclxuICovXG5mdW5jdGlvbiBDb2xsZWN0aW9uVmlld01hbmFnZXIodGFyZ2V0KSB7XG5cdHRoaXMuaXRlbVJlbmRlcmVycyA9IFtdO1xuXHR0aGlzLml0ZW1SZW5kZXJlckNsYXNzID0gbnVsbDtcblx0dGhpcy5pdGVtUmVuZGVyZXJGYWN0b3J5ID0gbnVsbDtcblx0dGhpcy5pdGVtQ29udHJvbGxlckNsYXNzID0gbnVsbDtcblx0dGhpcy5pdGVtQ29udHJvbGxlckZhY3RvcnkgPSBudWxsO1xuXHR0aGlzLmRhdGFTb3VyY2UgPSBudWxsO1xuXHR0aGlzLnRhcmdldCA9IG51bGw7XG5cblx0dGhpcy5zZXRUYXJnZXQodGFyZ2V0KTtcbn1cblxuLyoqXG4gKiBTZXQgdGFyZ2V0LlxuICogQG1ldGhvZCBzZXRUYXJnZXRcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5zZXRUYXJnZXQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLnJlbW92ZUFsbEl0ZW1SZW5kZXJlcnMoKTtcblx0dGhpcy50YXJnZXQ9dmFsdWU7XG5cdHRoaXMucmVtb3ZlQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIHJlbmRlcmVyIGNsYXNzLlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJDbGFzc1xuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldEl0ZW1SZW5kZXJlckNsYXNzID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIGl0ZW0gcmVuZGVyZXIgY2xhc3Mgc2hvdWxkIGJlIGEgZnVuY3Rpb25cIik7XG5cblx0dGhpcy5pdGVtUmVuZGVyZXJDbGFzcyA9IHZhbHVlO1xuXHR0aGlzLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gcmVuZGVyZXIgZmFjdG9yeS5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyRmFjdG9yeVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldEl0ZW1SZW5kZXJlckZhY3RvcnkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgaXRlbSByZW5kZXJlciBmYWN0b3J5IHNob3VsZCBiZSBhIGZ1bmN0aW9uXCIpO1xuXG5cdHRoaXMuaXRlbVJlbmRlcmVyRmFjdG9yeSA9IHZhbHVlO1xuXHR0aGlzLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gY29udHJvbGxlciBjbGFzcy5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyQ2xhc3NcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5zZXRJdGVtQ29udHJvbGxlckNsYXNzID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIGl0ZW0gcmVuZGVyZXIgY2xhc3Mgc2hvdWxkIGJlIGEgZnVuY3Rpb25cIik7XG5cblx0dGhpcy5pdGVtQ29udHJvbGxlckNsYXNzID0gdmFsdWU7XG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSBjb250cm9sbGVyIGZhY3RvcnkuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckZhY3RvcnlcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5zZXRJdGVtQ29udHJvbGxlckZhY3RvcnkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgaXRlbSByZW5kZXJlciBmYWN0b3J5IHNob3VsZCBiZSBhIGZ1bmN0aW9uXCIpO1xuXG5cdHRoaXMuaXRlbUNvbnRyb2xsZXJGYWN0b3J5ID0gdmFsdWU7XG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTZXQgZGF0YSBzb3VyY2UuXG4gKiBAbWV0aG9kIHNldERhdGFTb3VyY2VcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5zZXREYXRhU291cmNlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHRoaXMuZGF0YVNvdXJjZSkge1xuXHRcdHRoaXMuZGF0YVNvdXJjZS5vZmYoXCJjaGFuZ2VcIiwgdGhpcy5vbkRhdGFTb3VyY2VDaGFuZ2UsIHRoaXMpO1xuXHR9XG5cblx0dGhpcy5kYXRhU291cmNlID0gdmFsdWU7XG5cblx0aWYgKHRoaXMuZGF0YVNvdXJjZSkge1xuXHRcdHRoaXMuZGF0YVNvdXJjZS5vbihcImNoYW5nZVwiLCB0aGlzLm9uRGF0YVNvdXJjZUNoYW5nZSwgdGhpcyk7XG5cdH1cblxuXHR0aGlzLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogU29tZXRoaW5nIGluIHRoZSBkYXRhIHNvdXJjZSB3YXMgY2hhbmdlZC5cbiAqIEBtZXRob2Qgb25EYXRhU291cmNlQ2hhbmdlXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLm9uRGF0YVNvdXJjZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFsbCBpdGVtIHJlbmRlcmVycy5cbiAqIEBtZXRob2QgcmVtb3ZlQWxsSXRlbVJlbmRlcmVyc1xuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVBbGxJdGVtUmVuZGVyZXJzID0gZnVuY3Rpb24oKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pdGVtUmVuZGVyZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKHRoaXMuaXRlbVJlbmRlcmVyc1tpXS5fX2NvbnRyb2xsZXIpXG5cdFx0XHR0aGlzLml0ZW1SZW5kZXJlcnNbaV0uX19jb250cm9sbGVyLnNldERhdGEobnVsbCk7XG5cblx0XHRlbHNlXG5cdFx0XHR0aGlzLml0ZW1SZW5kZXJlcnNbaV0uc2V0RGF0YShudWxsKTtcblxuXHRcdHRoaXMudGFyZ2V0LnJlbW92ZUNoaWxkKHRoaXMuaXRlbVJlbmRlcmVyc1tpXSk7XG5cdH1cblxuXHR0aGlzLml0ZW1SZW5kZXJlcnMgPSBbXTtcbn1cblxuLyoqXG4gKiBSZWZyZXNoIGFsbCBpdGVtIHJlbmRlcmVycy5cbiAqIEBtZXRob2QgcmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnNcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZW1vdmVBbGxJdGVtUmVuZGVyZXJzKCk7XG5cblx0aWYgKCF0aGlzLmRhdGFTb3VyY2UpXG5cdFx0cmV0dXJuO1xuXG5cdGlmICghdGhpcy5pdGVtUmVuZGVyZXJDbGFzcyAmJiAhdGhpcy5pdGVtUmVuZGVyZXJGYWN0b3J5KVxuXHRcdHJldHVybjtcblxuXHRpZiAoIXRoaXMudGFyZ2V0KVxuXHRcdHJldHVybjtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGF0YVNvdXJjZS5nZXRMZW5ndGgoKTsgaSsrKSB7XG5cdFx0dmFyIGRhdGEgPSB0aGlzLmRhdGFTb3VyY2UuZ2V0SXRlbUF0KGkpO1xuXHRcdHZhciByZW5kZXJlciA9IHRoaXMuY3JlYXRlSXRlbVJlbmRlcmVyKCk7XG5cblx0XHRpZiAodGhpcy5pdGVtQ29udHJvbGxlckNsYXNzIHx8IHRoaXMuaXRlbUNvbnRyb2xsZXJGYWN0b3J5KSB7XG5cdFx0XHRyZW5kZXJlci5fX2NvbnRyb2xsZXIgPSB0aGlzLmNyZWF0ZUl0ZW1Db250cm9sbGVyKHJlbmRlcmVyKTtcblx0XHRcdHJlbmRlcmVyLl9fY29udHJvbGxlci5zZXREYXRhKGRhdGEpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW5kZXJlci5zZXREYXRhKGRhdGEpO1xuXHRcdH1cblxuXHRcdHRoaXMuaXRlbVJlbmRlcmVycy5wdXNoKHJlbmRlcmVyKTtcblx0XHR0aGlzLnRhcmdldC5hcHBlbmRDaGlsZChyZW5kZXJlcik7XG5cdH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgaXRlbSByZW5kZXJlci5cbiAqIEBtZXRob2QgY3JlYXRlSXRlbVJlbmRlcmVyXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLmNyZWF0ZUl0ZW1SZW5kZXJlciA9IGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5pdGVtUmVuZGVyZXJGYWN0b3J5KVxuXHRcdHJldHVybiB0aGlzLml0ZW1SZW5kZXJlckZhY3RvcnkoKTtcblxuXHRpZiAodGhpcy5pdGVtUmVuZGVyZXJDbGFzcylcblx0XHRyZXR1cm4gbmV3IHRoaXMuaXRlbVJlbmRlcmVyQ2xhc3MoKTtcblxuXHR0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBjcmVhdGUgaXRlbSByZW5kZXJlciFcIik7XG59XG5cbi8qKlxuICogQ3JlYXRlIGl0ZW0gY29udHJvbGxlci5cbiAqIEBtZXRob2QgY3JlYXRlSXRlbUNvbnRyb2xsZXJcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuY3JlYXRlSXRlbUNvbnRyb2xsZXIgPSBmdW5jdGlvbihyZW5kZXJlcikge1xuXHRpZiAodGhpcy5pdGVtQ29udHJvbGxlckZhY3RvcnkpXG5cdFx0cmV0dXJuIHRoaXMuaXRlbUNvbnRyb2xsZXJGYWN0b3J5KHJlbmRlcmVyKTtcblxuXHRpZiAodGhpcy5pdGVtQ29udHJvbGxlckNsYXNzKVxuXHRcdHJldHVybiBuZXcgdGhpcy5pdGVtQ29udHJvbGxlckNsYXNzKHJlbmRlcmVyKTtcblxuXHR0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBjcmVhdGUgaXRlbSBjb250cm9sbGVyIVwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsZWN0aW9uVmlld01hbmFnZXI7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdENvbGxlY3Rpb246IHJlcXVpcmUoXCIuL0NvbGxlY3Rpb25cIiksXG5cdENvbGxlY3Rpb25WaWV3OiByZXF1aXJlKFwiLi9Db2xsZWN0aW9uVmlld1wiKSxcblx0Q29sbGVjdGlvblZpZXdNYW5hZ2VyOiByZXF1aXJlKFwiLi9Db2xsZWN0aW9uVmlld01hbmFnZXJcIilcbn07IiwidmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIHhub2RldWkgPSB7fTtcblxuLyoqXG4gKiBDcmVhdGUgYSBjbGFzcyB0aGF0IGV4dGVuZHMgYSBqcXVlcnkgdWkgd2lkZ2V0LlxuICogQG1ldGhvZCBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoanF1ZXJ5dWlUeXBlLCBiYXNlQ2xhc3MpIHtcblx0aWYgKCFiYXNlQ2xhc3MpXG5cdFx0YmFzZUNsYXNzID0geG5vZGUuRGl2O1xuXG5cdGZ1bmN0aW9uIGNscygpIHtcblx0XHRiYXNlQ2xhc3MuY2FsbCh0aGlzKTtcblxuXHRcdHN3aXRjaCAoanF1ZXJ5dWlUeXBlKSB7XG5cdFx0XHRjYXNlIFwidGFic1wiOlxuXHRcdFx0XHR0aGlzLnVsID0gbmV3IHhub2RlLlVsKCk7XG5cdFx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy51bCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHRoaXMuanF1ZXJ5dWlUeXBlID0ganF1ZXJ5dWlUeXBlO1xuXHRcdHRoaXMuanF1ZXJ5RWxlbWVudCA9ICQodGhpcy5ub2RlKTtcblx0XHR0aGlzLmpxdWVyeUVsZW1lbnRbdGhpcy5qcXVlcnl1aVR5cGVdKCk7XG5cdH1cblxuXHRpbmhlcml0cyhjbHMsIGJhc2VDbGFzcyk7XG5cblx0Y2xzLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZSwgZikge1xuXHRcdHhub2RlLkRpdi5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMsIGUsIGYpO1xuXHRcdHRoaXMuanF1ZXJ5RWxlbWVudC5vbihlLCBmKTtcblx0fVxuXG5cdGNscy5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGUsIGYpIHtcblx0XHR4bm9kZS5EaXYucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIuY2FsbCh0aGlzLCBlLCBmKTtcblx0XHR0aGlzLmpxdWVyeUVsZW1lbnQub2ZmKGUsIGYpO1xuXHR9XG5cblx0Y2xzLnByb3RvdHlwZS5vbiA9IGNscy5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0Y2xzLnByb3RvdHlwZS5vZmYgPSBjbHMucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cblx0cmV0dXJuIGNscztcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBwcm9wZXJ0eSBvbiBhbiBleHRlbmRlZCBqcXVlcnkgdWkgY2xhc3MuXG4gKiBAbWV0aG9kIGNyZWF0ZVhOb2RlVUlQcm9wZXJ0eVxuICovXG5mdW5jdGlvbiBjcmVhdGVYTm9kZVVJUHJvcGVydHkoY2xzLCBwcm90b3R5cGVOYW1lKSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjbHMucHJvdG90eXBlLCBwcm90b3R5cGVOYW1lLCB7XG5cdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLmpxdWVyeUVsZW1lbnRbdGhpcy5qcXVlcnl1aVR5cGVdKFwib3B0aW9uXCIsIHByb3RvdHlwZU5hbWUpXG5cdFx0fSxcblxuXHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHRoaXMuanF1ZXJ5RWxlbWVudFt0aGlzLmpxdWVyeXVpVHlwZV0oXCJvcHRpb25cIiwgcHJvdG90eXBlTmFtZSwgdmFsdWUpXG5cdFx0fVxuXHR9KTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgc2V2ZXJhbCBwcm9wcnRpZXMgb24gYW4gZXh0ZW5kZWQganF1ZXJ5IHVpIGNsYXNzLlxuICogQG1ldGhvZCBjcmVhdGVYTm9kZVVJUHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBjcmVhdGVYTm9kZVVJUHJvcGVydGllcyhjbHMsIHByb3BydHlOYW1lcykge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHByb3BydHlOYW1lcy5sZW5ndGg7IGkrKylcblx0XHRjcmVhdGVYTm9kZVVJUHJvcGVydHkoY2xzLCBwcm9wcnR5TmFtZXNbaV0pO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIG1ldGhvZCBvbiBhbiBleHRlbmRlZCBqcXVlcnkgdWkgY2xhc3MuXG4gKiBAbWV0aG9kIGNyZWF0ZVhOb2RlVUlNZXRob2RcbiAqL1xuZnVuY3Rpb24gY3JlYXRlWE5vZGVVSU1ldGhvZChjbHMsIG1ldGhvZE5hbWUpIHtcblx0Y2xzLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApXG5cdFx0XHRyZXR1cm4gdGhpcy5qcXVlcnlFbGVtZW50W3RoaXMuanF1ZXJ5dWlUeXBlXShtZXRob2ROYW1lKTtcblxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSlcblx0XHRcdHJldHVybiB0aGlzLmpxdWVyeUVsZW1lbnRbdGhpcy5qcXVlcnl1aVR5cGVdKG1ldGhvZE5hbWUsIGFyZ3VtZW50c1swXSk7XG5cblx0XHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDIpXG5cdFx0XHRyZXR1cm4gdGhpcy5qcXVlcnlFbGVtZW50W3RoaXMuanF1ZXJ5dWlUeXBlXShtZXRob2ROYW1lLCBhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSk7XG5cblx0XHRlbHNlXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ0aGF0IG1hbnkgYXJndW1lbnRzP1wiKTtcblx0fVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIG1ldGhvZCBvbiBhbiBleHRlbmRlZCBqcXVlcnkgdWkgY2xhc3MuXG4gKiBAbWV0aG9kIGNyZWF0ZVhOb2RlVUlNZXRob2RzXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVhOb2RlVUlNZXRob2RzKGNscywgbWV0aG9kTmFtZXMpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtZXRob2ROYW1lcy5sZW5ndGg7IGkrKylcblx0XHRjcmVhdGVYTm9kZVVJTWV0aG9kKGNscywgbWV0aG9kTmFtZXNbaV0pO1xufVxuXG4vKipcbiAqIEFjY29yZGlvbiBjbGFzcy5cbiAqIEBjbGFzcyBBY2NvcmRpb25cbiAqL1xueG5vZGV1aS5BY2NvcmRpb24gPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwiYWNjb3JkaW9uXCIpO1xuXG5jcmVhdGVYTm9kZVVJUHJvcGVydGllcyh4bm9kZXVpLkFjY29yZGlvbiwgW1xuXHRcImFjdGl2ZVwiLCBcImFuaW1hdGVcIiwgXCJjb2xsYXBzaWJsZVwiLCBcImRpc2FibGVkXCIsXG5cdFwiZXZlbnRcIiwgXCJoZWFkZXJcIiwgXCJoZWlnaHRTdHlsZVwiLCBcImljb25zXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLkFjY29yZGlvbiwgW1xuXHRcImRlc3Ryb3lcIiwgXCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsIFwiaW5zdGFuY2VcIixcblx0XCJvcHRpb25cIiwgXCJyZWZyZXNoXCIsIFwid2lkZ2V0XCJcbl0pO1xuXG4vKipcbiAqIEF1dG9jb21wbGV0ZSBjbGFzcy5cbiAqIEBjbGFzcyBBdXRvY29tcGxldGVcbiAqL1xueG5vZGV1aS5BdXRvY29tcGxldGUgPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwiYXV0b2NvbXBsZXRlXCIpO1xuXG5jcmVhdGVYTm9kZVVJUHJvcGVydGllcyh4bm9kZXVpLkF1dG9jb21wbGV0ZSwgW1xuXHRcImFwcGVuZFRvXCIsIFwiYXV0b0ZvY3VzXCIsIFwiZGVsYXlcIiwgXCJkaXNhYmxlZFwiLFxuXHRcIm1pbkxlbmd0aFwiLCBcInBvc2l0aW9uXCIsIFwic291cmNlXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLkF1dG9jb21wbGV0ZSwgW1xuXHRcImNsb3NlXCIsIFwiZGVzdHJveVwiLCBcImRpc2FibGVcIiwgXCJlbmFibGVcIixcblx0XCJpbnN0YW5jZVwiLCBcIm9wdGlvblwiLCBcInNlYXJjaFwiLCBcIndpZGdldFwiXG5dKTtcblxuLyoqXG4gKiBCdXR0b24gY2xhc3MuXG4gKiBAY2xhc3MgeG5vZGV1aS5CdXR0b25cbiAqL1xueG5vZGV1aS5CdXR0b24gPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwiYnV0dG9uXCIsIHhub2RlLkJ1dHRvbik7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuQnV0dG9uLCBbXG5cdFwiZGlzYWJsZWRcIiwgXCJpY29uc1wiLCBcImxhYmVsXCIsIFwidGV4dFwiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5CdXR0b24sIFtcblx0XCJkZXN0cm95XCIsIFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLCBcImluc3RhbmNlXCIsXG5cdFwib3B0aW9uXCIsIFwicmVmcmVzaFwiLCBcIndpZGdldFwiXG5dKTtcblxuLyoqXG4gKiBCdXR0b25zZXQgY2xhc3MuXG4gKiBAY2xhc3MgeG5vZGV1aS5CdXR0b25zZXRcbiAqL1xueG5vZGV1aS5CdXR0b25zZXQgPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwiYnV0dG9uc2V0XCIpO1xuXG5jcmVhdGVYTm9kZVVJUHJvcGVydGllcyh4bm9kZXVpLkJ1dHRvbnNldCwgW1xuXHRcImRpc2FibGVkXCIsIFwiaXRlbXNcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuQXV0b2NvbXBsZXRlLCBbXG5cdFwiZGVzdHJveVwiLCBcImRpc2FibGVcIiwgXCJlbmFibGVcIiwgXCJpbnN0YW5jZVwiLFxuXHRcIm9wdGlvblwiLCBcInJlZnJlc2hcIiwgXCJ3aWRnZXRcIlxuXSk7XG5cbi8qKlxuICogU2xpZGVyIGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuU2xpZGVyXG4gKi9cbnhub2RldWkuU2xpZGVyID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcInNsaWRlclwiKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5TbGlkZXIsIFtcblx0XCJhbmltYXRlXCIsIFwiZGlzYWJsZWRcIiwgXCJtYXhcIiwgXCJtaW5cIixcblx0XCJvcmllbnRhdGlvblwiLCBcInJhbmdlXCIsIFwic3RlcFwiLCBcInZhbHVlXCIsXG5cdFwidmFsdWVzXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLlNsaWRlciwgW1xuXHRcImRlc3Ryb3lcIiwgXCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsIFwiaW5zdGFuY2VcIixcblx0XCJvcHRpb25cIiwgXCJ3aWRnZXRcIiAvKiwgXCJ2YWx1ZVwiLCBcInZhbHVlc1wiICovXG5dKTtcblxuLyoqXG4gKiBUYWJzIGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuVGFic1xuICovXG54bm9kZXVpLlRhYnMgPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwidGFic1wiKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5UYWJzLCBbXG5cdFwiYWN0aXZlXCIsIFwiY29sbGFwc2libGVcIiwgXCJkaXNhYmxlZFwiLCBcImV2ZW50XCIsXG5cdFwiaGVpZ2h0U3R5bGVcIiwgXCJoaWRlXCIsIFwic2hvd1wiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5UYWJzLCBbXG5cdFwiZGVzdHJveVwiLCBcImRpc2FibGVcIiwgXCJlbmFibGVcIiwgXCJpbnN0YW5jZVwiLFxuXHRcImxvYWRcIiwgXCJvcHRpb25cIiwgXCJyZWZyZXNoXCIsIFwid2lkZ2V0XCJcbl0pO1xuXG4vKipcbiAqIERhdGVwaWNrZXIgY2xhc3MuXG4gKiBAY2xhc3MgeG5vZGV1aS5EYXRlcGlja2VyXG4gKi9cbnhub2RldWkuRGF0ZXBpY2tlciA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJkYXRlcGlja2VyXCIpO1xuXG5jcmVhdGVYTm9kZVVJUHJvcGVydGllcyh4bm9kZXVpLkRhdGVwaWNrZXIsIFtcblx0XCJhbHRGaWVsZFwiLCBcImFsdEZvcm1hdFwiLCBcImFwcGVuZFRleHRcIiwgXCJhdXRvU2l6ZVwiLFxuXHRcImJlZm9yZVNob3dcIiwgXCJiZWZvcmVTaG93RGF5XCIsIFwiYnV0dG9uSW1hZ2VcIiwgXCJidXR0b25JbWFnZU9ubHlcIixcblx0XCJidXR0b25UZXh0XCIsIFwiY2FsY3VsYXRlV2Vla1wiLCBcImNoYW5nZU1vbnRoXCIsIFwiY2hhbmdlWWVhclwiLFxuXHRcImNsb3NlVGV4dFwiLCBcImNvbnN0cmFpbklucHV0XCIsIFwiY3VycmVudFRleHRcIiwgXCJkYXRlRm9ybWF0XCIsXG5cdFwiZGF5TmFtZXNcIiwgXCJkYXlOYW1lc01pblwiLCBcImRheU5hbWVzU2hvcnRcIiwgXCJkZWZhdWx0RGF0ZVwiLFxuXHRcImR1cmF0aW9uXCIsIFwiZmlyc3REYXlcIiwgXCJnb3RvQ3VycmVudFwiLCBcImhpZGVJZk5vUHJldk5leHRcIixcblx0XCJpc1JUTFwiLCBcIm1heERhdGVcIiwgXCJtaW5EYXRlXCIsIFwibW9udGhOYW1lc1wiLFxuXHRcIm1vbnRoTmFtZXNTaG9ydFwiLCBcIm5hdmlnYXRpb25Bc0RhdGVGb3JtYXRcIiwgXCJuZXh0VGV4dFwiLFxuXHRcIm51bWJlck9mTW9udGhzXCIsIFwib25DaGFuZ2VNb250aFllYXJcIixcblx0XCJvbkNsb3NlXCIsIFwib25TZWxlY3RcIiwgXCJwcmV2VGV4dFwiLCBcInNlbGVjdE90aGVyTW9udGhzXCIsXG5cdFwic2hvcnRZZWFyQ3V0b2ZmXCIsIFwic2hvd0FuaW1cIiwgXCJzaG93QnV0dG9uUGFuZWxcIiwgXCJzaG93Q3VycmVudEF0UG9zXCIsXG5cdFwic2hvd01vbnRoQWZ0ZXJZZWFyXCIsIFwic2hvd09uXCIsIFwic2hvd09wdGlvbnNcIiwgXCJzaG93T3RoZXJNb250aHNcIixcblx0XCJzaG93V2Vla1wiLCBcInN0ZXBNb250aHNcIiwgXCJ3ZWVrSGVhZGVyXCIsIFwieWVhclJhbmdlXCIsXG5cdFwieWVhclN1ZmZpeFwiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5EYXRlcGlja2VyLCBbXG5cdFwiZGVzdHJveVwiLCBcImRpYWxvZ1wiLCBcImdldERhdGVcIiwgXCJoaWRlXCIsXG5cdFwiaXNEaXNhYmxlZFwiLCBcIm9wdGlvblwiLCBcInJlZnJlc2hcIiwgXCJzZXREYXRlXCIsXG5cdFwic2hvd1wiLCBcIndpZGdldFwiXG5dKTtcblxuLyoqXG4gKiBEaWFsb2cgY2xhc3MuXG4gKiBAY2xhc3MgeG5vZGV1aS5EaWFsb2dcbiAqL1xueG5vZGV1aS5EaWFsb2cgPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwiZGlhbG9nXCIpO1xuXG5jcmVhdGVYTm9kZVVJUHJvcGVydGllcyh4bm9kZXVpLkRpYWxvZywgW1xuXHRcImFwcGVuZFRvXCIsIFwiYXV0b09wZW5cIiwgXCJidXR0b25zXCIsIFwiY2xvc2VPbkVzY2FwZVwiLFxuXHRcImNsb3NlVGV4dFwiLCBcImRpYWxvZ0NsYXNzXCIsIFwiZHJhZ2dhYmxlXCIsIFwiaGVpZ2h0XCIsXG5cdFwiaGlkZVwiLCBcIm1heEhlaWdodFwiLCBcIm1heFdpZHRoXCIsIFwibWluSGVpZ2h0XCIsXG5cdFwibWluV2lkdGhcIiwgXCJtb2RhbFwiLCBcInBvc2l0aW9uXCIsIFwicmVzaXphYmxlXCIsXG5cdFwic2hvd1wiLCBcInRpdGxlXCIsIFwid2lkdGhcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuRGlhbG9nLCBbXG5cdFwiY2xvc2VcIiwgXCJkZXN0cm95XCIsIFwiaW5zdGFuY2VcIiwgXCJpc09wZW5cIixcblx0XCJtb3ZlVG9Ub3BcIiwgXCJvcGVuXCIsIFwib3B0aW9uXCIsIFwid2lkZ2V0XCJcbl0pO1xuXG4vKipcbiAqIE1lbnUgY2xhc3MuXG4gKiBAY2xhc3MgeG5vZGV1aS5NZW51XG4gKi9cbnhub2RldWkuTWVudSA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJtZW51XCIsIHhub2RlLlVsKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5NZW51LCBbXG5cdFwiZGlzYWJsZWRcIiwgXCJpY29uc1wiLCBcIml0ZW1zXCIsIFwibWVudXNcIixcblx0XCJwb3NpdGlvblwiLCBcInJvbGVcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuTWVudSwgW1xuXHRcImJsdXJcIiwgXCJjb2xsYXBzZVwiLCBcImNvbGxhcHNlQWxsXCIsIFwiZGVzdHJveVwiLFxuXHRcImRpc2FibGVcIiwgXCJlbmFibGVcIiwgXCJleHBhbmRcIiwgXCJmb2N1c1wiLFxuXHRcImluc3RhbmNlXCIsIFwiaXNGaXJzdEl0ZW1cIiwgXCJpc0xhc3RJdGVtXCIsIFwibmV4dFwiLFxuXHRcIm5leHRQYWdlXCIsIFwib3B0aW9uXCIsIFwicHJldmlvdXNcIiwgXCJwcmV2aW91c1BhZ2VcIixcblx0XCJyZWZyZXNoXCIsIFwic2VsZWN0XCIsIFwid2lkZ2V0XCJcbl0pO1xuXG4vKipcbiAqIFByb2dyZXNzYmFyIGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuUHJvZ3Jlc3NiYXJcbiAqL1xueG5vZGV1aS5Qcm9ncmVzc2JhciA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJwcm9ncmVzc2JhclwiKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5Qcm9ncmVzc2JhciwgW1xuXHRcImRpc2FibGVkXCIsIFwibWF4XCIsIFwidmFsdWVcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuUHJvZ3Jlc3NiYXIsIFtcblx0XCJkZXN0cm95XCIsIFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLCBcImluc3RhbmNlXCIsXG5cdFwib3B0aW9uXCIsIFwid2lkZ2V0XCIgLyosIFwidmFsdWVcIiovXG5dKTtcblxuLyoqXG4gKiBTZWxlY3RtZW51IGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuU2VsZWN0bWVudVxuICovXG54bm9kZXVpLlNlbGVjdG1lbnUgPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwic2VsZWN0bWVudVwiLCB4bm9kZS5TZWxlY3QpO1xuXG5jcmVhdGVYTm9kZVVJUHJvcGVydGllcyh4bm9kZXVpLlNlbGVjdG1lbnUsIFtcblx0XCJhcHBlbmRUb1wiLCBcImRpc2FibGVkXCIsIFwiaWNvbnNcIiwgXCJwb3NpdGlvblwiLFxuXHRcIndpZHRoXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLlNlbGVjdG1lbnUsIFtcblx0XCJjbG9zZVwiLCBcImRlc3Ryb3lcIiwgXCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsXG5cdFwiaW5zdGFuY2VcIiwgXCJtZW51V2lkZ2V0XCIsIFwib3BlblwiLCBcIm9wdGlvblwiLFxuXHRcInJlZnJlc2hcIiwgXCJ3aWRnZXRcIlxuXSk7XG5cbi8qKlxuICogU3Bpbm5lciBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLlNwaW5uZXJcbiAqL1xueG5vZGV1aS5TcGlubmVyID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcInNwaW5uZXJcIiwgeG5vZGUuSW5wdXQpO1xuXG5jcmVhdGVYTm9kZVVJUHJvcGVydGllcyh4bm9kZXVpLlNwaW5uZXIsIFtcblx0XCJjdWx0dXJlXCIsIFwiZGlzYWJsZWRcIiwgXCJpY29uc1wiLCBcImluY3JlbWVudGFsXCIsXG5cdFwibWF4XCIsIFwibWluXCIsIFwibnVtYmVyRm9ybWF0XCIsIFwicGFnZVwiLFxuXHRcInN0ZXBcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuU3Bpbm5lciwgW1xuXHRcImRlc3Ryb3lcIiwgXCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsIFwiaW5zdGFuY2VcIixcblx0XCJpc1ZhbGlkXCIsIFwib3B0aW9uXCIsIFwicGFnZURvd25cIiwgXCJwYWdlVXBcIixcblx0XCJzdGVwRG93blwiLCBcInN0ZXBVcFwiLCBcInZhbHVlXCIsIFwid2lkZ2V0XCJcbl0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHhub2RldWk7IiwidmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIEFwcFZpZXcgPSByZXF1aXJlKFwiLi4vdmlldy9BcHBWaWV3XCIpO1xudmFyIEFwcE1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL0FwcE1vZGVsXCIpO1xudmFyIEFwcENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi4vY29udHJvbGxlci9BcHBDb250cm9sbGVyXCIpO1xuXG4vKipcbiAqIFRoZSBtYWluIHJlc291cmNlIGZpZGRsZSBhcHAgY2xhc3MuXG4gKiBAY2xhc3MgQXBwXG4gKi9cbmZ1bmN0aW9uIEFwcCgpIHtcblx0eG5vZGUuRGl2LmNhbGwodGhpcyk7XG5cblx0dGhpcy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0dGhpcy5zdHlsZS50b3AgPSAwO1xuXHR0aGlzLnN0eWxlLmJvdHRvbSA9IDA7XG5cdHRoaXMuc3R5bGUubGVmdCA9IDA7XG5cdHRoaXMuc3R5bGUucmlnaHQgPSAwO1xuXG5cdHRoaXMuYXBwVmlldyA9IG5ldyBBcHBWaWV3KCk7XG5cdHRoaXMuYXBwTW9kZWwgPSBuZXcgQXBwTW9kZWwoKTtcblx0dGhpcy5hcHBDb250cm9sbGVyID0gbmV3IEFwcENvbnRyb2xsZXIodGhpcy5hcHBNb2RlbCwgdGhpcy5hcHBWaWV3KTtcblxuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMuYXBwVmlldyk7XG59XG5cbmluaGVyaXRzKEFwcCwgeG5vZGUuRGl2KTtcblxuLyoqXG4gKiBHZXQgbW9kZWwuXG4gKiBAbWV0aG9kIGdldE1vZGVsXG4gKi9cbkFwcC5wcm90b3R5cGUuZ2V0TW9kZWwgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuYXBwTW9kZWw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwOyIsInZhciBSZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXJcIik7XG5cbi8qKlxuICogQXBwIGNvbnRyb2xsZXJcbiAqIEBjbGFzcyBBcHBDb250cm9sbGVyXG4gKi9cbmZ1bmN0aW9uIEFwcENvbnRyb2xsZXIoYXBwTW9kZWwsIGFwcFZpZXcpIHtcblx0dGhpcy5hcHBNb2RlbCA9IGFwcE1vZGVsO1xuXHR0aGlzLmFwcFZpZXcgPSBhcHBWaWV3O1xuXG5cdHRoaXMuYXBwVmlldy5nZXRSZXNvdXJjZVBhbmVWaWV3KCkuc2V0VGFic0NvbGxlY3Rpb24odGhpcy5hcHBNb2RlbC5nZXRDYXRlZ29yeUNvbGxlY3Rpb24oKSk7XG5cdHRoaXMuYXBwVmlldy5nZXRSZXNvdXJjZVBhbmVWaWV3KCkuZ2V0VGFic0hlYWRlck1hbmFnZXIoKS5zZXRJdGVtQ29udHJvbGxlckNsYXNzKFJlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwQ29udHJvbGxlcjsiLCJmdW5jdGlvbiBSZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXIodGFiSGVhZGVyVmlldykge1xuXHR0aGlzLnRhYkhlYWRlclZpZXcgPSB0YWJIZWFkZXJWaWV3O1xufVxuXG5SZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXIucHJvdG90eXBlLnNldERhdGEgPSBmdW5jdGlvbihjYXRlZ29yeU1vZGVsKSB7XG5cdGlmIChjYXRlZ29yeU1vZGVsKSB7XG5cdFx0dGhpcy50YWJIZWFkZXJWaWV3LnNldExhYmVsKGNhdGVnb3J5TW9kZWwuZ2V0TGFiZWwoKSk7XG5cdFx0dGhpcy50YWJIZWFkZXJWaWV3LnNldFRhcmdldElkKGNhdGVnb3J5TW9kZWwuZ2V0SWQoKSk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXI7IiwiZmlkZGxldWkgPSB7XG5cdEFwcDogcmVxdWlyZShcIi4vYXBwL0FwcFwiKSxcblx0Q2F0ZWdvcnlNb2RlbDogcmVxdWlyZShcIi4vbW9kZWwvQ2F0ZWdvcnlNb2RlbFwiKVxufTsiLCJ2YXIgeG5vZGVjID0gcmVxdWlyZShcInhub2RlY29sbGVjdGlvblwiKTtcblxuLyoqXG4gKiBBcHBNb2RlbFxuICogQGNsYXNzIEFwcE1vZGVsXG4gKi9cbmZ1bmN0aW9uIEFwcE1vZGVsKCkge1xuXHR0aGlzLmNhdGVnb3J5Q29sbGVjdGlvbiA9IG5ldyB4bm9kZWMuQ29sbGVjdGlvbigpO1xuXG5cdHRoaXMuaWRDb3VudCA9IDA7XG59XG5cbi8qKlxuICogR2V0IGNhdGVnb3J5IGNvbGxlY3Rpb24uXG4gKiBAbWV0aG9kIGdldENhdGVnb3J5Q29sbGVjdGlvblxuICovXG5BcHBNb2RlbC5wcm90b3R5cGUuZ2V0Q2F0ZWdvcnlDb2xsZWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNhdGVnb3J5Q29sbGVjdGlvbjtcbn1cblxuLyoqXG4gKiBHZXQgc29tZXRoaW5nIHVzYWJsZSBmb3IgYSB1bmlxdWUgaWQuXG4gKiBAbWV0aG9kIGdldE5leHRJZFxuICovXG5BcHBNb2RlbC5wcm90b3R5cGUuZ2V0TmV4dElkID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuaWRDb3VudCsrO1xuXG5cdHJldHVybiBcImVsZW1cIiArIHRoaXMuaWRDb3VudDtcbn1cblxuLyoqXG4gKiBBZGQgY2F0ZWdvcnkgbW9kZWwuXG4gKiBAbWV0aG9kIGFkZENhdGVnb3J5TW9kZWxcbiAqL1xuQXBwTW9kZWwucHJvdG90eXBlLmFkZENhdGVnb3J5TW9kZWwgPSBmdW5jdGlvbihjYXRlZ29yeU1vZGVsKSB7XG5cdGNhdGVnb3J5TW9kZWwuc2V0UGFyZW50TW9kZWwodGhpcyk7XG5cdHRoaXMuY2F0ZWdvcnlDb2xsZWN0aW9uLmFkZEl0ZW0oY2F0ZWdvcnlNb2RlbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwTW9kZWw7IiwidmFyIEFwcE1vZGVsID0gcmVxdWlyZShcIi4vQXBwTW9kZWxcIik7XG5cbi8qKlxuICogR2V0IGNhdGVnb3J5IG1vZGVsLlxuICogQGNsYXNzIENhdGVnb3J5TW9kZWxcbiAqL1xuZnVuY3Rpb24gQ2F0ZWdvcnlNb2RlbChsYWJlbCkge1xuXHR0aGlzLmxhYmVsID0gbGFiZWw7XG5cdHRoaXMucGFyZW50TW9kZWwgPSBudWxsO1xufVxuXG4vKipcbiAqIFNldCByZWZlcmVuY2UgdG8gcGFyZW50IG1vZGVsLlxuICogQG1ldGhvZCBnZXRQYXJlbnRNb2RlbFxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5zZXRQYXJlbnRNb2RlbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMucGFyZW50TW9kZWwgPSB2YWx1ZTtcbn1cblxuLyoqXG4gKiBHZXQgbGFiZWwuXG4gKiBAbWV0aG9kIGdldExhYmVsXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLmdldExhYmVsID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmxhYmVsO1xufVxuXG4vKipcbiAqIEdldCBpZC5cbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuZ2V0SWQgPSBmdW5jdGlvbigpIHtcblx0aWYgKCF0aGlzLmlkKVxuXHRcdHRoaXMuaWQgPSB0aGlzLmdldEFwcE1vZGVsKCkuZ2V0TmV4dElkKCk7XG5cblx0cmV0dXJuIHRoaXMuaWQ7XG59XG5cbi8qKlxuICogR2V0IHJlZmVyZW5jZSB0byBhcHAgbW9kZWwuXG4gKiBAbWV0aG9kIGdldEFwcE1vZGVsXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLmdldEFwcE1vZGVsID0gZnVuY3Rpb24oKSB7XG5cdGlmICghdGhpcy5wYXJlbnRNb2RlbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ0aGVyZSBpcyBubyBwYXJlbnQhXCIpO1xuXG5cdHZhciBwID0gdGhpcy5wYXJlbnRNb2RlbDtcblxuXHR3aGlsZSAocCAmJiAhKHAgaW5zdGFuY2VvZiBBcHBNb2RlbCkpXG5cdFx0cCA9IHAucGFyZW50TW9kZWw7XG5cblx0cmV0dXJuIHA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2F0ZWdvcnlNb2RlbDsiLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgeG5vZGV1aSA9IHJlcXVpcmUoXCJ4bm9kZXVpXCIpO1xudmFyIFJlc291cmNlUGFuZVZpZXcgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVBhbmVWaWV3XCIpO1xuXG4vKipcbiAqIE1haW4gYXBwbGljYXRpb24gdmlldy5cbiAqIEBjbGFzcyBBcHBWaWV3XG4gKi9cbmZ1bmN0aW9uIEFwcFZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMuc3R5bGUudG9wID0gMDtcblx0dGhpcy5zdHlsZS5sZWZ0ID0gMDtcblx0dGhpcy5zdHlsZS5yaWdodCA9IDA7XG5cdHRoaXMuc3R5bGUuYm90dG9tID0gMDtcblxuXHR0aGlzLnJlc291cmNlUGFuZVZpZXcgPSBuZXcgUmVzb3VyY2VQYW5lVmlldygpO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMucmVzb3VyY2VQYW5lVmlldyk7XG59XG5cbmluaGVyaXRzKEFwcFZpZXcsIHhub2RlLkRpdik7XG5cbkFwcFZpZXcucHJvdG90eXBlLmdldFJlc291cmNlUGFuZVZpZXcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMucmVzb3VyY2VQYW5lVmlldztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBWaWV3OyIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciB4bm9kZXVpID0gcmVxdWlyZShcInhub2RldWlcIik7XG52YXIgeG5vZGVjID0gcmVxdWlyZShcInhub2RlY29sbGVjdGlvblwiKTtcbnZhciBSZXNvdXJjZVRhYkhlYWRlclZpZXcgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVRhYkhlYWRlclZpZXdcIik7XG52YXIgUmVzb3VyY2VUYWJWaWV3ID0gcmVxdWlyZShcIi4vUmVzb3VyY2VUYWJWaWV3XCIpO1xuXG4vKipcbiAqIFRoZSBsZWZ0IHBhcnQgb2YgdGhlIGFwcCwgc2hvd2luZyB0aGUgcmVzb3VyY2VzLlxuICogQGNsYXNzIFJlc291cmNlUGFuZVZpZXdcbiAqL1xuZnVuY3Rpb24gUmVzb3VyY2VQYW5lVmlldygpIHtcblx0eG5vZGUuRGl2LmNhbGwodGhpcyk7XG5cblx0dGhpcy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0dGhpcy5zdHlsZS50b3AgPSAwO1xuXHR0aGlzLnN0eWxlLmxlZnQgPSAwO1xuXHR0aGlzLnN0eWxlLndpZHRoID0gXCI1MCVcIjtcblx0dGhpcy5zdHlsZS5ib3R0b20gPSAwO1xuXG5cdHRoaXMudGFicyA9IG5ldyB4bm9kZXVpLlRhYnMoKTtcblx0dGhpcy50YWJzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHR0aGlzLnRhYnMuc3R5bGUubGVmdCA9IDEwO1xuXHR0aGlzLnRhYnMuc3R5bGUucmlnaHQgPSA1O1xuXHR0aGlzLnRhYnMuc3R5bGUudG9wID0gMTA7XG5cdHRoaXMudGFicy5zdHlsZS5ib3R0b20gPSAxMDtcblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLnRhYnMpO1xuXG5cdHRoaXMudGFic0hlYWRlck1hbmFnZXIgPSBuZXcgeG5vZGVjLkNvbGxlY3Rpb25WaWV3TWFuYWdlcih0aGlzLnRhYnMudWwpO1xuXHR0aGlzLnRhYnNIZWFkZXJNYW5hZ2VyLnNldEl0ZW1SZW5kZXJlckNsYXNzKFJlc291cmNlVGFiSGVhZGVyVmlldyk7XG5cblx0dGhpcy50YWJzQ29udGVudE1hbmFnZXIgPSBuZXcgeG5vZGVjLkNvbGxlY3Rpb25WaWV3TWFuYWdlcih0aGlzLnRhYnMpO1xuXHR0aGlzLnRhYnNDb250ZW50TWFuYWdlci5zZXRJdGVtUmVuZGVyZXJDbGFzcyhSZXNvdXJjZVRhYlZpZXcpO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZVBhbmVWaWV3LCB4bm9kZS5EaXYpO1xuXG4vKipcbiAqIFNldCB0YWJzIGNvbGxlY3Rpb24uXG4gKi9cblJlc291cmNlUGFuZVZpZXcucHJvdG90eXBlLnNldFRhYnNDb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuXHR0aGlzLnRhYnNIZWFkZXJNYW5hZ2VyLnNldERhdGFTb3VyY2UoY29sbGVjdGlvbik7XG5cdHRoaXMudGFic0NvbnRlbnRNYW5hZ2VyLnNldERhdGFTb3VyY2UoY29sbGVjdGlvbik7XG5cblx0dmFyIHNjb3BlPXRoaXM7XG5cblx0Y29sbGVjdGlvbi5vbihcImNoYW5nZVwiLGZ1bmN0aW9uKCkge1xuXHRcdHNjb3BlLnRhYnMucmVmcmVzaCgpO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBHZXQgdGFicyBoZWFkZXIgbWFuYWdlci5cbiAqIEBtZXRob2QgZ2V0VGFic0hlYWRlck1hbmFnZXJcbiAqL1xuUmVzb3VyY2VQYW5lVmlldy5wcm90b3R5cGUuZ2V0VGFic0hlYWRlck1hbmFnZXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudGFic0hlYWRlck1hbmFnZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VQYW5lVmlldzsiLCJ2YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG5cbmZ1bmN0aW9uIFJlc291cmNlVGFiSGVhZGVyVmlldygpIHtcblx0eG5vZGUuTGkuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnRhcmdldElkID0gbnVsbDtcblx0dGhpcy5sYWJlbCA9IG51bGw7XG59XG5cbmluaGVyaXRzKFJlc291cmNlVGFiSGVhZGVyVmlldywgeG5vZGUuTGkpO1xuXG5SZXNvdXJjZVRhYkhlYWRlclZpZXcucHJvdG90eXBlLnNldFRhcmdldElkID0gZnVuY3Rpb24oaWQpIHtcblx0dGhpcy50YXJnZXRJZCA9IGlkO1xuXHR0aGlzLnJlZnJlc2goKTtcbn1cblxuUmVzb3VyY2VUYWJIZWFkZXJWaWV3LnByb3RvdHlwZS5zZXRMYWJlbCA9IGZ1bmN0aW9uKGxhYmVsKSB7XG5cdHRoaXMubGFiZWwgPSBsYWJlbDtcblx0dGhpcy5yZWZyZXNoKCk7XG59XG5cblJlc291cmNlVGFiSGVhZGVyVmlldy5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5sYWJlbCAmJiB0aGlzLnRhcmdldElkKSB7XG5cdFx0dGhpcy5pbm5lckhUTUwgPSBcIjxhIGhyZWY9JyNcIiArIHRoaXMudGFyZ2V0SWQgKyBcIic+XCIgKyB0aGlzLmxhYmVsICsgXCI8L2E+XCI7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZVRhYkhlYWRlclZpZXc7IiwidmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xuXG5mdW5jdGlvbiBSZXNvdXJjZVRhYlZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZVRhYlZpZXcsIHhub2RlLkRpdik7XG5cblJlc291cmNlVGFiVmlldy5wcm90b3R5cGUuc2V0RGF0YSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0aWYgKGRhdGEpIHtcblx0XHR0aGlzLmlkID0gZGF0YS5pZDtcblxuXHRcdHRoaXMuaW5uZXJIVE1MID0gXCJoZWxsbyB3b3JsZDogXCIgKyBkYXRhLmxhYmVsO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VUYWJWaWV3OyJdfQ==
