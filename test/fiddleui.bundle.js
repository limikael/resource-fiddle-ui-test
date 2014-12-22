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
var xnodeui = require("xnodeui");

function ResourceTabView() {
	xnode.Div.call(this);

//	this.innerHTML="hello";

	this.container=new xnode.Div();
	this.container.style.position = "absolute";
	this.container.style.left = 10;
	this.container.style.right = 10;
	this.container.style.top = 60;
	this.container.style.bottom = 10;
	this.container.style.background="#ff0000";
	this.container.innerHTML="hello";

	this.appendChild(this.container);

	this.accordion = new xnodeui.Accordion();
	this.accordion.style.position = "absolute";
	this.accordion.style.left = 5;
	this.accordion.style.right = 5;
	this.accordion.style.top = 5;
	this.accordion.style.bottom = 5;

	this.accordion.appendChild(new xnode.Div("hello"));
	this.accordion.appendChild(new xnode.Div("some content...<br/>blalabl"));
	this.accordion.appendChild(new xnode.Div("hello 2"));
	this.accordion.appendChild(new xnode.Div("some more content...<br/>blalabl and so on...<br/>blalabl and so on...<br/>blalabl and so on...<br/>"));


	this.accordion.heightStyle = "fill";
	this.accordion.collapsible = false;
	this.accordion.autoHeight = false;

	this.container.appendChild(this.accordion);

	var scope = this;

	setTimeout(function() {
		scope.accordion.heightStyle = "fill";
		scope.accordion.collapsible = false;
		scope.accordion.refresh();
	}, 0);
}

inherits(ResourceTabView, xnode.Div);

ResourceTabView.prototype.setData = function(data) {
	if (data) {
			this.id = data.id;

			//this.innerHTML = "hello world: " + data.label;
	}
}

module.exports = ResourceTabView;
},{"inherits":1,"xnode":2,"xnodeui":9}]},{},[13])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy94bm9kZS9zcmMveG5vZGUuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL25vZGVfbW9kdWxlcy94bm9kZS9zcmMveG5vZGUuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL25vZGVfbW9kdWxlcy95YWVkL3NyYy9FdmVudERpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3hub2RlY29sbGVjdGlvbi9zcmMvQ29sbGVjdGlvblZpZXcuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uVmlld01hbmFnZXIuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94bm9kZXVpL3NyYy94bm9kZXVpLmpzIiwic3JjL2FwcC9BcHAuanMiLCJzcmMvY29udHJvbGxlci9BcHBDb250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyLmpzIiwic3JjL2ZpZGRsZXVpLmpzIiwic3JjL21vZGVsL0FwcE1vZGVsLmpzIiwic3JjL21vZGVsL0NhdGVnb3J5TW9kZWwuanMiLCJzcmMvdmlldy9BcHBWaWV3LmpzIiwic3JjL3ZpZXcvUmVzb3VyY2VQYW5lVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlVGFiSGVhZGVyVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlVGFiVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiKGZ1bmN0aW9uKCkge1xuXHQvKipcblx0ICogVGhlIGJhc2ljIHhub2RlIGNsYXNzLlxuXHQgKiBJdCBzZXRzIHRoZSB1bmRlcmx5aW5nIG5vZGUgZWxlbWVudCBieSBjYWxsaW5nXG5cdCAqIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnRcblx0ICovXG5cdGZ1bmN0aW9uIFhOb2RlKHR5cGUsIGNvbnRlbnQpIHtcblx0XHR0aGlzLm5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG5cdFx0aWYgKGNvbnRlbnQgIT09IHVuZGVmaW5lZClcblx0XHRcdHRoaXMubm9kZS5pbm5lckhUTUwgPSBjb250ZW50O1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYW4gZXh0ZW5kZWQgY2xhc3MgdXNpbmdcblx0ICogdGhlIFhOb2RlIGNsYXNzIGRlZmluZWQgYWJvdmUuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChlbGVtZW50VHlwZSwgY29udGVudCkge1xuXHRcdHZhciBmID0gZnVuY3Rpb24oY29udGVudCkge1xuXHRcdFx0WE5vZGUuY2FsbCh0aGlzLCBlbGVtZW50VHlwZSwgY29udGVudCk7XG5cdFx0fTtcblxuXHRcdGYucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShYTm9kZS5wcm90b3R5cGUpO1xuXHRcdGYucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gZjtcblxuXHRcdHJldHVybiBmO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHJlYWQgb25seSBwcm9wZXJ0eSB0aGF0IHJldHVybnMgdGhlXG5cdCAqIHZhbHVlIG9mIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5IG9mIHRoZVxuXHQgKiB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlWE5vZGVSZWFkT25seVByb3BlcnR5KHByb3BlcnR5TmFtZSkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShYTm9kZS5wcm90b3R5cGUsIHByb3BlcnR5TmFtZSwge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubm9kZVtwcm9wZXJ0eU5hbWVdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHJlYWQgd3JpdGUgcHJvcGVydHkgdGhhdCBvcGVyYXRlcyBvblxuXHQgKiB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBvZiB0aGUgdW5kZXJseWluZ1xuXHQgKiBub2RlIG9iamVjdC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkocHJvcGVydHlOYW1lKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFhOb2RlLnByb3RvdHlwZSwgcHJvcGVydHlOYW1lLCB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5ub2RlW3Byb3BlcnR5TmFtZV07XG5cdFx0XHR9LFxuXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdHRoaXMubm9kZVtwcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbWV0aG9kIHRoYXQgcm91dGVzIHRoZSBjYWxsIHRocm91Z2gsIGRvd25cblx0ICogdG8gdGhlIHNhbWUgbWV0aG9kIG9uIHRoZSB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlWE5vZGVNZXRob2QobWV0aG9kTmFtZSkge1xuXHRcdFhOb2RlLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubm9kZVttZXRob2ROYW1lXS5hcHBseSh0aGlzLm5vZGUsIGFyZ3VtZW50cyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE1vZGlmeSB0aGUgTm9kZS5wcm9wZXJ0eSBmdW5jdGlvbiwgc28gdGhhdCBpdCBhY2NlcHRzXG5cdCAqIFhOb2RlIG9iamVjdHMuIEFsbCBYTm9kZSBvYmplY3RzIHdpbGwgYmUgY2hhbmdlZCB0b1xuXHQgKiB0aGUgdW5kZXJseWluZyBub2RlIG9iamVjdHMsIGFuZCB0aGUgY29ycmVzcG9uZGluZ1xuXHQgKiBtZXRob2Qgd2lsbCBiZSBjYWxsZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVOb2RlVG9YTm9kZU1ldGhvZFdyYXBwZXIobWV0aG9kTmFtZSkge1xuXHRcdHZhciBvcmlnaW5hbEZ1bmN0aW9uID0gTm9kZS5wcm90b3R5cGVbbWV0aG9kTmFtZV07XG5cblx0XHROb2RlLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Zm9yICh2YXIgYSBpbiBhcmd1bWVudHMpIHtcblx0XHRcdFx0aWYgKGFyZ3VtZW50c1thXSBpbnN0YW5jZW9mIFhOb2RlKVxuXHRcdFx0XHRcdGFyZ3VtZW50c1thXSA9IGFyZ3VtZW50c1thXS5ub2RlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gb3JpZ2luYWxGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgdXAgcmVhZCBvbmx5IHByb3BlcnRpZXMuXG5cdCAqL1xuXHRjcmVhdGVYTm9kZVJlYWRPbmx5UHJvcGVydHkoXCJzdHlsZVwiKTtcblxuXHQvKipcblx0ICogU2V0IHVwIHJlYWQvd3JpdGUgcHJvcGVydGllcy5cblx0ICovXG5cdGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkoXCJpbm5lckhUTUxcIik7XG5cdGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkoXCJocmVmXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwiaWRcIik7XG5cblx0LyoqXG5cdCAqIFNldCB1cCBtZXRob2RzIHRvIGJlIHJvdXRlZCB0byB0aGUgdW5kZXJseWluZyBub2RlIG9iamVjdC5cblx0ICovXG5cdGNyZWF0ZVhOb2RlTWV0aG9kKFwiYXBwZW5kQ2hpbGRcIik7XG5cdGNyZWF0ZVhOb2RlTWV0aG9kKFwicmVtb3ZlQ2hpbGRcIik7XG5cdGNyZWF0ZVhOb2RlTWV0aG9kKFwiYWRkRXZlbnRMaXN0ZW5lclwiKTtcblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJyZW1vdmVFdmVudExpc3RlbmVyXCIpO1xuXG5cdC8qKlxuXHQgKiBTZXQgdXAgbWV0aG9kcyBvbiBOb2RlLnByb3BlcnR5LlxuXHQgKi9cblx0Y3JlYXRlTm9kZVRvWE5vZGVNZXRob2RXcmFwcGVyKFwiYXBwZW5kQ2hpbGRcIik7XG5cdGNyZWF0ZU5vZGVUb1hOb2RlTWV0aG9kV3JhcHBlcihcInJlbW92ZUNoaWxkXCIpO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGUgZXZlbnQgbGlzdGVuZXIgYWxpYXNlcy5cblx0ICovXG5cdFhOb2RlLnByb3RvdHlwZS5vbiA9IFhOb2RlLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyO1xuXHRYTm9kZS5wcm90b3R5cGUub2ZmID0gWE5vZGUucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cblx0LyoqXG5cdCAqIFdvcmsgYm90aCBhcyBhIG5wbSBtb2R1bGUgYW5kIHN0YW5kYWxvbmUuXG5cdCAqL1xuXHR2YXIgdGFyZ2V0O1xuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0dGFyZ2V0ID0ge307XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSB0YXJnZXQ7XG5cdH0gZWxzZSB7XG5cdFx0eG5vZGUgPSB7fTtcblx0XHR0YXJnZXQgPSB4bm9kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgZXh0ZW5kZWQgY2xhc3Nlcy5cblx0ICovXG5cdHRhcmdldC5EaXYgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImRpdlwiKTtcblx0dGFyZ2V0LkJ1dHRvbiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHR0YXJnZXQuVWwgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcInVsXCIpO1xuXHR0YXJnZXQuTGkgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImxpXCIpO1xuXHR0YXJnZXQuQSA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwiYVwiKTtcblx0dGFyZ2V0Lk9wdGlvbiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwib3B0aW9uXCIpO1xuXHR0YXJnZXQuU2VsZWN0ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJzZWxlY3RcIik7XG5cdHRhcmdldC5JbnB1dCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwiaW5wdXRcIik7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHQvKipcblx0ICogVGhlIGJhc2ljIHhub2RlIGNsYXNzLlxuXHQgKiBJdCBzZXRzIHRoZSB1bmRlcmx5aW5nIG5vZGUgZWxlbWVudCBieSBjYWxsaW5nXG5cdCAqIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnRcblx0ICovXG5cdGZ1bmN0aW9uIFhOb2RlKHR5cGUsIGNvbnRlbnQpIHtcblx0XHR0aGlzLm5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG5cdFx0aWYgKGNvbnRlbnQgIT09IHVuZGVmaW5lZClcblx0XHRcdHRoaXMubm9kZS5pbm5lckhUTUwgPSBjb250ZW50O1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYW4gZXh0ZW5kZWQgY2xhc3MgdXNpbmdcblx0ICogdGhlIFhOb2RlIGNsYXNzIGRlZmluZWQgYWJvdmUuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChlbGVtZW50VHlwZSwgY29udGVudCkge1xuXHRcdHZhciBmID0gZnVuY3Rpb24oY29udGVudCkge1xuXHRcdFx0WE5vZGUuY2FsbCh0aGlzLCBlbGVtZW50VHlwZSwgY29udGVudCk7XG5cdFx0fTtcblxuXHRcdGYucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShYTm9kZS5wcm90b3R5cGUpO1xuXHRcdGYucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gZjtcblxuXHRcdHJldHVybiBmO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHJlYWQgb25seSBwcm9wZXJ0eSB0aGF0IHJldHVybnMgdGhlXG5cdCAqIHZhbHVlIG9mIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5IG9mIHRoZVxuXHQgKiB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlWE5vZGVSZWFkT25seVByb3BlcnR5KHByb3BlcnR5TmFtZSkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShYTm9kZS5wcm90b3R5cGUsIHByb3BlcnR5TmFtZSwge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubm9kZVtwcm9wZXJ0eU5hbWVdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHJlYWQgd3JpdGUgcHJvcGVydHkgdGhhdCBvcGVyYXRlcyBvblxuXHQgKiB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBvZiB0aGUgdW5kZXJseWluZ1xuXHQgKiBub2RlIG9iamVjdC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkocHJvcGVydHlOYW1lKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFhOb2RlLnByb3RvdHlwZSwgcHJvcGVydHlOYW1lLCB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5ub2RlW3Byb3BlcnR5TmFtZV07XG5cdFx0XHR9LFxuXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdHRoaXMubm9kZVtwcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbWV0aG9kIHRoYXQgcm91dGVzIHRoZSBjYWxsIHRocm91Z2gsIGRvd25cblx0ICogdG8gdGhlIHNhbWUgbWV0aG9kIG9uIHRoZSB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlWE5vZGVNZXRob2QobWV0aG9kTmFtZSkge1xuXHRcdFhOb2RlLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubm9kZVttZXRob2ROYW1lXS5hcHBseSh0aGlzLm5vZGUsIGFyZ3VtZW50cyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE1vZGlmeSB0aGUgTm9kZS5wcm9wZXJ0eSBmdW5jdGlvbiwgc28gdGhhdCBpdCBhY2NlcHRzXG5cdCAqIFhOb2RlIG9iamVjdHMuIEFsbCBYTm9kZSBvYmplY3RzIHdpbGwgYmUgY2hhbmdlZCB0b1xuXHQgKiB0aGUgdW5kZXJseWluZyBub2RlIG9iamVjdHMsIGFuZCB0aGUgY29ycmVzcG9uZGluZ1xuXHQgKiBtZXRob2Qgd2lsbCBiZSBjYWxsZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVOb2RlVG9YTm9kZU1ldGhvZFdyYXBwZXIobWV0aG9kTmFtZSkge1xuXHRcdHZhciBvcmlnaW5hbEZ1bmN0aW9uID0gTm9kZS5wcm90b3R5cGVbbWV0aG9kTmFtZV07XG5cblx0XHROb2RlLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Zm9yICh2YXIgYSBpbiBhcmd1bWVudHMpIHtcblx0XHRcdFx0aWYgKGFyZ3VtZW50c1thXSBpbnN0YW5jZW9mIFhOb2RlKVxuXHRcdFx0XHRcdGFyZ3VtZW50c1thXSA9IGFyZ3VtZW50c1thXS5ub2RlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gb3JpZ2luYWxGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgdXAgcmVhZCBvbmx5IHByb3BlcnRpZXMuXG5cdCAqL1xuXHRjcmVhdGVYTm9kZVJlYWRPbmx5UHJvcGVydHkoXCJzdHlsZVwiKTtcblxuXHQvKipcblx0ICogU2V0IHVwIHJlYWQvd3JpdGUgcHJvcGVydGllcy5cblx0ICovXG5cdGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkoXCJpbm5lckhUTUxcIik7XG5cdGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkoXCJocmVmXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwiaWRcIik7XG5cdGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkoXCJ2YWx1ZVwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcInR5cGVcIik7XG5cblx0LyoqXG5cdCAqIFNldCB1cCBtZXRob2RzIHRvIGJlIHJvdXRlZCB0byB0aGUgdW5kZXJseWluZyBub2RlIG9iamVjdC5cblx0ICovXG5cdGNyZWF0ZVhOb2RlTWV0aG9kKFwiYXBwZW5kQ2hpbGRcIik7XG5cdGNyZWF0ZVhOb2RlTWV0aG9kKFwicmVtb3ZlQ2hpbGRcIik7XG5cdGNyZWF0ZVhOb2RlTWV0aG9kKFwiYWRkRXZlbnRMaXN0ZW5lclwiKTtcblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJyZW1vdmVFdmVudExpc3RlbmVyXCIpO1xuXG5cdC8qKlxuXHQgKiBTZXQgdXAgbWV0aG9kcyBvbiBOb2RlLnByb3BlcnR5LlxuXHQgKi9cblx0Y3JlYXRlTm9kZVRvWE5vZGVNZXRob2RXcmFwcGVyKFwiYXBwZW5kQ2hpbGRcIik7XG5cdGNyZWF0ZU5vZGVUb1hOb2RlTWV0aG9kV3JhcHBlcihcInJlbW92ZUNoaWxkXCIpO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGUgZXZlbnQgbGlzdGVuZXIgYWxpYXNlcy5cblx0ICovXG5cdFhOb2RlLnByb3RvdHlwZS5vbiA9IFhOb2RlLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyO1xuXHRYTm9kZS5wcm90b3R5cGUub2ZmID0gWE5vZGUucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cblx0LyoqXG5cdCAqIFdvcmsgYm90aCBhcyBhIG5wbSBtb2R1bGUgYW5kIHN0YW5kYWxvbmUuXG5cdCAqL1xuXHR2YXIgdGFyZ2V0O1xuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0dGFyZ2V0ID0ge307XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSB0YXJnZXQ7XG5cdH0gZWxzZSB7XG5cdFx0eG5vZGUgPSB7fTtcblx0XHR0YXJnZXQgPSB4bm9kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgZXh0ZW5kZWQgY2xhc3Nlcy5cblx0ICovXG5cdHRhcmdldC5EaXYgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImRpdlwiKTtcblx0dGFyZ2V0LkJ1dHRvbiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHR0YXJnZXQuVWwgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcInVsXCIpO1xuXHR0YXJnZXQuTGkgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImxpXCIpO1xuXHR0YXJnZXQuQSA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwiYVwiKTtcblx0dGFyZ2V0Lk9wdGlvbiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwib3B0aW9uXCIpO1xuXHR0YXJnZXQuU2VsZWN0ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJzZWxlY3RcIik7XG5cdHRhcmdldC5JbnB1dCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwiaW5wdXRcIik7XG59KSgpOyIsIi8qKlxuICogQVMzL2pxdWVyeSBzdHlsZSBldmVudCBkaXNwYXRjaGVyLiBTbGlnaHRseSBtb2RpZmllZC4gVGhlXG4gKiBqcXVlcnkgc3R5bGUgb24vb2ZmL3RyaWdnZXIgc3R5bGUgb2YgYWRkaW5nIGxpc3RlbmVycyBpc1xuICogY3VycmVudGx5IHRoZSBwcmVmZXJyZWQgb25lLlxuICpcbiAqIFRoZSBvbiBtZXRob2QgZm9yIGFkZGluZyBsaXN0ZW5lcnMgdGFrZXMgYW4gZXh0cmEgcGFyYW1ldGVyIHdoaWNoIGlzIHRoZVxuICogc2NvcGUgaW4gd2hpY2ggbGlzdGVuZXJzIHNob3VsZCBiZSBjYWxsZWQuIFNvIHRoaXM6XG4gKlxuICogICAgIG9iamVjdC5vbihcImV2ZW50XCIsIGxpc3RlbmVyLCB0aGlzKTtcbiAqXG4gKiBIYXMgdGhlIHNhbWUgZnVuY3Rpb24gd2hlbiBhZGRpbmcgZXZlbnRzIGFzOlxuICpcbiAqICAgICBvYmplY3Qub24oXCJldmVudFwiLCBsaXN0ZW5lci5iaW5kKHRoaXMpKTtcbiAqXG4gKiBIb3dldmVyLCB0aGUgZGlmZmVyZW5jZSBpcyB0aGF0IGlmIHdlIHVzZSB0aGUgc2Vjb25kIG1ldGhvZCBpdFxuICogd2lsbCBub3QgYmUgcG9zc2libGUgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgbGF0ZXIsIHVubGVzc1xuICogdGhlIGNsb3N1cmUgY3JlYXRlZCBieSBiaW5kIGlzIHN0b3JlZCBzb21ld2hlcmUuIElmIHRoZVxuICogZmlyc3QgbWV0aG9kIGlzIHVzZWQsIHdlIGNhbiByZW1vdmUgdGhlIGxpc3RlbmVyIHdpdGg6XG4gKlxuICogICAgIG9iamVjdC5vZmYoXCJldmVudFwiLCBsaXN0ZW5lciwgdGhpcyk7XG4gKlxuICogQGNsYXNzIEV2ZW50RGlzcGF0Y2hlclxuICovXG5mdW5jdGlvbiBFdmVudERpc3BhdGNoZXIoKSB7XG5cdHRoaXMubGlzdGVuZXJNYXAgPSB7fTtcbn1cblxuLyoqXG4gKiBBZGQgZXZlbnQgbGlzdGVuZXIuXG4gKiBAbWV0aG9kIGFkZEV2ZW50TGlzdGVuZXJcbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lciwgc2NvcGUpIHtcblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwKVxuXHRcdHRoaXMubGlzdGVuZXJNYXAgPSB7fTtcblxuXHRpZiAoIWV2ZW50VHlwZSlcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFdmVudCB0eXBlIHJlcXVpcmVkIGZvciBldmVudCBkaXNwYXRjaGVyXCIpO1xuXG5cdGlmICghbGlzdGVuZXIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTGlzdGVuZXIgcmVxdWlyZWQgZm9yIGV2ZW50IGRpc3BhdGNoZXJcIik7XG5cblx0dGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHNjb3BlKTtcblxuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXAuaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSlcblx0XHR0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV0gPSBbXTtcblxuXHR0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV0ucHVzaCh7XG5cdFx0bGlzdGVuZXI6IGxpc3RlbmVyLFxuXHRcdHNjb3BlOiBzY29wZVxuXHR9KTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXIuXG4gKiBAbWV0aG9kIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lciwgc2NvcGUpIHtcblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwKVxuXHRcdHRoaXMubGlzdGVuZXJNYXAgPSB7fTtcblxuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXAuaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSlcblx0XHRyZXR1cm47XG5cblx0dmFyIGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBsaXN0ZW5lck9iaiA9IGxpc3RlbmVyc1tpXTtcblxuXHRcdGlmIChsaXN0ZW5lciA9PSBsaXN0ZW5lck9iai5saXN0ZW5lciAmJiBzY29wZSA9PSBsaXN0ZW5lck9iai5zY29wZSkge1xuXHRcdFx0bGlzdGVuZXJzLnNwbGljZShpLCAxKTtcblx0XHRcdGktLTtcblx0XHR9XG5cdH1cblxuXHRpZiAoIWxpc3RlbmVycy5sZW5ndGgpXG5cdFx0ZGVsZXRlIHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXTtcbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBldmVudC5cbiAqIEBtZXRob2QgZGlzcGF0Y2hFdmVudFxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQgPSBmdW5jdGlvbihldmVudCAvKiAuLi4gKi8gKSB7XG5cdGlmICghdGhpcy5saXN0ZW5lck1hcClcblx0XHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG5cblx0dmFyIGV2ZW50VHlwZTtcblx0dmFyIGxpc3RlbmVyUGFyYW1zO1xuXG5cdGlmICh0eXBlb2YgZXZlbnQgPT0gXCJzdHJpbmdcIikge1xuXHRcdGV2ZW50VHlwZSA9IGV2ZW50O1xuXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxuXHRcdFx0bGlzdGVuZXJQYXJhbXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG5cdFx0ZWxzZSBsaXN0ZW5lclBhcmFtcyA9IFt7XG5cdFx0XHR0eXBlOiBldmVudFR5cGUsXG5cdFx0XHR0YXJnZXQ6IHRoaXNcblx0XHR9XTtcblx0fSBlbHNlIHtcblx0XHRldmVudFR5cGUgPSBldmVudC50eXBlO1xuXHRcdGV2ZW50LnRhcmdldCA9IHRoaXM7XG5cdFx0bGlzdGVuZXJQYXJhbXMgPSBbZXZlbnRdO1xuXHR9XG5cblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpXG5cdFx0cmV0dXJuO1xuXG5cdGZvciAodmFyIGkgaW4gdGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdKSB7XG5cdFx0dmFyIGxpc3RlbmVyT2JqID0gdGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdW2ldO1xuXHRcdGxpc3RlbmVyT2JqLmxpc3RlbmVyLmFwcGx5KGxpc3RlbmVyT2JqLnNjb3BlLCBsaXN0ZW5lclBhcmFtcyk7XG5cdH1cbn1cblxuLyoqXG4gKiBKcXVlcnkgc3R5bGUgYWxpYXMgZm9yIGFkZEV2ZW50TGlzdGVuZXJcbiAqIEBtZXRob2Qgb25cbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblxuLyoqXG4gKiBKcXVlcnkgc3R5bGUgYWxpYXMgZm9yIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAqIEBtZXRob2Qgb2ZmXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub2ZmID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXG4vKipcbiAqIEpxdWVyeSBzdHlsZSBhbGlhcyBmb3IgZGlzcGF0Y2hFdmVudFxuICogQG1ldGhvZCB0cmlnZ2VyXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUudHJpZ2dlciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudDtcblxuLyoqXG4gKiBNYWtlIHNvbWV0aGluZyBhbiBldmVudCBkaXNwYXRjaGVyLiBDYW4gYmUgdXNlZCBmb3IgbXVsdGlwbGUgaW5oZXJpdGFuY2UuXG4gKiBAbWV0aG9kIGluaXRcbiAqIEBzdGF0aWNcbiAqL1xuRXZlbnREaXNwYXRjaGVyLmluaXQgPSBmdW5jdGlvbihjbHMpIHtcblx0Y2xzLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyO1xuXHRjbHMucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cdGNscy5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudDtcblx0Y2xzLnByb3RvdHlwZS5vbiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub247XG5cdGNscy5wcm90b3R5cGUub2ZmID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5vZmY7XG5cdGNscy5wcm90b3R5cGUudHJpZ2dlciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUudHJpZ2dlcjtcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gRXZlbnREaXNwYXRjaGVyO1xufSIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwieWFlZFwiKTtcblxuLyoqXG4gKiBDb2xsZWN0aW9uLlxuICogQGNsYXNzIENvbGxlY3Rpb25cbiAqL1xuZnVuY3Rpb24gQ29sbGVjdGlvbigpIHtcblx0dGhpcy5pdGVtcyA9IFtdO1xufVxuXG5pbmhlcml0cyhDb2xsZWN0aW9uLCBFdmVudERpc3BhdGNoZXIpO1xuXG4vKipcbiAqIEFkZCBpdGVtIGF0IGVuZC5cbiAqIEBtZXRob2QgYWRkSXRlbVxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5hZGRJdGVtID0gZnVuY3Rpb24oaXRlbSkge1xuXHR0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG5cblx0dGhpcy50cmlnZ2VyQ2hhbmdlKFwiYWRkXCIsIGl0ZW0sIHRoaXMuaXRlbXMubGVuZ3RoIC0gMSk7XG59XG5cbi8qKlxuICogQWRkIGl0ZW0gYXQgaW5kZXguXG4gKiBAbWV0aG9kIGFkZEl0ZW1cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuYWRkSXRlbUF0ID0gZnVuY3Rpb24oaW5kZXgsIGl0ZW0pIHtcblx0aWYgKGluZGV4IDwgMClcblx0XHRpbmRleCA9IDA7XG5cblx0aWYgKGluZGV4ID4gdGhpcy5pdGVtcy5sZW5ndGgpXG5cdFx0aW5kZXggPSB0aGlzLml0ZW1zLmxlbmd0aDtcblxuXHR2YXIgYWZ0ZXIgPSB0aGlzLml0ZW1zLnNwbGljZShpbmRleCk7XG5cdHRoaXMuaXRlbXMucHVzaChpdGVtKTtcblx0dGhpcy5pdGVtcyA9IHRoaXMuaXRlbXMuY29uY2F0KGFmdGVyKTtcblxuXHR0aGlzLnRyaWdnZXJDaGFuZ2UoXCJhZGRcIiwgaXRlbSwgaW5kZXgpO1xufVxuXG4vKipcbiAqIEdldCBsZW5ndGguXG4gKiBAbWV0aG9kIGdldExlbmd0aFxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5nZXRMZW5ndGggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoO1xufVxuXG4vKipcbiAqIEdldCBpdGVtIGF0IGluZGV4LlxuICogQG1ldGhvZCBnZXRJdGVtQXRcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuZ2V0SXRlbUF0ID0gZnVuY3Rpb24oaW5kZXgpIHtcblx0cmV0dXJuIHRoaXMuaXRlbXNbaW5kZXhdO1xufVxuXG4vKipcbiAqIEZpbmQgaXRlbSBpbmRleC5cbiAqIEBtZXRob2QgZ2V0SXRlbUluZGV4XG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmdldEl0ZW1JbmRleCA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0cmV0dXJuIHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgaXRlbSBhdC5cbiAqIEBtZXRob2QgcmVtb3ZlSXRlbUF0XG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLnJlbW92ZUl0ZW1BdCA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cdGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5pdGVtcy5sZW5ndGgpXG5cdFx0cmV0dXJuO1xuXG5cdHZhciBpdGVtID0gdGhpcy5nZXRJdGVtQXQoaW5kZXgpO1xuXG5cdHRoaXMuaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcblx0dGhpcy50cmlnZ2VyQ2hhbmdlKFwicmVtb3ZlXCIsIGl0ZW0sIGluZGV4KTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgaXRlbS5cbiAqIEBtZXRob2QgcmVtb3ZlSXRlbVxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5yZW1vdmVJdGVtID0gZnVuY3Rpb24oaXRlbSkge1xuXHR2YXIgaW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChpdGVtKTtcblxuXHR0aGlzLnJlbW92ZUl0ZW1BdChpbmRleCk7XG59XG5cbi8qKlxuICogVHJpZ2dlciBjaGFuZ2UgZXZlbnQuXG4gKiBAbWV0aG9kIHRyaWdnZXJDaGFuZ2VcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLnRyaWdnZXJDaGFuZ2UgPSBmdW5jdGlvbihldmVudEtpbmQsIGl0ZW0sIGluZGV4KSB7XG5cdHRoaXMudHJpZ2dlcih7XG5cdFx0dHlwZTogZXZlbnRLaW5kLFxuXHRcdGl0ZW06IGl0ZW0sXG5cdFx0aW5kZXg6IGluZGV4XG5cdH0pO1xuXG5cdHRoaXMudHJpZ2dlcih7XG5cdFx0dHlwZTogXCJjaGFuZ2VcIixcblx0XHRraW5kOiBldmVudEtpbmQsXG5cdFx0aXRlbTogaXRlbSxcblx0XHRpbmRleDogaW5kZXhcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sbGVjdGlvbjsiLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcInlhZWRcIik7XG52YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgQ29sbGVjdGlvblZpZXdNYW5hZ2VyPXJlcXVpcmUoXCIuL0NvbGxlY3Rpb25WaWV3TWFuYWdlclwiKTtcblxuLyoqXG4gKiBDb2xsZWN0aW9uVmlldy5cbiAqIEBjbGFzcyBDb2xsZWN0aW9uVmlld1xuICovXG5mdW5jdGlvbiBDb2xsZWN0aW9uVmlldygpIHtcblx0eG5vZGUuRGl2LmNhbGwodGhpcyk7XG5cblx0dGhpcy5tYW5hZ2VyPW5ldyBDb2xsZWN0aW9uVmlld01hbmFnZXIodGhpcyk7XG59XG5cbmluaGVyaXRzKENvbGxlY3Rpb25WaWV3LCB4bm9kZS5EaXYpO1xuXG4vKipcbiAqIFNldCBpdGVtIHJlbmRlcmVyIGNsYXNzLlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJDbGFzc1xuICovXG5Db2xsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0SXRlbVJlbmRlcmVyQ2xhc3MgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLm1hbmFnZXIuc2V0SXRlbVJlbmRlcmVyQ2xhc3ModmFsdWUpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIHJlbmRlcmVyIGZhY3RvcnkuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckZhY3RvcnlcbiAqL1xuQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLnNldEl0ZW1SZW5kZXJlckZhY3RvcnkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLm1hbmFnZXIuc2V0SXRlbVJlbmRlcmVyRmFjdG9yeSh2YWx1ZSk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gY29udHJvbGxlciBjbGFzcy5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyQ2xhc3NcbiAqL1xuQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLnNldEl0ZW1Db250cm9sbGVyQ2xhc3MgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLm1hbmFnZXIuc2V0SXRlbUNvbnRyb2xsZXJDbGFzcyh2YWx1ZSk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gY29udHJvbGxlciBmYWN0b3J5LlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJGYWN0b3J5XG4gKi9cbkNvbGxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXRJdGVtQ29udHJvbGxlckZhY3RvcnkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLm1hbmFnZXIuc2V0SXRlbUNvbnRyb2xsZXJGYWN0b3J5KHZhbHVlKTtcbn1cblxuLyoqXG4gKiBTZXQgZGF0YSBzb3VyY2UuXG4gKiBAbWV0aG9kIHNldERhdGFTb3VyY2VcbiAqL1xuQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLnNldERhdGFTb3VyY2UgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLm1hbmFnZXIuc2V0RGF0YVNvdXJjZSh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sbGVjdGlvblZpZXc7IiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCJ5YWVkXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xuXG4vKipcbiAqIENvbGxlY3Rpb25WaWV3TWFuYWdlci5cbiAqIEBjbGFzcyBDb2xsZWN0aW9uVmlld01hbmFnZXJcbiAqL1xuZnVuY3Rpb24gQ29sbGVjdGlvblZpZXdNYW5hZ2VyKHRhcmdldCkge1xuXHR0aGlzLml0ZW1SZW5kZXJlcnMgPSBbXTtcblx0dGhpcy5pdGVtUmVuZGVyZXJDbGFzcyA9IG51bGw7XG5cdHRoaXMuaXRlbVJlbmRlcmVyRmFjdG9yeSA9IG51bGw7XG5cdHRoaXMuaXRlbUNvbnRyb2xsZXJDbGFzcyA9IG51bGw7XG5cdHRoaXMuaXRlbUNvbnRyb2xsZXJGYWN0b3J5ID0gbnVsbDtcblx0dGhpcy5kYXRhU291cmNlID0gbnVsbDtcblx0dGhpcy50YXJnZXQgPSBudWxsO1xuXG5cdHRoaXMuc2V0VGFyZ2V0KHRhcmdldCk7XG59XG5cbi8qKlxuICogU2V0IHRhcmdldC5cbiAqIEBtZXRob2Qgc2V0VGFyZ2V0XG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0VGFyZ2V0ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5yZW1vdmVBbGxJdGVtUmVuZGVyZXJzKCk7XG5cdHRoaXMudGFyZ2V0PXZhbHVlO1xuXHR0aGlzLnJlbW92ZUFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSByZW5kZXJlciBjbGFzcy5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyQ2xhc3NcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5zZXRJdGVtUmVuZGVyZXJDbGFzcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBpdGVtIHJlbmRlcmVyIGNsYXNzIHNob3VsZCBiZSBhIGZ1bmN0aW9uXCIpO1xuXG5cdHRoaXMuaXRlbVJlbmRlcmVyQ2xhc3MgPSB2YWx1ZTtcblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIHJlbmRlcmVyIGZhY3RvcnkuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckZhY3RvcnlcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5zZXRJdGVtUmVuZGVyZXJGYWN0b3J5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIGl0ZW0gcmVuZGVyZXIgZmFjdG9yeSBzaG91bGQgYmUgYSBmdW5jdGlvblwiKTtcblxuXHR0aGlzLml0ZW1SZW5kZXJlckZhY3RvcnkgPSB2YWx1ZTtcblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIGNvbnRyb2xsZXIgY2xhc3MuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckNsYXNzXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0SXRlbUNvbnRyb2xsZXJDbGFzcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBpdGVtIHJlbmRlcmVyIGNsYXNzIHNob3VsZCBiZSBhIGZ1bmN0aW9uXCIpO1xuXG5cdHRoaXMuaXRlbUNvbnRyb2xsZXJDbGFzcyA9IHZhbHVlO1xuXHR0aGlzLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gY29udHJvbGxlciBmYWN0b3J5LlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJGYWN0b3J5XG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0SXRlbUNvbnRyb2xsZXJGYWN0b3J5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIGl0ZW0gcmVuZGVyZXIgZmFjdG9yeSBzaG91bGQgYmUgYSBmdW5jdGlvblwiKTtcblxuXHR0aGlzLml0ZW1Db250cm9sbGVyRmFjdG9yeSA9IHZhbHVlO1xuXHR0aGlzLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogU2V0IGRhdGEgc291cmNlLlxuICogQG1ldGhvZCBzZXREYXRhU291cmNlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0RGF0YVNvdXJjZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh0aGlzLmRhdGFTb3VyY2UpIHtcblx0XHR0aGlzLmRhdGFTb3VyY2Uub2ZmKFwiY2hhbmdlXCIsIHRoaXMub25EYXRhU291cmNlQ2hhbmdlLCB0aGlzKTtcblx0fVxuXG5cdHRoaXMuZGF0YVNvdXJjZSA9IHZhbHVlO1xuXG5cdGlmICh0aGlzLmRhdGFTb3VyY2UpIHtcblx0XHR0aGlzLmRhdGFTb3VyY2Uub24oXCJjaGFuZ2VcIiwgdGhpcy5vbkRhdGFTb3VyY2VDaGFuZ2UsIHRoaXMpO1xuXHR9XG5cblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNvbWV0aGluZyBpbiB0aGUgZGF0YSBzb3VyY2Ugd2FzIGNoYW5nZWQuXG4gKiBAbWV0aG9kIG9uRGF0YVNvdXJjZUNoYW5nZVxuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5vbkRhdGFTb3VyY2VDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbGwgaXRlbSByZW5kZXJlcnMuXG4gKiBAbWV0aG9kIHJlbW92ZUFsbEl0ZW1SZW5kZXJlcnNcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUucmVtb3ZlQWxsSXRlbVJlbmRlcmVycyA9IGZ1bmN0aW9uKCkge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlbVJlbmRlcmVycy5sZW5ndGg7IGkrKykge1xuXHRcdGlmICh0aGlzLml0ZW1SZW5kZXJlcnNbaV0uX19jb250cm9sbGVyKVxuXHRcdFx0dGhpcy5pdGVtUmVuZGVyZXJzW2ldLl9fY29udHJvbGxlci5zZXREYXRhKG51bGwpO1xuXG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5pdGVtUmVuZGVyZXJzW2ldLnNldERhdGEobnVsbCk7XG5cblx0XHR0aGlzLnRhcmdldC5yZW1vdmVDaGlsZCh0aGlzLml0ZW1SZW5kZXJlcnNbaV0pO1xuXHR9XG5cblx0dGhpcy5pdGVtUmVuZGVyZXJzID0gW107XG59XG5cbi8qKlxuICogUmVmcmVzaCBhbGwgaXRlbSByZW5kZXJlcnMuXG4gKiBAbWV0aG9kIHJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVtb3ZlQWxsSXRlbVJlbmRlcmVycygpO1xuXG5cdGlmICghdGhpcy5kYXRhU291cmNlKVxuXHRcdHJldHVybjtcblxuXHRpZiAoIXRoaXMuaXRlbVJlbmRlcmVyQ2xhc3MgJiYgIXRoaXMuaXRlbVJlbmRlcmVyRmFjdG9yeSlcblx0XHRyZXR1cm47XG5cblx0aWYgKCF0aGlzLnRhcmdldClcblx0XHRyZXR1cm47XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRhdGFTb3VyY2UuZ2V0TGVuZ3RoKCk7IGkrKykge1xuXHRcdHZhciBkYXRhID0gdGhpcy5kYXRhU291cmNlLmdldEl0ZW1BdChpKTtcblx0XHR2YXIgcmVuZGVyZXIgPSB0aGlzLmNyZWF0ZUl0ZW1SZW5kZXJlcigpO1xuXG5cdFx0aWYgKHRoaXMuaXRlbUNvbnRyb2xsZXJDbGFzcyB8fCB0aGlzLml0ZW1Db250cm9sbGVyRmFjdG9yeSkge1xuXHRcdFx0cmVuZGVyZXIuX19jb250cm9sbGVyID0gdGhpcy5jcmVhdGVJdGVtQ29udHJvbGxlcihyZW5kZXJlcik7XG5cdFx0XHRyZW5kZXJlci5fX2NvbnRyb2xsZXIuc2V0RGF0YShkYXRhKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVuZGVyZXIuc2V0RGF0YShkYXRhKTtcblx0XHR9XG5cblx0XHR0aGlzLml0ZW1SZW5kZXJlcnMucHVzaChyZW5kZXJlcik7XG5cdFx0dGhpcy50YXJnZXQuYXBwZW5kQ2hpbGQocmVuZGVyZXIpO1xuXHR9XG59XG5cbi8qKlxuICogQ3JlYXRlIGl0ZW0gcmVuZGVyZXIuXG4gKiBAbWV0aG9kIGNyZWF0ZUl0ZW1SZW5kZXJlclxuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5jcmVhdGVJdGVtUmVuZGVyZXIgPSBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMuaXRlbVJlbmRlcmVyRmFjdG9yeSlcblx0XHRyZXR1cm4gdGhpcy5pdGVtUmVuZGVyZXJGYWN0b3J5KCk7XG5cblx0aWYgKHRoaXMuaXRlbVJlbmRlcmVyQ2xhc3MpXG5cdFx0cmV0dXJuIG5ldyB0aGlzLml0ZW1SZW5kZXJlckNsYXNzKCk7XG5cblx0dGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY3JlYXRlIGl0ZW0gcmVuZGVyZXIhXCIpO1xufVxuXG4vKipcbiAqIENyZWF0ZSBpdGVtIGNvbnRyb2xsZXIuXG4gKiBAbWV0aG9kIGNyZWF0ZUl0ZW1Db250cm9sbGVyXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLmNyZWF0ZUl0ZW1Db250cm9sbGVyID0gZnVuY3Rpb24ocmVuZGVyZXIpIHtcblx0aWYgKHRoaXMuaXRlbUNvbnRyb2xsZXJGYWN0b3J5KVxuXHRcdHJldHVybiB0aGlzLml0ZW1Db250cm9sbGVyRmFjdG9yeShyZW5kZXJlcik7XG5cblx0aWYgKHRoaXMuaXRlbUNvbnRyb2xsZXJDbGFzcylcblx0XHRyZXR1cm4gbmV3IHRoaXMuaXRlbUNvbnRyb2xsZXJDbGFzcyhyZW5kZXJlcik7XG5cblx0dGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY3JlYXRlIGl0ZW0gY29udHJvbGxlciFcIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sbGVjdGlvblZpZXdNYW5hZ2VyOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRDb2xsZWN0aW9uOiByZXF1aXJlKFwiLi9Db2xsZWN0aW9uXCIpLFxuXHRDb2xsZWN0aW9uVmlldzogcmVxdWlyZShcIi4vQ29sbGVjdGlvblZpZXdcIiksXG5cdENvbGxlY3Rpb25WaWV3TWFuYWdlcjogcmVxdWlyZShcIi4vQ29sbGVjdGlvblZpZXdNYW5hZ2VyXCIpXG59OyIsInZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZXVpID0ge307XG5cbi8qKlxuICogQ3JlYXRlIGEgY2xhc3MgdGhhdCBleHRlbmRzIGEganF1ZXJ5IHVpIHdpZGdldC5cbiAqIEBtZXRob2QgY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudFxuICovXG5mdW5jdGlvbiBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KGpxdWVyeXVpVHlwZSwgYmFzZUNsYXNzKSB7XG5cdGlmICghYmFzZUNsYXNzKVxuXHRcdGJhc2VDbGFzcyA9IHhub2RlLkRpdjtcblxuXHRmdW5jdGlvbiBjbHMoKSB7XG5cdFx0YmFzZUNsYXNzLmNhbGwodGhpcyk7XG5cblx0XHRzd2l0Y2ggKGpxdWVyeXVpVHlwZSkge1xuXHRcdFx0Y2FzZSBcInRhYnNcIjpcblx0XHRcdFx0dGhpcy51bCA9IG5ldyB4bm9kZS5VbCgpO1xuXHRcdFx0XHR0aGlzLmFwcGVuZENoaWxkKHRoaXMudWwpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHR0aGlzLmpxdWVyeXVpVHlwZSA9IGpxdWVyeXVpVHlwZTtcblx0XHR0aGlzLmpxdWVyeUVsZW1lbnQgPSAkKHRoaXMubm9kZSk7XG5cdFx0dGhpcy5qcXVlcnlFbGVtZW50W3RoaXMuanF1ZXJ5dWlUeXBlXSgpO1xuXHR9XG5cblx0aW5oZXJpdHMoY2xzLCBiYXNlQ2xhc3MpO1xuXG5cdGNscy5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGUsIGYpIHtcblx0XHR4bm9kZS5EaXYucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIuY2FsbCh0aGlzLCBlLCBmKTtcblx0XHR0aGlzLmpxdWVyeUVsZW1lbnQub24oZSwgZik7XG5cdH1cblxuXHRjbHMucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihlLCBmKSB7XG5cdFx0eG5vZGUuRGl2LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyLmNhbGwodGhpcywgZSwgZik7XG5cdFx0dGhpcy5qcXVlcnlFbGVtZW50Lm9mZihlLCBmKTtcblx0fVxuXG5cdGNscy5wcm90b3R5cGUub24gPSBjbHMucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cdGNscy5wcm90b3R5cGUub2ZmID0gY2xzLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXG5cdHJldHVybiBjbHM7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgcHJvcGVydHkgb24gYW4gZXh0ZW5kZWQganF1ZXJ5IHVpIGNsYXNzLlxuICogQG1ldGhvZCBjcmVhdGVYTm9kZVVJUHJvcGVydHlcbiAqL1xuZnVuY3Rpb24gY3JlYXRlWE5vZGVVSVByb3BlcnR5KGNscywgcHJvdG90eXBlTmFtZSkge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoY2xzLnByb3RvdHlwZSwgcHJvdG90eXBlTmFtZSwge1xuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5qcXVlcnlFbGVtZW50W3RoaXMuanF1ZXJ5dWlUeXBlXShcIm9wdGlvblwiLCBwcm90b3R5cGVOYW1lKVxuXHRcdH0sXG5cblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR0aGlzLmpxdWVyeUVsZW1lbnRbdGhpcy5qcXVlcnl1aVR5cGVdKFwib3B0aW9uXCIsIHByb3RvdHlwZU5hbWUsIHZhbHVlKVxuXHRcdH1cblx0fSk7XG59XG5cbi8qKlxuICogQ3JlYXRlIHNldmVyYWwgcHJvcHJ0aWVzIG9uIGFuIGV4dGVuZGVkIGpxdWVyeSB1aSBjbGFzcy5cbiAqIEBtZXRob2QgY3JlYXRlWE5vZGVVSVByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoY2xzLCBwcm9wcnR5TmFtZXMpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcnR5TmFtZXMubGVuZ3RoOyBpKyspXG5cdFx0Y3JlYXRlWE5vZGVVSVByb3BlcnR5KGNscywgcHJvcHJ0eU5hbWVzW2ldKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBtZXRob2Qgb24gYW4gZXh0ZW5kZWQganF1ZXJ5IHVpIGNsYXNzLlxuICogQG1ldGhvZCBjcmVhdGVYTm9kZVVJTWV0aG9kXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVhOb2RlVUlNZXRob2QoY2xzLCBtZXRob2ROYW1lKSB7XG5cdGNscy5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKVxuXHRcdFx0cmV0dXJuIHRoaXMuanF1ZXJ5RWxlbWVudFt0aGlzLmpxdWVyeXVpVHlwZV0obWV0aG9kTmFtZSk7XG5cblx0XHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpXG5cdFx0XHRyZXR1cm4gdGhpcy5qcXVlcnlFbGVtZW50W3RoaXMuanF1ZXJ5dWlUeXBlXShtZXRob2ROYW1lLCBhcmd1bWVudHNbMF0pO1xuXG5cdFx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKVxuXHRcdFx0cmV0dXJuIHRoaXMuanF1ZXJ5RWxlbWVudFt0aGlzLmpxdWVyeXVpVHlwZV0obWV0aG9kTmFtZSwgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xuXG5cdFx0ZWxzZVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwidGhhdCBtYW55IGFyZ3VtZW50cz9cIik7XG5cdH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBtZXRob2Qgb24gYW4gZXh0ZW5kZWQganF1ZXJ5IHVpIGNsYXNzLlxuICogQG1ldGhvZCBjcmVhdGVYTm9kZVVJTWV0aG9kc1xuICovXG5mdW5jdGlvbiBjcmVhdGVYTm9kZVVJTWV0aG9kcyhjbHMsIG1ldGhvZE5hbWVzKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbWV0aG9kTmFtZXMubGVuZ3RoOyBpKyspXG5cdFx0Y3JlYXRlWE5vZGVVSU1ldGhvZChjbHMsIG1ldGhvZE5hbWVzW2ldKTtcbn1cblxuLyoqXG4gKiBBY2NvcmRpb24gY2xhc3MuXG4gKiBAY2xhc3MgQWNjb3JkaW9uXG4gKi9cbnhub2RldWkuQWNjb3JkaW9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcImFjY29yZGlvblwiKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5BY2NvcmRpb24sIFtcblx0XCJhY3RpdmVcIiwgXCJhbmltYXRlXCIsIFwiY29sbGFwc2libGVcIiwgXCJkaXNhYmxlZFwiLFxuXHRcImV2ZW50XCIsIFwiaGVhZGVyXCIsIFwiaGVpZ2h0U3R5bGVcIiwgXCJpY29uc1wiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5BY2NvcmRpb24sIFtcblx0XCJkZXN0cm95XCIsIFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLCBcImluc3RhbmNlXCIsXG5cdFwib3B0aW9uXCIsIFwicmVmcmVzaFwiLCBcIndpZGdldFwiXG5dKTtcblxuLyoqXG4gKiBBdXRvY29tcGxldGUgY2xhc3MuXG4gKiBAY2xhc3MgQXV0b2NvbXBsZXRlXG4gKi9cbnhub2RldWkuQXV0b2NvbXBsZXRlID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcImF1dG9jb21wbGV0ZVwiKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5BdXRvY29tcGxldGUsIFtcblx0XCJhcHBlbmRUb1wiLCBcImF1dG9Gb2N1c1wiLCBcImRlbGF5XCIsIFwiZGlzYWJsZWRcIixcblx0XCJtaW5MZW5ndGhcIiwgXCJwb3NpdGlvblwiLCBcInNvdXJjZVwiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5BdXRvY29tcGxldGUsIFtcblx0XCJjbG9zZVwiLCBcImRlc3Ryb3lcIiwgXCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsXG5cdFwiaW5zdGFuY2VcIiwgXCJvcHRpb25cIiwgXCJzZWFyY2hcIiwgXCJ3aWRnZXRcIlxuXSk7XG5cbi8qKlxuICogQnV0dG9uIGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuQnV0dG9uXG4gKi9cbnhub2RldWkuQnV0dG9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcImJ1dHRvblwiLCB4bm9kZS5CdXR0b24pO1xuXG5jcmVhdGVYTm9kZVVJUHJvcGVydGllcyh4bm9kZXVpLkJ1dHRvbiwgW1xuXHRcImRpc2FibGVkXCIsIFwiaWNvbnNcIiwgXCJsYWJlbFwiLCBcInRleHRcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuQnV0dG9uLCBbXG5cdFwiZGVzdHJveVwiLCBcImRpc2FibGVcIiwgXCJlbmFibGVcIiwgXCJpbnN0YW5jZVwiLFxuXHRcIm9wdGlvblwiLCBcInJlZnJlc2hcIiwgXCJ3aWRnZXRcIlxuXSk7XG5cbi8qKlxuICogQnV0dG9uc2V0IGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuQnV0dG9uc2V0XG4gKi9cbnhub2RldWkuQnV0dG9uc2V0ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcImJ1dHRvbnNldFwiKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5CdXR0b25zZXQsIFtcblx0XCJkaXNhYmxlZFwiLCBcIml0ZW1zXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLkF1dG9jb21wbGV0ZSwgW1xuXHRcImRlc3Ryb3lcIiwgXCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsIFwiaW5zdGFuY2VcIixcblx0XCJvcHRpb25cIiwgXCJyZWZyZXNoXCIsIFwid2lkZ2V0XCJcbl0pO1xuXG4vKipcbiAqIFNsaWRlciBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLlNsaWRlclxuICovXG54bm9kZXVpLlNsaWRlciA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJzbGlkZXJcIik7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuU2xpZGVyLCBbXG5cdFwiYW5pbWF0ZVwiLCBcImRpc2FibGVkXCIsIFwibWF4XCIsIFwibWluXCIsXG5cdFwib3JpZW50YXRpb25cIiwgXCJyYW5nZVwiLCBcInN0ZXBcIiwgXCJ2YWx1ZVwiLFxuXHRcInZhbHVlc1wiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5TbGlkZXIsIFtcblx0XCJkZXN0cm95XCIsIFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLCBcImluc3RhbmNlXCIsXG5cdFwib3B0aW9uXCIsIFwid2lkZ2V0XCIgLyosIFwidmFsdWVcIiwgXCJ2YWx1ZXNcIiAqL1xuXSk7XG5cbi8qKlxuICogVGFicyBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLlRhYnNcbiAqL1xueG5vZGV1aS5UYWJzID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcInRhYnNcIik7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuVGFicywgW1xuXHRcImFjdGl2ZVwiLCBcImNvbGxhcHNpYmxlXCIsIFwiZGlzYWJsZWRcIiwgXCJldmVudFwiLFxuXHRcImhlaWdodFN0eWxlXCIsIFwiaGlkZVwiLCBcInNob3dcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuVGFicywgW1xuXHRcImRlc3Ryb3lcIiwgXCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsIFwiaW5zdGFuY2VcIixcblx0XCJsb2FkXCIsIFwib3B0aW9uXCIsIFwicmVmcmVzaFwiLCBcIndpZGdldFwiXG5dKTtcblxuLyoqXG4gKiBEYXRlcGlja2VyIGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuRGF0ZXBpY2tlclxuICovXG54bm9kZXVpLkRhdGVwaWNrZXIgPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwiZGF0ZXBpY2tlclwiKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5EYXRlcGlja2VyLCBbXG5cdFwiYWx0RmllbGRcIiwgXCJhbHRGb3JtYXRcIiwgXCJhcHBlbmRUZXh0XCIsIFwiYXV0b1NpemVcIixcblx0XCJiZWZvcmVTaG93XCIsIFwiYmVmb3JlU2hvd0RheVwiLCBcImJ1dHRvbkltYWdlXCIsIFwiYnV0dG9uSW1hZ2VPbmx5XCIsXG5cdFwiYnV0dG9uVGV4dFwiLCBcImNhbGN1bGF0ZVdlZWtcIiwgXCJjaGFuZ2VNb250aFwiLCBcImNoYW5nZVllYXJcIixcblx0XCJjbG9zZVRleHRcIiwgXCJjb25zdHJhaW5JbnB1dFwiLCBcImN1cnJlbnRUZXh0XCIsIFwiZGF0ZUZvcm1hdFwiLFxuXHRcImRheU5hbWVzXCIsIFwiZGF5TmFtZXNNaW5cIiwgXCJkYXlOYW1lc1Nob3J0XCIsIFwiZGVmYXVsdERhdGVcIixcblx0XCJkdXJhdGlvblwiLCBcImZpcnN0RGF5XCIsIFwiZ290b0N1cnJlbnRcIiwgXCJoaWRlSWZOb1ByZXZOZXh0XCIsXG5cdFwiaXNSVExcIiwgXCJtYXhEYXRlXCIsIFwibWluRGF0ZVwiLCBcIm1vbnRoTmFtZXNcIixcblx0XCJtb250aE5hbWVzU2hvcnRcIiwgXCJuYXZpZ2F0aW9uQXNEYXRlRm9ybWF0XCIsIFwibmV4dFRleHRcIixcblx0XCJudW1iZXJPZk1vbnRoc1wiLCBcIm9uQ2hhbmdlTW9udGhZZWFyXCIsXG5cdFwib25DbG9zZVwiLCBcIm9uU2VsZWN0XCIsIFwicHJldlRleHRcIiwgXCJzZWxlY3RPdGhlck1vbnRoc1wiLFxuXHRcInNob3J0WWVhckN1dG9mZlwiLCBcInNob3dBbmltXCIsIFwic2hvd0J1dHRvblBhbmVsXCIsIFwic2hvd0N1cnJlbnRBdFBvc1wiLFxuXHRcInNob3dNb250aEFmdGVyWWVhclwiLCBcInNob3dPblwiLCBcInNob3dPcHRpb25zXCIsIFwic2hvd090aGVyTW9udGhzXCIsXG5cdFwic2hvd1dlZWtcIiwgXCJzdGVwTW9udGhzXCIsIFwid2Vla0hlYWRlclwiLCBcInllYXJSYW5nZVwiLFxuXHRcInllYXJTdWZmaXhcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuRGF0ZXBpY2tlciwgW1xuXHRcImRlc3Ryb3lcIiwgXCJkaWFsb2dcIiwgXCJnZXREYXRlXCIsIFwiaGlkZVwiLFxuXHRcImlzRGlzYWJsZWRcIiwgXCJvcHRpb25cIiwgXCJyZWZyZXNoXCIsIFwic2V0RGF0ZVwiLFxuXHRcInNob3dcIiwgXCJ3aWRnZXRcIlxuXSk7XG5cbi8qKlxuICogRGlhbG9nIGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuRGlhbG9nXG4gKi9cbnhub2RldWkuRGlhbG9nID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcImRpYWxvZ1wiKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5EaWFsb2csIFtcblx0XCJhcHBlbmRUb1wiLCBcImF1dG9PcGVuXCIsIFwiYnV0dG9uc1wiLCBcImNsb3NlT25Fc2NhcGVcIixcblx0XCJjbG9zZVRleHRcIiwgXCJkaWFsb2dDbGFzc1wiLCBcImRyYWdnYWJsZVwiLCBcImhlaWdodFwiLFxuXHRcImhpZGVcIiwgXCJtYXhIZWlnaHRcIiwgXCJtYXhXaWR0aFwiLCBcIm1pbkhlaWdodFwiLFxuXHRcIm1pbldpZHRoXCIsIFwibW9kYWxcIiwgXCJwb3NpdGlvblwiLCBcInJlc2l6YWJsZVwiLFxuXHRcInNob3dcIiwgXCJ0aXRsZVwiLCBcIndpZHRoXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLkRpYWxvZywgW1xuXHRcImNsb3NlXCIsIFwiZGVzdHJveVwiLCBcImluc3RhbmNlXCIsIFwiaXNPcGVuXCIsXG5cdFwibW92ZVRvVG9wXCIsIFwib3BlblwiLCBcIm9wdGlvblwiLCBcIndpZGdldFwiXG5dKTtcblxuLyoqXG4gKiBNZW51IGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuTWVudVxuICovXG54bm9kZXVpLk1lbnUgPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwibWVudVwiLCB4bm9kZS5VbCk7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuTWVudSwgW1xuXHRcImRpc2FibGVkXCIsIFwiaWNvbnNcIiwgXCJpdGVtc1wiLCBcIm1lbnVzXCIsXG5cdFwicG9zaXRpb25cIiwgXCJyb2xlXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLk1lbnUsIFtcblx0XCJibHVyXCIsIFwiY29sbGFwc2VcIiwgXCJjb2xsYXBzZUFsbFwiLCBcImRlc3Ryb3lcIixcblx0XCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsIFwiZXhwYW5kXCIsIFwiZm9jdXNcIixcblx0XCJpbnN0YW5jZVwiLCBcImlzRmlyc3RJdGVtXCIsIFwiaXNMYXN0SXRlbVwiLCBcIm5leHRcIixcblx0XCJuZXh0UGFnZVwiLCBcIm9wdGlvblwiLCBcInByZXZpb3VzXCIsIFwicHJldmlvdXNQYWdlXCIsXG5cdFwicmVmcmVzaFwiLCBcInNlbGVjdFwiLCBcIndpZGdldFwiXG5dKTtcblxuLyoqXG4gKiBQcm9ncmVzc2JhciBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLlByb2dyZXNzYmFyXG4gKi9cbnhub2RldWkuUHJvZ3Jlc3NiYXIgPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwicHJvZ3Jlc3NiYXJcIik7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuUHJvZ3Jlc3NiYXIsIFtcblx0XCJkaXNhYmxlZFwiLCBcIm1heFwiLCBcInZhbHVlXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLlByb2dyZXNzYmFyLCBbXG5cdFwiZGVzdHJveVwiLCBcImRpc2FibGVcIiwgXCJlbmFibGVcIiwgXCJpbnN0YW5jZVwiLFxuXHRcIm9wdGlvblwiLCBcIndpZGdldFwiIC8qLCBcInZhbHVlXCIqL1xuXSk7XG5cbi8qKlxuICogU2VsZWN0bWVudSBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLlNlbGVjdG1lbnVcbiAqL1xueG5vZGV1aS5TZWxlY3RtZW51ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcInNlbGVjdG1lbnVcIiwgeG5vZGUuU2VsZWN0KTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5TZWxlY3RtZW51LCBbXG5cdFwiYXBwZW5kVG9cIiwgXCJkaXNhYmxlZFwiLCBcImljb25zXCIsIFwicG9zaXRpb25cIixcblx0XCJ3aWR0aFwiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5TZWxlY3RtZW51LCBbXG5cdFwiY2xvc2VcIiwgXCJkZXN0cm95XCIsIFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLFxuXHRcImluc3RhbmNlXCIsIFwibWVudVdpZGdldFwiLCBcIm9wZW5cIiwgXCJvcHRpb25cIixcblx0XCJyZWZyZXNoXCIsIFwid2lkZ2V0XCJcbl0pO1xuXG4vKipcbiAqIFNwaW5uZXIgY2xhc3MuXG4gKiBAY2xhc3MgeG5vZGV1aS5TcGlubmVyXG4gKi9cbnhub2RldWkuU3Bpbm5lciA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJzcGlubmVyXCIsIHhub2RlLklucHV0KTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5TcGlubmVyLCBbXG5cdFwiY3VsdHVyZVwiLCBcImRpc2FibGVkXCIsIFwiaWNvbnNcIiwgXCJpbmNyZW1lbnRhbFwiLFxuXHRcIm1heFwiLCBcIm1pblwiLCBcIm51bWJlckZvcm1hdFwiLCBcInBhZ2VcIixcblx0XCJzdGVwXCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLlNwaW5uZXIsIFtcblx0XCJkZXN0cm95XCIsIFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLCBcImluc3RhbmNlXCIsXG5cdFwiaXNWYWxpZFwiLCBcIm9wdGlvblwiLCBcInBhZ2VEb3duXCIsIFwicGFnZVVwXCIsXG5cdFwic3RlcERvd25cIiwgXCJzdGVwVXBcIiwgXCJ2YWx1ZVwiLCBcIndpZGdldFwiXG5dKTtcblxubW9kdWxlLmV4cG9ydHMgPSB4bm9kZXVpOyIsInZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciBBcHBWaWV3ID0gcmVxdWlyZShcIi4uL3ZpZXcvQXBwVmlld1wiKTtcbnZhciBBcHBNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9BcHBNb2RlbFwiKTtcbnZhciBBcHBDb250cm9sbGVyID0gcmVxdWlyZShcIi4uL2NvbnRyb2xsZXIvQXBwQ29udHJvbGxlclwiKTtcblxuLyoqXG4gKiBUaGUgbWFpbiByZXNvdXJjZSBmaWRkbGUgYXBwIGNsYXNzLlxuICogQGNsYXNzIEFwcFxuICovXG5mdW5jdGlvbiBBcHAoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMuc3R5bGUudG9wID0gMDtcblx0dGhpcy5zdHlsZS5ib3R0b20gPSAwO1xuXHR0aGlzLnN0eWxlLmxlZnQgPSAwO1xuXHR0aGlzLnN0eWxlLnJpZ2h0ID0gMDtcblxuXHR0aGlzLmFwcFZpZXcgPSBuZXcgQXBwVmlldygpO1xuXHR0aGlzLmFwcE1vZGVsID0gbmV3IEFwcE1vZGVsKCk7XG5cdHRoaXMuYXBwQ29udHJvbGxlciA9IG5ldyBBcHBDb250cm9sbGVyKHRoaXMuYXBwTW9kZWwsIHRoaXMuYXBwVmlldyk7XG5cblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLmFwcFZpZXcpO1xufVxuXG5pbmhlcml0cyhBcHAsIHhub2RlLkRpdik7XG5cbi8qKlxuICogR2V0IG1vZGVsLlxuICogQG1ldGhvZCBnZXRNb2RlbFxuICovXG5BcHAucHJvdG90eXBlLmdldE1vZGVsID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmFwcE1vZGVsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcDsiLCJ2YXIgUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyID0gcmVxdWlyZShcIi4vUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyXCIpO1xuXG4vKipcbiAqIEFwcCBjb250cm9sbGVyXG4gKiBAY2xhc3MgQXBwQ29udHJvbGxlclxuICovXG5mdW5jdGlvbiBBcHBDb250cm9sbGVyKGFwcE1vZGVsLCBhcHBWaWV3KSB7XG5cdHRoaXMuYXBwTW9kZWwgPSBhcHBNb2RlbDtcblx0dGhpcy5hcHBWaWV3ID0gYXBwVmlldztcblxuXHR0aGlzLmFwcFZpZXcuZ2V0UmVzb3VyY2VQYW5lVmlldygpLnNldFRhYnNDb2xsZWN0aW9uKHRoaXMuYXBwTW9kZWwuZ2V0Q2F0ZWdvcnlDb2xsZWN0aW9uKCkpO1xuXHR0aGlzLmFwcFZpZXcuZ2V0UmVzb3VyY2VQYW5lVmlldygpLmdldFRhYnNIZWFkZXJNYW5hZ2VyKCkuc2V0SXRlbUNvbnRyb2xsZXJDbGFzcyhSZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcENvbnRyb2xsZXI7IiwiZnVuY3Rpb24gUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyKHRhYkhlYWRlclZpZXcpIHtcblx0dGhpcy50YWJIZWFkZXJWaWV3ID0gdGFiSGVhZGVyVmlldztcbn1cblxuUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyLnByb3RvdHlwZS5zZXREYXRhID0gZnVuY3Rpb24oY2F0ZWdvcnlNb2RlbCkge1xuXHRpZiAoY2F0ZWdvcnlNb2RlbCkge1xuXHRcdHRoaXMudGFiSGVhZGVyVmlldy5zZXRMYWJlbChjYXRlZ29yeU1vZGVsLmdldExhYmVsKCkpO1xuXHRcdHRoaXMudGFiSGVhZGVyVmlldy5zZXRUYXJnZXRJZChjYXRlZ29yeU1vZGVsLmdldElkKCkpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyOyIsImZpZGRsZXVpID0ge1xuXHRBcHA6IHJlcXVpcmUoXCIuL2FwcC9BcHBcIiksXG5cdENhdGVnb3J5TW9kZWw6IHJlcXVpcmUoXCIuL21vZGVsL0NhdGVnb3J5TW9kZWxcIilcbn07IiwidmFyIHhub2RlYyA9IHJlcXVpcmUoXCJ4bm9kZWNvbGxlY3Rpb25cIik7XG5cbi8qKlxuICogQXBwTW9kZWxcbiAqIEBjbGFzcyBBcHBNb2RlbFxuICovXG5mdW5jdGlvbiBBcHBNb2RlbCgpIHtcblx0dGhpcy5jYXRlZ29yeUNvbGxlY3Rpb24gPSBuZXcgeG5vZGVjLkNvbGxlY3Rpb24oKTtcblxuXHR0aGlzLmlkQ291bnQgPSAwO1xufVxuXG4vKipcbiAqIEdldCBjYXRlZ29yeSBjb2xsZWN0aW9uLlxuICogQG1ldGhvZCBnZXRDYXRlZ29yeUNvbGxlY3Rpb25cbiAqL1xuQXBwTW9kZWwucHJvdG90eXBlLmdldENhdGVnb3J5Q29sbGVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jYXRlZ29yeUNvbGxlY3Rpb247XG59XG5cbi8qKlxuICogR2V0IHNvbWV0aGluZyB1c2FibGUgZm9yIGEgdW5pcXVlIGlkLlxuICogQG1ldGhvZCBnZXROZXh0SWRcbiAqL1xuQXBwTW9kZWwucHJvdG90eXBlLmdldE5leHRJZCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmlkQ291bnQrKztcblxuXHRyZXR1cm4gXCJlbGVtXCIgKyB0aGlzLmlkQ291bnQ7XG59XG5cbi8qKlxuICogQWRkIGNhdGVnb3J5IG1vZGVsLlxuICogQG1ldGhvZCBhZGRDYXRlZ29yeU1vZGVsXG4gKi9cbkFwcE1vZGVsLnByb3RvdHlwZS5hZGRDYXRlZ29yeU1vZGVsID0gZnVuY3Rpb24oY2F0ZWdvcnlNb2RlbCkge1xuXHRjYXRlZ29yeU1vZGVsLnNldFBhcmVudE1vZGVsKHRoaXMpO1xuXHR0aGlzLmNhdGVnb3J5Q29sbGVjdGlvbi5hZGRJdGVtKGNhdGVnb3J5TW9kZWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcE1vZGVsOyIsInZhciBBcHBNb2RlbCA9IHJlcXVpcmUoXCIuL0FwcE1vZGVsXCIpO1xuXG4vKipcbiAqIEdldCBjYXRlZ29yeSBtb2RlbC5cbiAqIEBjbGFzcyBDYXRlZ29yeU1vZGVsXG4gKi9cbmZ1bmN0aW9uIENhdGVnb3J5TW9kZWwobGFiZWwpIHtcblx0dGhpcy5sYWJlbCA9IGxhYmVsO1xuXHR0aGlzLnBhcmVudE1vZGVsID0gbnVsbDtcbn1cblxuLyoqXG4gKiBTZXQgcmVmZXJlbmNlIHRvIHBhcmVudCBtb2RlbC5cbiAqIEBtZXRob2QgZ2V0UGFyZW50TW9kZWxcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuc2V0UGFyZW50TW9kZWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLnBhcmVudE1vZGVsID0gdmFsdWU7XG59XG5cbi8qKlxuICogR2V0IGxhYmVsLlxuICogQG1ldGhvZCBnZXRMYWJlbFxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5nZXRMYWJlbCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5sYWJlbDtcbn1cblxuLyoqXG4gKiBHZXQgaWQuXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLmdldElkID0gZnVuY3Rpb24oKSB7XG5cdGlmICghdGhpcy5pZClcblx0XHR0aGlzLmlkID0gdGhpcy5nZXRBcHBNb2RlbCgpLmdldE5leHRJZCgpO1xuXG5cdHJldHVybiB0aGlzLmlkO1xufVxuXG4vKipcbiAqIEdldCByZWZlcmVuY2UgdG8gYXBwIG1vZGVsLlxuICogQG1ldGhvZCBnZXRBcHBNb2RlbFxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5nZXRBcHBNb2RlbCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIXRoaXMucGFyZW50TW9kZWwpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidGhlcmUgaXMgbm8gcGFyZW50IVwiKTtcblxuXHR2YXIgcCA9IHRoaXMucGFyZW50TW9kZWw7XG5cblx0d2hpbGUgKHAgJiYgIShwIGluc3RhbmNlb2YgQXBwTW9kZWwpKVxuXHRcdHAgPSBwLnBhcmVudE1vZGVsO1xuXG5cdHJldHVybiBwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhdGVnb3J5TW9kZWw7IiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIHhub2RldWkgPSByZXF1aXJlKFwieG5vZGV1aVwiKTtcbnZhciBSZXNvdXJjZVBhbmVWaWV3ID0gcmVxdWlyZShcIi4vUmVzb3VyY2VQYW5lVmlld1wiKTtcblxuLyoqXG4gKiBNYWluIGFwcGxpY2F0aW9uIHZpZXcuXG4gKiBAY2xhc3MgQXBwVmlld1xuICovXG5mdW5jdGlvbiBBcHBWaWV3KCkge1xuXHR4bm9kZS5EaXYuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHR0aGlzLnN0eWxlLnRvcCA9IDA7XG5cdHRoaXMuc3R5bGUubGVmdCA9IDA7XG5cdHRoaXMuc3R5bGUucmlnaHQgPSAwO1xuXHR0aGlzLnN0eWxlLmJvdHRvbSA9IDA7XG5cblx0dGhpcy5yZXNvdXJjZVBhbmVWaWV3ID0gbmV3IFJlc291cmNlUGFuZVZpZXcoKTtcblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLnJlc291cmNlUGFuZVZpZXcpO1xufVxuXG5pbmhlcml0cyhBcHBWaWV3LCB4bm9kZS5EaXYpO1xuXG5BcHBWaWV3LnByb3RvdHlwZS5nZXRSZXNvdXJjZVBhbmVWaWV3ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnJlc291cmNlUGFuZVZpZXc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwVmlldzsiLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgeG5vZGV1aSA9IHJlcXVpcmUoXCJ4bm9kZXVpXCIpO1xudmFyIHhub2RlYyA9IHJlcXVpcmUoXCJ4bm9kZWNvbGxlY3Rpb25cIik7XG52YXIgUmVzb3VyY2VUYWJIZWFkZXJWaWV3ID0gcmVxdWlyZShcIi4vUmVzb3VyY2VUYWJIZWFkZXJWaWV3XCIpO1xudmFyIFJlc291cmNlVGFiVmlldyA9IHJlcXVpcmUoXCIuL1Jlc291cmNlVGFiVmlld1wiKTtcblxuLyoqXG4gKiBUaGUgbGVmdCBwYXJ0IG9mIHRoZSBhcHAsIHNob3dpbmcgdGhlIHJlc291cmNlcy5cbiAqIEBjbGFzcyBSZXNvdXJjZVBhbmVWaWV3XG4gKi9cbmZ1bmN0aW9uIFJlc291cmNlUGFuZVZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMuc3R5bGUudG9wID0gMDtcblx0dGhpcy5zdHlsZS5sZWZ0ID0gMDtcblx0dGhpcy5zdHlsZS53aWR0aCA9IFwiNTAlXCI7XG5cdHRoaXMuc3R5bGUuYm90dG9tID0gMDtcblxuXHR0aGlzLnRhYnMgPSBuZXcgeG5vZGV1aS5UYWJzKCk7XG5cdHRoaXMudGFicy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0dGhpcy50YWJzLnN0eWxlLmxlZnQgPSAxMDtcblx0dGhpcy50YWJzLnN0eWxlLnJpZ2h0ID0gNTtcblx0dGhpcy50YWJzLnN0eWxlLnRvcCA9IDEwO1xuXHR0aGlzLnRhYnMuc3R5bGUuYm90dG9tID0gMTA7XG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy50YWJzKTtcblxuXHR0aGlzLnRhYnNIZWFkZXJNYW5hZ2VyID0gbmV3IHhub2RlYy5Db2xsZWN0aW9uVmlld01hbmFnZXIodGhpcy50YWJzLnVsKTtcblx0dGhpcy50YWJzSGVhZGVyTWFuYWdlci5zZXRJdGVtUmVuZGVyZXJDbGFzcyhSZXNvdXJjZVRhYkhlYWRlclZpZXcpO1xuXG5cdHRoaXMudGFic0NvbnRlbnRNYW5hZ2VyID0gbmV3IHhub2RlYy5Db2xsZWN0aW9uVmlld01hbmFnZXIodGhpcy50YWJzKTtcblx0dGhpcy50YWJzQ29udGVudE1hbmFnZXIuc2V0SXRlbVJlbmRlcmVyQ2xhc3MoUmVzb3VyY2VUYWJWaWV3KTtcbn1cblxuaW5oZXJpdHMoUmVzb3VyY2VQYW5lVmlldywgeG5vZGUuRGl2KTtcblxuLyoqXG4gKiBTZXQgdGFicyBjb2xsZWN0aW9uLlxuICovXG5SZXNvdXJjZVBhbmVWaWV3LnByb3RvdHlwZS5zZXRUYWJzQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcblx0dGhpcy50YWJzSGVhZGVyTWFuYWdlci5zZXREYXRhU291cmNlKGNvbGxlY3Rpb24pO1xuXHR0aGlzLnRhYnNDb250ZW50TWFuYWdlci5zZXREYXRhU291cmNlKGNvbGxlY3Rpb24pO1xuXG5cdHZhciBzY29wZT10aGlzO1xuXG5cdGNvbGxlY3Rpb24ub24oXCJjaGFuZ2VcIixmdW5jdGlvbigpIHtcblx0XHRzY29wZS50YWJzLnJlZnJlc2goKTtcblx0fSk7XG59XG5cbi8qKlxuICogR2V0IHRhYnMgaGVhZGVyIG1hbmFnZXIuXG4gKiBAbWV0aG9kIGdldFRhYnNIZWFkZXJNYW5hZ2VyXG4gKi9cblJlc291cmNlUGFuZVZpZXcucHJvdG90eXBlLmdldFRhYnNIZWFkZXJNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnRhYnNIZWFkZXJNYW5hZ2VyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlUGFuZVZpZXc7IiwidmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xuXG5mdW5jdGlvbiBSZXNvdXJjZVRhYkhlYWRlclZpZXcoKSB7XG5cdHhub2RlLkxpLmNhbGwodGhpcyk7XG5cblx0dGhpcy50YXJnZXRJZCA9IG51bGw7XG5cdHRoaXMubGFiZWwgPSBudWxsO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZVRhYkhlYWRlclZpZXcsIHhub2RlLkxpKTtcblxuUmVzb3VyY2VUYWJIZWFkZXJWaWV3LnByb3RvdHlwZS5zZXRUYXJnZXRJZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdHRoaXMudGFyZ2V0SWQgPSBpZDtcblx0dGhpcy5yZWZyZXNoKCk7XG59XG5cblJlc291cmNlVGFiSGVhZGVyVmlldy5wcm90b3R5cGUuc2V0TGFiZWwgPSBmdW5jdGlvbihsYWJlbCkge1xuXHR0aGlzLmxhYmVsID0gbGFiZWw7XG5cdHRoaXMucmVmcmVzaCgpO1xufVxuXG5SZXNvdXJjZVRhYkhlYWRlclZpZXcucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMubGFiZWwgJiYgdGhpcy50YXJnZXRJZCkge1xuXHRcdHRoaXMuaW5uZXJIVE1MID0gXCI8YSBocmVmPScjXCIgKyB0aGlzLnRhcmdldElkICsgXCInPlwiICsgdGhpcy5sYWJlbCArIFwiPC9hPlwiO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VUYWJIZWFkZXJWaWV3OyIsInZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZXVpID0gcmVxdWlyZShcInhub2RldWlcIik7XG5cbmZ1bmN0aW9uIFJlc291cmNlVGFiVmlldygpIHtcblx0eG5vZGUuRGl2LmNhbGwodGhpcyk7XG5cbi8vXHR0aGlzLmlubmVySFRNTD1cImhlbGxvXCI7XG5cblx0dGhpcy5jb250YWluZXI9bmV3IHhub2RlLkRpdigpO1xuXHR0aGlzLmNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0dGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IDEwO1xuXHR0aGlzLmNvbnRhaW5lci5zdHlsZS5yaWdodCA9IDEwO1xuXHR0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSA2MDtcblx0dGhpcy5jb250YWluZXIuc3R5bGUuYm90dG9tID0gMTA7XG5cdHRoaXMuY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmQ9XCIjZmYwMDAwXCI7XG5cdHRoaXMuY29udGFpbmVyLmlubmVySFRNTD1cImhlbGxvXCI7XG5cblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XG5cblx0dGhpcy5hY2NvcmRpb24gPSBuZXcgeG5vZGV1aS5BY2NvcmRpb24oKTtcblx0dGhpcy5hY2NvcmRpb24uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMuYWNjb3JkaW9uLnN0eWxlLmxlZnQgPSA1O1xuXHR0aGlzLmFjY29yZGlvbi5zdHlsZS5yaWdodCA9IDU7XG5cdHRoaXMuYWNjb3JkaW9uLnN0eWxlLnRvcCA9IDU7XG5cdHRoaXMuYWNjb3JkaW9uLnN0eWxlLmJvdHRvbSA9IDU7XG5cblx0dGhpcy5hY2NvcmRpb24uYXBwZW5kQ2hpbGQobmV3IHhub2RlLkRpdihcImhlbGxvXCIpKTtcblx0dGhpcy5hY2NvcmRpb24uYXBwZW5kQ2hpbGQobmV3IHhub2RlLkRpdihcInNvbWUgY29udGVudC4uLjxici8+YmxhbGFibFwiKSk7XG5cdHRoaXMuYWNjb3JkaW9uLmFwcGVuZENoaWxkKG5ldyB4bm9kZS5EaXYoXCJoZWxsbyAyXCIpKTtcblx0dGhpcy5hY2NvcmRpb24uYXBwZW5kQ2hpbGQobmV3IHhub2RlLkRpdihcInNvbWUgbW9yZSBjb250ZW50Li4uPGJyLz5ibGFsYWJsIGFuZCBzbyBvbi4uLjxici8+YmxhbGFibCBhbmQgc28gb24uLi48YnIvPmJsYWxhYmwgYW5kIHNvIG9uLi4uPGJyLz5cIikpO1xuXG5cblx0dGhpcy5hY2NvcmRpb24uaGVpZ2h0U3R5bGUgPSBcImZpbGxcIjtcblx0dGhpcy5hY2NvcmRpb24uY29sbGFwc2libGUgPSBmYWxzZTtcblx0dGhpcy5hY2NvcmRpb24uYXV0b0hlaWdodCA9IGZhbHNlO1xuXG5cdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYWNjb3JkaW9uKTtcblxuXHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0c2NvcGUuYWNjb3JkaW9uLmhlaWdodFN0eWxlID0gXCJmaWxsXCI7XG5cdFx0c2NvcGUuYWNjb3JkaW9uLmNvbGxhcHNpYmxlID0gZmFsc2U7XG5cdFx0c2NvcGUuYWNjb3JkaW9uLnJlZnJlc2goKTtcblx0fSwgMCk7XG59XG5cbmluaGVyaXRzKFJlc291cmNlVGFiVmlldywgeG5vZGUuRGl2KTtcblxuUmVzb3VyY2VUYWJWaWV3LnByb3RvdHlwZS5zZXREYXRhID0gZnVuY3Rpb24oZGF0YSkge1xuXHRpZiAoZGF0YSkge1xuXHRcdFx0dGhpcy5pZCA9IGRhdGEuaWQ7XG5cblx0XHRcdC8vdGhpcy5pbm5lckhUTUwgPSBcImhlbGxvIHdvcmxkOiBcIiArIGRhdGEubGFiZWw7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZVRhYlZpZXc7Il19
