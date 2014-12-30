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
	target.Span = createExtendedXNodeElement("span");
})();
},{}],3:[function(require,module,exports){
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
},{"inherits":1,"yaed":7}],4:[function(require,module,exports){
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
},{"./CollectionViewManager":5,"inherits":1,"xnode":2,"yaed":7}],5:[function(require,module,exports){
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
},{"inherits":1,"xnode":2,"yaed":7}],6:[function(require,module,exports){
module.exports = {
	Collection: require("./Collection"),
	CollectionView: require("./CollectionView"),
	CollectionViewManager: require("./CollectionViewManager")
};
},{"./Collection":3,"./CollectionView":4,"./CollectionViewManager":5}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{"../controller/AppController":9,"../model/AppModel":14,"../view/AppView":16,"inherits":1,"xnode":2}],9:[function(require,module,exports){
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
},{"./ResourceTabController":11,"./ResourceTabHeaderController":12}],10:[function(require,module,exports){
/**
 * Control a resource category.
 * @method ResourceTabController
 */
function ResourceCategoryController(categoryView) {
	this.categoryView = categoryView;
	//	this.categoryView.getCategoryManager().setItemControllerClass(ResourceCategoryController);

	this.categoryView.on("titleClick", this.onCategoryViewTitleClick, this);
}

/**
 * Set data.
 * @method setData
 */
ResourceCategoryController.prototype.setData = function(categoryModel) {
	if (this.categoryModel) {
		this.categoryModel.off("change", this.onCategoryModelChange, this);
		//this.categoryView.setCategoryCollection(null);
	}

	this.categoryModel = categoryModel;

	if (this.categoryModel) {
		this.categoryModel.on("change", this.onCategoryModelChange, this);
		this.categoryView.setActive(categoryModel.isActive());
		this.categoryView.setLabel(categoryModel.getLabel());

		//this.tabView.setCategoryCollection(categoryModel.getCategoryCollection());
	}
}

/**
 * Handle change in the model.
 * @method onCategoryModelChange
 */
ResourceCategoryController.prototype.onCategoryModelChange = function() {
	this.categoryView.setActive(this.categoryModel.isActive());
}

/**
 *
 */
ResourceCategoryController.prototype.onCategoryViewTitleClick=function() {
	this.categoryModel.setActive(true);
}

module.exports = ResourceCategoryController;
},{}],11:[function(require,module,exports){
var ResourceCategoryController = require("./ResourceCategoryController");

/**
 * Control one resource tab.
 * @method ResourceTabController
 */
function ResourceTabController(tabView) {
	this.tabView = tabView;
	this.tabView.getCategoryManager().setItemControllerClass(ResourceCategoryController);
}

/**
 * Set data.
 * @method setData
 */
ResourceTabController.prototype.setData = function(categoryModel) {
	if (this.categoryModel) {
		this.categoryModel.off("change", this.onCategoryModelChange, this);
		this.tabView.setCategoryCollection(null);
	}

	this.categoryModel = categoryModel;

	if (this.categoryModel) {
		this.categoryModel.on("change", this.onCategoryModelChange, this);
		this.tabView.setActive(categoryModel.isActive());
		this.tabView.setCategoryCollection(categoryModel.getCategoryCollection());
	}
}

/**
 * Handle change in the model.
 * @method onCategoryModelChange
 */
ResourceTabController.prototype.onCategoryModelChange = function() {
	this.tabView.setActive(this.categoryModel.isActive());
}

module.exports = ResourceTabController;
},{"./ResourceCategoryController":10}],12:[function(require,module,exports){
/**
 * Control the header field of the tabls in the resource pane.
 * @method ResourceTabController
 */
function ResourceTabHeaderController(tabHeaderView) {
	this.tabHeaderView = tabHeaderView;
	this.tabHeaderView.addEventListener("click", this.onTabHeaderViewClick.bind(this));
}

/**
 * Set data.
 * @method setData
 */
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

/**
 * The tab was clicked, set this tab as the active one.
 * @method onTabHeaderViewClick
 */
ResourceTabHeaderController.prototype.onTabHeaderViewClick = function() {
	this.categoryModel.setActive(true);
}

/**
 * The model changed.
 * @method onCategoryModelChange
 */
ResourceTabHeaderController.prototype.onCategoryModelChange = function() {
	this.tabHeaderView.setActive(this.categoryModel.isActive());
}

module.exports = ResourceTabHeaderController;
},{}],13:[function(require,module,exports){
fiddleui = {
	App: require("./app/App"),
	CategoryModel: require("./model/CategoryModel")
};
},{"./app/App":8,"./model/CategoryModel":15}],14:[function(require,module,exports){
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

	return categoryModel;
}

module.exports = AppModel;
},{"xnodecollection":6}],15:[function(require,module,exports){
var AppModel = require("./AppModel");
var EventDispatcher = require("yaed");
var inherits = require("inherits");
var xnodec = require("xnodecollection");

/**
 * Get category model.
 * @class CategoryModel
 */
function CategoryModel(label) {
	this.label = label;
	this.parentModel = null;
	this.active = false;
	this.categoryCollection = new xnodec.Collection();
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

/**
 * Get category collection for sub categories.
 * @method getCategoryCollection
 */
CategoryModel.prototype.getCategoryCollection = function() {
	return this.categoryCollection;
}

/**
 * Add sub category model.
 * @method addCategoryModel
 */
CategoryModel.prototype.addCategoryModel = function(categoryModel) {
	categoryModel.setParentModel(this);
	this.categoryCollection.addItem(categoryModel);

	if (this.categoryCollection.getLength() == 1)
		this.categoryCollection.getItemAt(0).setActive(true);

	return categoryModel;
}

module.exports = CategoryModel;
},{"./AppModel":14,"inherits":1,"xnodecollection":6,"yaed":7}],16:[function(require,module,exports){
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
},{"./ResourcePaneView":18,"inherits":1,"xnode":2}],17:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");
var EventDispatcher = require("yaed");

function ResourceCategoryView() {
	xnode.Div.call(this);

	this.title = new xnode.Div();
	this.title.className = "title";
	this.appendChild(this.title);
	this.title.addEventListener("click", this.onTitleClick.bind(this));

	var icon = new xnode.Div();
	icon.className = "dropdown icon";
	this.title.appendChild(icon);

	this.titleSpan = new xnode.Span();
	this.title.appendChild(this.titleSpan);

	this.content = new xnode.Div();
	this.content.className = "content";
	this.appendChild(this.content);
}

inherits(ResourceCategoryView, xnode.Div);
EventDispatcher.init(ResourceCategoryView);

ResourceCategoryView.prototype.setLabel = function(label) {
	this.titleSpan.innerHTML = label;
}

ResourceCategoryView.prototype.setActive = function(active) {
	if (active) {
		this.title.className = "active title";
		this.content.className = "active content";
	} else {
		this.title.className = "title";
		this.content.className = "content";
	}
}

ResourceCategoryView.prototype.onTitleClick = function() {
	this.trigger("titleClick");
}

module.exports = ResourceCategoryView;
},{"inherits":1,"xnode":2,"yaed":7}],18:[function(require,module,exports){
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
}

inherits(ResourcePaneView, xnode.Div);

/**
 * Set tabs collection.
 * @method setTabsCollection
 */
ResourcePaneView.prototype.setTabsCollection = function(collection) {
	this.tabHeaders.setDataSource(collection);
	this.tabsManager.setDataSource(collection);
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
},{"./ResourceTabHeaderView":19,"./ResourceTabView":20,"inherits":1,"xnode":2,"xnodecollection":6}],19:[function(require,module,exports){
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
},{"inherits":1,"xnode":2}],20:[function(require,module,exports){
var xnode = require("xnode");
var xnodec = require("xnodecollection");
var inherits = require("inherits");
var ResourceCategoryView = require("./ResourceCategoryView");

/**
 * The view for the content that goes into one tab.
 * @class ResourceTabView
 */
function ResourceTabView() {
	xnode.Div.call(this);
	this.className = "ui bottom attached active tab segment";

	this.inner = new xnode.Div();
	this.inner.style.position = "relative";
	this.inner.style.height = "calc(100% - 65px)";
	this.inner.style.padding = "1px";
	this.inner.style.overflowY = "scroll";
	this.appendChild(this.inner);

	this.accordion = new xnodec.CollectionView();
	this.accordion.setItemRendererClass(ResourceCategoryView);
	this.accordion.className = "ui styled fluid accordion";
	this.inner.appendChild(this.accordion);
}

inherits(ResourceTabView, xnode.Div);

/**
 * Should this be the active tab?
 * @method setActive
 */
ResourceTabView.prototype.setActive = function(active) {
	if (active) {
		this.style.display = "block";
		this.className = "ui bottom attached active tab segment active";
	} else {
		this.style.display = "none";
		this.className = "ui bottom attached active tab segment";
	}
}

/**
 * Set category collection.
 * @method setCategoryCollection
 */
ResourceTabView.prototype.setCategoryCollection = function(collection) {
	this.accordion.setDataSource(collection);
}

/**
 * Get category manager.
 * @method getCategoryManager
 */
ResourceTabView.prototype.getCategoryManager = function() {
	return this.accordion;
}


module.exports = ResourceTabView;
},{"./ResourceCategoryView":17,"inherits":1,"xnode":2,"xnodecollection":6}]},{},[13])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy94bm9kZS9zcmMveG5vZGUuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3hub2RlY29sbGVjdGlvbi9zcmMvQ29sbGVjdGlvblZpZXcuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uVmlld01hbmFnZXIuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy95YWVkL3NyYy9FdmVudERpc3BhdGNoZXIuanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9jb250cm9sbGVyL0FwcENvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9SZXNvdXJjZUNhdGVnb3J5Q29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL1Jlc291cmNlVGFiQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL1Jlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlci5qcyIsInNyYy9maWRkbGV1aS5qcyIsInNyYy9tb2RlbC9BcHBNb2RlbC5qcyIsInNyYy9tb2RlbC9DYXRlZ29yeU1vZGVsLmpzIiwic3JjL3ZpZXcvQXBwVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlQ2F0ZWdvcnlWaWV3LmpzIiwic3JjL3ZpZXcvUmVzb3VyY2VQYW5lVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlVGFiSGVhZGVyVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlVGFiVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIoZnVuY3Rpb24oKSB7XG5cdC8qKlxuXHQgKiBUaGUgYmFzaWMgeG5vZGUgY2xhc3MuXG5cdCAqIEl0IHNldHMgdGhlIHVuZGVybHlpbmcgbm9kZSBlbGVtZW50IGJ5IGNhbGxpbmdcblx0ICogZG9jdW1lbnQuY3JlYXRlRWxlbWVudFxuXHQgKi9cblx0ZnVuY3Rpb24gWE5vZGUodHlwZSwgY29udGVudCkge1xuXHRcdHRoaXMubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cblx0XHRpZiAoY29udGVudCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0dGhpcy5ub2RlLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBtZXRob2QgY3JlYXRlcyBhbiBleHRlbmRlZCBjbGFzcyB1c2luZ1xuXHQgKiB0aGUgWE5vZGUgY2xhc3MgZGVmaW5lZCBhYm92ZS5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KGVsZW1lbnRUeXBlLCBjb250ZW50KSB7XG5cdFx0dmFyIGYgPSBmdW5jdGlvbihjb250ZW50KSB7XG5cdFx0XHRYTm9kZS5jYWxsKHRoaXMsIGVsZW1lbnRUeXBlLCBjb250ZW50KTtcblx0XHR9O1xuXG5cdFx0Zi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFhOb2RlLnByb3RvdHlwZSk7XG5cdFx0Zi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBmO1xuXG5cdFx0cmV0dXJuIGY7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcmVhZCBvbmx5IHByb3BlcnR5IHRoYXQgcmV0dXJucyB0aGVcblx0ICogdmFsdWUgb2YgdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgb2YgdGhlXG5cdCAqIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZVJlYWRPbmx5UHJvcGVydHkocHJvcGVydHlOYW1lKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFhOb2RlLnByb3RvdHlwZSwgcHJvcGVydHlOYW1lLCB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5ub2RlW3Byb3BlcnR5TmFtZV07XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcmVhZCB3cml0ZSBwcm9wZXJ0eSB0aGF0IG9wZXJhdGVzIG9uXG5cdCAqIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5IG9mIHRoZSB1bmRlcmx5aW5nXG5cdCAqIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoWE5vZGUucHJvdG90eXBlLCBwcm9wZXJ0eU5hbWUsIHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm5vZGVbcHJvcGVydHlOYW1lXTtcblx0XHRcdH0sXG5cblx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0dGhpcy5ub2RlW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBtZXRob2QgdGhhdCByb3V0ZXMgdGhlIGNhbGwgdGhyb3VnaCwgZG93blxuXHQgKiB0byB0aGUgc2FtZSBtZXRob2Qgb24gdGhlIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZU1ldGhvZChtZXRob2ROYW1lKSB7XG5cdFx0WE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5ub2RlW21ldGhvZE5hbWVdLmFwcGx5KHRoaXMubm9kZSwgYXJndW1lbnRzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogTW9kaWZ5IHRoZSBOb2RlLnByb3BlcnR5IGZ1bmN0aW9uLCBzbyB0aGF0IGl0IGFjY2VwdHNcblx0ICogWE5vZGUgb2JqZWN0cy4gQWxsIFhOb2RlIG9iamVjdHMgd2lsbCBiZSBjaGFuZ2VkIHRvXG5cdCAqIHRoZSB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0cywgYW5kIHRoZSBjb3JyZXNwb25kaW5nXG5cdCAqIG1ldGhvZCB3aWxsIGJlIGNhbGxlZC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZU5vZGVUb1hOb2RlTWV0aG9kV3JhcHBlcihtZXRob2ROYW1lKSB7XG5cdFx0dmFyIG9yaWdpbmFsRnVuY3Rpb24gPSBOb2RlLnByb3RvdHlwZVttZXRob2ROYW1lXTtcblxuXHRcdE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRmb3IgKHZhciBhIGluIGFyZ3VtZW50cykge1xuXHRcdFx0XHRpZiAoYXJndW1lbnRzW2FdIGluc3RhbmNlb2YgWE5vZGUpXG5cdFx0XHRcdFx0YXJndW1lbnRzW2FdID0gYXJndW1lbnRzW2FdLm5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB1cCByZWFkIG9ubHkgcHJvcGVydGllcy5cblx0ICovXG5cdGNyZWF0ZVhOb2RlUmVhZE9ubHlQcm9wZXJ0eShcInN0eWxlXCIpO1xuXG5cdC8qKlxuXHQgKiBTZXQgdXAgcmVhZC93cml0ZSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImlubmVySFRNTFwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImhyZWZcIik7XG5cdGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkoXCJpZFwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcInZhbHVlXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwidHlwZVwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImNsYXNzTmFtZVwiKTtcblxuXHQvKipcblx0ICogU2V0IHVwIG1ldGhvZHMgdG8gYmUgcm91dGVkIHRvIHRoZSB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJhcHBlbmRDaGlsZFwiKTtcblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJyZW1vdmVDaGlsZFwiKTtcblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJhZGRFdmVudExpc3RlbmVyXCIpO1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcInJlbW92ZUV2ZW50TGlzdGVuZXJcIik7XG5cblx0LyoqXG5cdCAqIFNldCB1cCBtZXRob2RzIG9uIE5vZGUucHJvcGVydHkuXG5cdCAqL1xuXHRjcmVhdGVOb2RlVG9YTm9kZU1ldGhvZFdyYXBwZXIoXCJhcHBlbmRDaGlsZFwiKTtcblx0Y3JlYXRlTm9kZVRvWE5vZGVNZXRob2RXcmFwcGVyKFwicmVtb3ZlQ2hpbGRcIik7XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBldmVudCBsaXN0ZW5lciBhbGlhc2VzLlxuXHQgKi9cblx0WE5vZGUucHJvdG90eXBlLm9uID0gWE5vZGUucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cdFhOb2RlLnByb3RvdHlwZS5vZmYgPSBYTm9kZS5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblxuXHQvKipcblx0ICogV29yayBib3RoIGFzIGEgbnBtIG1vZHVsZSBhbmQgc3RhbmRhbG9uZS5cblx0ICovXG5cdHZhciB0YXJnZXQ7XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IHRhcmdldDtcblx0fSBlbHNlIHtcblx0XHR4bm9kZSA9IHt9O1xuXHRcdHRhcmdldCA9IHhub2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBleHRlbmRlZCBjbGFzc2VzLlxuXHQgKi9cblx0dGFyZ2V0LkRpdiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwiZGl2XCIpO1xuXHR0YXJnZXQuQnV0dG9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdHRhcmdldC5VbCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwidWxcIik7XG5cdHRhcmdldC5MaSA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwibGlcIik7XG5cdHRhcmdldC5BID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJhXCIpO1xuXHR0YXJnZXQuT3B0aW9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJvcHRpb25cIik7XG5cdHRhcmdldC5TZWxlY3QgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcInNlbGVjdFwiKTtcblx0dGFyZ2V0LklucHV0ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJpbnB1dFwiKTtcblx0dGFyZ2V0Lk5hdiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwibmF2XCIpO1xuXHR0YXJnZXQuU3BhbiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwic3BhblwiKTtcbn0pKCk7IiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCJ5YWVkXCIpO1xuXG4vKipcbiAqIENvbGxlY3Rpb24uXG4gKiBAY2xhc3MgQ29sbGVjdGlvblxuICovXG5mdW5jdGlvbiBDb2xsZWN0aW9uKCkge1xuXHR0aGlzLml0ZW1zID0gW107XG59XG5cbmluaGVyaXRzKENvbGxlY3Rpb24sIEV2ZW50RGlzcGF0Y2hlcik7XG5cbi8qKlxuICogQWRkIGl0ZW0gYXQgZW5kLlxuICogQG1ldGhvZCBhZGRJdGVtXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmFkZEl0ZW0gPSBmdW5jdGlvbihpdGVtKSB7XG5cdHRoaXMuaXRlbXMucHVzaChpdGVtKTtcblxuXHR0aGlzLnRyaWdnZXJDaGFuZ2UoXCJhZGRcIiwgaXRlbSwgdGhpcy5pdGVtcy5sZW5ndGggLSAxKTtcbn1cblxuLyoqXG4gKiBBZGQgaXRlbSBhdCBpbmRleC5cbiAqIEBtZXRob2QgYWRkSXRlbVxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5hZGRJdGVtQXQgPSBmdW5jdGlvbihpbmRleCwgaXRlbSkge1xuXHRpZiAoaW5kZXggPCAwKVxuXHRcdGluZGV4ID0gMDtcblxuXHRpZiAoaW5kZXggPiB0aGlzLml0ZW1zLmxlbmd0aClcblx0XHRpbmRleCA9IHRoaXMuaXRlbXMubGVuZ3RoO1xuXG5cdHZhciBhZnRlciA9IHRoaXMuaXRlbXMuc3BsaWNlKGluZGV4KTtcblx0dGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuXHR0aGlzLml0ZW1zID0gdGhpcy5pdGVtcy5jb25jYXQoYWZ0ZXIpO1xuXG5cdHRoaXMudHJpZ2dlckNoYW5nZShcImFkZFwiLCBpdGVtLCBpbmRleCk7XG59XG5cbi8qKlxuICogR2V0IGxlbmd0aC5cbiAqIEBtZXRob2QgZ2V0TGVuZ3RoXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmdldExlbmd0aCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XG59XG5cbi8qKlxuICogR2V0IGl0ZW0gYXQgaW5kZXguXG4gKiBAbWV0aG9kIGdldEl0ZW1BdFxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5nZXRJdGVtQXQgPSBmdW5jdGlvbihpbmRleCkge1xuXHRyZXR1cm4gdGhpcy5pdGVtc1tpbmRleF07XG59XG5cbi8qKlxuICogRmluZCBpdGVtIGluZGV4LlxuICogQG1ldGhvZCBnZXRJdGVtSW5kZXhcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuZ2V0SXRlbUluZGV4ID0gZnVuY3Rpb24oaXRlbSkge1xuXHRyZXR1cm4gdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xufVxuXG4vKipcbiAqIFJlbW92ZSBpdGVtIGF0LlxuICogQG1ldGhvZCByZW1vdmVJdGVtQXRcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUucmVtb3ZlSXRlbUF0ID0gZnVuY3Rpb24oaW5kZXgpIHtcblx0aWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLml0ZW1zLmxlbmd0aClcblx0XHRyZXR1cm47XG5cblx0dmFyIGl0ZW0gPSB0aGlzLmdldEl0ZW1BdChpbmRleCk7XG5cblx0dGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHR0aGlzLnRyaWdnZXJDaGFuZ2UoXCJyZW1vdmVcIiwgaXRlbSwgaW5kZXgpO1xufVxuXG4vKipcbiAqIFJlbW92ZSBpdGVtLlxuICogQG1ldGhvZCByZW1vdmVJdGVtXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbihpdGVtKSB7XG5cdHZhciBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KGl0ZW0pO1xuXG5cdHRoaXMucmVtb3ZlSXRlbUF0KGluZGV4KTtcbn1cblxuLyoqXG4gKiBUcmlnZ2VyIGNoYW5nZSBldmVudC5cbiAqIEBtZXRob2QgdHJpZ2dlckNoYW5nZVxuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUudHJpZ2dlckNoYW5nZSA9IGZ1bmN0aW9uKGV2ZW50S2luZCwgaXRlbSwgaW5kZXgpIHtcblx0dGhpcy50cmlnZ2VyKHtcblx0XHR0eXBlOiBldmVudEtpbmQsXG5cdFx0aXRlbTogaXRlbSxcblx0XHRpbmRleDogaW5kZXhcblx0fSk7XG5cblx0dGhpcy50cmlnZ2VyKHtcblx0XHR0eXBlOiBcImNoYW5nZVwiLFxuXHRcdGtpbmQ6IGV2ZW50S2luZCxcblx0XHRpdGVtOiBpdGVtLFxuXHRcdGluZGV4OiBpbmRleFxuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsZWN0aW9uOyIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwieWFlZFwiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciBDb2xsZWN0aW9uVmlld01hbmFnZXI9cmVxdWlyZShcIi4vQ29sbGVjdGlvblZpZXdNYW5hZ2VyXCIpO1xuXG4vKipcbiAqIENvbGxlY3Rpb25WaWV3LlxuICogQGNsYXNzIENvbGxlY3Rpb25WaWV3XG4gKi9cbmZ1bmN0aW9uIENvbGxlY3Rpb25WaWV3KCkge1xuXHR4bm9kZS5EaXYuY2FsbCh0aGlzKTtcblxuXHR0aGlzLm1hbmFnZXI9bmV3IENvbGxlY3Rpb25WaWV3TWFuYWdlcih0aGlzKTtcbn1cblxuaW5oZXJpdHMoQ29sbGVjdGlvblZpZXcsIHhub2RlLkRpdik7XG5cbi8qKlxuICogU2V0IGl0ZW0gcmVuZGVyZXIgY2xhc3MuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckNsYXNzXG4gKi9cbkNvbGxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXRJdGVtUmVuZGVyZXJDbGFzcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMubWFuYWdlci5zZXRJdGVtUmVuZGVyZXJDbGFzcyh2YWx1ZSk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gcmVuZGVyZXIgZmFjdG9yeS5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyRmFjdG9yeVxuICovXG5Db2xsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0SXRlbVJlbmRlcmVyRmFjdG9yeSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMubWFuYWdlci5zZXRJdGVtUmVuZGVyZXJGYWN0b3J5KHZhbHVlKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSBjb250cm9sbGVyIGNsYXNzLlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJDbGFzc1xuICovXG5Db2xsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0SXRlbUNvbnRyb2xsZXJDbGFzcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMubWFuYWdlci5zZXRJdGVtQ29udHJvbGxlckNsYXNzKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSBjb250cm9sbGVyIGZhY3RvcnkuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckZhY3RvcnlcbiAqL1xuQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLnNldEl0ZW1Db250cm9sbGVyRmFjdG9yeSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMubWFuYWdlci5zZXRJdGVtQ29udHJvbGxlckZhY3RvcnkodmFsdWUpO1xufVxuXG4vKipcbiAqIFNldCBkYXRhIHNvdXJjZS5cbiAqIEBtZXRob2Qgc2V0RGF0YVNvdXJjZVxuICovXG5Db2xsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0RGF0YVNvdXJjZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMubWFuYWdlci5zZXREYXRhU291cmNlKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsZWN0aW9uVmlldzsiLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcInlhZWRcIik7XG52YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG5cbi8qKlxuICogQ29sbGVjdGlvblZpZXdNYW5hZ2VyLlxuICogQGNsYXNzIENvbGxlY3Rpb25WaWV3TWFuYWdlclxuICovXG5mdW5jdGlvbiBDb2xsZWN0aW9uVmlld01hbmFnZXIodGFyZ2V0KSB7XG5cdHRoaXMuaXRlbVJlbmRlcmVycyA9IFtdO1xuXHR0aGlzLml0ZW1SZW5kZXJlckNsYXNzID0gbnVsbDtcblx0dGhpcy5pdGVtUmVuZGVyZXJGYWN0b3J5ID0gbnVsbDtcblx0dGhpcy5pdGVtQ29udHJvbGxlckNsYXNzID0gbnVsbDtcblx0dGhpcy5pdGVtQ29udHJvbGxlckZhY3RvcnkgPSBudWxsO1xuXHR0aGlzLmRhdGFTb3VyY2UgPSBudWxsO1xuXHR0aGlzLnRhcmdldCA9IG51bGw7XG5cblx0dGhpcy5zZXRUYXJnZXQodGFyZ2V0KTtcbn1cblxuLyoqXG4gKiBTZXQgdGFyZ2V0LlxuICogQG1ldGhvZCBzZXRUYXJnZXRcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5zZXRUYXJnZXQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLnJlbW92ZUFsbEl0ZW1SZW5kZXJlcnMoKTtcblx0dGhpcy50YXJnZXQ9dmFsdWU7XG5cdHRoaXMucmVtb3ZlQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIHJlbmRlcmVyIGNsYXNzLlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJDbGFzc1xuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldEl0ZW1SZW5kZXJlckNsYXNzID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIGl0ZW0gcmVuZGVyZXIgY2xhc3Mgc2hvdWxkIGJlIGEgZnVuY3Rpb25cIik7XG5cblx0dGhpcy5pdGVtUmVuZGVyZXJDbGFzcyA9IHZhbHVlO1xuXHR0aGlzLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gcmVuZGVyZXIgZmFjdG9yeS5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyRmFjdG9yeVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldEl0ZW1SZW5kZXJlckZhY3RvcnkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgaXRlbSByZW5kZXJlciBmYWN0b3J5IHNob3VsZCBiZSBhIGZ1bmN0aW9uXCIpO1xuXG5cdHRoaXMuaXRlbVJlbmRlcmVyRmFjdG9yeSA9IHZhbHVlO1xuXHR0aGlzLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gY29udHJvbGxlciBjbGFzcy5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyQ2xhc3NcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5zZXRJdGVtQ29udHJvbGxlckNsYXNzID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIGl0ZW0gcmVuZGVyZXIgY2xhc3Mgc2hvdWxkIGJlIGEgZnVuY3Rpb25cIik7XG5cblx0dGhpcy5pdGVtQ29udHJvbGxlckNsYXNzID0gdmFsdWU7XG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSBjb250cm9sbGVyIGZhY3RvcnkuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckZhY3RvcnlcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5zZXRJdGVtQ29udHJvbGxlckZhY3RvcnkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgaXRlbSByZW5kZXJlciBmYWN0b3J5IHNob3VsZCBiZSBhIGZ1bmN0aW9uXCIpO1xuXG5cdHRoaXMuaXRlbUNvbnRyb2xsZXJGYWN0b3J5ID0gdmFsdWU7XG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTZXQgZGF0YSBzb3VyY2UuXG4gKiBAbWV0aG9kIHNldERhdGFTb3VyY2VcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5zZXREYXRhU291cmNlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHRoaXMuZGF0YVNvdXJjZSkge1xuXHRcdHRoaXMuZGF0YVNvdXJjZS5vZmYoXCJjaGFuZ2VcIiwgdGhpcy5vbkRhdGFTb3VyY2VDaGFuZ2UsIHRoaXMpO1xuXHR9XG5cblx0dGhpcy5kYXRhU291cmNlID0gdmFsdWU7XG5cblx0aWYgKHRoaXMuZGF0YVNvdXJjZSkge1xuXHRcdHRoaXMuZGF0YVNvdXJjZS5vbihcImNoYW5nZVwiLCB0aGlzLm9uRGF0YVNvdXJjZUNoYW5nZSwgdGhpcyk7XG5cdH1cblxuXHR0aGlzLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogU29tZXRoaW5nIGluIHRoZSBkYXRhIHNvdXJjZSB3YXMgY2hhbmdlZC5cbiAqIEBtZXRob2Qgb25EYXRhU291cmNlQ2hhbmdlXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLm9uRGF0YVNvdXJjZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFsbCBpdGVtIHJlbmRlcmVycy5cbiAqIEBtZXRob2QgcmVtb3ZlQWxsSXRlbVJlbmRlcmVyc1xuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVBbGxJdGVtUmVuZGVyZXJzID0gZnVuY3Rpb24oKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pdGVtUmVuZGVyZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKHRoaXMuaXRlbVJlbmRlcmVyc1tpXS5fX2NvbnRyb2xsZXIpXG5cdFx0XHR0aGlzLml0ZW1SZW5kZXJlcnNbaV0uX19jb250cm9sbGVyLnNldERhdGEobnVsbCk7XG5cblx0XHRlbHNlXG5cdFx0XHR0aGlzLml0ZW1SZW5kZXJlcnNbaV0uc2V0RGF0YShudWxsKTtcblxuXHRcdHRoaXMudGFyZ2V0LnJlbW92ZUNoaWxkKHRoaXMuaXRlbVJlbmRlcmVyc1tpXSk7XG5cdH1cblxuXHR0aGlzLml0ZW1SZW5kZXJlcnMgPSBbXTtcbn1cblxuLyoqXG4gKiBSZWZyZXNoIGFsbCBpdGVtIHJlbmRlcmVycy5cbiAqIEBtZXRob2QgcmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnNcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZW1vdmVBbGxJdGVtUmVuZGVyZXJzKCk7XG5cblx0aWYgKCF0aGlzLmRhdGFTb3VyY2UpXG5cdFx0cmV0dXJuO1xuXG5cdGlmICghdGhpcy5pdGVtUmVuZGVyZXJDbGFzcyAmJiAhdGhpcy5pdGVtUmVuZGVyZXJGYWN0b3J5KVxuXHRcdHJldHVybjtcblxuXHRpZiAoIXRoaXMudGFyZ2V0KVxuXHRcdHJldHVybjtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGF0YVNvdXJjZS5nZXRMZW5ndGgoKTsgaSsrKSB7XG5cdFx0dmFyIGRhdGEgPSB0aGlzLmRhdGFTb3VyY2UuZ2V0SXRlbUF0KGkpO1xuXHRcdHZhciByZW5kZXJlciA9IHRoaXMuY3JlYXRlSXRlbVJlbmRlcmVyKCk7XG5cblx0XHRpZiAodGhpcy5pdGVtQ29udHJvbGxlckNsYXNzIHx8IHRoaXMuaXRlbUNvbnRyb2xsZXJGYWN0b3J5KSB7XG5cdFx0XHRyZW5kZXJlci5fX2NvbnRyb2xsZXIgPSB0aGlzLmNyZWF0ZUl0ZW1Db250cm9sbGVyKHJlbmRlcmVyKTtcblx0XHRcdHJlbmRlcmVyLl9fY29udHJvbGxlci5zZXREYXRhKGRhdGEpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW5kZXJlci5zZXREYXRhKGRhdGEpO1xuXHRcdH1cblxuXHRcdHRoaXMuaXRlbVJlbmRlcmVycy5wdXNoKHJlbmRlcmVyKTtcblx0XHR0aGlzLnRhcmdldC5hcHBlbmRDaGlsZChyZW5kZXJlcik7XG5cdH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgaXRlbSByZW5kZXJlci5cbiAqIEBtZXRob2QgY3JlYXRlSXRlbVJlbmRlcmVyXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLmNyZWF0ZUl0ZW1SZW5kZXJlciA9IGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5pdGVtUmVuZGVyZXJGYWN0b3J5KVxuXHRcdHJldHVybiB0aGlzLml0ZW1SZW5kZXJlckZhY3RvcnkoKTtcblxuXHRpZiAodGhpcy5pdGVtUmVuZGVyZXJDbGFzcylcblx0XHRyZXR1cm4gbmV3IHRoaXMuaXRlbVJlbmRlcmVyQ2xhc3MoKTtcblxuXHR0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBjcmVhdGUgaXRlbSByZW5kZXJlciFcIik7XG59XG5cbi8qKlxuICogQ3JlYXRlIGl0ZW0gY29udHJvbGxlci5cbiAqIEBtZXRob2QgY3JlYXRlSXRlbUNvbnRyb2xsZXJcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuY3JlYXRlSXRlbUNvbnRyb2xsZXIgPSBmdW5jdGlvbihyZW5kZXJlcikge1xuXHRpZiAodGhpcy5pdGVtQ29udHJvbGxlckZhY3RvcnkpXG5cdFx0cmV0dXJuIHRoaXMuaXRlbUNvbnRyb2xsZXJGYWN0b3J5KHJlbmRlcmVyKTtcblxuXHRpZiAodGhpcy5pdGVtQ29udHJvbGxlckNsYXNzKVxuXHRcdHJldHVybiBuZXcgdGhpcy5pdGVtQ29udHJvbGxlckNsYXNzKHJlbmRlcmVyKTtcblxuXHR0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBjcmVhdGUgaXRlbSBjb250cm9sbGVyIVwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsZWN0aW9uVmlld01hbmFnZXI7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdENvbGxlY3Rpb246IHJlcXVpcmUoXCIuL0NvbGxlY3Rpb25cIiksXG5cdENvbGxlY3Rpb25WaWV3OiByZXF1aXJlKFwiLi9Db2xsZWN0aW9uVmlld1wiKSxcblx0Q29sbGVjdGlvblZpZXdNYW5hZ2VyOiByZXF1aXJlKFwiLi9Db2xsZWN0aW9uVmlld01hbmFnZXJcIilcbn07IiwiLyoqXG4gKiBBUzMvanF1ZXJ5IHN0eWxlIGV2ZW50IGRpc3BhdGNoZXIuIFNsaWdodGx5IG1vZGlmaWVkLiBUaGVcbiAqIGpxdWVyeSBzdHlsZSBvbi9vZmYvdHJpZ2dlciBzdHlsZSBvZiBhZGRpbmcgbGlzdGVuZXJzIGlzXG4gKiBjdXJyZW50bHkgdGhlIHByZWZlcnJlZCBvbmUuXG4gKlxuICogVGhlIG9uIG1ldGhvZCBmb3IgYWRkaW5nIGxpc3RlbmVycyB0YWtlcyBhbiBleHRyYSBwYXJhbWV0ZXIgd2hpY2ggaXMgdGhlXG4gKiBzY29wZSBpbiB3aGljaCBsaXN0ZW5lcnMgc2hvdWxkIGJlIGNhbGxlZC4gU28gdGhpczpcbiAqXG4gKiAgICAgb2JqZWN0Lm9uKFwiZXZlbnRcIiwgbGlzdGVuZXIsIHRoaXMpO1xuICpcbiAqIEhhcyB0aGUgc2FtZSBmdW5jdGlvbiB3aGVuIGFkZGluZyBldmVudHMgYXM6XG4gKlxuICogICAgIG9iamVjdC5vbihcImV2ZW50XCIsIGxpc3RlbmVyLmJpbmQodGhpcykpO1xuICpcbiAqIEhvd2V2ZXIsIHRoZSBkaWZmZXJlbmNlIGlzIHRoYXQgaWYgd2UgdXNlIHRoZSBzZWNvbmQgbWV0aG9kIGl0XG4gKiB3aWxsIG5vdCBiZSBwb3NzaWJsZSB0byByZW1vdmUgdGhlIGxpc3RlbmVycyBsYXRlciwgdW5sZXNzXG4gKiB0aGUgY2xvc3VyZSBjcmVhdGVkIGJ5IGJpbmQgaXMgc3RvcmVkIHNvbWV3aGVyZS4gSWYgdGhlXG4gKiBmaXJzdCBtZXRob2QgaXMgdXNlZCwgd2UgY2FuIHJlbW92ZSB0aGUgbGlzdGVuZXIgd2l0aDpcbiAqXG4gKiAgICAgb2JqZWN0Lm9mZihcImV2ZW50XCIsIGxpc3RlbmVyLCB0aGlzKTtcbiAqXG4gKiBAY2xhc3MgRXZlbnREaXNwYXRjaGVyXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RGlzcGF0Y2hlcigpIHtcblx0dGhpcy5saXN0ZW5lck1hcCA9IHt9O1xufVxuXG4vKipcbiAqIEFkZCBldmVudCBsaXN0ZW5lci5cbiAqIEBtZXRob2QgYWRkRXZlbnRMaXN0ZW5lclxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudFR5cGUsIGxpc3RlbmVyLCBzY29wZSkge1xuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXApXG5cdFx0dGhpcy5saXN0ZW5lck1hcCA9IHt9O1xuXG5cdGlmICghZXZlbnRUeXBlKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIkV2ZW50IHR5cGUgcmVxdWlyZWQgZm9yIGV2ZW50IGRpc3BhdGNoZXJcIik7XG5cblx0aWYgKCFsaXN0ZW5lcilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJMaXN0ZW5lciByZXF1aXJlZCBmb3IgZXZlbnQgZGlzcGF0Y2hlclwiKTtcblxuXHR0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBsaXN0ZW5lciwgc2NvcGUpO1xuXG5cdGlmICghdGhpcy5saXN0ZW5lck1hcC5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKVxuXHRcdHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXSA9IFtdO1xuXG5cdHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXS5wdXNoKHtcblx0XHRsaXN0ZW5lcjogbGlzdGVuZXIsXG5cdFx0c2NvcGU6IHNjb3BlXG5cdH0pO1xufVxuXG4vKipcbiAqIFJlbW92ZSBldmVudCBsaXN0ZW5lci5cbiAqIEBtZXRob2QgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudFR5cGUsIGxpc3RlbmVyLCBzY29wZSkge1xuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXApXG5cdFx0dGhpcy5saXN0ZW5lck1hcCA9IHt9O1xuXG5cdGlmICghdGhpcy5saXN0ZW5lck1hcC5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKVxuXHRcdHJldHVybjtcblxuXHR2YXIgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGxpc3RlbmVyT2JqID0gbGlzdGVuZXJzW2ldO1xuXG5cdFx0aWYgKGxpc3RlbmVyID09IGxpc3RlbmVyT2JqLmxpc3RlbmVyICYmIHNjb3BlID09IGxpc3RlbmVyT2JqLnNjb3BlKSB7XG5cdFx0XHRsaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0aS0tO1xuXHRcdH1cblx0fVxuXG5cdGlmICghbGlzdGVuZXJzLmxlbmd0aClcblx0XHRkZWxldGUgdGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdO1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGV2ZW50LlxuICogQG1ldGhvZCBkaXNwYXRjaEV2ZW50XG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKGV2ZW50IC8qIC4uLiAqLyApIHtcblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwKVxuXHRcdHRoaXMubGlzdGVuZXJNYXAgPSB7fTtcblxuXHR2YXIgZXZlbnRUeXBlO1xuXHR2YXIgbGlzdGVuZXJQYXJhbXM7XG5cblx0aWYgKHR5cGVvZiBldmVudCA9PSBcInN0cmluZ1wiKSB7XG5cdFx0ZXZlbnRUeXBlID0gZXZlbnQ7XG5cblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpXG5cdFx0XHRsaXN0ZW5lclBhcmFtcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cblx0XHRlbHNlIGxpc3RlbmVyUGFyYW1zID0gW3tcblx0XHRcdHR5cGU6IGV2ZW50VHlwZSxcblx0XHRcdHRhcmdldDogdGhpc1xuXHRcdH1dO1xuXHR9IGVsc2Uge1xuXHRcdGV2ZW50VHlwZSA9IGV2ZW50LnR5cGU7XG5cdFx0ZXZlbnQudGFyZ2V0ID0gdGhpcztcblx0XHRsaXN0ZW5lclBhcmFtcyA9IFtldmVudF07XG5cdH1cblxuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXAuaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSlcblx0XHRyZXR1cm47XG5cblx0Zm9yICh2YXIgaSBpbiB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV0pIHtcblx0XHR2YXIgbGlzdGVuZXJPYmogPSB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV1baV07XG5cdFx0bGlzdGVuZXJPYmoubGlzdGVuZXIuYXBwbHkobGlzdGVuZXJPYmouc2NvcGUsIGxpc3RlbmVyUGFyYW1zKTtcblx0fVxufVxuXG4vKipcbiAqIEpxdWVyeSBzdHlsZSBhbGlhcyBmb3IgYWRkRXZlbnRMaXN0ZW5lclxuICogQG1ldGhvZCBvblxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLm9uID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyO1xuXG4vKipcbiAqIEpxdWVyeSBzdHlsZSBhbGlhcyBmb3IgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuICogQG1ldGhvZCBvZmZcbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5vZmYgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cbi8qKlxuICogSnF1ZXJ5IHN0eWxlIGFsaWFzIGZvciBkaXNwYXRjaEV2ZW50XG4gKiBAbWV0aG9kIHRyaWdnZXJcbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS50cmlnZ2VyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50O1xuXG4vKipcbiAqIE1ha2Ugc29tZXRoaW5nIGFuIGV2ZW50IGRpc3BhdGNoZXIuIENhbiBiZSB1c2VkIGZvciBtdWx0aXBsZSBpbmhlcml0YW5jZS5cbiAqIEBtZXRob2QgaW5pdFxuICogQHN0YXRpY1xuICovXG5FdmVudERpc3BhdGNoZXIuaW5pdCA9IGZ1bmN0aW9uKGNscykge1xuXHRjbHMucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cdGNscy5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblx0Y2xzLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50O1xuXHRjbHMucHJvdG90eXBlLm9uID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5vbjtcblx0Y2xzLnByb3RvdHlwZS5vZmYgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLm9mZjtcblx0Y2xzLnByb3RvdHlwZS50cmlnZ2VyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS50cmlnZ2VyO1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBFdmVudERpc3BhdGNoZXI7XG59IiwidmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIEFwcFZpZXcgPSByZXF1aXJlKFwiLi4vdmlldy9BcHBWaWV3XCIpO1xudmFyIEFwcE1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL0FwcE1vZGVsXCIpO1xudmFyIEFwcENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi4vY29udHJvbGxlci9BcHBDb250cm9sbGVyXCIpO1xuXG4vKipcbiAqIFRoZSBtYWluIHJlc291cmNlIGZpZGRsZSBhcHAgY2xhc3MuXG4gKiBAY2xhc3MgQXBwXG4gKi9cbmZ1bmN0aW9uIEFwcCgpIHtcblx0eG5vZGUuRGl2LmNhbGwodGhpcyk7XG5cblx0dGhpcy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0dGhpcy5zdHlsZS50b3AgPSAwO1xuXHR0aGlzLnN0eWxlLmJvdHRvbSA9IDA7XG5cdHRoaXMuc3R5bGUubGVmdCA9IDA7XG5cdHRoaXMuc3R5bGUucmlnaHQgPSAwO1xuXG5cdHRoaXMuYXBwVmlldyA9IG5ldyBBcHBWaWV3KCk7XG5cdHRoaXMuYXBwTW9kZWwgPSBuZXcgQXBwTW9kZWwoKTtcblx0dGhpcy5hcHBDb250cm9sbGVyID0gbmV3IEFwcENvbnRyb2xsZXIodGhpcy5hcHBNb2RlbCwgdGhpcy5hcHBWaWV3KTtcblxuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMuYXBwVmlldyk7XG59XG5cbmluaGVyaXRzKEFwcCwgeG5vZGUuRGl2KTtcblxuLyoqXG4gKiBHZXQgbW9kZWwuXG4gKiBAbWV0aG9kIGdldE1vZGVsXG4gKi9cbkFwcC5wcm90b3R5cGUuZ2V0TW9kZWwgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuYXBwTW9kZWw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwOyIsInZhciBSZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXJcIik7XG52YXIgUmVzb3VyY2VUYWJDb250cm9sbGVyID0gcmVxdWlyZShcIi4vUmVzb3VyY2VUYWJDb250cm9sbGVyXCIpO1xuXG4vKipcbiAqIEFwcCBjb250cm9sbGVyXG4gKiBAY2xhc3MgQXBwQ29udHJvbGxlclxuICovXG5mdW5jdGlvbiBBcHBDb250cm9sbGVyKGFwcE1vZGVsLCBhcHBWaWV3KSB7XG5cdHRoaXMuYXBwTW9kZWwgPSBhcHBNb2RlbDtcblx0dGhpcy5hcHBWaWV3ID0gYXBwVmlldztcblxuXHR0aGlzLmFwcFZpZXcuZ2V0UmVzb3VyY2VQYW5lVmlldygpLnNldFRhYnNDb2xsZWN0aW9uKHRoaXMuYXBwTW9kZWwuZ2V0Q2F0ZWdvcnlDb2xsZWN0aW9uKCkpO1xuXG5cdHRoaXMuYXBwVmlldy5nZXRSZXNvdXJjZVBhbmVWaWV3KCkuZ2V0VGFic0hlYWRlck1hbmFnZXIoKS5zZXRJdGVtQ29udHJvbGxlckNsYXNzKFJlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlcik7XG5cdHRoaXMuYXBwVmlldy5nZXRSZXNvdXJjZVBhbmVWaWV3KCkuZ2V0VGFic01hbmFnZXIoKS5zZXRJdGVtQ29udHJvbGxlckNsYXNzKFJlc291cmNlVGFiQ29udHJvbGxlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwQ29udHJvbGxlcjsiLCIvKipcbiAqIENvbnRyb2wgYSByZXNvdXJjZSBjYXRlZ29yeS5cbiAqIEBtZXRob2QgUmVzb3VyY2VUYWJDb250cm9sbGVyXG4gKi9cbmZ1bmN0aW9uIFJlc291cmNlQ2F0ZWdvcnlDb250cm9sbGVyKGNhdGVnb3J5Vmlldykge1xuXHR0aGlzLmNhdGVnb3J5VmlldyA9IGNhdGVnb3J5Vmlldztcblx0Ly9cdHRoaXMuY2F0ZWdvcnlWaWV3LmdldENhdGVnb3J5TWFuYWdlcigpLnNldEl0ZW1Db250cm9sbGVyQ2xhc3MoUmVzb3VyY2VDYXRlZ29yeUNvbnRyb2xsZXIpO1xuXG5cdHRoaXMuY2F0ZWdvcnlWaWV3Lm9uKFwidGl0bGVDbGlja1wiLCB0aGlzLm9uQ2F0ZWdvcnlWaWV3VGl0bGVDbGljaywgdGhpcyk7XG59XG5cbi8qKlxuICogU2V0IGRhdGEuXG4gKiBAbWV0aG9kIHNldERhdGFcbiAqL1xuUmVzb3VyY2VDYXRlZ29yeUNvbnRyb2xsZXIucHJvdG90eXBlLnNldERhdGEgPSBmdW5jdGlvbihjYXRlZ29yeU1vZGVsKSB7XG5cdGlmICh0aGlzLmNhdGVnb3J5TW9kZWwpIHtcblx0XHR0aGlzLmNhdGVnb3J5TW9kZWwub2ZmKFwiY2hhbmdlXCIsIHRoaXMub25DYXRlZ29yeU1vZGVsQ2hhbmdlLCB0aGlzKTtcblx0XHQvL3RoaXMuY2F0ZWdvcnlWaWV3LnNldENhdGVnb3J5Q29sbGVjdGlvbihudWxsKTtcblx0fVxuXG5cdHRoaXMuY2F0ZWdvcnlNb2RlbCA9IGNhdGVnb3J5TW9kZWw7XG5cblx0aWYgKHRoaXMuY2F0ZWdvcnlNb2RlbCkge1xuXHRcdHRoaXMuY2F0ZWdvcnlNb2RlbC5vbihcImNoYW5nZVwiLCB0aGlzLm9uQ2F0ZWdvcnlNb2RlbENoYW5nZSwgdGhpcyk7XG5cdFx0dGhpcy5jYXRlZ29yeVZpZXcuc2V0QWN0aXZlKGNhdGVnb3J5TW9kZWwuaXNBY3RpdmUoKSk7XG5cdFx0dGhpcy5jYXRlZ29yeVZpZXcuc2V0TGFiZWwoY2F0ZWdvcnlNb2RlbC5nZXRMYWJlbCgpKTtcblxuXHRcdC8vdGhpcy50YWJWaWV3LnNldENhdGVnb3J5Q29sbGVjdGlvbihjYXRlZ29yeU1vZGVsLmdldENhdGVnb3J5Q29sbGVjdGlvbigpKTtcblx0fVxufVxuXG4vKipcbiAqIEhhbmRsZSBjaGFuZ2UgaW4gdGhlIG1vZGVsLlxuICogQG1ldGhvZCBvbkNhdGVnb3J5TW9kZWxDaGFuZ2VcbiAqL1xuUmVzb3VyY2VDYXRlZ29yeUNvbnRyb2xsZXIucHJvdG90eXBlLm9uQ2F0ZWdvcnlNb2RlbENoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmNhdGVnb3J5Vmlldy5zZXRBY3RpdmUodGhpcy5jYXRlZ29yeU1vZGVsLmlzQWN0aXZlKCkpO1xufVxuXG4vKipcbiAqXG4gKi9cblJlc291cmNlQ2F0ZWdvcnlDb250cm9sbGVyLnByb3RvdHlwZS5vbkNhdGVnb3J5Vmlld1RpdGxlQ2xpY2s9ZnVuY3Rpb24oKSB7XG5cdHRoaXMuY2F0ZWdvcnlNb2RlbC5zZXRBY3RpdmUodHJ1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VDYXRlZ29yeUNvbnRyb2xsZXI7IiwidmFyIFJlc291cmNlQ2F0ZWdvcnlDb250cm9sbGVyID0gcmVxdWlyZShcIi4vUmVzb3VyY2VDYXRlZ29yeUNvbnRyb2xsZXJcIik7XG5cbi8qKlxuICogQ29udHJvbCBvbmUgcmVzb3VyY2UgdGFiLlxuICogQG1ldGhvZCBSZXNvdXJjZVRhYkNvbnRyb2xsZXJcbiAqL1xuZnVuY3Rpb24gUmVzb3VyY2VUYWJDb250cm9sbGVyKHRhYlZpZXcpIHtcblx0dGhpcy50YWJWaWV3ID0gdGFiVmlldztcblx0dGhpcy50YWJWaWV3LmdldENhdGVnb3J5TWFuYWdlcigpLnNldEl0ZW1Db250cm9sbGVyQ2xhc3MoUmVzb3VyY2VDYXRlZ29yeUNvbnRyb2xsZXIpO1xufVxuXG4vKipcbiAqIFNldCBkYXRhLlxuICogQG1ldGhvZCBzZXREYXRhXG4gKi9cblJlc291cmNlVGFiQ29udHJvbGxlci5wcm90b3R5cGUuc2V0RGF0YSA9IGZ1bmN0aW9uKGNhdGVnb3J5TW9kZWwpIHtcblx0aWYgKHRoaXMuY2F0ZWdvcnlNb2RlbCkge1xuXHRcdHRoaXMuY2F0ZWdvcnlNb2RlbC5vZmYoXCJjaGFuZ2VcIiwgdGhpcy5vbkNhdGVnb3J5TW9kZWxDaGFuZ2UsIHRoaXMpO1xuXHRcdHRoaXMudGFiVmlldy5zZXRDYXRlZ29yeUNvbGxlY3Rpb24obnVsbCk7XG5cdH1cblxuXHR0aGlzLmNhdGVnb3J5TW9kZWwgPSBjYXRlZ29yeU1vZGVsO1xuXG5cdGlmICh0aGlzLmNhdGVnb3J5TW9kZWwpIHtcblx0XHR0aGlzLmNhdGVnb3J5TW9kZWwub24oXCJjaGFuZ2VcIiwgdGhpcy5vbkNhdGVnb3J5TW9kZWxDaGFuZ2UsIHRoaXMpO1xuXHRcdHRoaXMudGFiVmlldy5zZXRBY3RpdmUoY2F0ZWdvcnlNb2RlbC5pc0FjdGl2ZSgpKTtcblx0XHR0aGlzLnRhYlZpZXcuc2V0Q2F0ZWdvcnlDb2xsZWN0aW9uKGNhdGVnb3J5TW9kZWwuZ2V0Q2F0ZWdvcnlDb2xsZWN0aW9uKCkpO1xuXHR9XG59XG5cbi8qKlxuICogSGFuZGxlIGNoYW5nZSBpbiB0aGUgbW9kZWwuXG4gKiBAbWV0aG9kIG9uQ2F0ZWdvcnlNb2RlbENoYW5nZVxuICovXG5SZXNvdXJjZVRhYkNvbnRyb2xsZXIucHJvdG90eXBlLm9uQ2F0ZWdvcnlNb2RlbENoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnRhYlZpZXcuc2V0QWN0aXZlKHRoaXMuY2F0ZWdvcnlNb2RlbC5pc0FjdGl2ZSgpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZVRhYkNvbnRyb2xsZXI7IiwiLyoqXG4gKiBDb250cm9sIHRoZSBoZWFkZXIgZmllbGQgb2YgdGhlIHRhYmxzIGluIHRoZSByZXNvdXJjZSBwYW5lLlxuICogQG1ldGhvZCBSZXNvdXJjZVRhYkNvbnRyb2xsZXJcbiAqL1xuZnVuY3Rpb24gUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyKHRhYkhlYWRlclZpZXcpIHtcblx0dGhpcy50YWJIZWFkZXJWaWV3ID0gdGFiSGVhZGVyVmlldztcblx0dGhpcy50YWJIZWFkZXJWaWV3LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uVGFiSGVhZGVyVmlld0NsaWNrLmJpbmQodGhpcykpO1xufVxuXG4vKipcbiAqIFNldCBkYXRhLlxuICogQG1ldGhvZCBzZXREYXRhXG4gKi9cblJlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlci5wcm90b3R5cGUuc2V0RGF0YSA9IGZ1bmN0aW9uKGNhdGVnb3J5TW9kZWwpIHtcblx0aWYgKHRoaXMuY2F0ZWdvcnlNb2RlbCkge1xuXHRcdHRoaXMuY2F0ZWdvcnlNb2RlbC5vZmYoXCJjaGFuZ2VcIiwgdGhpcy5vbkNhdGVnb3J5TW9kZWxDaGFuZ2UsIHRoaXMpO1xuXHR9XG5cblx0dGhpcy5jYXRlZ29yeU1vZGVsID0gY2F0ZWdvcnlNb2RlbDtcblxuXHRpZiAodGhpcy5jYXRlZ29yeU1vZGVsKSB7XG5cdFx0dGhpcy5jYXRlZ29yeU1vZGVsLm9uKFwiY2hhbmdlXCIsIHRoaXMub25DYXRlZ29yeU1vZGVsQ2hhbmdlLCB0aGlzKTtcblx0XHR0aGlzLnRhYkhlYWRlclZpZXcuc2V0TGFiZWwoY2F0ZWdvcnlNb2RlbC5nZXRMYWJlbCgpKTtcblx0XHR0aGlzLnRhYkhlYWRlclZpZXcuc2V0QWN0aXZlKGNhdGVnb3J5TW9kZWwuaXNBY3RpdmUoKSk7XG5cdH1cbn1cblxuLyoqXG4gKiBUaGUgdGFiIHdhcyBjbGlja2VkLCBzZXQgdGhpcyB0YWIgYXMgdGhlIGFjdGl2ZSBvbmUuXG4gKiBAbWV0aG9kIG9uVGFiSGVhZGVyVmlld0NsaWNrXG4gKi9cblJlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlci5wcm90b3R5cGUub25UYWJIZWFkZXJWaWV3Q2xpY2sgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jYXRlZ29yeU1vZGVsLnNldEFjdGl2ZSh0cnVlKTtcbn1cblxuLyoqXG4gKiBUaGUgbW9kZWwgY2hhbmdlZC5cbiAqIEBtZXRob2Qgb25DYXRlZ29yeU1vZGVsQ2hhbmdlXG4gKi9cblJlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlci5wcm90b3R5cGUub25DYXRlZ29yeU1vZGVsQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMudGFiSGVhZGVyVmlldy5zZXRBY3RpdmUodGhpcy5jYXRlZ29yeU1vZGVsLmlzQWN0aXZlKCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlcjsiLCJmaWRkbGV1aSA9IHtcblx0QXBwOiByZXF1aXJlKFwiLi9hcHAvQXBwXCIpLFxuXHRDYXRlZ29yeU1vZGVsOiByZXF1aXJlKFwiLi9tb2RlbC9DYXRlZ29yeU1vZGVsXCIpXG59OyIsInZhciB4bm9kZWMgPSByZXF1aXJlKFwieG5vZGVjb2xsZWN0aW9uXCIpO1xuXG4vKipcbiAqIEFwcE1vZGVsXG4gKiBAY2xhc3MgQXBwTW9kZWxcbiAqL1xuZnVuY3Rpb24gQXBwTW9kZWwoKSB7XG5cdHRoaXMuY2F0ZWdvcnlDb2xsZWN0aW9uID0gbmV3IHhub2RlYy5Db2xsZWN0aW9uKCk7XG5cblx0dGhpcy5pZENvdW50ID0gMDtcbn1cblxuLyoqXG4gKiBHZXQgY2F0ZWdvcnkgY29sbGVjdGlvbi5cbiAqIEBtZXRob2QgZ2V0Q2F0ZWdvcnlDb2xsZWN0aW9uXG4gKi9cbkFwcE1vZGVsLnByb3RvdHlwZS5nZXRDYXRlZ29yeUNvbGxlY3Rpb24gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY2F0ZWdvcnlDb2xsZWN0aW9uO1xufVxuXG4vKipcbiAqIEFkZCBjYXRlZ29yeSBtb2RlbC5cbiAqIEBtZXRob2QgYWRkQ2F0ZWdvcnlNb2RlbFxuICovXG5BcHBNb2RlbC5wcm90b3R5cGUuYWRkQ2F0ZWdvcnlNb2RlbCA9IGZ1bmN0aW9uKGNhdGVnb3J5TW9kZWwpIHtcblx0Y2F0ZWdvcnlNb2RlbC5zZXRQYXJlbnRNb2RlbCh0aGlzKTtcblx0dGhpcy5jYXRlZ29yeUNvbGxlY3Rpb24uYWRkSXRlbShjYXRlZ29yeU1vZGVsKTtcblxuXHRpZiAodGhpcy5jYXRlZ29yeUNvbGxlY3Rpb24uZ2V0TGVuZ3RoKCkgPT0gMSlcblx0XHRjYXRlZ29yeU1vZGVsLnNldEFjdGl2ZSh0cnVlKTtcblxuXHRyZXR1cm4gY2F0ZWdvcnlNb2RlbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBNb2RlbDsiLCJ2YXIgQXBwTW9kZWwgPSByZXF1aXJlKFwiLi9BcHBNb2RlbFwiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwieWFlZFwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZWMgPSByZXF1aXJlKFwieG5vZGVjb2xsZWN0aW9uXCIpO1xuXG4vKipcbiAqIEdldCBjYXRlZ29yeSBtb2RlbC5cbiAqIEBjbGFzcyBDYXRlZ29yeU1vZGVsXG4gKi9cbmZ1bmN0aW9uIENhdGVnb3J5TW9kZWwobGFiZWwpIHtcblx0dGhpcy5sYWJlbCA9IGxhYmVsO1xuXHR0aGlzLnBhcmVudE1vZGVsID0gbnVsbDtcblx0dGhpcy5hY3RpdmUgPSBmYWxzZTtcblx0dGhpcy5jYXRlZ29yeUNvbGxlY3Rpb24gPSBuZXcgeG5vZGVjLkNvbGxlY3Rpb24oKTtcbn1cblxuaW5oZXJpdHMoQ2F0ZWdvcnlNb2RlbCwgRXZlbnREaXNwYXRjaGVyKTtcblxuLyoqXG4gKiBTZXQgcmVmZXJlbmNlIHRvIHBhcmVudCBtb2RlbC5cbiAqIEBtZXRob2QgZ2V0UGFyZW50TW9kZWxcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuc2V0UGFyZW50TW9kZWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLnBhcmVudE1vZGVsID0gdmFsdWU7XG59XG5cbi8qKlxuICogR2V0IGxhYmVsLlxuICogQG1ldGhvZCBnZXRMYWJlbFxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5nZXRMYWJlbCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5sYWJlbDtcbn1cblxuLyoqXG4gKiBHZXQgcmVmZXJlbmNlIHRvIGFwcCBtb2RlbC5cbiAqIEBtZXRob2QgZ2V0QXBwTW9kZWxcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuZ2V0QXBwTW9kZWwgPSBmdW5jdGlvbigpIHtcblx0aWYgKCF0aGlzLnBhcmVudE1vZGVsKVxuXHRcdHRocm93IG5ldyBFcnJvcihcInRoZXJlIGlzIG5vIHBhcmVudCFcIik7XG5cblx0dmFyIHAgPSB0aGlzLnBhcmVudE1vZGVsO1xuXG5cdHdoaWxlIChwICYmICEocCBpbnN0YW5jZW9mIEFwcE1vZGVsKSlcblx0XHRwID0gcC5wYXJlbnRNb2RlbDtcblxuXHRyZXR1cm4gcDtcbn1cblxuLyoqXG4gKiBTZXQgYWN0aXZlIHN0YXRlLlxuICogQG1ldGhvZCBzZXRBY3RpdmVcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHZhbHVlID09IHRoaXMuYWN0aXZlKVxuXHRcdHJldHVybjtcblxuXHR2YXIgc2libGluZ3MgPSB0aGlzLnBhcmVudE1vZGVsLmdldENhdGVnb3J5Q29sbGVjdGlvbigpO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc2libGluZ3MuZ2V0TGVuZ3RoKCk7IGkrKylcblx0XHRpZiAoc2libGluZ3MuZ2V0SXRlbUF0KGkpICE9IHRoaXMpXG5cdFx0XHRzaWJsaW5ncy5nZXRJdGVtQXQoaSkuc2V0QWN0aXZlKGZhbHNlKTtcblxuXHR0aGlzLmFjdGl2ZSA9IHZhbHVlO1xuXHR0aGlzLnRyaWdnZXIoXCJjaGFuZ2VcIik7XG59XG5cbi8qKlxuICogSXMgdGhpcyBjYXRlZ29yeSB0aGUgYWN0aXZlIG9uZT9cbiAqIEBtZXRob2QgaXNBY3RpdmVcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuYWN0aXZlO1xufVxuXG4vKipcbiAqIEdldCBjYXRlZ29yeSBjb2xsZWN0aW9uIGZvciBzdWIgY2F0ZWdvcmllcy5cbiAqIEBtZXRob2QgZ2V0Q2F0ZWdvcnlDb2xsZWN0aW9uXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLmdldENhdGVnb3J5Q29sbGVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jYXRlZ29yeUNvbGxlY3Rpb247XG59XG5cbi8qKlxuICogQWRkIHN1YiBjYXRlZ29yeSBtb2RlbC5cbiAqIEBtZXRob2QgYWRkQ2F0ZWdvcnlNb2RlbFxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5hZGRDYXRlZ29yeU1vZGVsID0gZnVuY3Rpb24oY2F0ZWdvcnlNb2RlbCkge1xuXHRjYXRlZ29yeU1vZGVsLnNldFBhcmVudE1vZGVsKHRoaXMpO1xuXHR0aGlzLmNhdGVnb3J5Q29sbGVjdGlvbi5hZGRJdGVtKGNhdGVnb3J5TW9kZWwpO1xuXG5cdGlmICh0aGlzLmNhdGVnb3J5Q29sbGVjdGlvbi5nZXRMZW5ndGgoKSA9PSAxKVxuXHRcdHRoaXMuY2F0ZWdvcnlDb2xsZWN0aW9uLmdldEl0ZW1BdCgwKS5zZXRBY3RpdmUodHJ1ZSk7XG5cblx0cmV0dXJuIGNhdGVnb3J5TW9kZWw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2F0ZWdvcnlNb2RlbDsiLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgUmVzb3VyY2VQYW5lVmlldyA9IHJlcXVpcmUoXCIuL1Jlc291cmNlUGFuZVZpZXdcIik7XG5cbi8qKlxuICogTWFpbiBhcHBsaWNhdGlvbiB2aWV3LlxuICogQGNsYXNzIEFwcFZpZXdcbiAqL1xuZnVuY3Rpb24gQXBwVmlldygpIHtcblx0eG5vZGUuRGl2LmNhbGwodGhpcyk7XG5cblx0dGhpcy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0dGhpcy5zdHlsZS50b3AgPSAwO1xuXHR0aGlzLnN0eWxlLmxlZnQgPSAwO1xuXHR0aGlzLnN0eWxlLnJpZ2h0ID0gMDtcblx0dGhpcy5zdHlsZS5ib3R0b20gPSAwO1xuXG5cdHRoaXMucmVzb3VyY2VQYW5lVmlldyA9IG5ldyBSZXNvdXJjZVBhbmVWaWV3KCk7XG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5yZXNvdXJjZVBhbmVWaWV3KTtcbn1cblxuaW5oZXJpdHMoQXBwVmlldywgeG5vZGUuRGl2KTtcblxuQXBwVmlldy5wcm90b3R5cGUuZ2V0UmVzb3VyY2VQYW5lVmlldyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5yZXNvdXJjZVBhbmVWaWV3O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFZpZXc7IiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCJ5YWVkXCIpO1xuXG5mdW5jdGlvbiBSZXNvdXJjZUNhdGVnb3J5VmlldygpIHtcblx0eG5vZGUuRGl2LmNhbGwodGhpcyk7XG5cblx0dGhpcy50aXRsZSA9IG5ldyB4bm9kZS5EaXYoKTtcblx0dGhpcy50aXRsZS5jbGFzc05hbWUgPSBcInRpdGxlXCI7XG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy50aXRsZSk7XG5cdHRoaXMudGl0bGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25UaXRsZUNsaWNrLmJpbmQodGhpcykpO1xuXG5cdHZhciBpY29uID0gbmV3IHhub2RlLkRpdigpO1xuXHRpY29uLmNsYXNzTmFtZSA9IFwiZHJvcGRvd24gaWNvblwiO1xuXHR0aGlzLnRpdGxlLmFwcGVuZENoaWxkKGljb24pO1xuXG5cdHRoaXMudGl0bGVTcGFuID0gbmV3IHhub2RlLlNwYW4oKTtcblx0dGhpcy50aXRsZS5hcHBlbmRDaGlsZCh0aGlzLnRpdGxlU3Bhbik7XG5cblx0dGhpcy5jb250ZW50ID0gbmV3IHhub2RlLkRpdigpO1xuXHR0aGlzLmNvbnRlbnQuY2xhc3NOYW1lID0gXCJjb250ZW50XCI7XG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50KTtcbn1cblxuaW5oZXJpdHMoUmVzb3VyY2VDYXRlZ29yeVZpZXcsIHhub2RlLkRpdik7XG5FdmVudERpc3BhdGNoZXIuaW5pdChSZXNvdXJjZUNhdGVnb3J5Vmlldyk7XG5cblJlc291cmNlQ2F0ZWdvcnlWaWV3LnByb3RvdHlwZS5zZXRMYWJlbCA9IGZ1bmN0aW9uKGxhYmVsKSB7XG5cdHRoaXMudGl0bGVTcGFuLmlubmVySFRNTCA9IGxhYmVsO1xufVxuXG5SZXNvdXJjZUNhdGVnb3J5Vmlldy5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24oYWN0aXZlKSB7XG5cdGlmIChhY3RpdmUpIHtcblx0XHR0aGlzLnRpdGxlLmNsYXNzTmFtZSA9IFwiYWN0aXZlIHRpdGxlXCI7XG5cdFx0dGhpcy5jb250ZW50LmNsYXNzTmFtZSA9IFwiYWN0aXZlIGNvbnRlbnRcIjtcblx0fSBlbHNlIHtcblx0XHR0aGlzLnRpdGxlLmNsYXNzTmFtZSA9IFwidGl0bGVcIjtcblx0XHR0aGlzLmNvbnRlbnQuY2xhc3NOYW1lID0gXCJjb250ZW50XCI7XG5cdH1cbn1cblxuUmVzb3VyY2VDYXRlZ29yeVZpZXcucHJvdG90eXBlLm9uVGl0bGVDbGljayA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnRyaWdnZXIoXCJ0aXRsZUNsaWNrXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlQ2F0ZWdvcnlWaWV3OyIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciB4bm9kZWMgPSByZXF1aXJlKFwieG5vZGVjb2xsZWN0aW9uXCIpO1xudmFyIFJlc291cmNlVGFiSGVhZGVyVmlldyA9IHJlcXVpcmUoXCIuL1Jlc291cmNlVGFiSGVhZGVyVmlld1wiKTtcbnZhciBSZXNvdXJjZVRhYlZpZXcgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVRhYlZpZXdcIik7XG5cbi8qKlxuICogVGhlIGxlZnQgcGFydCBvZiB0aGUgYXBwLCBzaG93aW5nIHRoZSByZXNvdXJjZXMuXG4gKiBAY2xhc3MgUmVzb3VyY2VQYW5lVmlld1xuICovXG5mdW5jdGlvbiBSZXNvdXJjZVBhbmVWaWV3KCkge1xuXHR4bm9kZS5EaXYuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHR0aGlzLnN0eWxlLnRvcCA9IFwiMTBweFwiO1xuXHR0aGlzLnN0eWxlLmxlZnQgPSBcIjEwcHhcIjtcblx0dGhpcy5zdHlsZS53aWR0aCA9IFwiNTAlXCI7XG5cdHRoaXMuc3R5bGUuYm90dG9tID0gXCIxMHB4XCI7XG5cblx0dGhpcy50YWJIZWFkZXJzID0gbmV3IHhub2RlYy5Db2xsZWN0aW9uVmlldygpO1xuXHR0aGlzLnRhYkhlYWRlcnMuY2xhc3NOYW1lID0gXCJ1aSB0b3AgYXR0YWNoZWQgdGFidWxhciBtZW51XCI7XG5cdHRoaXMudGFiSGVhZGVycy5zZXRJdGVtUmVuZGVyZXJDbGFzcyhSZXNvdXJjZVRhYkhlYWRlclZpZXcpO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMudGFiSGVhZGVycyk7XG5cblx0dGhpcy50YWJzTWFuYWdlciA9IG5ldyB4bm9kZWMuQ29sbGVjdGlvblZpZXdNYW5hZ2VyKHRoaXMpO1xuXHR0aGlzLnRhYnNNYW5hZ2VyLnNldEl0ZW1SZW5kZXJlckNsYXNzKFJlc291cmNlVGFiVmlldyk7XG59XG5cbmluaGVyaXRzKFJlc291cmNlUGFuZVZpZXcsIHhub2RlLkRpdik7XG5cbi8qKlxuICogU2V0IHRhYnMgY29sbGVjdGlvbi5cbiAqIEBtZXRob2Qgc2V0VGFic0NvbGxlY3Rpb25cbiAqL1xuUmVzb3VyY2VQYW5lVmlldy5wcm90b3R5cGUuc2V0VGFic0NvbGxlY3Rpb24gPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG5cdHRoaXMudGFiSGVhZGVycy5zZXREYXRhU291cmNlKGNvbGxlY3Rpb24pO1xuXHR0aGlzLnRhYnNNYW5hZ2VyLnNldERhdGFTb3VyY2UoY29sbGVjdGlvbik7XG59XG5cbi8qKlxuICogR2V0IHRhYnMgaGVhZGVyIG1hbmFnZXIuXG4gKiBAbWV0aG9kIGdldFRhYnNIZWFkZXJNYW5hZ2VyXG4gKi9cblJlc291cmNlUGFuZVZpZXcucHJvdG90eXBlLmdldFRhYnNIZWFkZXJNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnRhYkhlYWRlcnM7XG59XG5cbi8qKlxuICogR2V0IHRhYnMgaGVhZGVyIG1hbmFnZXIuXG4gKiBAbWV0aG9kIGdldFRhYnNNYW5hZ2VyXG4gKi9cblJlc291cmNlUGFuZVZpZXcucHJvdG90eXBlLmdldFRhYnNNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnRhYnNNYW5hZ2VyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlUGFuZVZpZXc7IiwidmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xuXG5mdW5jdGlvbiBSZXNvdXJjZVRhYkhlYWRlclZpZXcoKSB7XG5cdHhub2RlLkEuY2FsbCh0aGlzKTtcblx0dGhpcy5jbGFzc05hbWUgPSBcIml0ZW1cIjtcbn1cblxuaW5oZXJpdHMoUmVzb3VyY2VUYWJIZWFkZXJWaWV3LCB4bm9kZS5BKTtcblxuUmVzb3VyY2VUYWJIZWFkZXJWaWV3LnByb3RvdHlwZS5zZXRMYWJlbCA9IGZ1bmN0aW9uKGxhYmVsKSB7XG5cdHRoaXMuaW5uZXJIVE1MID0gbGFiZWw7XG59XG5cblJlc291cmNlVGFiSGVhZGVyVmlldy5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24oYWN0aXZlKSB7XG5cdGlmIChhY3RpdmUpXG5cdFx0dGhpcy5jbGFzc05hbWUgPSBcImFjdGl2ZSBpdGVtXCI7XG5cblx0ZWxzZVxuXHRcdHRoaXMuY2xhc3NOYW1lID0gXCJpdGVtXCI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VUYWJIZWFkZXJWaWV3OyIsInZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciB4bm9kZWMgPSByZXF1aXJlKFwieG5vZGVjb2xsZWN0aW9uXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIFJlc291cmNlQ2F0ZWdvcnlWaWV3ID0gcmVxdWlyZShcIi4vUmVzb3VyY2VDYXRlZ29yeVZpZXdcIik7XG5cbi8qKlxuICogVGhlIHZpZXcgZm9yIHRoZSBjb250ZW50IHRoYXQgZ29lcyBpbnRvIG9uZSB0YWIuXG4gKiBAY2xhc3MgUmVzb3VyY2VUYWJWaWV3XG4gKi9cbmZ1bmN0aW9uIFJlc291cmNlVGFiVmlldygpIHtcblx0eG5vZGUuRGl2LmNhbGwodGhpcyk7XG5cdHRoaXMuY2xhc3NOYW1lID0gXCJ1aSBib3R0b20gYXR0YWNoZWQgYWN0aXZlIHRhYiBzZWdtZW50XCI7XG5cblx0dGhpcy5pbm5lciA9IG5ldyB4bm9kZS5EaXYoKTtcblx0dGhpcy5pbm5lci5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcblx0dGhpcy5pbm5lci5zdHlsZS5oZWlnaHQgPSBcImNhbGMoMTAwJSAtIDY1cHgpXCI7XG5cdHRoaXMuaW5uZXIuc3R5bGUucGFkZGluZyA9IFwiMXB4XCI7XG5cdHRoaXMuaW5uZXIuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLmlubmVyKTtcblxuXHR0aGlzLmFjY29yZGlvbiA9IG5ldyB4bm9kZWMuQ29sbGVjdGlvblZpZXcoKTtcblx0dGhpcy5hY2NvcmRpb24uc2V0SXRlbVJlbmRlcmVyQ2xhc3MoUmVzb3VyY2VDYXRlZ29yeVZpZXcpO1xuXHR0aGlzLmFjY29yZGlvbi5jbGFzc05hbWUgPSBcInVpIHN0eWxlZCBmbHVpZCBhY2NvcmRpb25cIjtcblx0dGhpcy5pbm5lci5hcHBlbmRDaGlsZCh0aGlzLmFjY29yZGlvbik7XG59XG5cbmluaGVyaXRzKFJlc291cmNlVGFiVmlldywgeG5vZGUuRGl2KTtcblxuLyoqXG4gKiBTaG91bGQgdGhpcyBiZSB0aGUgYWN0aXZlIHRhYj9cbiAqIEBtZXRob2Qgc2V0QWN0aXZlXG4gKi9cblJlc291cmNlVGFiVmlldy5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24oYWN0aXZlKSB7XG5cdGlmIChhY3RpdmUpIHtcblx0XHR0aGlzLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cdFx0dGhpcy5jbGFzc05hbWUgPSBcInVpIGJvdHRvbSBhdHRhY2hlZCBhY3RpdmUgdGFiIHNlZ21lbnQgYWN0aXZlXCI7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0dGhpcy5jbGFzc05hbWUgPSBcInVpIGJvdHRvbSBhdHRhY2hlZCBhY3RpdmUgdGFiIHNlZ21lbnRcIjtcblx0fVxufVxuXG4vKipcbiAqIFNldCBjYXRlZ29yeSBjb2xsZWN0aW9uLlxuICogQG1ldGhvZCBzZXRDYXRlZ29yeUNvbGxlY3Rpb25cbiAqL1xuUmVzb3VyY2VUYWJWaWV3LnByb3RvdHlwZS5zZXRDYXRlZ29yeUNvbGxlY3Rpb24gPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG5cdHRoaXMuYWNjb3JkaW9uLnNldERhdGFTb3VyY2UoY29sbGVjdGlvbik7XG59XG5cbi8qKlxuICogR2V0IGNhdGVnb3J5IG1hbmFnZXIuXG4gKiBAbWV0aG9kIGdldENhdGVnb3J5TWFuYWdlclxuICovXG5SZXNvdXJjZVRhYlZpZXcucHJvdG90eXBlLmdldENhdGVnb3J5TWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5hY2NvcmRpb247XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZVRhYlZpZXc7Il19
