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
var ResourcePaneTabHeaderController = require("./ResourcePaneTabHeaderController");

/**
 * App controller
 * @class AppController
 */
function AppController(appModel, appView) {
	this.appModel = appModel;
	this.appView = appView;

	this.appView.getResourcePaneView().setTabsCollection(this.appModel.getCategoryCollection());
	this.appView.getResourcePaneView().getTabsHeaderManager().setItemControllerClass(ResourcePaneTabHeaderController);
}

module.exports = AppController;
},{"./ResourcePaneTabHeaderController":12}],12:[function(require,module,exports){
function ResourcePaneTabHeaderController(tabHeaderView) {
	this.tabHeaderView = tabHeaderView;
}

ResourcePaneTabHeaderController.prototype.setData = function(categoryModel) {
	if (categoryModel) {
		this.tabHeaderView.setLabel(categoryModel.getLabel());
		this.tabHeaderView.setTargetId(categoryModel.getId());
	}
}

module.exports = ResourcePaneTabHeaderController;
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
	console.log("setting parent: " + value);
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
},{"./ResourcePaneView":19,"inherits":1,"xnode":2,"xnodeui":9}],17:[function(require,module,exports){
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
},{"inherits":1,"xnode":2}],18:[function(require,module,exports){
var xnode = require("xnode");
var inherits = require("inherits");

function ResourcePaneTabHeaderView() {
	xnode.Li.call(this);

	this.targetId = null;
	this.label = null;
}

inherits(ResourcePaneTabHeaderView, xnode.Li);

ResourcePaneTabHeaderView.prototype.setTargetId = function(id) {
	this.targetId = id;
	this.refresh();
}

ResourcePaneTabHeaderView.prototype.setLabel = function(label) {
	this.label = label;
	this.refresh();
}

ResourcePaneTabHeaderView.prototype.refresh = function() {
	if (this.label && this.targetId) {
		console.log("setting inner, label=" + this.label + " id: " + this.targetId);
		this.innerHTML = "<a href='#" + this.targetId + "'>" + this.label + "</a>";
	}
}

module.exports = ResourcePaneTabHeaderView;
},{"inherits":1,"xnode":2}],19:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");
var xnodeui = require("xnodeui");
var xnodec = require("xnodecollection");
var ResourcePaneTabHeaderView = require("./ResourcePaneTabHeaderView");
var ResourcePaneTabContentView = require("./ResourcePaneTabContentView");

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
	this.tabsHeaderManager.setItemRendererClass(ResourcePaneTabHeaderView);

	this.tabsContentManager = new xnodec.CollectionViewManager(this.tabs);
	this.tabsContentManager.setItemRendererClass(ResourcePaneTabContentView);
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
},{"./ResourcePaneTabContentView":17,"./ResourcePaneTabHeaderView":18,"inherits":1,"xnode":2,"xnodecollection":8,"xnodeui":9}]},{},[13])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy94bm9kZS9zcmMveG5vZGUuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL25vZGVfbW9kdWxlcy94bm9kZS9zcmMveG5vZGUuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL25vZGVfbW9kdWxlcy95YWVkL3NyYy9FdmVudERpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3hub2RlY29sbGVjdGlvbi9zcmMvQ29sbGVjdGlvblZpZXcuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uVmlld01hbmFnZXIuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94bm9kZXVpL3NyYy94bm9kZXVpLmpzIiwic3JjL2FwcC9BcHAuanMiLCJzcmMvY29udHJvbGxlci9BcHBDb250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvUmVzb3VyY2VQYW5lVGFiSGVhZGVyQ29udHJvbGxlci5qcyIsInNyYy9maWRkbGV1aS5qcyIsInNyYy9tb2RlbC9BcHBNb2RlbC5qcyIsInNyYy9tb2RlbC9DYXRlZ29yeU1vZGVsLmpzIiwic3JjL3ZpZXcvQXBwVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlUGFuZVRhYkNvbnRlbnRWaWV3LmpzIiwic3JjL3ZpZXcvUmVzb3VyY2VQYW5lVGFiSGVhZGVyVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlUGFuZVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIihmdW5jdGlvbigpIHtcblx0LyoqXG5cdCAqIFRoZSBiYXNpYyB4bm9kZSBjbGFzcy5cblx0ICogSXQgc2V0cyB0aGUgdW5kZXJseWluZyBub2RlIGVsZW1lbnQgYnkgY2FsbGluZ1xuXHQgKiBkb2N1bWVudC5jcmVhdGVFbGVtZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBYTm9kZSh0eXBlLCBjb250ZW50KSB7XG5cdFx0dGhpcy5ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuXHRcdGlmIChjb250ZW50ICE9PSB1bmRlZmluZWQpXG5cdFx0XHR0aGlzLm5vZGUuaW5uZXJIVE1MID0gY29udGVudDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIG1ldGhvZCBjcmVhdGVzIGFuIGV4dGVuZGVkIGNsYXNzIHVzaW5nXG5cdCAqIHRoZSBYTm9kZSBjbGFzcyBkZWZpbmVkIGFib3ZlLlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoZWxlbWVudFR5cGUsIGNvbnRlbnQpIHtcblx0XHR2YXIgZiA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcblx0XHRcdFhOb2RlLmNhbGwodGhpcywgZWxlbWVudFR5cGUsIGNvbnRlbnQpO1xuXHRcdH07XG5cblx0XHRmLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoWE5vZGUucHJvdG90eXBlKTtcblx0XHRmLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGY7XG5cblx0XHRyZXR1cm4gZjtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSByZWFkIG9ubHkgcHJvcGVydHkgdGhhdCByZXR1cm5zIHRoZVxuXHQgKiB2YWx1ZSBvZiB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBvZiB0aGVcblx0ICogdW5kZXJseWluZyBub2RlIG9iamVjdC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVhOb2RlUmVhZE9ubHlQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoWE5vZGUucHJvdG90eXBlLCBwcm9wZXJ0eU5hbWUsIHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm5vZGVbcHJvcGVydHlOYW1lXTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSByZWFkIHdyaXRlIHByb3BlcnR5IHRoYXQgb3BlcmF0ZXMgb25cblx0ICogdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgb2YgdGhlIHVuZGVybHlpbmdcblx0ICogbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KHByb3BlcnR5TmFtZSkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShYTm9kZS5wcm90b3R5cGUsIHByb3BlcnR5TmFtZSwge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubm9kZVtwcm9wZXJ0eU5hbWVdO1xuXHRcdFx0fSxcblxuXHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHR0aGlzLm5vZGVbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG1ldGhvZCB0aGF0IHJvdXRlcyB0aGUgY2FsbCB0aHJvdWdoLCBkb3duXG5cdCAqIHRvIHRoZSBzYW1lIG1ldGhvZCBvbiB0aGUgdW5kZXJseWluZyBub2RlIG9iamVjdC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVhOb2RlTWV0aG9kKG1ldGhvZE5hbWUpIHtcblx0XHRYTm9kZS5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLm5vZGVbbWV0aG9kTmFtZV0uYXBwbHkodGhpcy5ub2RlLCBhcmd1bWVudHMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBNb2RpZnkgdGhlIE5vZGUucHJvcGVydHkgZnVuY3Rpb24sIHNvIHRoYXQgaXQgYWNjZXB0c1xuXHQgKiBYTm9kZSBvYmplY3RzLiBBbGwgWE5vZGUgb2JqZWN0cyB3aWxsIGJlIGNoYW5nZWQgdG9cblx0ICogdGhlIHVuZGVybHlpbmcgbm9kZSBvYmplY3RzLCBhbmQgdGhlIGNvcnJlc3BvbmRpbmdcblx0ICogbWV0aG9kIHdpbGwgYmUgY2FsbGVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlTm9kZVRvWE5vZGVNZXRob2RXcmFwcGVyKG1ldGhvZE5hbWUpIHtcblx0XHR2YXIgb3JpZ2luYWxGdW5jdGlvbiA9IE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuXG5cdFx0Tm9kZS5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdGZvciAodmFyIGEgaW4gYXJndW1lbnRzKSB7XG5cdFx0XHRcdGlmIChhcmd1bWVudHNbYV0gaW5zdGFuY2VvZiBYTm9kZSlcblx0XHRcdFx0XHRhcmd1bWVudHNbYV0gPSBhcmd1bWVudHNbYV0ubm9kZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG9yaWdpbmFsRnVuY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHVwIHJlYWQgb25seSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVSZWFkT25seVByb3BlcnR5KFwic3R5bGVcIik7XG5cblx0LyoqXG5cdCAqIFNldCB1cCByZWFkL3dyaXRlIHByb3BlcnRpZXMuXG5cdCAqL1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwiaW5uZXJIVE1MXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwiaHJlZlwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImlkXCIpO1xuXG5cdC8qKlxuXHQgKiBTZXQgdXAgbWV0aG9kcyB0byBiZSByb3V0ZWQgdG8gdGhlIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcImFwcGVuZENoaWxkXCIpO1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcInJlbW92ZUNoaWxkXCIpO1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcImFkZEV2ZW50TGlzdGVuZXJcIik7XG5cdGNyZWF0ZVhOb2RlTWV0aG9kKFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiKTtcblxuXHQvKipcblx0ICogU2V0IHVwIG1ldGhvZHMgb24gTm9kZS5wcm9wZXJ0eS5cblx0ICovXG5cdGNyZWF0ZU5vZGVUb1hOb2RlTWV0aG9kV3JhcHBlcihcImFwcGVuZENoaWxkXCIpO1xuXHRjcmVhdGVOb2RlVG9YTm9kZU1ldGhvZFdyYXBwZXIoXCJyZW1vdmVDaGlsZFwiKTtcblxuXHQvKipcblx0ICogQ3JlYXRlIGV2ZW50IGxpc3RlbmVyIGFsaWFzZXMuXG5cdCAqL1xuXHRYTm9kZS5wcm90b3R5cGUub24gPSBYTm9kZS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0WE5vZGUucHJvdG90eXBlLm9mZiA9IFhOb2RlLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXG5cdC8qKlxuXHQgKiBXb3JrIGJvdGggYXMgYSBucG0gbW9kdWxlIGFuZCBzdGFuZGFsb25lLlxuXHQgKi9cblx0dmFyIHRhcmdldDtcblxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdHRhcmdldCA9IHt9O1xuXHRcdG1vZHVsZS5leHBvcnRzID0gdGFyZ2V0O1xuXHR9IGVsc2Uge1xuXHRcdHhub2RlID0ge307XG5cdFx0dGFyZ2V0ID0geG5vZGU7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGV4dGVuZGVkIGNsYXNzZXMuXG5cdCAqL1xuXHR0YXJnZXQuRGl2ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJkaXZcIik7XG5cdHRhcmdldC5CdXR0b24gPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImJ1dHRvblwiKTtcblx0dGFyZ2V0LlVsID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJ1bFwiKTtcblx0dGFyZ2V0LkxpID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJsaVwiKTtcblx0dGFyZ2V0LkEgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImFcIik7XG5cdHRhcmdldC5PcHRpb24gPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcIm9wdGlvblwiKTtcblx0dGFyZ2V0LlNlbGVjdCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwic2VsZWN0XCIpO1xuXHR0YXJnZXQuSW5wdXQgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImlucHV0XCIpO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0LyoqXG5cdCAqIFRoZSBiYXNpYyB4bm9kZSBjbGFzcy5cblx0ICogSXQgc2V0cyB0aGUgdW5kZXJseWluZyBub2RlIGVsZW1lbnQgYnkgY2FsbGluZ1xuXHQgKiBkb2N1bWVudC5jcmVhdGVFbGVtZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBYTm9kZSh0eXBlLCBjb250ZW50KSB7XG5cdFx0dGhpcy5ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuXHRcdGlmIChjb250ZW50ICE9PSB1bmRlZmluZWQpXG5cdFx0XHR0aGlzLm5vZGUuaW5uZXJIVE1MID0gY29udGVudDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIG1ldGhvZCBjcmVhdGVzIGFuIGV4dGVuZGVkIGNsYXNzIHVzaW5nXG5cdCAqIHRoZSBYTm9kZSBjbGFzcyBkZWZpbmVkIGFib3ZlLlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoZWxlbWVudFR5cGUsIGNvbnRlbnQpIHtcblx0XHR2YXIgZiA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcblx0XHRcdFhOb2RlLmNhbGwodGhpcywgZWxlbWVudFR5cGUsIGNvbnRlbnQpO1xuXHRcdH07XG5cblx0XHRmLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoWE5vZGUucHJvdG90eXBlKTtcblx0XHRmLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGY7XG5cblx0XHRyZXR1cm4gZjtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSByZWFkIG9ubHkgcHJvcGVydHkgdGhhdCByZXR1cm5zIHRoZVxuXHQgKiB2YWx1ZSBvZiB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBvZiB0aGVcblx0ICogdW5kZXJseWluZyBub2RlIG9iamVjdC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVhOb2RlUmVhZE9ubHlQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoWE5vZGUucHJvdG90eXBlLCBwcm9wZXJ0eU5hbWUsIHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm5vZGVbcHJvcGVydHlOYW1lXTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSByZWFkIHdyaXRlIHByb3BlcnR5IHRoYXQgb3BlcmF0ZXMgb25cblx0ICogdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgb2YgdGhlIHVuZGVybHlpbmdcblx0ICogbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KHByb3BlcnR5TmFtZSkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShYTm9kZS5wcm90b3R5cGUsIHByb3BlcnR5TmFtZSwge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubm9kZVtwcm9wZXJ0eU5hbWVdO1xuXHRcdFx0fSxcblxuXHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHR0aGlzLm5vZGVbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG1ldGhvZCB0aGF0IHJvdXRlcyB0aGUgY2FsbCB0aHJvdWdoLCBkb3duXG5cdCAqIHRvIHRoZSBzYW1lIG1ldGhvZCBvbiB0aGUgdW5kZXJseWluZyBub2RlIG9iamVjdC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVhOb2RlTWV0aG9kKG1ldGhvZE5hbWUpIHtcblx0XHRYTm9kZS5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLm5vZGVbbWV0aG9kTmFtZV0uYXBwbHkodGhpcy5ub2RlLCBhcmd1bWVudHMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBNb2RpZnkgdGhlIE5vZGUucHJvcGVydHkgZnVuY3Rpb24sIHNvIHRoYXQgaXQgYWNjZXB0c1xuXHQgKiBYTm9kZSBvYmplY3RzLiBBbGwgWE5vZGUgb2JqZWN0cyB3aWxsIGJlIGNoYW5nZWQgdG9cblx0ICogdGhlIHVuZGVybHlpbmcgbm9kZSBvYmplY3RzLCBhbmQgdGhlIGNvcnJlc3BvbmRpbmdcblx0ICogbWV0aG9kIHdpbGwgYmUgY2FsbGVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlTm9kZVRvWE5vZGVNZXRob2RXcmFwcGVyKG1ldGhvZE5hbWUpIHtcblx0XHR2YXIgb3JpZ2luYWxGdW5jdGlvbiA9IE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuXG5cdFx0Tm9kZS5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdGZvciAodmFyIGEgaW4gYXJndW1lbnRzKSB7XG5cdFx0XHRcdGlmIChhcmd1bWVudHNbYV0gaW5zdGFuY2VvZiBYTm9kZSlcblx0XHRcdFx0XHRhcmd1bWVudHNbYV0gPSBhcmd1bWVudHNbYV0ubm9kZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG9yaWdpbmFsRnVuY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHVwIHJlYWQgb25seSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVSZWFkT25seVByb3BlcnR5KFwic3R5bGVcIik7XG5cblx0LyoqXG5cdCAqIFNldCB1cCByZWFkL3dyaXRlIHByb3BlcnRpZXMuXG5cdCAqL1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwiaW5uZXJIVE1MXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwiaHJlZlwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImlkXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwidmFsdWVcIik7XG5cdGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkoXCJ0eXBlXCIpO1xuXG5cdC8qKlxuXHQgKiBTZXQgdXAgbWV0aG9kcyB0byBiZSByb3V0ZWQgdG8gdGhlIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcImFwcGVuZENoaWxkXCIpO1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcInJlbW92ZUNoaWxkXCIpO1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcImFkZEV2ZW50TGlzdGVuZXJcIik7XG5cdGNyZWF0ZVhOb2RlTWV0aG9kKFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiKTtcblxuXHQvKipcblx0ICogU2V0IHVwIG1ldGhvZHMgb24gTm9kZS5wcm9wZXJ0eS5cblx0ICovXG5cdGNyZWF0ZU5vZGVUb1hOb2RlTWV0aG9kV3JhcHBlcihcImFwcGVuZENoaWxkXCIpO1xuXHRjcmVhdGVOb2RlVG9YTm9kZU1ldGhvZFdyYXBwZXIoXCJyZW1vdmVDaGlsZFwiKTtcblxuXHQvKipcblx0ICogQ3JlYXRlIGV2ZW50IGxpc3RlbmVyIGFsaWFzZXMuXG5cdCAqL1xuXHRYTm9kZS5wcm90b3R5cGUub24gPSBYTm9kZS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0WE5vZGUucHJvdG90eXBlLm9mZiA9IFhOb2RlLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXG5cdC8qKlxuXHQgKiBXb3JrIGJvdGggYXMgYSBucG0gbW9kdWxlIGFuZCBzdGFuZGFsb25lLlxuXHQgKi9cblx0dmFyIHRhcmdldDtcblxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdHRhcmdldCA9IHt9O1xuXHRcdG1vZHVsZS5leHBvcnRzID0gdGFyZ2V0O1xuXHR9IGVsc2Uge1xuXHRcdHhub2RlID0ge307XG5cdFx0dGFyZ2V0ID0geG5vZGU7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGV4dGVuZGVkIGNsYXNzZXMuXG5cdCAqL1xuXHR0YXJnZXQuRGl2ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJkaXZcIik7XG5cdHRhcmdldC5CdXR0b24gPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImJ1dHRvblwiKTtcblx0dGFyZ2V0LlVsID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJ1bFwiKTtcblx0dGFyZ2V0LkxpID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJsaVwiKTtcblx0dGFyZ2V0LkEgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImFcIik7XG5cdHRhcmdldC5PcHRpb24gPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcIm9wdGlvblwiKTtcblx0dGFyZ2V0LlNlbGVjdCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwic2VsZWN0XCIpO1xuXHR0YXJnZXQuSW5wdXQgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImlucHV0XCIpO1xufSkoKTsiLCIvKipcbiAqIEFTMy9qcXVlcnkgc3R5bGUgZXZlbnQgZGlzcGF0Y2hlci4gU2xpZ2h0bHkgbW9kaWZpZWQuIFRoZVxuICoganF1ZXJ5IHN0eWxlIG9uL29mZi90cmlnZ2VyIHN0eWxlIG9mIGFkZGluZyBsaXN0ZW5lcnMgaXNcbiAqIGN1cnJlbnRseSB0aGUgcHJlZmVycmVkIG9uZS5cbiAqXG4gKiBUaGUgb24gbWV0aG9kIGZvciBhZGRpbmcgbGlzdGVuZXJzIHRha2VzIGFuIGV4dHJhIHBhcmFtZXRlciB3aGljaCBpcyB0aGVcbiAqIHNjb3BlIGluIHdoaWNoIGxpc3RlbmVycyBzaG91bGQgYmUgY2FsbGVkLiBTbyB0aGlzOlxuICpcbiAqICAgICBvYmplY3Qub24oXCJldmVudFwiLCBsaXN0ZW5lciwgdGhpcyk7XG4gKlxuICogSGFzIHRoZSBzYW1lIGZ1bmN0aW9uIHdoZW4gYWRkaW5nIGV2ZW50cyBhczpcbiAqXG4gKiAgICAgb2JqZWN0Lm9uKFwiZXZlbnRcIiwgbGlzdGVuZXIuYmluZCh0aGlzKSk7XG4gKlxuICogSG93ZXZlciwgdGhlIGRpZmZlcmVuY2UgaXMgdGhhdCBpZiB3ZSB1c2UgdGhlIHNlY29uZCBtZXRob2QgaXRcbiAqIHdpbGwgbm90IGJlIHBvc3NpYmxlIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXJzIGxhdGVyLCB1bmxlc3NcbiAqIHRoZSBjbG9zdXJlIGNyZWF0ZWQgYnkgYmluZCBpcyBzdG9yZWQgc29tZXdoZXJlLiBJZiB0aGVcbiAqIGZpcnN0IG1ldGhvZCBpcyB1c2VkLCB3ZSBjYW4gcmVtb3ZlIHRoZSBsaXN0ZW5lciB3aXRoOlxuICpcbiAqICAgICBvYmplY3Qub2ZmKFwiZXZlbnRcIiwgbGlzdGVuZXIsIHRoaXMpO1xuICpcbiAqIEBjbGFzcyBFdmVudERpc3BhdGNoZXJcbiAqL1xuZnVuY3Rpb24gRXZlbnREaXNwYXRjaGVyKCkge1xuXHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG59XG5cbi8qKlxuICogQWRkIGV2ZW50IGxpc3RlbmVyLlxuICogQG1ldGhvZCBhZGRFdmVudExpc3RlbmVyXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHNjb3BlKSB7XG5cdGlmICghdGhpcy5saXN0ZW5lck1hcClcblx0XHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG5cblx0aWYgKCFldmVudFR5cGUpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiRXZlbnQgdHlwZSByZXF1aXJlZCBmb3IgZXZlbnQgZGlzcGF0Y2hlclwiKTtcblxuXHRpZiAoIWxpc3RlbmVyKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIkxpc3RlbmVyIHJlcXVpcmVkIGZvciBldmVudCBkaXNwYXRjaGVyXCIpO1xuXG5cdHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGxpc3RlbmVyLCBzY29wZSk7XG5cblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpXG5cdFx0dGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdID0gW107XG5cblx0dGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdLnB1c2goe1xuXHRcdGxpc3RlbmVyOiBsaXN0ZW5lcixcblx0XHRzY29wZTogc2NvcGVcblx0fSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVyLlxuICogQG1ldGhvZCByZW1vdmVFdmVudExpc3RlbmVyXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHNjb3BlKSB7XG5cdGlmICghdGhpcy5saXN0ZW5lck1hcClcblx0XHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG5cblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpXG5cdFx0cmV0dXJuO1xuXG5cdHZhciBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgbGlzdGVuZXJPYmogPSBsaXN0ZW5lcnNbaV07XG5cblx0XHRpZiAobGlzdGVuZXIgPT0gbGlzdGVuZXJPYmoubGlzdGVuZXIgJiYgc2NvcGUgPT0gbGlzdGVuZXJPYmouc2NvcGUpIHtcblx0XHRcdGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRpLS07XG5cdFx0fVxuXHR9XG5cblx0aWYgKCFsaXN0ZW5lcnMubGVuZ3RoKVxuXHRcdGRlbGV0ZSB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggZXZlbnQuXG4gKiBAbWV0aG9kIGRpc3BhdGNoRXZlbnRcbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24oZXZlbnQgLyogLi4uICovICkge1xuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXApXG5cdFx0dGhpcy5saXN0ZW5lck1hcCA9IHt9O1xuXG5cdHZhciBldmVudFR5cGU7XG5cdHZhciBsaXN0ZW5lclBhcmFtcztcblxuXHRpZiAodHlwZW9mIGV2ZW50ID09IFwic3RyaW5nXCIpIHtcblx0XHRldmVudFR5cGUgPSBldmVudDtcblxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSlcblx0XHRcdGxpc3RlbmVyUGFyYW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuXHRcdGVsc2UgbGlzdGVuZXJQYXJhbXMgPSBbe1xuXHRcdFx0dHlwZTogZXZlbnRUeXBlLFxuXHRcdFx0dGFyZ2V0OiB0aGlzXG5cdFx0fV07XG5cdH0gZWxzZSB7XG5cdFx0ZXZlbnRUeXBlID0gZXZlbnQudHlwZTtcblx0XHRldmVudC50YXJnZXQgPSB0aGlzO1xuXHRcdGxpc3RlbmVyUGFyYW1zID0gW2V2ZW50XTtcblx0fVxuXG5cdGlmICghdGhpcy5saXN0ZW5lck1hcC5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKVxuXHRcdHJldHVybjtcblxuXHRmb3IgKHZhciBpIGluIHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXSkge1xuXHRcdHZhciBsaXN0ZW5lck9iaiA9IHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXVtpXTtcblx0XHRsaXN0ZW5lck9iai5saXN0ZW5lci5hcHBseShsaXN0ZW5lck9iai5zY29wZSwgbGlzdGVuZXJQYXJhbXMpO1xuXHR9XG59XG5cbi8qKlxuICogSnF1ZXJ5IHN0eWxlIGFsaWFzIGZvciBhZGRFdmVudExpc3RlbmVyXG4gKiBAbWV0aG9kIG9uXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub24gPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cbi8qKlxuICogSnF1ZXJ5IHN0eWxlIGFsaWFzIGZvciByZW1vdmVFdmVudExpc3RlbmVyXG4gKiBAbWV0aG9kIG9mZlxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblxuLyoqXG4gKiBKcXVlcnkgc3R5bGUgYWxpYXMgZm9yIGRpc3BhdGNoRXZlbnRcbiAqIEBtZXRob2QgdHJpZ2dlclxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnRyaWdnZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQ7XG5cbi8qKlxuICogTWFrZSBzb21ldGhpbmcgYW4gZXZlbnQgZGlzcGF0Y2hlci4gQ2FuIGJlIHVzZWQgZm9yIG11bHRpcGxlIGluaGVyaXRhbmNlLlxuICogQG1ldGhvZCBpbml0XG4gKiBAc3RhdGljXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5pbml0ID0gZnVuY3Rpb24oY2xzKSB7XG5cdGNscy5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0Y2xzLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXHRjbHMucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQ7XG5cdGNscy5wcm90b3R5cGUub24gPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLm9uO1xuXHRjbHMucHJvdG90eXBlLm9mZiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub2ZmO1xuXHRjbHMucHJvdG90eXBlLnRyaWdnZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnRyaWdnZXI7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IEV2ZW50RGlzcGF0Y2hlcjtcbn0iLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcInlhZWRcIik7XG5cbi8qKlxuICogQ29sbGVjdGlvbi5cbiAqIEBjbGFzcyBDb2xsZWN0aW9uXG4gKi9cbmZ1bmN0aW9uIENvbGxlY3Rpb24oKSB7XG5cdHRoaXMuaXRlbXMgPSBbXTtcbn1cblxuaW5oZXJpdHMoQ29sbGVjdGlvbiwgRXZlbnREaXNwYXRjaGVyKTtcblxuLyoqXG4gKiBBZGQgaXRlbSBhdCBlbmQuXG4gKiBAbWV0aG9kIGFkZEl0ZW1cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuYWRkSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0dGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuXG5cdHRoaXMudHJpZ2dlckNoYW5nZShcImFkZFwiLCBpdGVtLCB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpO1xufVxuXG4vKipcbiAqIEFkZCBpdGVtIGF0IGluZGV4LlxuICogQG1ldGhvZCBhZGRJdGVtXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmFkZEl0ZW1BdCA9IGZ1bmN0aW9uKGluZGV4LCBpdGVtKSB7XG5cdGlmIChpbmRleCA8IDApXG5cdFx0aW5kZXggPSAwO1xuXG5cdGlmIChpbmRleCA+IHRoaXMuaXRlbXMubGVuZ3RoKVxuXHRcdGluZGV4ID0gdGhpcy5pdGVtcy5sZW5ndGg7XG5cblx0dmFyIGFmdGVyID0gdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgpO1xuXHR0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG5cdHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmNvbmNhdChhZnRlcik7XG5cblx0dGhpcy50cmlnZ2VyQ2hhbmdlKFwiYWRkXCIsIGl0ZW0sIGluZGV4KTtcbn1cblxuLyoqXG4gKiBHZXQgbGVuZ3RoLlxuICogQG1ldGhvZCBnZXRMZW5ndGhcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcbn1cblxuLyoqXG4gKiBHZXQgaXRlbSBhdCBpbmRleC5cbiAqIEBtZXRob2QgZ2V0SXRlbUF0XG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmdldEl0ZW1BdCA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cdHJldHVybiB0aGlzLml0ZW1zW2luZGV4XTtcbn1cblxuLyoqXG4gKiBGaW5kIGl0ZW0gaW5kZXguXG4gKiBAbWV0aG9kIGdldEl0ZW1JbmRleFxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5nZXRJdGVtSW5kZXggPSBmdW5jdGlvbihpdGVtKSB7XG5cdHJldHVybiB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGl0ZW0gYXQuXG4gKiBAbWV0aG9kIHJlbW92ZUl0ZW1BdFxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5yZW1vdmVJdGVtQXQgPSBmdW5jdGlvbihpbmRleCkge1xuXHRpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuaXRlbXMubGVuZ3RoKVxuXHRcdHJldHVybjtcblxuXHR2YXIgaXRlbSA9IHRoaXMuZ2V0SXRlbUF0KGluZGV4KTtcblxuXHR0aGlzLml0ZW1zLnNwbGljZShpbmRleCwgMSk7XG5cdHRoaXMudHJpZ2dlckNoYW5nZShcInJlbW92ZVwiLCBpdGVtLCBpbmRleCk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGl0ZW0uXG4gKiBAbWV0aG9kIHJlbW92ZUl0ZW1cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUucmVtb3ZlSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0dmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgoaXRlbSk7XG5cblx0dGhpcy5yZW1vdmVJdGVtQXQoaW5kZXgpO1xufVxuXG4vKipcbiAqIFRyaWdnZXIgY2hhbmdlIGV2ZW50LlxuICogQG1ldGhvZCB0cmlnZ2VyQ2hhbmdlXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS50cmlnZ2VyQ2hhbmdlID0gZnVuY3Rpb24oZXZlbnRLaW5kLCBpdGVtLCBpbmRleCkge1xuXHR0aGlzLnRyaWdnZXIoe1xuXHRcdHR5cGU6IGV2ZW50S2luZCxcblx0XHRpdGVtOiBpdGVtLFxuXHRcdGluZGV4OiBpbmRleFxuXHR9KTtcblxuXHR0aGlzLnRyaWdnZXIoe1xuXHRcdHR5cGU6IFwiY2hhbmdlXCIsXG5cdFx0a2luZDogZXZlbnRLaW5kLFxuXHRcdGl0ZW06IGl0ZW0sXG5cdFx0aW5kZXg6IGluZGV4XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb247IiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCJ5YWVkXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIENvbGxlY3Rpb25WaWV3TWFuYWdlcj1yZXF1aXJlKFwiLi9Db2xsZWN0aW9uVmlld01hbmFnZXJcIik7XG5cbi8qKlxuICogQ29sbGVjdGlvblZpZXcuXG4gKiBAY2xhc3MgQ29sbGVjdGlvblZpZXdcbiAqL1xuZnVuY3Rpb24gQ29sbGVjdGlvblZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMubWFuYWdlcj1uZXcgQ29sbGVjdGlvblZpZXdNYW5hZ2VyKHRoaXMpO1xufVxuXG5pbmhlcml0cyhDb2xsZWN0aW9uVmlldywgeG5vZGUuRGl2KTtcblxuLyoqXG4gKiBTZXQgaXRlbSByZW5kZXJlciBjbGFzcy5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyQ2xhc3NcbiAqL1xuQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLnNldEl0ZW1SZW5kZXJlckNsYXNzID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldEl0ZW1SZW5kZXJlckNsYXNzKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSByZW5kZXJlciBmYWN0b3J5LlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJGYWN0b3J5XG4gKi9cbkNvbGxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXRJdGVtUmVuZGVyZXJGYWN0b3J5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldEl0ZW1SZW5kZXJlckZhY3RvcnkodmFsdWUpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIGNvbnRyb2xsZXIgY2xhc3MuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckNsYXNzXG4gKi9cbkNvbGxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXRJdGVtQ29udHJvbGxlckNsYXNzID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldEl0ZW1Db250cm9sbGVyQ2xhc3ModmFsdWUpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIGNvbnRyb2xsZXIgZmFjdG9yeS5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyRmFjdG9yeVxuICovXG5Db2xsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0SXRlbUNvbnRyb2xsZXJGYWN0b3J5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldEl0ZW1Db250cm9sbGVyRmFjdG9yeSh2YWx1ZSk7XG59XG5cbi8qKlxuICogU2V0IGRhdGEgc291cmNlLlxuICogQG1ldGhvZCBzZXREYXRhU291cmNlXG4gKi9cbkNvbGxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXREYXRhU291cmNlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldERhdGFTb3VyY2UodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb25WaWV3OyIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwieWFlZFwiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcblxuLyoqXG4gKiBDb2xsZWN0aW9uVmlld01hbmFnZXIuXG4gKiBAY2xhc3MgQ29sbGVjdGlvblZpZXdNYW5hZ2VyXG4gKi9cbmZ1bmN0aW9uIENvbGxlY3Rpb25WaWV3TWFuYWdlcih0YXJnZXQpIHtcblx0dGhpcy5pdGVtUmVuZGVyZXJzID0gW107XG5cdHRoaXMuaXRlbVJlbmRlcmVyQ2xhc3MgPSBudWxsO1xuXHR0aGlzLml0ZW1SZW5kZXJlckZhY3RvcnkgPSBudWxsO1xuXHR0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MgPSBudWxsO1xuXHR0aGlzLml0ZW1Db250cm9sbGVyRmFjdG9yeSA9IG51bGw7XG5cdHRoaXMuZGF0YVNvdXJjZSA9IG51bGw7XG5cdHRoaXMudGFyZ2V0ID0gbnVsbDtcblxuXHR0aGlzLnNldFRhcmdldCh0YXJnZXQpO1xufVxuXG4vKipcbiAqIFNldCB0YXJnZXQuXG4gKiBAbWV0aG9kIHNldFRhcmdldFxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldFRhcmdldCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMucmVtb3ZlQWxsSXRlbVJlbmRlcmVycygpO1xuXHR0aGlzLnRhcmdldD12YWx1ZTtcblx0dGhpcy5yZW1vdmVBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gcmVuZGVyZXIgY2xhc3MuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckNsYXNzXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0SXRlbVJlbmRlcmVyQ2xhc3MgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgaXRlbSByZW5kZXJlciBjbGFzcyBzaG91bGQgYmUgYSBmdW5jdGlvblwiKTtcblxuXHR0aGlzLml0ZW1SZW5kZXJlckNsYXNzID0gdmFsdWU7XG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSByZW5kZXJlciBmYWN0b3J5LlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJGYWN0b3J5XG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0SXRlbVJlbmRlcmVyRmFjdG9yeSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBpdGVtIHJlbmRlcmVyIGZhY3Rvcnkgc2hvdWxkIGJlIGEgZnVuY3Rpb25cIik7XG5cblx0dGhpcy5pdGVtUmVuZGVyZXJGYWN0b3J5ID0gdmFsdWU7XG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSBjb250cm9sbGVyIGNsYXNzLlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJDbGFzc1xuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldEl0ZW1Db250cm9sbGVyQ2xhc3MgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgaXRlbSByZW5kZXJlciBjbGFzcyBzaG91bGQgYmUgYSBmdW5jdGlvblwiKTtcblxuXHR0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MgPSB2YWx1ZTtcblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIGNvbnRyb2xsZXIgZmFjdG9yeS5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyRmFjdG9yeVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldEl0ZW1Db250cm9sbGVyRmFjdG9yeSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBpdGVtIHJlbmRlcmVyIGZhY3Rvcnkgc2hvdWxkIGJlIGEgZnVuY3Rpb25cIik7XG5cblx0dGhpcy5pdGVtQ29udHJvbGxlckZhY3RvcnkgPSB2YWx1ZTtcblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNldCBkYXRhIHNvdXJjZS5cbiAqIEBtZXRob2Qgc2V0RGF0YVNvdXJjZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldERhdGFTb3VyY2UgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodGhpcy5kYXRhU291cmNlKSB7XG5cdFx0dGhpcy5kYXRhU291cmNlLm9mZihcImNoYW5nZVwiLCB0aGlzLm9uRGF0YVNvdXJjZUNoYW5nZSwgdGhpcyk7XG5cdH1cblxuXHR0aGlzLmRhdGFTb3VyY2UgPSB2YWx1ZTtcblxuXHRpZiAodGhpcy5kYXRhU291cmNlKSB7XG5cdFx0dGhpcy5kYXRhU291cmNlLm9uKFwiY2hhbmdlXCIsIHRoaXMub25EYXRhU291cmNlQ2hhbmdlLCB0aGlzKTtcblx0fVxuXG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTb21ldGhpbmcgaW4gdGhlIGRhdGEgc291cmNlIHdhcyBjaGFuZ2VkLlxuICogQG1ldGhvZCBvbkRhdGFTb3VyY2VDaGFuZ2VcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUub25EYXRhU291cmNlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYWxsIGl0ZW0gcmVuZGVyZXJzLlxuICogQG1ldGhvZCByZW1vdmVBbGxJdGVtUmVuZGVyZXJzXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnJlbW92ZUFsbEl0ZW1SZW5kZXJlcnMgPSBmdW5jdGlvbigpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZW1SZW5kZXJlcnMubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAodGhpcy5pdGVtUmVuZGVyZXJzW2ldLl9fY29udHJvbGxlcilcblx0XHRcdHRoaXMuaXRlbVJlbmRlcmVyc1tpXS5fX2NvbnRyb2xsZXIuc2V0RGF0YShudWxsKTtcblxuXHRcdGVsc2Vcblx0XHRcdHRoaXMuaXRlbVJlbmRlcmVyc1tpXS5zZXREYXRhKG51bGwpO1xuXG5cdFx0dGhpcy50YXJnZXQucmVtb3ZlQ2hpbGQodGhpcy5pdGVtUmVuZGVyZXJzW2ldKTtcblx0fVxuXG5cdHRoaXMuaXRlbVJlbmRlcmVycyA9IFtdO1xufVxuXG4vKipcbiAqIFJlZnJlc2ggYWxsIGl0ZW0gcmVuZGVyZXJzLlxuICogQG1ldGhvZCByZWZyZXNoQWxsSXRlbVJlbmRlcmVyc1xuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbW92ZUFsbEl0ZW1SZW5kZXJlcnMoKTtcblxuXHRpZiAoIXRoaXMuZGF0YVNvdXJjZSlcblx0XHRyZXR1cm47XG5cblx0aWYgKCF0aGlzLml0ZW1SZW5kZXJlckNsYXNzICYmICF0aGlzLml0ZW1SZW5kZXJlckZhY3RvcnkpXG5cdFx0cmV0dXJuO1xuXG5cdGlmICghdGhpcy50YXJnZXQpXG5cdFx0cmV0dXJuO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kYXRhU291cmNlLmdldExlbmd0aCgpOyBpKyspIHtcblx0XHR2YXIgZGF0YSA9IHRoaXMuZGF0YVNvdXJjZS5nZXRJdGVtQXQoaSk7XG5cdFx0dmFyIHJlbmRlcmVyID0gdGhpcy5jcmVhdGVJdGVtUmVuZGVyZXIoKTtcblxuXHRcdGlmICh0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MgfHwgdGhpcy5pdGVtQ29udHJvbGxlckZhY3RvcnkpIHtcblx0XHRcdHJlbmRlcmVyLl9fY29udHJvbGxlciA9IHRoaXMuY3JlYXRlSXRlbUNvbnRyb2xsZXIocmVuZGVyZXIpO1xuXHRcdFx0cmVuZGVyZXIuX19jb250cm9sbGVyLnNldERhdGEoZGF0YSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbmRlcmVyLnNldERhdGEoZGF0YSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5pdGVtUmVuZGVyZXJzLnB1c2gocmVuZGVyZXIpO1xuXHRcdHRoaXMudGFyZ2V0LmFwcGVuZENoaWxkKHJlbmRlcmVyKTtcblx0fVxufVxuXG4vKipcbiAqIENyZWF0ZSBpdGVtIHJlbmRlcmVyLlxuICogQG1ldGhvZCBjcmVhdGVJdGVtUmVuZGVyZXJcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuY3JlYXRlSXRlbVJlbmRlcmVyID0gZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLml0ZW1SZW5kZXJlckZhY3RvcnkpXG5cdFx0cmV0dXJuIHRoaXMuaXRlbVJlbmRlcmVyRmFjdG9yeSgpO1xuXG5cdGlmICh0aGlzLml0ZW1SZW5kZXJlckNsYXNzKVxuXHRcdHJldHVybiBuZXcgdGhpcy5pdGVtUmVuZGVyZXJDbGFzcygpO1xuXG5cdHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNyZWF0ZSBpdGVtIHJlbmRlcmVyIVwiKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgaXRlbSBjb250cm9sbGVyLlxuICogQG1ldGhvZCBjcmVhdGVJdGVtQ29udHJvbGxlclxuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5jcmVhdGVJdGVtQ29udHJvbGxlciA9IGZ1bmN0aW9uKHJlbmRlcmVyKSB7XG5cdGlmICh0aGlzLml0ZW1Db250cm9sbGVyRmFjdG9yeSlcblx0XHRyZXR1cm4gdGhpcy5pdGVtQ29udHJvbGxlckZhY3RvcnkocmVuZGVyZXIpO1xuXG5cdGlmICh0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MpXG5cdFx0cmV0dXJuIG5ldyB0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MocmVuZGVyZXIpO1xuXG5cdHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNyZWF0ZSBpdGVtIGNvbnRyb2xsZXIhXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb25WaWV3TWFuYWdlcjsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0Q29sbGVjdGlvbjogcmVxdWlyZShcIi4vQ29sbGVjdGlvblwiKSxcblx0Q29sbGVjdGlvblZpZXc6IHJlcXVpcmUoXCIuL0NvbGxlY3Rpb25WaWV3XCIpLFxuXHRDb2xsZWN0aW9uVmlld01hbmFnZXI6IHJlcXVpcmUoXCIuL0NvbGxlY3Rpb25WaWV3TWFuYWdlclwiKVxufTsiLCJ2YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgeG5vZGV1aSA9IHt9O1xuXG4vKipcbiAqIENyZWF0ZSBhIGNsYXNzIHRoYXQgZXh0ZW5kcyBhIGpxdWVyeSB1aSB3aWRnZXQuXG4gKiBAbWV0aG9kIGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChqcXVlcnl1aVR5cGUsIGJhc2VDbGFzcykge1xuXHRpZiAoIWJhc2VDbGFzcylcblx0XHRiYXNlQ2xhc3MgPSB4bm9kZS5EaXY7XG5cblx0ZnVuY3Rpb24gY2xzKCkge1xuXHRcdGJhc2VDbGFzcy5jYWxsKHRoaXMpO1xuXG5cdFx0c3dpdGNoIChqcXVlcnl1aVR5cGUpIHtcblx0XHRcdGNhc2UgXCJ0YWJzXCI6XG5cdFx0XHRcdHRoaXMudWwgPSBuZXcgeG5vZGUuVWwoKTtcblx0XHRcdFx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLnVsKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0dGhpcy5qcXVlcnl1aVR5cGUgPSBqcXVlcnl1aVR5cGU7XG5cdFx0dGhpcy5qcXVlcnlFbGVtZW50ID0gJCh0aGlzLm5vZGUpO1xuXHRcdHRoaXMuanF1ZXJ5RWxlbWVudFt0aGlzLmpxdWVyeXVpVHlwZV0oKTtcblx0fVxuXG5cdGluaGVyaXRzKGNscywgYmFzZUNsYXNzKTtcblxuXHRjbHMucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihlLCBmKSB7XG5cdFx0eG5vZGUuRGl2LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyLmNhbGwodGhpcywgZSwgZik7XG5cdFx0dGhpcy5qcXVlcnlFbGVtZW50Lm9uKGUsIGYpO1xuXHR9XG5cblx0Y2xzLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZSwgZikge1xuXHRcdHhub2RlLkRpdi5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMsIGUsIGYpO1xuXHRcdHRoaXMuanF1ZXJ5RWxlbWVudC5vZmYoZSwgZik7XG5cdH1cblxuXHRjbHMucHJvdG90eXBlLm9uID0gY2xzLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyO1xuXHRjbHMucHJvdG90eXBlLm9mZiA9IGNscy5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblxuXHRyZXR1cm4gY2xzO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHByb3BlcnR5IG9uIGFuIGV4dGVuZGVkIGpxdWVyeSB1aSBjbGFzcy5cbiAqIEBtZXRob2QgY3JlYXRlWE5vZGVVSVByb3BlcnR5XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVhOb2RlVUlQcm9wZXJ0eShjbHMsIHByb3RvdHlwZU5hbWUpIHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGNscy5wcm90b3R5cGUsIHByb3RvdHlwZU5hbWUsIHtcblx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuanF1ZXJ5RWxlbWVudFt0aGlzLmpxdWVyeXVpVHlwZV0oXCJvcHRpb25cIiwgcHJvdG90eXBlTmFtZSlcblx0XHR9LFxuXG5cdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dGhpcy5qcXVlcnlFbGVtZW50W3RoaXMuanF1ZXJ5dWlUeXBlXShcIm9wdGlvblwiLCBwcm90b3R5cGVOYW1lLCB2YWx1ZSlcblx0XHR9XG5cdH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZSBzZXZlcmFsIHByb3BydGllcyBvbiBhbiBleHRlbmRlZCBqcXVlcnkgdWkgY2xhc3MuXG4gKiBAbWV0aG9kIGNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKGNscywgcHJvcHJ0eU5hbWVzKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHJ0eU5hbWVzLmxlbmd0aDsgaSsrKVxuXHRcdGNyZWF0ZVhOb2RlVUlQcm9wZXJ0eShjbHMsIHByb3BydHlOYW1lc1tpXSk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgbWV0aG9kIG9uIGFuIGV4dGVuZGVkIGpxdWVyeSB1aSBjbGFzcy5cbiAqIEBtZXRob2QgY3JlYXRlWE5vZGVVSU1ldGhvZFxuICovXG5mdW5jdGlvbiBjcmVhdGVYTm9kZVVJTWV0aG9kKGNscywgbWV0aG9kTmFtZSkge1xuXHRjbHMucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMClcblx0XHRcdHJldHVybiB0aGlzLmpxdWVyeUVsZW1lbnRbdGhpcy5qcXVlcnl1aVR5cGVdKG1ldGhvZE5hbWUpO1xuXG5cdFx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKVxuXHRcdFx0cmV0dXJuIHRoaXMuanF1ZXJ5RWxlbWVudFt0aGlzLmpxdWVyeXVpVHlwZV0obWV0aG9kTmFtZSwgYXJndW1lbnRzWzBdKTtcblxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMilcblx0XHRcdHJldHVybiB0aGlzLmpxdWVyeUVsZW1lbnRbdGhpcy5qcXVlcnl1aVR5cGVdKG1ldGhvZE5hbWUsIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcblxuXHRcdGVsc2Vcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInRoYXQgbWFueSBhcmd1bWVudHM/XCIpO1xuXHR9XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgbWV0aG9kIG9uIGFuIGV4dGVuZGVkIGpxdWVyeSB1aSBjbGFzcy5cbiAqIEBtZXRob2QgY3JlYXRlWE5vZGVVSU1ldGhvZHNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlWE5vZGVVSU1ldGhvZHMoY2xzLCBtZXRob2ROYW1lcykge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IG1ldGhvZE5hbWVzLmxlbmd0aDsgaSsrKVxuXHRcdGNyZWF0ZVhOb2RlVUlNZXRob2QoY2xzLCBtZXRob2ROYW1lc1tpXSk7XG59XG5cbi8qKlxuICogQWNjb3JkaW9uIGNsYXNzLlxuICogQGNsYXNzIEFjY29yZGlvblxuICovXG54bm9kZXVpLkFjY29yZGlvbiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJhY2NvcmRpb25cIik7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuQWNjb3JkaW9uLCBbXG5cdFwiYWN0aXZlXCIsIFwiYW5pbWF0ZVwiLCBcImNvbGxhcHNpYmxlXCIsIFwiZGlzYWJsZWRcIixcblx0XCJldmVudFwiLCBcImhlYWRlclwiLCBcImhlaWdodFN0eWxlXCIsIFwiaWNvbnNcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuQWNjb3JkaW9uLCBbXG5cdFwiZGVzdHJveVwiLCBcImRpc2FibGVcIiwgXCJlbmFibGVcIiwgXCJpbnN0YW5jZVwiLFxuXHRcIm9wdGlvblwiLCBcInJlZnJlc2hcIiwgXCJ3aWRnZXRcIlxuXSk7XG5cbi8qKlxuICogQXV0b2NvbXBsZXRlIGNsYXNzLlxuICogQGNsYXNzIEF1dG9jb21wbGV0ZVxuICovXG54bm9kZXVpLkF1dG9jb21wbGV0ZSA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJhdXRvY29tcGxldGVcIik7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuQXV0b2NvbXBsZXRlLCBbXG5cdFwiYXBwZW5kVG9cIiwgXCJhdXRvRm9jdXNcIiwgXCJkZWxheVwiLCBcImRpc2FibGVkXCIsXG5cdFwibWluTGVuZ3RoXCIsIFwicG9zaXRpb25cIiwgXCJzb3VyY2VcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuQXV0b2NvbXBsZXRlLCBbXG5cdFwiY2xvc2VcIiwgXCJkZXN0cm95XCIsIFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLFxuXHRcImluc3RhbmNlXCIsIFwib3B0aW9uXCIsIFwic2VhcmNoXCIsIFwid2lkZ2V0XCJcbl0pO1xuXG4vKipcbiAqIEJ1dHRvbiBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLkJ1dHRvblxuICovXG54bm9kZXVpLkJ1dHRvbiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJidXR0b25cIiwgeG5vZGUuQnV0dG9uKTtcblxuY3JlYXRlWE5vZGVVSVByb3BlcnRpZXMoeG5vZGV1aS5CdXR0b24sIFtcblx0XCJkaXNhYmxlZFwiLCBcImljb25zXCIsIFwibGFiZWxcIiwgXCJ0ZXh0XCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLkJ1dHRvbiwgW1xuXHRcImRlc3Ryb3lcIiwgXCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsIFwiaW5zdGFuY2VcIixcblx0XCJvcHRpb25cIiwgXCJyZWZyZXNoXCIsIFwid2lkZ2V0XCJcbl0pO1xuXG4vKipcbiAqIEJ1dHRvbnNldCBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLkJ1dHRvbnNldFxuICovXG54bm9kZXVpLkJ1dHRvbnNldCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJidXR0b25zZXRcIik7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuQnV0dG9uc2V0LCBbXG5cdFwiZGlzYWJsZWRcIiwgXCJpdGVtc1wiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5BdXRvY29tcGxldGUsIFtcblx0XCJkZXN0cm95XCIsIFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLCBcImluc3RhbmNlXCIsXG5cdFwib3B0aW9uXCIsIFwicmVmcmVzaFwiLCBcIndpZGdldFwiXG5dKTtcblxuLyoqXG4gKiBTbGlkZXIgY2xhc3MuXG4gKiBAY2xhc3MgeG5vZGV1aS5TbGlkZXJcbiAqL1xueG5vZGV1aS5TbGlkZXIgPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwic2xpZGVyXCIpO1xuXG5jcmVhdGVYTm9kZVVJUHJvcGVydGllcyh4bm9kZXVpLlNsaWRlciwgW1xuXHRcImFuaW1hdGVcIiwgXCJkaXNhYmxlZFwiLCBcIm1heFwiLCBcIm1pblwiLFxuXHRcIm9yaWVudGF0aW9uXCIsIFwicmFuZ2VcIiwgXCJzdGVwXCIsIFwidmFsdWVcIixcblx0XCJ2YWx1ZXNcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuU2xpZGVyLCBbXG5cdFwiZGVzdHJveVwiLCBcImRpc2FibGVcIiwgXCJlbmFibGVcIiwgXCJpbnN0YW5jZVwiLFxuXHRcIm9wdGlvblwiLCBcIndpZGdldFwiIC8qLCBcInZhbHVlXCIsIFwidmFsdWVzXCIgKi9cbl0pO1xuXG4vKipcbiAqIFRhYnMgY2xhc3MuXG4gKiBAY2xhc3MgeG5vZGV1aS5UYWJzXG4gKi9cbnhub2RldWkuVGFicyA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJ0YWJzXCIpO1xuXG5jcmVhdGVYTm9kZVVJUHJvcGVydGllcyh4bm9kZXVpLlRhYnMsIFtcblx0XCJhY3RpdmVcIiwgXCJjb2xsYXBzaWJsZVwiLCBcImRpc2FibGVkXCIsIFwiZXZlbnRcIixcblx0XCJoZWlnaHRTdHlsZVwiLCBcImhpZGVcIiwgXCJzaG93XCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLlRhYnMsIFtcblx0XCJkZXN0cm95XCIsIFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLCBcImluc3RhbmNlXCIsXG5cdFwibG9hZFwiLCBcIm9wdGlvblwiLCBcInJlZnJlc2hcIiwgXCJ3aWRnZXRcIlxuXSk7XG5cbi8qKlxuICogRGF0ZXBpY2tlciBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLkRhdGVwaWNrZXJcbiAqL1xueG5vZGV1aS5EYXRlcGlja2VyID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcImRhdGVwaWNrZXJcIik7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuRGF0ZXBpY2tlciwgW1xuXHRcImFsdEZpZWxkXCIsIFwiYWx0Rm9ybWF0XCIsIFwiYXBwZW5kVGV4dFwiLCBcImF1dG9TaXplXCIsXG5cdFwiYmVmb3JlU2hvd1wiLCBcImJlZm9yZVNob3dEYXlcIiwgXCJidXR0b25JbWFnZVwiLCBcImJ1dHRvbkltYWdlT25seVwiLFxuXHRcImJ1dHRvblRleHRcIiwgXCJjYWxjdWxhdGVXZWVrXCIsIFwiY2hhbmdlTW9udGhcIiwgXCJjaGFuZ2VZZWFyXCIsXG5cdFwiY2xvc2VUZXh0XCIsIFwiY29uc3RyYWluSW5wdXRcIiwgXCJjdXJyZW50VGV4dFwiLCBcImRhdGVGb3JtYXRcIixcblx0XCJkYXlOYW1lc1wiLCBcImRheU5hbWVzTWluXCIsIFwiZGF5TmFtZXNTaG9ydFwiLCBcImRlZmF1bHREYXRlXCIsXG5cdFwiZHVyYXRpb25cIiwgXCJmaXJzdERheVwiLCBcImdvdG9DdXJyZW50XCIsIFwiaGlkZUlmTm9QcmV2TmV4dFwiLFxuXHRcImlzUlRMXCIsIFwibWF4RGF0ZVwiLCBcIm1pbkRhdGVcIiwgXCJtb250aE5hbWVzXCIsXG5cdFwibW9udGhOYW1lc1Nob3J0XCIsIFwibmF2aWdhdGlvbkFzRGF0ZUZvcm1hdFwiLCBcIm5leHRUZXh0XCIsXG5cdFwibnVtYmVyT2ZNb250aHNcIiwgXCJvbkNoYW5nZU1vbnRoWWVhclwiLFxuXHRcIm9uQ2xvc2VcIiwgXCJvblNlbGVjdFwiLCBcInByZXZUZXh0XCIsIFwic2VsZWN0T3RoZXJNb250aHNcIixcblx0XCJzaG9ydFllYXJDdXRvZmZcIiwgXCJzaG93QW5pbVwiLCBcInNob3dCdXR0b25QYW5lbFwiLCBcInNob3dDdXJyZW50QXRQb3NcIixcblx0XCJzaG93TW9udGhBZnRlclllYXJcIiwgXCJzaG93T25cIiwgXCJzaG93T3B0aW9uc1wiLCBcInNob3dPdGhlck1vbnRoc1wiLFxuXHRcInNob3dXZWVrXCIsIFwic3RlcE1vbnRoc1wiLCBcIndlZWtIZWFkZXJcIiwgXCJ5ZWFyUmFuZ2VcIixcblx0XCJ5ZWFyU3VmZml4XCJcbl0pO1xuXG5jcmVhdGVYTm9kZVVJTWV0aG9kcyh4bm9kZXVpLkRhdGVwaWNrZXIsIFtcblx0XCJkZXN0cm95XCIsIFwiZGlhbG9nXCIsIFwiZ2V0RGF0ZVwiLCBcImhpZGVcIixcblx0XCJpc0Rpc2FibGVkXCIsIFwib3B0aW9uXCIsIFwicmVmcmVzaFwiLCBcInNldERhdGVcIixcblx0XCJzaG93XCIsIFwid2lkZ2V0XCJcbl0pO1xuXG4vKipcbiAqIERpYWxvZyBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLkRpYWxvZ1xuICovXG54bm9kZXVpLkRpYWxvZyA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJkaWFsb2dcIik7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuRGlhbG9nLCBbXG5cdFwiYXBwZW5kVG9cIiwgXCJhdXRvT3BlblwiLCBcImJ1dHRvbnNcIiwgXCJjbG9zZU9uRXNjYXBlXCIsXG5cdFwiY2xvc2VUZXh0XCIsIFwiZGlhbG9nQ2xhc3NcIiwgXCJkcmFnZ2FibGVcIiwgXCJoZWlnaHRcIixcblx0XCJoaWRlXCIsIFwibWF4SGVpZ2h0XCIsIFwibWF4V2lkdGhcIiwgXCJtaW5IZWlnaHRcIixcblx0XCJtaW5XaWR0aFwiLCBcIm1vZGFsXCIsIFwicG9zaXRpb25cIiwgXCJyZXNpemFibGVcIixcblx0XCJzaG93XCIsIFwidGl0bGVcIiwgXCJ3aWR0aFwiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5EaWFsb2csIFtcblx0XCJjbG9zZVwiLCBcImRlc3Ryb3lcIiwgXCJpbnN0YW5jZVwiLCBcImlzT3BlblwiLFxuXHRcIm1vdmVUb1RvcFwiLCBcIm9wZW5cIiwgXCJvcHRpb25cIiwgXCJ3aWRnZXRcIlxuXSk7XG5cbi8qKlxuICogTWVudSBjbGFzcy5cbiAqIEBjbGFzcyB4bm9kZXVpLk1lbnVcbiAqL1xueG5vZGV1aS5NZW51ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcIm1lbnVcIiwgeG5vZGUuVWwpO1xuXG5jcmVhdGVYTm9kZVVJUHJvcGVydGllcyh4bm9kZXVpLk1lbnUsIFtcblx0XCJkaXNhYmxlZFwiLCBcImljb25zXCIsIFwiaXRlbXNcIiwgXCJtZW51c1wiLFxuXHRcInBvc2l0aW9uXCIsIFwicm9sZVwiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5NZW51LCBbXG5cdFwiYmx1clwiLCBcImNvbGxhcHNlXCIsIFwiY29sbGFwc2VBbGxcIiwgXCJkZXN0cm95XCIsXG5cdFwiZGlzYWJsZVwiLCBcImVuYWJsZVwiLCBcImV4cGFuZFwiLCBcImZvY3VzXCIsXG5cdFwiaW5zdGFuY2VcIiwgXCJpc0ZpcnN0SXRlbVwiLCBcImlzTGFzdEl0ZW1cIiwgXCJuZXh0XCIsXG5cdFwibmV4dFBhZ2VcIiwgXCJvcHRpb25cIiwgXCJwcmV2aW91c1wiLCBcInByZXZpb3VzUGFnZVwiLFxuXHRcInJlZnJlc2hcIiwgXCJzZWxlY3RcIiwgXCJ3aWRnZXRcIlxuXSk7XG5cbi8qKlxuICogUHJvZ3Jlc3NiYXIgY2xhc3MuXG4gKiBAY2xhc3MgeG5vZGV1aS5Qcm9ncmVzc2JhclxuICovXG54bm9kZXVpLlByb2dyZXNzYmFyID0gY3JlYXRlRXh0ZW5kZWRYTm9kZVVJRWxlbWVudChcInByb2dyZXNzYmFyXCIpO1xuXG5jcmVhdGVYTm9kZVVJUHJvcGVydGllcyh4bm9kZXVpLlByb2dyZXNzYmFyLCBbXG5cdFwiZGlzYWJsZWRcIiwgXCJtYXhcIiwgXCJ2YWx1ZVwiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5Qcm9ncmVzc2JhciwgW1xuXHRcImRlc3Ryb3lcIiwgXCJkaXNhYmxlXCIsIFwiZW5hYmxlXCIsIFwiaW5zdGFuY2VcIixcblx0XCJvcHRpb25cIiwgXCJ3aWRnZXRcIiAvKiwgXCJ2YWx1ZVwiKi9cbl0pO1xuXG4vKipcbiAqIFNlbGVjdG1lbnUgY2xhc3MuXG4gKiBAY2xhc3MgeG5vZGV1aS5TZWxlY3RtZW51XG4gKi9cbnhub2RldWkuU2VsZWN0bWVudSA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVVSUVsZW1lbnQoXCJzZWxlY3RtZW51XCIsIHhub2RlLlNlbGVjdCk7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuU2VsZWN0bWVudSwgW1xuXHRcImFwcGVuZFRvXCIsIFwiZGlzYWJsZWRcIiwgXCJpY29uc1wiLCBcInBvc2l0aW9uXCIsXG5cdFwid2lkdGhcIlxuXSk7XG5cbmNyZWF0ZVhOb2RlVUlNZXRob2RzKHhub2RldWkuU2VsZWN0bWVudSwgW1xuXHRcImNsb3NlXCIsIFwiZGVzdHJveVwiLCBcImRpc2FibGVcIiwgXCJlbmFibGVcIixcblx0XCJpbnN0YW5jZVwiLCBcIm1lbnVXaWRnZXRcIiwgXCJvcGVuXCIsIFwib3B0aW9uXCIsXG5cdFwicmVmcmVzaFwiLCBcIndpZGdldFwiXG5dKTtcblxuLyoqXG4gKiBTcGlubmVyIGNsYXNzLlxuICogQGNsYXNzIHhub2RldWkuU3Bpbm5lclxuICovXG54bm9kZXVpLlNwaW5uZXIgPSBjcmVhdGVFeHRlbmRlZFhOb2RlVUlFbGVtZW50KFwic3Bpbm5lclwiLCB4bm9kZS5JbnB1dCk7XG5cbmNyZWF0ZVhOb2RlVUlQcm9wZXJ0aWVzKHhub2RldWkuU3Bpbm5lciwgW1xuXHRcImN1bHR1cmVcIiwgXCJkaXNhYmxlZFwiLCBcImljb25zXCIsIFwiaW5jcmVtZW50YWxcIixcblx0XCJtYXhcIiwgXCJtaW5cIiwgXCJudW1iZXJGb3JtYXRcIiwgXCJwYWdlXCIsXG5cdFwic3RlcFwiXG5dKTtcblxuY3JlYXRlWE5vZGVVSU1ldGhvZHMoeG5vZGV1aS5TcGlubmVyLCBbXG5cdFwiZGVzdHJveVwiLCBcImRpc2FibGVcIiwgXCJlbmFibGVcIiwgXCJpbnN0YW5jZVwiLFxuXHRcImlzVmFsaWRcIiwgXCJvcHRpb25cIiwgXCJwYWdlRG93blwiLCBcInBhZ2VVcFwiLFxuXHRcInN0ZXBEb3duXCIsIFwic3RlcFVwXCIsIFwidmFsdWVcIiwgXCJ3aWRnZXRcIlxuXSk7XG5cbm1vZHVsZS5leHBvcnRzID0geG5vZGV1aTsiLCJ2YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgQXBwVmlldyA9IHJlcXVpcmUoXCIuLi92aWV3L0FwcFZpZXdcIik7XG52YXIgQXBwTW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWwvQXBwTW9kZWxcIik7XG52YXIgQXBwQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuLi9jb250cm9sbGVyL0FwcENvbnRyb2xsZXJcIik7XG5cbi8qKlxuICogVGhlIG1haW4gcmVzb3VyY2UgZmlkZGxlIGFwcCBjbGFzcy5cbiAqIEBjbGFzcyBBcHBcbiAqL1xuZnVuY3Rpb24gQXBwKCkge1xuXHR4bm9kZS5EaXYuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHR0aGlzLnN0eWxlLnRvcCA9IDA7XG5cdHRoaXMuc3R5bGUuYm90dG9tID0gMDtcblx0dGhpcy5zdHlsZS5sZWZ0ID0gMDtcblx0dGhpcy5zdHlsZS5yaWdodCA9IDA7XG5cblx0dGhpcy5hcHBWaWV3ID0gbmV3IEFwcFZpZXcoKTtcblx0dGhpcy5hcHBNb2RlbCA9IG5ldyBBcHBNb2RlbCgpO1xuXHR0aGlzLmFwcENvbnRyb2xsZXIgPSBuZXcgQXBwQ29udHJvbGxlcih0aGlzLmFwcE1vZGVsLCB0aGlzLmFwcFZpZXcpO1xuXG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5hcHBWaWV3KTtcbn1cblxuaW5oZXJpdHMoQXBwLCB4bm9kZS5EaXYpO1xuXG4vKipcbiAqIEdldCBtb2RlbC5cbiAqIEBtZXRob2QgZ2V0TW9kZWxcbiAqL1xuQXBwLnByb3RvdHlwZS5nZXRNb2RlbCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5hcHBNb2RlbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHA7IiwidmFyIFJlc291cmNlUGFuZVRhYkhlYWRlckNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVBhbmVUYWJIZWFkZXJDb250cm9sbGVyXCIpO1xuXG4vKipcbiAqIEFwcCBjb250cm9sbGVyXG4gKiBAY2xhc3MgQXBwQ29udHJvbGxlclxuICovXG5mdW5jdGlvbiBBcHBDb250cm9sbGVyKGFwcE1vZGVsLCBhcHBWaWV3KSB7XG5cdHRoaXMuYXBwTW9kZWwgPSBhcHBNb2RlbDtcblx0dGhpcy5hcHBWaWV3ID0gYXBwVmlldztcblxuXHR0aGlzLmFwcFZpZXcuZ2V0UmVzb3VyY2VQYW5lVmlldygpLnNldFRhYnNDb2xsZWN0aW9uKHRoaXMuYXBwTW9kZWwuZ2V0Q2F0ZWdvcnlDb2xsZWN0aW9uKCkpO1xuXHR0aGlzLmFwcFZpZXcuZ2V0UmVzb3VyY2VQYW5lVmlldygpLmdldFRhYnNIZWFkZXJNYW5hZ2VyKCkuc2V0SXRlbUNvbnRyb2xsZXJDbGFzcyhSZXNvdXJjZVBhbmVUYWJIZWFkZXJDb250cm9sbGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBDb250cm9sbGVyOyIsImZ1bmN0aW9uIFJlc291cmNlUGFuZVRhYkhlYWRlckNvbnRyb2xsZXIodGFiSGVhZGVyVmlldykge1xuXHR0aGlzLnRhYkhlYWRlclZpZXcgPSB0YWJIZWFkZXJWaWV3O1xufVxuXG5SZXNvdXJjZVBhbmVUYWJIZWFkZXJDb250cm9sbGVyLnByb3RvdHlwZS5zZXREYXRhID0gZnVuY3Rpb24oY2F0ZWdvcnlNb2RlbCkge1xuXHRpZiAoY2F0ZWdvcnlNb2RlbCkge1xuXHRcdHRoaXMudGFiSGVhZGVyVmlldy5zZXRMYWJlbChjYXRlZ29yeU1vZGVsLmdldExhYmVsKCkpO1xuXHRcdHRoaXMudGFiSGVhZGVyVmlldy5zZXRUYXJnZXRJZChjYXRlZ29yeU1vZGVsLmdldElkKCkpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VQYW5lVGFiSGVhZGVyQ29udHJvbGxlcjsiLCJmaWRkbGV1aSA9IHtcblx0QXBwOiByZXF1aXJlKFwiLi9hcHAvQXBwXCIpLFxuXHRDYXRlZ29yeU1vZGVsOiByZXF1aXJlKFwiLi9tb2RlbC9DYXRlZ29yeU1vZGVsXCIpXG59OyIsInZhciB4bm9kZWMgPSByZXF1aXJlKFwieG5vZGVjb2xsZWN0aW9uXCIpO1xuXG4vKipcbiAqIEFwcE1vZGVsXG4gKiBAY2xhc3MgQXBwTW9kZWxcbiAqL1xuZnVuY3Rpb24gQXBwTW9kZWwoKSB7XG5cdHRoaXMuY2F0ZWdvcnlDb2xsZWN0aW9uID0gbmV3IHhub2RlYy5Db2xsZWN0aW9uKCk7XG5cblx0dGhpcy5pZENvdW50ID0gMDtcbn1cblxuLyoqXG4gKiBHZXQgY2F0ZWdvcnkgY29sbGVjdGlvbi5cbiAqIEBtZXRob2QgZ2V0Q2F0ZWdvcnlDb2xsZWN0aW9uXG4gKi9cbkFwcE1vZGVsLnByb3RvdHlwZS5nZXRDYXRlZ29yeUNvbGxlY3Rpb24gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY2F0ZWdvcnlDb2xsZWN0aW9uO1xufVxuXG4vKipcbiAqIEdldCBzb21ldGhpbmcgdXNhYmxlIGZvciBhIHVuaXF1ZSBpZC5cbiAqIEBtZXRob2QgZ2V0TmV4dElkXG4gKi9cbkFwcE1vZGVsLnByb3RvdHlwZS5nZXROZXh0SWQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5pZENvdW50Kys7XG5cblx0cmV0dXJuIFwiZWxlbVwiICsgdGhpcy5pZENvdW50O1xufVxuXG4vKipcbiAqIEFkZCBjYXRlZ29yeSBtb2RlbC5cbiAqIEBtZXRob2QgYWRkQ2F0ZWdvcnlNb2RlbFxuICovXG5BcHBNb2RlbC5wcm90b3R5cGUuYWRkQ2F0ZWdvcnlNb2RlbCA9IGZ1bmN0aW9uKGNhdGVnb3J5TW9kZWwpIHtcblx0Y2F0ZWdvcnlNb2RlbC5zZXRQYXJlbnRNb2RlbCh0aGlzKTtcblx0dGhpcy5jYXRlZ29yeUNvbGxlY3Rpb24uYWRkSXRlbShjYXRlZ29yeU1vZGVsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBNb2RlbDsiLCJ2YXIgQXBwTW9kZWwgPSByZXF1aXJlKFwiLi9BcHBNb2RlbFwiKTtcblxuLyoqXG4gKiBHZXQgY2F0ZWdvcnkgbW9kZWwuXG4gKiBAY2xhc3MgQ2F0ZWdvcnlNb2RlbFxuICovXG5mdW5jdGlvbiBDYXRlZ29yeU1vZGVsKGxhYmVsKSB7XG5cdHRoaXMubGFiZWwgPSBsYWJlbDtcblx0dGhpcy5wYXJlbnRNb2RlbCA9IG51bGw7XG59XG5cbi8qKlxuICogU2V0IHJlZmVyZW5jZSB0byBwYXJlbnQgbW9kZWwuXG4gKiBAbWV0aG9kIGdldFBhcmVudE1vZGVsXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLnNldFBhcmVudE1vZGVsID0gZnVuY3Rpb24odmFsdWUpIHtcblx0Y29uc29sZS5sb2coXCJzZXR0aW5nIHBhcmVudDogXCIgKyB2YWx1ZSk7XG5cdHRoaXMucGFyZW50TW9kZWwgPSB2YWx1ZTtcbn1cblxuLyoqXG4gKiBHZXQgbGFiZWwuXG4gKiBAbWV0aG9kIGdldExhYmVsXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLmdldExhYmVsID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmxhYmVsO1xufVxuXG4vKipcbiAqIEdldCBpZC5cbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuZ2V0SWQgPSBmdW5jdGlvbigpIHtcblx0aWYgKCF0aGlzLmlkKVxuXHRcdHRoaXMuaWQgPSB0aGlzLmdldEFwcE1vZGVsKCkuZ2V0TmV4dElkKCk7XG5cblx0cmV0dXJuIHRoaXMuaWQ7XG59XG5cbi8qKlxuICogR2V0IHJlZmVyZW5jZSB0byBhcHAgbW9kZWwuXG4gKiBAbWV0aG9kIGdldEFwcE1vZGVsXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLmdldEFwcE1vZGVsID0gZnVuY3Rpb24oKSB7XG5cdGlmICghdGhpcy5wYXJlbnRNb2RlbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ0aGVyZSBpcyBubyBwYXJlbnQhXCIpO1xuXG5cdHZhciBwID0gdGhpcy5wYXJlbnRNb2RlbDtcblxuXHR3aGlsZSAocCAmJiAhKHAgaW5zdGFuY2VvZiBBcHBNb2RlbCkpXG5cdFx0cCA9IHAucGFyZW50TW9kZWw7XG5cblx0cmV0dXJuIHA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2F0ZWdvcnlNb2RlbDsiLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgeG5vZGV1aSA9IHJlcXVpcmUoXCJ4bm9kZXVpXCIpO1xudmFyIFJlc291cmNlUGFuZVZpZXcgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVBhbmVWaWV3XCIpO1xuXG4vKipcbiAqIE1haW4gYXBwbGljYXRpb24gdmlldy5cbiAqIEBjbGFzcyBBcHBWaWV3XG4gKi9cbmZ1bmN0aW9uIEFwcFZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMuc3R5bGUudG9wID0gMDtcblx0dGhpcy5zdHlsZS5sZWZ0ID0gMDtcblx0dGhpcy5zdHlsZS5yaWdodCA9IDA7XG5cdHRoaXMuc3R5bGUuYm90dG9tID0gMDtcblxuXHR0aGlzLnJlc291cmNlUGFuZVZpZXcgPSBuZXcgUmVzb3VyY2VQYW5lVmlldygpO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMucmVzb3VyY2VQYW5lVmlldyk7XG59XG5cbmluaGVyaXRzKEFwcFZpZXcsIHhub2RlLkRpdik7XG5cbkFwcFZpZXcucHJvdG90eXBlLmdldFJlc291cmNlUGFuZVZpZXcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMucmVzb3VyY2VQYW5lVmlldztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBWaWV3OyIsInZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcblxuZnVuY3Rpb24gUmVzb3VyY2VQYW5lVGFiQ29udGVudFZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZVBhbmVUYWJDb250ZW50VmlldywgeG5vZGUuRGl2KTtcblxuUmVzb3VyY2VQYW5lVGFiQ29udGVudFZpZXcucHJvdG90eXBlLnNldERhdGEgPSBmdW5jdGlvbihkYXRhKSB7XG5cdGlmIChkYXRhKSB7XG5cdFx0dGhpcy5pZCA9IGRhdGEuaWQ7XG5cblx0XHR0aGlzLmlubmVySFRNTCA9IFwiaGVsbG8gd29ybGQ6IFwiICsgZGF0YS5sYWJlbDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlUGFuZVRhYkNvbnRlbnRWaWV3OyIsInZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcblxuZnVuY3Rpb24gUmVzb3VyY2VQYW5lVGFiSGVhZGVyVmlldygpIHtcblx0eG5vZGUuTGkuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnRhcmdldElkID0gbnVsbDtcblx0dGhpcy5sYWJlbCA9IG51bGw7XG59XG5cbmluaGVyaXRzKFJlc291cmNlUGFuZVRhYkhlYWRlclZpZXcsIHhub2RlLkxpKTtcblxuUmVzb3VyY2VQYW5lVGFiSGVhZGVyVmlldy5wcm90b3R5cGUuc2V0VGFyZ2V0SWQgPSBmdW5jdGlvbihpZCkge1xuXHR0aGlzLnRhcmdldElkID0gaWQ7XG5cdHRoaXMucmVmcmVzaCgpO1xufVxuXG5SZXNvdXJjZVBhbmVUYWJIZWFkZXJWaWV3LnByb3RvdHlwZS5zZXRMYWJlbCA9IGZ1bmN0aW9uKGxhYmVsKSB7XG5cdHRoaXMubGFiZWwgPSBsYWJlbDtcblx0dGhpcy5yZWZyZXNoKCk7XG59XG5cblJlc291cmNlUGFuZVRhYkhlYWRlclZpZXcucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMubGFiZWwgJiYgdGhpcy50YXJnZXRJZCkge1xuXHRcdGNvbnNvbGUubG9nKFwic2V0dGluZyBpbm5lciwgbGFiZWw9XCIgKyB0aGlzLmxhYmVsICsgXCIgaWQ6IFwiICsgdGhpcy50YXJnZXRJZCk7XG5cdFx0dGhpcy5pbm5lckhUTUwgPSBcIjxhIGhyZWY9JyNcIiArIHRoaXMudGFyZ2V0SWQgKyBcIic+XCIgKyB0aGlzLmxhYmVsICsgXCI8L2E+XCI7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZVBhbmVUYWJIZWFkZXJWaWV3OyIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciB4bm9kZXVpID0gcmVxdWlyZShcInhub2RldWlcIik7XG52YXIgeG5vZGVjID0gcmVxdWlyZShcInhub2RlY29sbGVjdGlvblwiKTtcbnZhciBSZXNvdXJjZVBhbmVUYWJIZWFkZXJWaWV3ID0gcmVxdWlyZShcIi4vUmVzb3VyY2VQYW5lVGFiSGVhZGVyVmlld1wiKTtcbnZhciBSZXNvdXJjZVBhbmVUYWJDb250ZW50VmlldyA9IHJlcXVpcmUoXCIuL1Jlc291cmNlUGFuZVRhYkNvbnRlbnRWaWV3XCIpO1xuXG4vKipcbiAqIFRoZSBsZWZ0IHBhcnQgb2YgdGhlIGFwcCwgc2hvd2luZyB0aGUgcmVzb3VyY2VzLlxuICogQGNsYXNzIFJlc291cmNlUGFuZVZpZXdcbiAqL1xuZnVuY3Rpb24gUmVzb3VyY2VQYW5lVmlldygpIHtcblx0eG5vZGUuRGl2LmNhbGwodGhpcyk7XG5cblx0dGhpcy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0dGhpcy5zdHlsZS50b3AgPSAwO1xuXHR0aGlzLnN0eWxlLmxlZnQgPSAwO1xuXHR0aGlzLnN0eWxlLndpZHRoID0gXCI1MCVcIjtcblx0dGhpcy5zdHlsZS5ib3R0b20gPSAwO1xuXG5cdHRoaXMudGFicyA9IG5ldyB4bm9kZXVpLlRhYnMoKTtcblx0dGhpcy50YWJzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHR0aGlzLnRhYnMuc3R5bGUubGVmdCA9IDEwO1xuXHR0aGlzLnRhYnMuc3R5bGUucmlnaHQgPSA1O1xuXHR0aGlzLnRhYnMuc3R5bGUudG9wID0gMTA7XG5cdHRoaXMudGFicy5zdHlsZS5ib3R0b20gPSAxMDtcblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLnRhYnMpO1xuXG5cdHRoaXMudGFic0hlYWRlck1hbmFnZXIgPSBuZXcgeG5vZGVjLkNvbGxlY3Rpb25WaWV3TWFuYWdlcih0aGlzLnRhYnMudWwpO1xuXHR0aGlzLnRhYnNIZWFkZXJNYW5hZ2VyLnNldEl0ZW1SZW5kZXJlckNsYXNzKFJlc291cmNlUGFuZVRhYkhlYWRlclZpZXcpO1xuXG5cdHRoaXMudGFic0NvbnRlbnRNYW5hZ2VyID0gbmV3IHhub2RlYy5Db2xsZWN0aW9uVmlld01hbmFnZXIodGhpcy50YWJzKTtcblx0dGhpcy50YWJzQ29udGVudE1hbmFnZXIuc2V0SXRlbVJlbmRlcmVyQ2xhc3MoUmVzb3VyY2VQYW5lVGFiQ29udGVudFZpZXcpO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZVBhbmVWaWV3LCB4bm9kZS5EaXYpO1xuXG4vKipcbiAqIFNldCB0YWJzIGNvbGxlY3Rpb24uXG4gKi9cblJlc291cmNlUGFuZVZpZXcucHJvdG90eXBlLnNldFRhYnNDb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuXHR0aGlzLnRhYnNIZWFkZXJNYW5hZ2VyLnNldERhdGFTb3VyY2UoY29sbGVjdGlvbik7XG5cdHRoaXMudGFic0NvbnRlbnRNYW5hZ2VyLnNldERhdGFTb3VyY2UoY29sbGVjdGlvbik7XG5cblx0dmFyIHNjb3BlPXRoaXM7XG5cblx0Y29sbGVjdGlvbi5vbihcImNoYW5nZVwiLGZ1bmN0aW9uKCkge1xuXHRcdHNjb3BlLnRhYnMucmVmcmVzaCgpO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBHZXQgdGFicyBoZWFkZXIgbWFuYWdlci5cbiAqIEBtZXRob2QgZ2V0VGFic0hlYWRlck1hbmFnZXJcbiAqL1xuUmVzb3VyY2VQYW5lVmlldy5wcm90b3R5cGUuZ2V0VGFic0hlYWRlck1hbmFnZXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudGFic0hlYWRlck1hbmFnZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VQYW5lVmlldzsiXX0=
