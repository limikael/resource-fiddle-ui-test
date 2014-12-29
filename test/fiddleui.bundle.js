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
	createXNodeReadWriteProperty("value");
	createXNodeReadWriteProperty("type");
	createXNodeReadWriteProperty("className");

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
	target.Nav = createExtendedXNodeElement("nav");
})();
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{"inherits":1,"yaed":3}],5:[function(require,module,exports){
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
},{"./CollectionViewManager":6,"inherits":1,"xnode":2,"yaed":3}],6:[function(require,module,exports){
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
},{"inherits":1,"xnode":2,"yaed":3}],7:[function(require,module,exports){
module.exports = {
	Collection: require("./Collection"),
	CollectionView: require("./CollectionView"),
	CollectionViewManager: require("./CollectionViewManager")
};
},{"./Collection":4,"./CollectionView":5,"./CollectionViewManager":6}],8:[function(require,module,exports){
module.exports=require(3)
},{"/home/micke/repo/resource-fiddle-ui-test/node_modules/xnodecollection/node_modules/yaed/src/EventDispatcher.js":3}],9:[function(require,module,exports){
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
},{"../controller/AppController":10,"../model/AppModel":14,"../view/AppView":16,"inherits":1,"xnode":2}],10:[function(require,module,exports){
var ResourceTabHeaderController = require("./ResourceTabHeaderController");
var ResourceTabController = require("./ResourceTabController");

/**
 * App controller
 * @class AppController
 */
function AppController(appModel, appView) {
	this.appModel = appModel;
	this.appView = appView;

	this.appView.getResourcePaneView().setTabsCollection(this.appModel.getCategoryCollection());

	this.appView.getResourcePaneView().getTabsHeaderManager().setItemControllerClass(ResourceTabHeaderController);
	this.appView.getResourcePaneView().getTabsManager().setItemControllerClass(ResourceTabController);
}

module.exports = AppController;
},{"./ResourceTabController":11,"./ResourceTabHeaderController":12}],11:[function(require,module,exports){
function ResourceTabController(tabView) {
	this.tabView = tabView;
}

ResourceTabController.prototype.setData = function(categoryModel) {
	if (this.categoryModel) {
		this.categoryModel.off("change", this.onCategoryModelChange, this);
	}

	this.categoryModel = categoryModel;

	if (this.categoryModel) {
		this.categoryModel.on("change", this.onCategoryModelChange, this);
		this.tabView.setActive(categoryModel.isActive());

		this.tabView.setLabel(categoryModel.getLabel());
	}
}

ResourceTabController.prototype.onCategoryModelChange = function() {
	this.tabView.setActive(this.categoryModel.isActive());
}

module.exports = ResourceTabController;
},{}],12:[function(require,module,exports){
function ResourceTabHeaderController(tabHeaderView) {
	this.tabHeaderView = tabHeaderView;
	this.tabHeaderView.addEventListener("click", this.onTabHeaderViewClick.bind(this));
}

ResourceTabHeaderController.prototype.setData = function(categoryModel) {
	if (this.categoryModel) {
		this.categoryModel.off("change", this.onCategoryModelChange, this);
	}

	this.categoryModel = categoryModel;

	if (this.categoryModel) {
		this.categoryModel.on("change", this.onCategoryModelChange, this);
		this.tabHeaderView.setLabel(categoryModel.getLabel());
		this.tabHeaderView.setActive(categoryModel.isActive());
	}
}

ResourceTabHeaderController.prototype.onTabHeaderViewClick = function() {
	this.categoryModel.setActive(true);
}

ResourceTabHeaderController.prototype.onCategoryModelChange = function() {
	this.tabHeaderView.setActive(this.categoryModel.isActive());
}

module.exports = ResourceTabHeaderController;
},{}],13:[function(require,module,exports){
fiddleui = {
	App: require("./app/App"),
	CategoryModel: require("./model/CategoryModel")
};
},{"./app/App":9,"./model/CategoryModel":15}],14:[function(require,module,exports){
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
 * Add category model.
 * @method addCategoryModel
 */
AppModel.prototype.addCategoryModel = function(categoryModel) {
	categoryModel.setParentModel(this);
	this.categoryCollection.addItem(categoryModel);

	if (this.categoryCollection.getLength() == 1)
		categoryModel.setActive(true);
}

module.exports = AppModel;
},{"xnodecollection":7}],15:[function(require,module,exports){
var AppModel = require("./AppModel");
var EventDispatcher = require("yaed");
var inherits = require("inherits");

/**
 * Get category model.
 * @class CategoryModel
 */
function CategoryModel(label) {
	this.label = label;
	this.parentModel = null;
	this.active = false;
}

inherits(CategoryModel, EventDispatcher);

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

/**
 * Set active state.
 * @method setActive
 */
CategoryModel.prototype.setActive = function(value) {
	if (value == this.active)
		return;

	var siblings = this.parentModel.getCategoryCollection();

	for (var i = 0; i < siblings.getLength(); i++)
		if (siblings.getItemAt(i) != this)
			siblings.getItemAt(i).setActive(false);

	this.active = value;
	this.trigger("change");
}

/**
 * Is this category the active one?
 * @method isActive
 */
CategoryModel.prototype.isActive = function() {
	return this.active;
}

module.exports = CategoryModel;
},{"./AppModel":14,"inherits":1,"yaed":8}],16:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");
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
},{"./ResourcePaneView":17,"inherits":1,"xnode":2}],17:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");
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
	this.style.top = "10px";
	this.style.left = "10px";
	this.style.width = "50%";
	this.style.bottom = "10px";

	this.tabHeaders = new xnodec.CollectionView();
	this.tabHeaders.className = "ui top attached tabular menu";
	this.tabHeaders.setItemRendererClass(ResourceTabHeaderView);
	this.appendChild(this.tabHeaders);

	this.tabsManager = new xnodec.CollectionViewManager(this);
	this.tabsManager.setItemRendererClass(ResourceTabView);

	/*	this.tabs = new xnodeui.Tabs();
		this.tabs.style.position = "absolute";
		this.tabs.style.left = 10;
		this.tabs.style.right = 5;
		this.tabs.style.top = 10;
		this.tabs.style.bottom = 10;
		this.appendChild(this.tabs);

		this.tabsHeaderManager = new xnodec.CollectionViewManager(this.tabs.ul);
		this.tabsHeaderManager.setItemRendererClass(ResourceTabHeaderView);

		this.tabsContentManager = new xnodec.CollectionViewManager(this.tabs);
		this.tabsContentManager.setItemRendererClass(ResourceTabView);*/
}

inherits(ResourcePaneView, xnode.Div);

/**
 * Set tabs collection.
 */
ResourcePaneView.prototype.setTabsCollection = function(collection) {
	this.tabHeaders.setDataSource(collection);
	this.tabsManager.setDataSource(collection);

	/*	this.tabsContentManager.setDataSource(collection);

		var scope=this;

		collection.on("change",function() {
			scope.tabs.refresh();
		});*/
}

/**
 * Get tabs header manager.
 * @method getTabsHeaderManager
 */
ResourcePaneView.prototype.getTabsHeaderManager = function() {
	return this.tabHeaders;
}

/**
 * Get tabs header manager.
 * @method getTabsManager
 */
ResourcePaneView.prototype.getTabsManager = function() {
	return this.tabsManager;
}

module.exports = ResourcePaneView;
},{"./ResourceTabHeaderView":18,"./ResourceTabView":19,"inherits":1,"xnode":2,"xnodecollection":7}],18:[function(require,module,exports){
var xnode = require("xnode");
var inherits = require("inherits");

function ResourceTabHeaderView() {
	xnode.A.call(this);
	this.className = "item";
}

inherits(ResourceTabHeaderView, xnode.A);

ResourceTabHeaderView.prototype.setLabel = function(label) {
	this.innerHTML = label;
}

ResourceTabHeaderView.prototype.setActive = function(active) {
	if (active)
		this.className = "active item";

	else
		this.className = "item";
}

module.exports = ResourceTabHeaderView;
},{"inherits":1,"xnode":2}],19:[function(require,module,exports){
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
},{"inherits":1,"xnode":2}]},{},[13])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy94bm9kZS9zcmMveG5vZGUuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL25vZGVfbW9kdWxlcy95YWVkL3NyYy9FdmVudERpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3hub2RlY29sbGVjdGlvbi9zcmMvQ29sbGVjdGlvblZpZXcuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uVmlld01hbmFnZXIuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9pbmRleC5qcyIsInNyYy9hcHAvQXBwLmpzIiwic3JjL2NvbnRyb2xsZXIvQXBwQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL1Jlc291cmNlVGFiQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL1Jlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlci5qcyIsInNyYy9maWRkbGV1aS5qcyIsInNyYy9tb2RlbC9BcHBNb2RlbC5qcyIsInNyYy9tb2RlbC9DYXRlZ29yeU1vZGVsLmpzIiwic3JjL3ZpZXcvQXBwVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlUGFuZVZpZXcuanMiLCJzcmMvdmlldy9SZXNvdXJjZVRhYkhlYWRlclZpZXcuanMiLCJzcmMvdmlldy9SZXNvdXJjZVRhYlZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIoZnVuY3Rpb24oKSB7XG5cdC8qKlxuXHQgKiBUaGUgYmFzaWMgeG5vZGUgY2xhc3MuXG5cdCAqIEl0IHNldHMgdGhlIHVuZGVybHlpbmcgbm9kZSBlbGVtZW50IGJ5IGNhbGxpbmdcblx0ICogZG9jdW1lbnQuY3JlYXRlRWxlbWVudFxuXHQgKi9cblx0ZnVuY3Rpb24gWE5vZGUodHlwZSwgY29udGVudCkge1xuXHRcdHRoaXMubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cblx0XHRpZiAoY29udGVudCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0dGhpcy5ub2RlLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBtZXRob2QgY3JlYXRlcyBhbiBleHRlbmRlZCBjbGFzcyB1c2luZ1xuXHQgKiB0aGUgWE5vZGUgY2xhc3MgZGVmaW5lZCBhYm92ZS5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KGVsZW1lbnRUeXBlLCBjb250ZW50KSB7XG5cdFx0dmFyIGYgPSBmdW5jdGlvbihjb250ZW50KSB7XG5cdFx0XHRYTm9kZS5jYWxsKHRoaXMsIGVsZW1lbnRUeXBlLCBjb250ZW50KTtcblx0XHR9O1xuXG5cdFx0Zi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFhOb2RlLnByb3RvdHlwZSk7XG5cdFx0Zi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBmO1xuXG5cdFx0cmV0dXJuIGY7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcmVhZCBvbmx5IHByb3BlcnR5IHRoYXQgcmV0dXJucyB0aGVcblx0ICogdmFsdWUgb2YgdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgb2YgdGhlXG5cdCAqIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZVJlYWRPbmx5UHJvcGVydHkocHJvcGVydHlOYW1lKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFhOb2RlLnByb3RvdHlwZSwgcHJvcGVydHlOYW1lLCB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5ub2RlW3Byb3BlcnR5TmFtZV07XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcmVhZCB3cml0ZSBwcm9wZXJ0eSB0aGF0IG9wZXJhdGVzIG9uXG5cdCAqIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5IG9mIHRoZSB1bmRlcmx5aW5nXG5cdCAqIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoWE5vZGUucHJvdG90eXBlLCBwcm9wZXJ0eU5hbWUsIHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm5vZGVbcHJvcGVydHlOYW1lXTtcblx0XHRcdH0sXG5cblx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0dGhpcy5ub2RlW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBtZXRob2QgdGhhdCByb3V0ZXMgdGhlIGNhbGwgdGhyb3VnaCwgZG93blxuXHQgKiB0byB0aGUgc2FtZSBtZXRob2Qgb24gdGhlIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZU1ldGhvZChtZXRob2ROYW1lKSB7XG5cdFx0WE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5ub2RlW21ldGhvZE5hbWVdLmFwcGx5KHRoaXMubm9kZSwgYXJndW1lbnRzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogTW9kaWZ5IHRoZSBOb2RlLnByb3BlcnR5IGZ1bmN0aW9uLCBzbyB0aGF0IGl0IGFjY2VwdHNcblx0ICogWE5vZGUgb2JqZWN0cy4gQWxsIFhOb2RlIG9iamVjdHMgd2lsbCBiZSBjaGFuZ2VkIHRvXG5cdCAqIHRoZSB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0cywgYW5kIHRoZSBjb3JyZXNwb25kaW5nXG5cdCAqIG1ldGhvZCB3aWxsIGJlIGNhbGxlZC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZU5vZGVUb1hOb2RlTWV0aG9kV3JhcHBlcihtZXRob2ROYW1lKSB7XG5cdFx0dmFyIG9yaWdpbmFsRnVuY3Rpb24gPSBOb2RlLnByb3RvdHlwZVttZXRob2ROYW1lXTtcblxuXHRcdE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRmb3IgKHZhciBhIGluIGFyZ3VtZW50cykge1xuXHRcdFx0XHRpZiAoYXJndW1lbnRzW2FdIGluc3RhbmNlb2YgWE5vZGUpXG5cdFx0XHRcdFx0YXJndW1lbnRzW2FdID0gYXJndW1lbnRzW2FdLm5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB1cCByZWFkIG9ubHkgcHJvcGVydGllcy5cblx0ICovXG5cdGNyZWF0ZVhOb2RlUmVhZE9ubHlQcm9wZXJ0eShcInN0eWxlXCIpO1xuXG5cdC8qKlxuXHQgKiBTZXQgdXAgcmVhZC93cml0ZSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImlubmVySFRNTFwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImhyZWZcIik7XG5cdGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkoXCJpZFwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcInZhbHVlXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwidHlwZVwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImNsYXNzTmFtZVwiKTtcblxuXHQvKipcblx0ICogU2V0IHVwIG1ldGhvZHMgdG8gYmUgcm91dGVkIHRvIHRoZSB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJhcHBlbmRDaGlsZFwiKTtcblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJyZW1vdmVDaGlsZFwiKTtcblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJhZGRFdmVudExpc3RlbmVyXCIpO1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcInJlbW92ZUV2ZW50TGlzdGVuZXJcIik7XG5cblx0LyoqXG5cdCAqIFNldCB1cCBtZXRob2RzIG9uIE5vZGUucHJvcGVydHkuXG5cdCAqL1xuXHRjcmVhdGVOb2RlVG9YTm9kZU1ldGhvZFdyYXBwZXIoXCJhcHBlbmRDaGlsZFwiKTtcblx0Y3JlYXRlTm9kZVRvWE5vZGVNZXRob2RXcmFwcGVyKFwicmVtb3ZlQ2hpbGRcIik7XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBldmVudCBsaXN0ZW5lciBhbGlhc2VzLlxuXHQgKi9cblx0WE5vZGUucHJvdG90eXBlLm9uID0gWE5vZGUucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cdFhOb2RlLnByb3RvdHlwZS5vZmYgPSBYTm9kZS5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblxuXHQvKipcblx0ICogV29yayBib3RoIGFzIGEgbnBtIG1vZHVsZSBhbmQgc3RhbmRhbG9uZS5cblx0ICovXG5cdHZhciB0YXJnZXQ7XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IHRhcmdldDtcblx0fSBlbHNlIHtcblx0XHR4bm9kZSA9IHt9O1xuXHRcdHRhcmdldCA9IHhub2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBleHRlbmRlZCBjbGFzc2VzLlxuXHQgKi9cblx0dGFyZ2V0LkRpdiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwiZGl2XCIpO1xuXHR0YXJnZXQuQnV0dG9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdHRhcmdldC5VbCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwidWxcIik7XG5cdHRhcmdldC5MaSA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwibGlcIik7XG5cdHRhcmdldC5BID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJhXCIpO1xuXHR0YXJnZXQuT3B0aW9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJvcHRpb25cIik7XG5cdHRhcmdldC5TZWxlY3QgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcInNlbGVjdFwiKTtcblx0dGFyZ2V0LklucHV0ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJpbnB1dFwiKTtcblx0dGFyZ2V0Lk5hdiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwibmF2XCIpO1xufSkoKTsiLCIvKipcbiAqIEFTMy9qcXVlcnkgc3R5bGUgZXZlbnQgZGlzcGF0Y2hlci4gU2xpZ2h0bHkgbW9kaWZpZWQuIFRoZVxuICoganF1ZXJ5IHN0eWxlIG9uL29mZi90cmlnZ2VyIHN0eWxlIG9mIGFkZGluZyBsaXN0ZW5lcnMgaXNcbiAqIGN1cnJlbnRseSB0aGUgcHJlZmVycmVkIG9uZS5cbiAqXG4gKiBUaGUgb24gbWV0aG9kIGZvciBhZGRpbmcgbGlzdGVuZXJzIHRha2VzIGFuIGV4dHJhIHBhcmFtZXRlciB3aGljaCBpcyB0aGVcbiAqIHNjb3BlIGluIHdoaWNoIGxpc3RlbmVycyBzaG91bGQgYmUgY2FsbGVkLiBTbyB0aGlzOlxuICpcbiAqICAgICBvYmplY3Qub24oXCJldmVudFwiLCBsaXN0ZW5lciwgdGhpcyk7XG4gKlxuICogSGFzIHRoZSBzYW1lIGZ1bmN0aW9uIHdoZW4gYWRkaW5nIGV2ZW50cyBhczpcbiAqXG4gKiAgICAgb2JqZWN0Lm9uKFwiZXZlbnRcIiwgbGlzdGVuZXIuYmluZCh0aGlzKSk7XG4gKlxuICogSG93ZXZlciwgdGhlIGRpZmZlcmVuY2UgaXMgdGhhdCBpZiB3ZSB1c2UgdGhlIHNlY29uZCBtZXRob2QgaXRcbiAqIHdpbGwgbm90IGJlIHBvc3NpYmxlIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXJzIGxhdGVyLCB1bmxlc3NcbiAqIHRoZSBjbG9zdXJlIGNyZWF0ZWQgYnkgYmluZCBpcyBzdG9yZWQgc29tZXdoZXJlLiBJZiB0aGVcbiAqIGZpcnN0IG1ldGhvZCBpcyB1c2VkLCB3ZSBjYW4gcmVtb3ZlIHRoZSBsaXN0ZW5lciB3aXRoOlxuICpcbiAqICAgICBvYmplY3Qub2ZmKFwiZXZlbnRcIiwgbGlzdGVuZXIsIHRoaXMpO1xuICpcbiAqIEBjbGFzcyBFdmVudERpc3BhdGNoZXJcbiAqL1xuZnVuY3Rpb24gRXZlbnREaXNwYXRjaGVyKCkge1xuXHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG59XG5cbi8qKlxuICogQWRkIGV2ZW50IGxpc3RlbmVyLlxuICogQG1ldGhvZCBhZGRFdmVudExpc3RlbmVyXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHNjb3BlKSB7XG5cdGlmICghdGhpcy5saXN0ZW5lck1hcClcblx0XHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG5cblx0aWYgKCFldmVudFR5cGUpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiRXZlbnQgdHlwZSByZXF1aXJlZCBmb3IgZXZlbnQgZGlzcGF0Y2hlclwiKTtcblxuXHRpZiAoIWxpc3RlbmVyKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIkxpc3RlbmVyIHJlcXVpcmVkIGZvciBldmVudCBkaXNwYXRjaGVyXCIpO1xuXG5cdHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGxpc3RlbmVyLCBzY29wZSk7XG5cblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpXG5cdFx0dGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdID0gW107XG5cblx0dGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdLnB1c2goe1xuXHRcdGxpc3RlbmVyOiBsaXN0ZW5lcixcblx0XHRzY29wZTogc2NvcGVcblx0fSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVyLlxuICogQG1ldGhvZCByZW1vdmVFdmVudExpc3RlbmVyXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHNjb3BlKSB7XG5cdGlmICghdGhpcy5saXN0ZW5lck1hcClcblx0XHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG5cblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpXG5cdFx0cmV0dXJuO1xuXG5cdHZhciBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgbGlzdGVuZXJPYmogPSBsaXN0ZW5lcnNbaV07XG5cblx0XHRpZiAobGlzdGVuZXIgPT0gbGlzdGVuZXJPYmoubGlzdGVuZXIgJiYgc2NvcGUgPT0gbGlzdGVuZXJPYmouc2NvcGUpIHtcblx0XHRcdGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRpLS07XG5cdFx0fVxuXHR9XG5cblx0aWYgKCFsaXN0ZW5lcnMubGVuZ3RoKVxuXHRcdGRlbGV0ZSB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggZXZlbnQuXG4gKiBAbWV0aG9kIGRpc3BhdGNoRXZlbnRcbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24oZXZlbnQgLyogLi4uICovICkge1xuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXApXG5cdFx0dGhpcy5saXN0ZW5lck1hcCA9IHt9O1xuXG5cdHZhciBldmVudFR5cGU7XG5cdHZhciBsaXN0ZW5lclBhcmFtcztcblxuXHRpZiAodHlwZW9mIGV2ZW50ID09IFwic3RyaW5nXCIpIHtcblx0XHRldmVudFR5cGUgPSBldmVudDtcblxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSlcblx0XHRcdGxpc3RlbmVyUGFyYW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuXHRcdGVsc2UgbGlzdGVuZXJQYXJhbXMgPSBbe1xuXHRcdFx0dHlwZTogZXZlbnRUeXBlLFxuXHRcdFx0dGFyZ2V0OiB0aGlzXG5cdFx0fV07XG5cdH0gZWxzZSB7XG5cdFx0ZXZlbnRUeXBlID0gZXZlbnQudHlwZTtcblx0XHRldmVudC50YXJnZXQgPSB0aGlzO1xuXHRcdGxpc3RlbmVyUGFyYW1zID0gW2V2ZW50XTtcblx0fVxuXG5cdGlmICghdGhpcy5saXN0ZW5lck1hcC5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKVxuXHRcdHJldHVybjtcblxuXHRmb3IgKHZhciBpIGluIHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXSkge1xuXHRcdHZhciBsaXN0ZW5lck9iaiA9IHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXVtpXTtcblx0XHRsaXN0ZW5lck9iai5saXN0ZW5lci5hcHBseShsaXN0ZW5lck9iai5zY29wZSwgbGlzdGVuZXJQYXJhbXMpO1xuXHR9XG59XG5cbi8qKlxuICogSnF1ZXJ5IHN0eWxlIGFsaWFzIGZvciBhZGRFdmVudExpc3RlbmVyXG4gKiBAbWV0aG9kIG9uXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub24gPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cbi8qKlxuICogSnF1ZXJ5IHN0eWxlIGFsaWFzIGZvciByZW1vdmVFdmVudExpc3RlbmVyXG4gKiBAbWV0aG9kIG9mZlxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblxuLyoqXG4gKiBKcXVlcnkgc3R5bGUgYWxpYXMgZm9yIGRpc3BhdGNoRXZlbnRcbiAqIEBtZXRob2QgdHJpZ2dlclxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnRyaWdnZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQ7XG5cbi8qKlxuICogTWFrZSBzb21ldGhpbmcgYW4gZXZlbnQgZGlzcGF0Y2hlci4gQ2FuIGJlIHVzZWQgZm9yIG11bHRpcGxlIGluaGVyaXRhbmNlLlxuICogQG1ldGhvZCBpbml0XG4gKiBAc3RhdGljXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5pbml0ID0gZnVuY3Rpb24oY2xzKSB7XG5cdGNscy5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0Y2xzLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXHRjbHMucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQ7XG5cdGNscy5wcm90b3R5cGUub24gPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLm9uO1xuXHRjbHMucHJvdG90eXBlLm9mZiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub2ZmO1xuXHRjbHMucHJvdG90eXBlLnRyaWdnZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnRyaWdnZXI7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IEV2ZW50RGlzcGF0Y2hlcjtcbn0iLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcInlhZWRcIik7XG5cbi8qKlxuICogQ29sbGVjdGlvbi5cbiAqIEBjbGFzcyBDb2xsZWN0aW9uXG4gKi9cbmZ1bmN0aW9uIENvbGxlY3Rpb24oKSB7XG5cdHRoaXMuaXRlbXMgPSBbXTtcbn1cblxuaW5oZXJpdHMoQ29sbGVjdGlvbiwgRXZlbnREaXNwYXRjaGVyKTtcblxuLyoqXG4gKiBBZGQgaXRlbSBhdCBlbmQuXG4gKiBAbWV0aG9kIGFkZEl0ZW1cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuYWRkSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0dGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuXG5cdHRoaXMudHJpZ2dlckNoYW5nZShcImFkZFwiLCBpdGVtLCB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpO1xufVxuXG4vKipcbiAqIEFkZCBpdGVtIGF0IGluZGV4LlxuICogQG1ldGhvZCBhZGRJdGVtXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmFkZEl0ZW1BdCA9IGZ1bmN0aW9uKGluZGV4LCBpdGVtKSB7XG5cdGlmIChpbmRleCA8IDApXG5cdFx0aW5kZXggPSAwO1xuXG5cdGlmIChpbmRleCA+IHRoaXMuaXRlbXMubGVuZ3RoKVxuXHRcdGluZGV4ID0gdGhpcy5pdGVtcy5sZW5ndGg7XG5cblx0dmFyIGFmdGVyID0gdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgpO1xuXHR0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG5cdHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmNvbmNhdChhZnRlcik7XG5cblx0dGhpcy50cmlnZ2VyQ2hhbmdlKFwiYWRkXCIsIGl0ZW0sIGluZGV4KTtcbn1cblxuLyoqXG4gKiBHZXQgbGVuZ3RoLlxuICogQG1ldGhvZCBnZXRMZW5ndGhcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcbn1cblxuLyoqXG4gKiBHZXQgaXRlbSBhdCBpbmRleC5cbiAqIEBtZXRob2QgZ2V0SXRlbUF0XG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmdldEl0ZW1BdCA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cdHJldHVybiB0aGlzLml0ZW1zW2luZGV4XTtcbn1cblxuLyoqXG4gKiBGaW5kIGl0ZW0gaW5kZXguXG4gKiBAbWV0aG9kIGdldEl0ZW1JbmRleFxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5nZXRJdGVtSW5kZXggPSBmdW5jdGlvbihpdGVtKSB7XG5cdHJldHVybiB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGl0ZW0gYXQuXG4gKiBAbWV0aG9kIHJlbW92ZUl0ZW1BdFxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5yZW1vdmVJdGVtQXQgPSBmdW5jdGlvbihpbmRleCkge1xuXHRpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuaXRlbXMubGVuZ3RoKVxuXHRcdHJldHVybjtcblxuXHR2YXIgaXRlbSA9IHRoaXMuZ2V0SXRlbUF0KGluZGV4KTtcblxuXHR0aGlzLml0ZW1zLnNwbGljZShpbmRleCwgMSk7XG5cdHRoaXMudHJpZ2dlckNoYW5nZShcInJlbW92ZVwiLCBpdGVtLCBpbmRleCk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGl0ZW0uXG4gKiBAbWV0aG9kIHJlbW92ZUl0ZW1cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUucmVtb3ZlSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0dmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgoaXRlbSk7XG5cblx0dGhpcy5yZW1vdmVJdGVtQXQoaW5kZXgpO1xufVxuXG4vKipcbiAqIFRyaWdnZXIgY2hhbmdlIGV2ZW50LlxuICogQG1ldGhvZCB0cmlnZ2VyQ2hhbmdlXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS50cmlnZ2VyQ2hhbmdlID0gZnVuY3Rpb24oZXZlbnRLaW5kLCBpdGVtLCBpbmRleCkge1xuXHR0aGlzLnRyaWdnZXIoe1xuXHRcdHR5cGU6IGV2ZW50S2luZCxcblx0XHRpdGVtOiBpdGVtLFxuXHRcdGluZGV4OiBpbmRleFxuXHR9KTtcblxuXHR0aGlzLnRyaWdnZXIoe1xuXHRcdHR5cGU6IFwiY2hhbmdlXCIsXG5cdFx0a2luZDogZXZlbnRLaW5kLFxuXHRcdGl0ZW06IGl0ZW0sXG5cdFx0aW5kZXg6IGluZGV4XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb247IiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCJ5YWVkXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIENvbGxlY3Rpb25WaWV3TWFuYWdlcj1yZXF1aXJlKFwiLi9Db2xsZWN0aW9uVmlld01hbmFnZXJcIik7XG5cbi8qKlxuICogQ29sbGVjdGlvblZpZXcuXG4gKiBAY2xhc3MgQ29sbGVjdGlvblZpZXdcbiAqL1xuZnVuY3Rpb24gQ29sbGVjdGlvblZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMubWFuYWdlcj1uZXcgQ29sbGVjdGlvblZpZXdNYW5hZ2VyKHRoaXMpO1xufVxuXG5pbmhlcml0cyhDb2xsZWN0aW9uVmlldywgeG5vZGUuRGl2KTtcblxuLyoqXG4gKiBTZXQgaXRlbSByZW5kZXJlciBjbGFzcy5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyQ2xhc3NcbiAqL1xuQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLnNldEl0ZW1SZW5kZXJlckNsYXNzID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldEl0ZW1SZW5kZXJlckNsYXNzKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSByZW5kZXJlciBmYWN0b3J5LlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJGYWN0b3J5XG4gKi9cbkNvbGxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXRJdGVtUmVuZGVyZXJGYWN0b3J5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldEl0ZW1SZW5kZXJlckZhY3RvcnkodmFsdWUpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIGNvbnRyb2xsZXIgY2xhc3MuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckNsYXNzXG4gKi9cbkNvbGxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXRJdGVtQ29udHJvbGxlckNsYXNzID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldEl0ZW1Db250cm9sbGVyQ2xhc3ModmFsdWUpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIGNvbnRyb2xsZXIgZmFjdG9yeS5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyRmFjdG9yeVxuICovXG5Db2xsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0SXRlbUNvbnRyb2xsZXJGYWN0b3J5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldEl0ZW1Db250cm9sbGVyRmFjdG9yeSh2YWx1ZSk7XG59XG5cbi8qKlxuICogU2V0IGRhdGEgc291cmNlLlxuICogQG1ldGhvZCBzZXREYXRhU291cmNlXG4gKi9cbkNvbGxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXREYXRhU291cmNlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldERhdGFTb3VyY2UodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb25WaWV3OyIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwieWFlZFwiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcblxuLyoqXG4gKiBDb2xsZWN0aW9uVmlld01hbmFnZXIuXG4gKiBAY2xhc3MgQ29sbGVjdGlvblZpZXdNYW5hZ2VyXG4gKi9cbmZ1bmN0aW9uIENvbGxlY3Rpb25WaWV3TWFuYWdlcih0YXJnZXQpIHtcblx0dGhpcy5pdGVtUmVuZGVyZXJzID0gW107XG5cdHRoaXMuaXRlbVJlbmRlcmVyQ2xhc3MgPSBudWxsO1xuXHR0aGlzLml0ZW1SZW5kZXJlckZhY3RvcnkgPSBudWxsO1xuXHR0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MgPSBudWxsO1xuXHR0aGlzLml0ZW1Db250cm9sbGVyRmFjdG9yeSA9IG51bGw7XG5cdHRoaXMuZGF0YVNvdXJjZSA9IG51bGw7XG5cdHRoaXMudGFyZ2V0ID0gbnVsbDtcblxuXHR0aGlzLnNldFRhcmdldCh0YXJnZXQpO1xufVxuXG4vKipcbiAqIFNldCB0YXJnZXQuXG4gKiBAbWV0aG9kIHNldFRhcmdldFxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldFRhcmdldCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMucmVtb3ZlQWxsSXRlbVJlbmRlcmVycygpO1xuXHR0aGlzLnRhcmdldD12YWx1ZTtcblx0dGhpcy5yZW1vdmVBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gcmVuZGVyZXIgY2xhc3MuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckNsYXNzXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0SXRlbVJlbmRlcmVyQ2xhc3MgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgaXRlbSByZW5kZXJlciBjbGFzcyBzaG91bGQgYmUgYSBmdW5jdGlvblwiKTtcblxuXHR0aGlzLml0ZW1SZW5kZXJlckNsYXNzID0gdmFsdWU7XG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSByZW5kZXJlciBmYWN0b3J5LlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJGYWN0b3J5XG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0SXRlbVJlbmRlcmVyRmFjdG9yeSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBpdGVtIHJlbmRlcmVyIGZhY3Rvcnkgc2hvdWxkIGJlIGEgZnVuY3Rpb25cIik7XG5cblx0dGhpcy5pdGVtUmVuZGVyZXJGYWN0b3J5ID0gdmFsdWU7XG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSBjb250cm9sbGVyIGNsYXNzLlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJDbGFzc1xuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldEl0ZW1Db250cm9sbGVyQ2xhc3MgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgaXRlbSByZW5kZXJlciBjbGFzcyBzaG91bGQgYmUgYSBmdW5jdGlvblwiKTtcblxuXHR0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MgPSB2YWx1ZTtcblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIGNvbnRyb2xsZXIgZmFjdG9yeS5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyRmFjdG9yeVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldEl0ZW1Db250cm9sbGVyRmFjdG9yeSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBpdGVtIHJlbmRlcmVyIGZhY3Rvcnkgc2hvdWxkIGJlIGEgZnVuY3Rpb25cIik7XG5cblx0dGhpcy5pdGVtQ29udHJvbGxlckZhY3RvcnkgPSB2YWx1ZTtcblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNldCBkYXRhIHNvdXJjZS5cbiAqIEBtZXRob2Qgc2V0RGF0YVNvdXJjZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldERhdGFTb3VyY2UgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodGhpcy5kYXRhU291cmNlKSB7XG5cdFx0dGhpcy5kYXRhU291cmNlLm9mZihcImNoYW5nZVwiLCB0aGlzLm9uRGF0YVNvdXJjZUNoYW5nZSwgdGhpcyk7XG5cdH1cblxuXHR0aGlzLmRhdGFTb3VyY2UgPSB2YWx1ZTtcblxuXHRpZiAodGhpcy5kYXRhU291cmNlKSB7XG5cdFx0dGhpcy5kYXRhU291cmNlLm9uKFwiY2hhbmdlXCIsIHRoaXMub25EYXRhU291cmNlQ2hhbmdlLCB0aGlzKTtcblx0fVxuXG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTb21ldGhpbmcgaW4gdGhlIGRhdGEgc291cmNlIHdhcyBjaGFuZ2VkLlxuICogQG1ldGhvZCBvbkRhdGFTb3VyY2VDaGFuZ2VcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUub25EYXRhU291cmNlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYWxsIGl0ZW0gcmVuZGVyZXJzLlxuICogQG1ldGhvZCByZW1vdmVBbGxJdGVtUmVuZGVyZXJzXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnJlbW92ZUFsbEl0ZW1SZW5kZXJlcnMgPSBmdW5jdGlvbigpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZW1SZW5kZXJlcnMubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAodGhpcy5pdGVtUmVuZGVyZXJzW2ldLl9fY29udHJvbGxlcilcblx0XHRcdHRoaXMuaXRlbVJlbmRlcmVyc1tpXS5fX2NvbnRyb2xsZXIuc2V0RGF0YShudWxsKTtcblxuXHRcdGVsc2Vcblx0XHRcdHRoaXMuaXRlbVJlbmRlcmVyc1tpXS5zZXREYXRhKG51bGwpO1xuXG5cdFx0dGhpcy50YXJnZXQucmVtb3ZlQ2hpbGQodGhpcy5pdGVtUmVuZGVyZXJzW2ldKTtcblx0fVxuXG5cdHRoaXMuaXRlbVJlbmRlcmVycyA9IFtdO1xufVxuXG4vKipcbiAqIFJlZnJlc2ggYWxsIGl0ZW0gcmVuZGVyZXJzLlxuICogQG1ldGhvZCByZWZyZXNoQWxsSXRlbVJlbmRlcmVyc1xuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbW92ZUFsbEl0ZW1SZW5kZXJlcnMoKTtcblxuXHRpZiAoIXRoaXMuZGF0YVNvdXJjZSlcblx0XHRyZXR1cm47XG5cblx0aWYgKCF0aGlzLml0ZW1SZW5kZXJlckNsYXNzICYmICF0aGlzLml0ZW1SZW5kZXJlckZhY3RvcnkpXG5cdFx0cmV0dXJuO1xuXG5cdGlmICghdGhpcy50YXJnZXQpXG5cdFx0cmV0dXJuO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kYXRhU291cmNlLmdldExlbmd0aCgpOyBpKyspIHtcblx0XHR2YXIgZGF0YSA9IHRoaXMuZGF0YVNvdXJjZS5nZXRJdGVtQXQoaSk7XG5cdFx0dmFyIHJlbmRlcmVyID0gdGhpcy5jcmVhdGVJdGVtUmVuZGVyZXIoKTtcblxuXHRcdGlmICh0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MgfHwgdGhpcy5pdGVtQ29udHJvbGxlckZhY3RvcnkpIHtcblx0XHRcdHJlbmRlcmVyLl9fY29udHJvbGxlciA9IHRoaXMuY3JlYXRlSXRlbUNvbnRyb2xsZXIocmVuZGVyZXIpO1xuXHRcdFx0cmVuZGVyZXIuX19jb250cm9sbGVyLnNldERhdGEoZGF0YSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbmRlcmVyLnNldERhdGEoZGF0YSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5pdGVtUmVuZGVyZXJzLnB1c2gocmVuZGVyZXIpO1xuXHRcdHRoaXMudGFyZ2V0LmFwcGVuZENoaWxkKHJlbmRlcmVyKTtcblx0fVxufVxuXG4vKipcbiAqIENyZWF0ZSBpdGVtIHJlbmRlcmVyLlxuICogQG1ldGhvZCBjcmVhdGVJdGVtUmVuZGVyZXJcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuY3JlYXRlSXRlbVJlbmRlcmVyID0gZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLml0ZW1SZW5kZXJlckZhY3RvcnkpXG5cdFx0cmV0dXJuIHRoaXMuaXRlbVJlbmRlcmVyRmFjdG9yeSgpO1xuXG5cdGlmICh0aGlzLml0ZW1SZW5kZXJlckNsYXNzKVxuXHRcdHJldHVybiBuZXcgdGhpcy5pdGVtUmVuZGVyZXJDbGFzcygpO1xuXG5cdHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNyZWF0ZSBpdGVtIHJlbmRlcmVyIVwiKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgaXRlbSBjb250cm9sbGVyLlxuICogQG1ldGhvZCBjcmVhdGVJdGVtQ29udHJvbGxlclxuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5jcmVhdGVJdGVtQ29udHJvbGxlciA9IGZ1bmN0aW9uKHJlbmRlcmVyKSB7XG5cdGlmICh0aGlzLml0ZW1Db250cm9sbGVyRmFjdG9yeSlcblx0XHRyZXR1cm4gdGhpcy5pdGVtQ29udHJvbGxlckZhY3RvcnkocmVuZGVyZXIpO1xuXG5cdGlmICh0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MpXG5cdFx0cmV0dXJuIG5ldyB0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MocmVuZGVyZXIpO1xuXG5cdHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNyZWF0ZSBpdGVtIGNvbnRyb2xsZXIhXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb25WaWV3TWFuYWdlcjsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0Q29sbGVjdGlvbjogcmVxdWlyZShcIi4vQ29sbGVjdGlvblwiKSxcblx0Q29sbGVjdGlvblZpZXc6IHJlcXVpcmUoXCIuL0NvbGxlY3Rpb25WaWV3XCIpLFxuXHRDb2xsZWN0aW9uVmlld01hbmFnZXI6IHJlcXVpcmUoXCIuL0NvbGxlY3Rpb25WaWV3TWFuYWdlclwiKVxufTsiLCJ2YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgQXBwVmlldyA9IHJlcXVpcmUoXCIuLi92aWV3L0FwcFZpZXdcIik7XG52YXIgQXBwTW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWwvQXBwTW9kZWxcIik7XG52YXIgQXBwQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuLi9jb250cm9sbGVyL0FwcENvbnRyb2xsZXJcIik7XG5cbi8qKlxuICogVGhlIG1haW4gcmVzb3VyY2UgZmlkZGxlIGFwcCBjbGFzcy5cbiAqIEBjbGFzcyBBcHBcbiAqL1xuZnVuY3Rpb24gQXBwKCkge1xuXHR4bm9kZS5EaXYuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHR0aGlzLnN0eWxlLnRvcCA9IDA7XG5cdHRoaXMuc3R5bGUuYm90dG9tID0gMDtcblx0dGhpcy5zdHlsZS5sZWZ0ID0gMDtcblx0dGhpcy5zdHlsZS5yaWdodCA9IDA7XG5cblx0dGhpcy5hcHBWaWV3ID0gbmV3IEFwcFZpZXcoKTtcblx0dGhpcy5hcHBNb2RlbCA9IG5ldyBBcHBNb2RlbCgpO1xuXHR0aGlzLmFwcENvbnRyb2xsZXIgPSBuZXcgQXBwQ29udHJvbGxlcih0aGlzLmFwcE1vZGVsLCB0aGlzLmFwcFZpZXcpO1xuXG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5hcHBWaWV3KTtcbn1cblxuaW5oZXJpdHMoQXBwLCB4bm9kZS5EaXYpO1xuXG4vKipcbiAqIEdldCBtb2RlbC5cbiAqIEBtZXRob2QgZ2V0TW9kZWxcbiAqL1xuQXBwLnByb3RvdHlwZS5nZXRNb2RlbCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5hcHBNb2RlbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHA7IiwidmFyIFJlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL1Jlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlclwiKTtcbnZhciBSZXNvdXJjZVRhYkNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVRhYkNvbnRyb2xsZXJcIik7XG5cbi8qKlxuICogQXBwIGNvbnRyb2xsZXJcbiAqIEBjbGFzcyBBcHBDb250cm9sbGVyXG4gKi9cbmZ1bmN0aW9uIEFwcENvbnRyb2xsZXIoYXBwTW9kZWwsIGFwcFZpZXcpIHtcblx0dGhpcy5hcHBNb2RlbCA9IGFwcE1vZGVsO1xuXHR0aGlzLmFwcFZpZXcgPSBhcHBWaWV3O1xuXG5cdHRoaXMuYXBwVmlldy5nZXRSZXNvdXJjZVBhbmVWaWV3KCkuc2V0VGFic0NvbGxlY3Rpb24odGhpcy5hcHBNb2RlbC5nZXRDYXRlZ29yeUNvbGxlY3Rpb24oKSk7XG5cblx0dGhpcy5hcHBWaWV3LmdldFJlc291cmNlUGFuZVZpZXcoKS5nZXRUYWJzSGVhZGVyTWFuYWdlcigpLnNldEl0ZW1Db250cm9sbGVyQ2xhc3MoUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyKTtcblx0dGhpcy5hcHBWaWV3LmdldFJlc291cmNlUGFuZVZpZXcoKS5nZXRUYWJzTWFuYWdlcigpLnNldEl0ZW1Db250cm9sbGVyQ2xhc3MoUmVzb3VyY2VUYWJDb250cm9sbGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBDb250cm9sbGVyOyIsImZ1bmN0aW9uIFJlc291cmNlVGFiQ29udHJvbGxlcih0YWJWaWV3KSB7XG5cdHRoaXMudGFiVmlldyA9IHRhYlZpZXc7XG59XG5cblJlc291cmNlVGFiQ29udHJvbGxlci5wcm90b3R5cGUuc2V0RGF0YSA9IGZ1bmN0aW9uKGNhdGVnb3J5TW9kZWwpIHtcblx0aWYgKHRoaXMuY2F0ZWdvcnlNb2RlbCkge1xuXHRcdHRoaXMuY2F0ZWdvcnlNb2RlbC5vZmYoXCJjaGFuZ2VcIiwgdGhpcy5vbkNhdGVnb3J5TW9kZWxDaGFuZ2UsIHRoaXMpO1xuXHR9XG5cblx0dGhpcy5jYXRlZ29yeU1vZGVsID0gY2F0ZWdvcnlNb2RlbDtcblxuXHRpZiAodGhpcy5jYXRlZ29yeU1vZGVsKSB7XG5cdFx0dGhpcy5jYXRlZ29yeU1vZGVsLm9uKFwiY2hhbmdlXCIsIHRoaXMub25DYXRlZ29yeU1vZGVsQ2hhbmdlLCB0aGlzKTtcblx0XHR0aGlzLnRhYlZpZXcuc2V0QWN0aXZlKGNhdGVnb3J5TW9kZWwuaXNBY3RpdmUoKSk7XG5cblx0XHR0aGlzLnRhYlZpZXcuc2V0TGFiZWwoY2F0ZWdvcnlNb2RlbC5nZXRMYWJlbCgpKTtcblx0fVxufVxuXG5SZXNvdXJjZVRhYkNvbnRyb2xsZXIucHJvdG90eXBlLm9uQ2F0ZWdvcnlNb2RlbENoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnRhYlZpZXcuc2V0QWN0aXZlKHRoaXMuY2F0ZWdvcnlNb2RlbC5pc0FjdGl2ZSgpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZVRhYkNvbnRyb2xsZXI7IiwiZnVuY3Rpb24gUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyKHRhYkhlYWRlclZpZXcpIHtcblx0dGhpcy50YWJIZWFkZXJWaWV3ID0gdGFiSGVhZGVyVmlldztcblx0dGhpcy50YWJIZWFkZXJWaWV3LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uVGFiSGVhZGVyVmlld0NsaWNrLmJpbmQodGhpcykpO1xufVxuXG5SZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXIucHJvdG90eXBlLnNldERhdGEgPSBmdW5jdGlvbihjYXRlZ29yeU1vZGVsKSB7XG5cdGlmICh0aGlzLmNhdGVnb3J5TW9kZWwpIHtcblx0XHR0aGlzLmNhdGVnb3J5TW9kZWwub2ZmKFwiY2hhbmdlXCIsIHRoaXMub25DYXRlZ29yeU1vZGVsQ2hhbmdlLCB0aGlzKTtcblx0fVxuXG5cdHRoaXMuY2F0ZWdvcnlNb2RlbCA9IGNhdGVnb3J5TW9kZWw7XG5cblx0aWYgKHRoaXMuY2F0ZWdvcnlNb2RlbCkge1xuXHRcdHRoaXMuY2F0ZWdvcnlNb2RlbC5vbihcImNoYW5nZVwiLCB0aGlzLm9uQ2F0ZWdvcnlNb2RlbENoYW5nZSwgdGhpcyk7XG5cdFx0dGhpcy50YWJIZWFkZXJWaWV3LnNldExhYmVsKGNhdGVnb3J5TW9kZWwuZ2V0TGFiZWwoKSk7XG5cdFx0dGhpcy50YWJIZWFkZXJWaWV3LnNldEFjdGl2ZShjYXRlZ29yeU1vZGVsLmlzQWN0aXZlKCkpO1xuXHR9XG59XG5cblJlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlci5wcm90b3R5cGUub25UYWJIZWFkZXJWaWV3Q2xpY2sgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jYXRlZ29yeU1vZGVsLnNldEFjdGl2ZSh0cnVlKTtcbn1cblxuUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyLnByb3RvdHlwZS5vbkNhdGVnb3J5TW9kZWxDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0dGhpcy50YWJIZWFkZXJWaWV3LnNldEFjdGl2ZSh0aGlzLmNhdGVnb3J5TW9kZWwuaXNBY3RpdmUoKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyOyIsImZpZGRsZXVpID0ge1xuXHRBcHA6IHJlcXVpcmUoXCIuL2FwcC9BcHBcIiksXG5cdENhdGVnb3J5TW9kZWw6IHJlcXVpcmUoXCIuL21vZGVsL0NhdGVnb3J5TW9kZWxcIilcbn07IiwidmFyIHhub2RlYyA9IHJlcXVpcmUoXCJ4bm9kZWNvbGxlY3Rpb25cIik7XG5cbi8qKlxuICogQXBwTW9kZWxcbiAqIEBjbGFzcyBBcHBNb2RlbFxuICovXG5mdW5jdGlvbiBBcHBNb2RlbCgpIHtcblx0dGhpcy5jYXRlZ29yeUNvbGxlY3Rpb24gPSBuZXcgeG5vZGVjLkNvbGxlY3Rpb24oKTtcblxuXHR0aGlzLmlkQ291bnQgPSAwO1xufVxuXG4vKipcbiAqIEdldCBjYXRlZ29yeSBjb2xsZWN0aW9uLlxuICogQG1ldGhvZCBnZXRDYXRlZ29yeUNvbGxlY3Rpb25cbiAqL1xuQXBwTW9kZWwucHJvdG90eXBlLmdldENhdGVnb3J5Q29sbGVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jYXRlZ29yeUNvbGxlY3Rpb247XG59XG5cbi8qKlxuICogQWRkIGNhdGVnb3J5IG1vZGVsLlxuICogQG1ldGhvZCBhZGRDYXRlZ29yeU1vZGVsXG4gKi9cbkFwcE1vZGVsLnByb3RvdHlwZS5hZGRDYXRlZ29yeU1vZGVsID0gZnVuY3Rpb24oY2F0ZWdvcnlNb2RlbCkge1xuXHRjYXRlZ29yeU1vZGVsLnNldFBhcmVudE1vZGVsKHRoaXMpO1xuXHR0aGlzLmNhdGVnb3J5Q29sbGVjdGlvbi5hZGRJdGVtKGNhdGVnb3J5TW9kZWwpO1xuXG5cdGlmICh0aGlzLmNhdGVnb3J5Q29sbGVjdGlvbi5nZXRMZW5ndGgoKSA9PSAxKVxuXHRcdGNhdGVnb3J5TW9kZWwuc2V0QWN0aXZlKHRydWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcE1vZGVsOyIsInZhciBBcHBNb2RlbCA9IHJlcXVpcmUoXCIuL0FwcE1vZGVsXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCJ5YWVkXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xuXG4vKipcbiAqIEdldCBjYXRlZ29yeSBtb2RlbC5cbiAqIEBjbGFzcyBDYXRlZ29yeU1vZGVsXG4gKi9cbmZ1bmN0aW9uIENhdGVnb3J5TW9kZWwobGFiZWwpIHtcblx0dGhpcy5sYWJlbCA9IGxhYmVsO1xuXHR0aGlzLnBhcmVudE1vZGVsID0gbnVsbDtcblx0dGhpcy5hY3RpdmUgPSBmYWxzZTtcbn1cblxuaW5oZXJpdHMoQ2F0ZWdvcnlNb2RlbCwgRXZlbnREaXNwYXRjaGVyKTtcblxuLyoqXG4gKiBTZXQgcmVmZXJlbmNlIHRvIHBhcmVudCBtb2RlbC5cbiAqIEBtZXRob2QgZ2V0UGFyZW50TW9kZWxcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuc2V0UGFyZW50TW9kZWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLnBhcmVudE1vZGVsID0gdmFsdWU7XG59XG5cbi8qKlxuICogR2V0IGxhYmVsLlxuICogQG1ldGhvZCBnZXRMYWJlbFxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5nZXRMYWJlbCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5sYWJlbDtcbn1cblxuLyoqXG4gKiBHZXQgcmVmZXJlbmNlIHRvIGFwcCBtb2RlbC5cbiAqIEBtZXRob2QgZ2V0QXBwTW9kZWxcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuZ2V0QXBwTW9kZWwgPSBmdW5jdGlvbigpIHtcblx0aWYgKCF0aGlzLnBhcmVudE1vZGVsKVxuXHRcdHRocm93IG5ldyBFcnJvcihcInRoZXJlIGlzIG5vIHBhcmVudCFcIik7XG5cblx0dmFyIHAgPSB0aGlzLnBhcmVudE1vZGVsO1xuXG5cdHdoaWxlIChwICYmICEocCBpbnN0YW5jZW9mIEFwcE1vZGVsKSlcblx0XHRwID0gcC5wYXJlbnRNb2RlbDtcblxuXHRyZXR1cm4gcDtcbn1cblxuLyoqXG4gKiBTZXQgYWN0aXZlIHN0YXRlLlxuICogQG1ldGhvZCBzZXRBY3RpdmVcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHZhbHVlID09IHRoaXMuYWN0aXZlKVxuXHRcdHJldHVybjtcblxuXHR2YXIgc2libGluZ3MgPSB0aGlzLnBhcmVudE1vZGVsLmdldENhdGVnb3J5Q29sbGVjdGlvbigpO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc2libGluZ3MuZ2V0TGVuZ3RoKCk7IGkrKylcblx0XHRpZiAoc2libGluZ3MuZ2V0SXRlbUF0KGkpICE9IHRoaXMpXG5cdFx0XHRzaWJsaW5ncy5nZXRJdGVtQXQoaSkuc2V0QWN0aXZlKGZhbHNlKTtcblxuXHR0aGlzLmFjdGl2ZSA9IHZhbHVlO1xuXHR0aGlzLnRyaWdnZXIoXCJjaGFuZ2VcIik7XG59XG5cbi8qKlxuICogSXMgdGhpcyBjYXRlZ29yeSB0aGUgYWN0aXZlIG9uZT9cbiAqIEBtZXRob2QgaXNBY3RpdmVcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuYWN0aXZlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhdGVnb3J5TW9kZWw7IiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIFJlc291cmNlUGFuZVZpZXcgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVBhbmVWaWV3XCIpO1xuXG4vKipcbiAqIE1haW4gYXBwbGljYXRpb24gdmlldy5cbiAqIEBjbGFzcyBBcHBWaWV3XG4gKi9cbmZ1bmN0aW9uIEFwcFZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMuc3R5bGUudG9wID0gMDtcblx0dGhpcy5zdHlsZS5sZWZ0ID0gMDtcblx0dGhpcy5zdHlsZS5yaWdodCA9IDA7XG5cdHRoaXMuc3R5bGUuYm90dG9tID0gMDtcblxuXHR0aGlzLnJlc291cmNlUGFuZVZpZXcgPSBuZXcgUmVzb3VyY2VQYW5lVmlldygpO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMucmVzb3VyY2VQYW5lVmlldyk7XG59XG5cbmluaGVyaXRzKEFwcFZpZXcsIHhub2RlLkRpdik7XG5cbkFwcFZpZXcucHJvdG90eXBlLmdldFJlc291cmNlUGFuZVZpZXcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMucmVzb3VyY2VQYW5lVmlldztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBWaWV3OyIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciB4bm9kZWMgPSByZXF1aXJlKFwieG5vZGVjb2xsZWN0aW9uXCIpO1xudmFyIFJlc291cmNlVGFiSGVhZGVyVmlldyA9IHJlcXVpcmUoXCIuL1Jlc291cmNlVGFiSGVhZGVyVmlld1wiKTtcbnZhciBSZXNvdXJjZVRhYlZpZXcgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVRhYlZpZXdcIik7XG5cbi8qKlxuICogVGhlIGxlZnQgcGFydCBvZiB0aGUgYXBwLCBzaG93aW5nIHRoZSByZXNvdXJjZXMuXG4gKiBAY2xhc3MgUmVzb3VyY2VQYW5lVmlld1xuICovXG5mdW5jdGlvbiBSZXNvdXJjZVBhbmVWaWV3KCkge1xuXHR4bm9kZS5EaXYuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHR0aGlzLnN0eWxlLnRvcCA9IFwiMTBweFwiO1xuXHR0aGlzLnN0eWxlLmxlZnQgPSBcIjEwcHhcIjtcblx0dGhpcy5zdHlsZS53aWR0aCA9IFwiNTAlXCI7XG5cdHRoaXMuc3R5bGUuYm90dG9tID0gXCIxMHB4XCI7XG5cblx0dGhpcy50YWJIZWFkZXJzID0gbmV3IHhub2RlYy5Db2xsZWN0aW9uVmlldygpO1xuXHR0aGlzLnRhYkhlYWRlcnMuY2xhc3NOYW1lID0gXCJ1aSB0b3AgYXR0YWNoZWQgdGFidWxhciBtZW51XCI7XG5cdHRoaXMudGFiSGVhZGVycy5zZXRJdGVtUmVuZGVyZXJDbGFzcyhSZXNvdXJjZVRhYkhlYWRlclZpZXcpO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMudGFiSGVhZGVycyk7XG5cblx0dGhpcy50YWJzTWFuYWdlciA9IG5ldyB4bm9kZWMuQ29sbGVjdGlvblZpZXdNYW5hZ2VyKHRoaXMpO1xuXHR0aGlzLnRhYnNNYW5hZ2VyLnNldEl0ZW1SZW5kZXJlckNsYXNzKFJlc291cmNlVGFiVmlldyk7XG5cblx0LypcdHRoaXMudGFicyA9IG5ldyB4bm9kZXVpLlRhYnMoKTtcblx0XHR0aGlzLnRhYnMuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdFx0dGhpcy50YWJzLnN0eWxlLmxlZnQgPSAxMDtcblx0XHR0aGlzLnRhYnMuc3R5bGUucmlnaHQgPSA1O1xuXHRcdHRoaXMudGFicy5zdHlsZS50b3AgPSAxMDtcblx0XHR0aGlzLnRhYnMuc3R5bGUuYm90dG9tID0gMTA7XG5cdFx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLnRhYnMpO1xuXG5cdFx0dGhpcy50YWJzSGVhZGVyTWFuYWdlciA9IG5ldyB4bm9kZWMuQ29sbGVjdGlvblZpZXdNYW5hZ2VyKHRoaXMudGFicy51bCk7XG5cdFx0dGhpcy50YWJzSGVhZGVyTWFuYWdlci5zZXRJdGVtUmVuZGVyZXJDbGFzcyhSZXNvdXJjZVRhYkhlYWRlclZpZXcpO1xuXG5cdFx0dGhpcy50YWJzQ29udGVudE1hbmFnZXIgPSBuZXcgeG5vZGVjLkNvbGxlY3Rpb25WaWV3TWFuYWdlcih0aGlzLnRhYnMpO1xuXHRcdHRoaXMudGFic0NvbnRlbnRNYW5hZ2VyLnNldEl0ZW1SZW5kZXJlckNsYXNzKFJlc291cmNlVGFiVmlldyk7Ki9cbn1cblxuaW5oZXJpdHMoUmVzb3VyY2VQYW5lVmlldywgeG5vZGUuRGl2KTtcblxuLyoqXG4gKiBTZXQgdGFicyBjb2xsZWN0aW9uLlxuICovXG5SZXNvdXJjZVBhbmVWaWV3LnByb3RvdHlwZS5zZXRUYWJzQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcblx0dGhpcy50YWJIZWFkZXJzLnNldERhdGFTb3VyY2UoY29sbGVjdGlvbik7XG5cdHRoaXMudGFic01hbmFnZXIuc2V0RGF0YVNvdXJjZShjb2xsZWN0aW9uKTtcblxuXHQvKlx0dGhpcy50YWJzQ29udGVudE1hbmFnZXIuc2V0RGF0YVNvdXJjZShjb2xsZWN0aW9uKTtcblxuXHRcdHZhciBzY29wZT10aGlzO1xuXG5cdFx0Y29sbGVjdGlvbi5vbihcImNoYW5nZVwiLGZ1bmN0aW9uKCkge1xuXHRcdFx0c2NvcGUudGFicy5yZWZyZXNoKCk7XG5cdFx0fSk7Ki9cbn1cblxuLyoqXG4gKiBHZXQgdGFicyBoZWFkZXIgbWFuYWdlci5cbiAqIEBtZXRob2QgZ2V0VGFic0hlYWRlck1hbmFnZXJcbiAqL1xuUmVzb3VyY2VQYW5lVmlldy5wcm90b3R5cGUuZ2V0VGFic0hlYWRlck1hbmFnZXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudGFiSGVhZGVycztcbn1cblxuLyoqXG4gKiBHZXQgdGFicyBoZWFkZXIgbWFuYWdlci5cbiAqIEBtZXRob2QgZ2V0VGFic01hbmFnZXJcbiAqL1xuUmVzb3VyY2VQYW5lVmlldy5wcm90b3R5cGUuZ2V0VGFic01hbmFnZXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudGFic01hbmFnZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VQYW5lVmlldzsiLCJ2YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG5cbmZ1bmN0aW9uIFJlc291cmNlVGFiSGVhZGVyVmlldygpIHtcblx0eG5vZGUuQS5jYWxsKHRoaXMpO1xuXHR0aGlzLmNsYXNzTmFtZSA9IFwiaXRlbVwiO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZVRhYkhlYWRlclZpZXcsIHhub2RlLkEpO1xuXG5SZXNvdXJjZVRhYkhlYWRlclZpZXcucHJvdG90eXBlLnNldExhYmVsID0gZnVuY3Rpb24obGFiZWwpIHtcblx0dGhpcy5pbm5lckhUTUwgPSBsYWJlbDtcbn1cblxuUmVzb3VyY2VUYWJIZWFkZXJWaWV3LnByb3RvdHlwZS5zZXRBY3RpdmUgPSBmdW5jdGlvbihhY3RpdmUpIHtcblx0aWYgKGFjdGl2ZSlcblx0XHR0aGlzLmNsYXNzTmFtZSA9IFwiYWN0aXZlIGl0ZW1cIjtcblxuXHRlbHNlXG5cdFx0dGhpcy5jbGFzc05hbWUgPSBcIml0ZW1cIjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZVRhYkhlYWRlclZpZXc7IiwidmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xuXG5mdW5jdGlvbiBSZXNvdXJjZVRhYlZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXHR0aGlzLmNsYXNzTmFtZSA9IFwidWkgYm90dG9tIGF0dGFjaGVkIGFjdGl2ZSB0YWIgc2VnbWVudFwiO1xuXG5cdC8vdGhpcy5pbm5lckhUTUwgPSBcImhlbGxvXCI7XG5cblx0dGhpcy5pbm5lciA9IG5ldyB4bm9kZS5EaXYoKTtcblx0dGhpcy5pbm5lci5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcblx0dGhpcy5pbm5lci5zdHlsZS5oZWlnaHQgPSBcImNhbGMoMTAwJSAtIDY1cHgpXCI7XG5cdHRoaXMuaW5uZXIuc3R5bGUucGFkZGluZyA9IFwiMXB4XCI7XG5cdHRoaXMuaW5uZXIuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLmlubmVyKTtcbn1cblxuaW5oZXJpdHMoUmVzb3VyY2VUYWJWaWV3LCB4bm9kZS5EaXYpO1xuXG5SZXNvdXJjZVRhYlZpZXcucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKGFjdGl2ZSkge1xuXHRpZiAoYWN0aXZlKSB7XG5cdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXHRcdHRoaXMuY2xhc3NOYW1lID0gXCJ1aSBib3R0b20gYXR0YWNoZWQgYWN0aXZlIHRhYiBzZWdtZW50IGFjdGl2ZVwiO1xuXHR9IGVsc2Uge1xuXHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdHRoaXMuY2xhc3NOYW1lID0gXCJ1aSBib3R0b20gYXR0YWNoZWQgYWN0aXZlIHRhYiBzZWdtZW50XCI7XG5cdH1cbn1cblxuUmVzb3VyY2VUYWJWaWV3LnByb3RvdHlwZS5zZXRMYWJlbCA9IGZ1bmN0aW9uKGxhYmVsKSB7XG5cdC8vdGhpcy5pbm5lckhUTUwgPSBsYWJlbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZVRhYlZpZXc7Il19
