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
	createXNodeReadWriteProperty("src");

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
	target.P = createExtendedXNodeElement("p");
	target.Table = createExtendedXNodeElement("table");
	target.Thead = createExtendedXNodeElement("thead");
	target.Tbody = createExtendedXNodeElement("tbody");
	target.Tr = createExtendedXNodeElement("tr");
	target.Td = createExtendedXNodeElement("td");
	target.Th = createExtendedXNodeElement("th");
	target.Img = createExtendedXNodeElement("img");
	target.I = createExtendedXNodeElement("i");
	target.B = createExtendedXNodeElement("b");
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
},{"../controller/AppController":9,"../model/AppModel":15,"../view/AppView":19,"inherits":1,"xnode":2}],9:[function(require,module,exports){
var ResourceTabHeaderController = require("./ResourceTabHeaderController");
var ResourceTabController = require("./ResourceTabController");
var ResourceTabHeaderView = require("../view/ResourceTabHeaderView");
var ResourceTabView = require("../view/ResourceTabView");
var xnodec = require("xnodecollection");

/**
 * App controller
 * @class AppController
 */
function AppController(appModel, appView) {
	this.appModel = appModel;
	this.appView = appView;

	this.tabHeaderManager = new xnodec.CollectionViewManager();
	this.tabHeaderManager.setTarget(this.appView.getResourcePaneView().getTabHeaderHolder());
	this.tabHeaderManager.setItemControllerClass(ResourceTabHeaderController);
	this.tabHeaderManager.setItemRendererClass(ResourceTabHeaderView);
	this.tabHeaderManager.setDataSource(this.appModel.getCategoryCollection());

	this.tabManager = new xnodec.CollectionViewManager();
	this.tabManager.setTarget(this.appView.getResourcePaneView().getTabHolder());
	this.tabManager.setItemControllerClass(ResourceTabController);
	this.tabManager.setItemRendererClass(ResourceTabView);
	this.tabManager.setDataSource(this.appModel.getCategoryCollection());
}

module.exports = AppController;
},{"../view/ResourceTabHeaderView":26,"../view/ResourceTabView":27,"./ResourceTabController":12,"./ResourceTabHeaderController":13,"xnodecollection":6}],10:[function(require,module,exports){
var ResourceItemController = require("./ResourceItemController");
var ResourceItemView = require("../view/ResourceItemView");
var xnodec = require("xnodecollection");

/**
 * Control a resource category.
 * @method ResourceTabController
 */
function ResourceCategoryController(categoryView) {
	this.categoryView = categoryView;

	this.categoryView.on("titleClick", this.onCategoryViewTitleClick, this);

	this.itemManager = new xnodec.CollectionViewManager();
	this.itemManager.setTarget(this.categoryView.getItemHolder());
	this.itemManager.setItemRendererClass(ResourceItemView);
	this.itemManager.setItemControllerClass(ResourceItemController);
}

/**
 * Set data.
 * @method setData
 */
ResourceCategoryController.prototype.setData = function(categoryModel) {
	if (this.categoryModel) {
		this.itemManager.setDataSource(null);

		this.categoryModel.off("change", this.onCategoryModelChange, this);
	}

	this.categoryModel = categoryModel;

	if (this.categoryModel) {
		this.itemManager.setDataSource(this.categoryModel.getItemCollection());

		this.categoryModel.on("change", this.onCategoryModelChange, this);
		this.categoryView.setActive(categoryModel.isActive());
		this.categoryView.setLabel(categoryModel.getLabel());
		this.categoryView.setDescription(this.categoryModel.getDescription());
	}
}

/**
 * Handle change in the model.
 * @method onCategoryModelChange
 */
ResourceCategoryController.prototype.onCategoryModelChange = function() {
	this.categoryView.setActive(this.categoryModel.isActive());
	this.categoryView.setDescription(this.categoryModel.getDescription());
}

/**
 * Title click. Toggle the active state.
 * @method onCategoryViewTitleClick
 */
ResourceCategoryController.prototype.onCategoryViewTitleClick = function() {
	this.categoryModel.setActive(!this.categoryModel.isActive());
}

module.exports = ResourceCategoryController;
},{"../view/ResourceItemView":23,"./ResourceItemController":11,"xnodecollection":6}],11:[function(require,module,exports){
/**
 * Control a resource item.
 * @class ResourceItemController
 */
function ResourceItemController(itemView) {
	this.itemView = itemView;
}

/**
 * Set item model to serve as data.
 * @method setData
 */
ResourceItemController.prototype.setData = function(itemModel) {
	this.itemModel = itemModel;

	if (this.itemModel) {
		this.itemView.setKey(this.itemModel.getKey());
		this.itemView.setDefaultValue(this.itemModel.getDefaultValue());
		this.itemView.setValue(this.itemModel.getValue());

		this.itemView.setItemType(this.itemModel.getItemType());
	}
}

module.exports = ResourceItemController;
},{}],12:[function(require,module,exports){
var ResourceCategoryController = require("./ResourceCategoryController");
var ResourceCategoryView = require("../view/ResourceCategoryView");
var xnodec = require("xnodecollection");

/**
 * Control one resource tab.
 * @method ResourceTabController
 */
function ResourceTabController(tabView) {
	this.tabView = tabView;

	this.categoryManager = new xnodec.CollectionViewManager();
	this.categoryManager.setTarget(tabView.getCategoryHolder());
	this.categoryManager.setItemRendererClass(ResourceCategoryView);
	this.categoryManager.setItemControllerClass(ResourceCategoryController);
}

/**
 * Set data.
 * @method setData
 */
ResourceTabController.prototype.setData = function(categoryModel) {
	if (this.categoryModel) {
		this.categoryModel.off("change", this.onCategoryModelChange, this);
		this.categoryManager.setDataSource(null);
	}

	this.categoryModel = categoryModel;

	if (this.categoryModel) {
		this.categoryModel.on("change", this.onCategoryModelChange, this);
		this.tabView.setActive(categoryModel.isActive());
		this.tabView.setDescription(categoryModel.getDescription());

		this.categoryManager.setDataSource(categoryModel.getCategoryCollection());
	}
}

/**
 * Handle change in the model.
 * @method onCategoryModelChange
 */
ResourceTabController.prototype.onCategoryModelChange = function() {
	this.tabView.setActive(this.categoryModel.isActive());
	this.tabView.setDescription(this.categoryModel.getDescription());
}

module.exports = ResourceTabController;
},{"../view/ResourceCategoryView":20,"./ResourceCategoryController":10,"xnodecollection":6}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
fiddleui = {
	App: require("./app/App"),
	CategoryModel: require("./model/CategoryModel"),
	ResourceItemModel: require("./model/ResourceItemModel")
};
},{"./app/App":8,"./model/CategoryModel":16,"./model/ResourceItemModel":17}],15:[function(require,module,exports){
var xnodec = require("xnodecollection");
var CategoryModel = require("./CategoryModel");

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

/**
 * Create and add a category model.
 * @method createCategory
 */
AppModel.prototype.createCategory = function(title) {
	var categoryModel = new CategoryModel(title);

	return this.addCategoryModel(categoryModel);
}

module.exports = AppModel;
},{"./CategoryModel":16,"xnodecollection":6}],16:[function(require,module,exports){
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
	this.itemCollection = new xnodec.Collection();
	this.description = "";
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
 * Get description.
 * @method getLabel
 */
CategoryModel.prototype.getDescription = function() {
	return this.description;
}

/**
 * Set description.
 * @method getLabel
 */
CategoryModel.prototype.setDescription = function(description) {
	this.description = description;

	this.trigger("change");
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
 * Get item collection.
 * @method getItemCollection
 */
CategoryModel.prototype.getItemCollection = function() {
	return this.itemCollection;
}

/**
 * Add sub category model.
 * @method addCategoryModel
 */
CategoryModel.prototype.addCategoryModel = function(categoryModel) {
	categoryModel.setParentModel(this);
	this.categoryCollection.addItem(categoryModel);

	return categoryModel;
}

/**
 * Create and add a category model.
 * @method createCategory
 */
CategoryModel.prototype.createCategory = function(title) {
	var categoryModel = new CategoryModel(title);

	return this.addCategoryModel(categoryModel);
}

/**
 * Add resource item model.
 * @method addResourceItemModel
 */
CategoryModel.prototype.addResourceItemModel = function(resourceItemModel) {
	this.itemCollection.addItem(resourceItemModel);
}

module.exports = CategoryModel;
},{"./AppModel":15,"inherits":1,"xnodecollection":6,"yaed":7}],17:[function(require,module,exports){
/**
 * ResourceItemModel
 * @class ResourceItemModel
 */
function ResourceItemModel(key, defaultValue, value, type) {
	this.key = key;
	this.defaultValue = defaultValue;
	this.value = value;

	this.itemType = type;

	if (!this.itemType)
		this.itemType = "position";
}

/**
 * Get key.
 * @method getKey
 */
ResourceItemModel.prototype.getKey = function() {
	return this.key;
}

/**
 * Get default value.
 * @method getDefaultValue
 */
ResourceItemModel.prototype.getDefaultValue = function() {
	return this.defaultValue;
}

/**
 * Get customized value.
 * @method getValue
 */
ResourceItemModel.prototype.getValue = function() {
	return this.value;
}

/**
 * Set value.
 * @method setValue
 */
ResourceItemModel.prototype.setValue = function(value) {
	this.value = value;
}

/**
 * Get item type.
 * @method getItemType
 */
ResourceItemModel.prototype.getItemType = function() {
	return this.itemType;
}

module.exports = ResourceItemModel;
},{}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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

/**
 * Get a reference to the resource pane.
 * @method getResourcePaneView
 */
AppView.prototype.getResourcePaneView = function() {
	return this.resourcePaneView;
}

module.exports = AppView;
},{"./ResourcePaneView":24,"inherits":1,"xnode":2}],20:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");
var EventDispatcher = require("yaed");
var ResourceItemView = require("./ResourceItemView");

/**
 * The view of one resource category.
 * @class ResourceCategoryView
 */
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

	this.descriptionP = new xnode.P();
	this.content.appendChild(this.descriptionP);

	this.itemTable = new xnode.Table();
	this.itemTable.className = "ui table unstackable definition";
	this.content.appendChild(this.itemTable);

	this.itemTableBody = new xnode.Tbody();
	this.itemTable.appendChild(this.itemTableBody);
}

inherits(ResourceCategoryView, xnode.Div);
EventDispatcher.init(ResourceCategoryView);

/**
 * Set the label.
 * @method setLabel
 */
ResourceCategoryView.prototype.setLabel = function(label) {
	this.titleSpan.innerHTML = label;
}

/**
 * Should this be active or not?
 * @method setActive
 */
ResourceCategoryView.prototype.setActive = function(active) {
	if (active) {
		this.title.className = "active title";
		this.content.className = "active content";
	} else {
		this.title.className = "title";
		this.content.className = "content";
	}
}

/**
 * The description.
 * @method setDescription
 */
ResourceCategoryView.prototype.setDescription = function(description) {
	this.descriptionP.innerHTML = description;
}

/**
 * The title was clicked. Dispatch further.
 * @method onTitleClick
 */
ResourceCategoryView.prototype.onTitleClick = function() {
	this.trigger("titleClick");
}

/**
 * Get holder for the items.
 * @method getItemHolder
 */
ResourceCategoryView.prototype.getItemHolder = function() {
	return this.itemTableBody;
}

module.exports = ResourceCategoryView;
},{"./ResourceItemView":23,"inherits":1,"xnode":2,"yaed":7}],21:[function(require,module,exports){
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
},{"../utils/ColorUtil":18,"inherits":1,"xnode":2}],22:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");

/**
 * View and edit the value of an image.
 * @method ResourceImageValueView
 */
function ResourceImageValueView() {
	xnode.Div.call(this);

	this.defaultImage = new xnode.Img();
	this.defaultImage.style.position = "absolute";
	this.defaultImage.style.top = "10px";
	this.defaultImage.style.height = "30px";
	this.defaultImage.style.width = "auto";
	this.appendChild(this.defaultImage);

	this.valueImage = new xnode.Img();
	this.valueImage.style.position = "absolute";
	this.valueImage.style.top = "10px";
	this.valueImage.style.height = "30px";
	this.valueImage.style.width = "auto";
	this.valueImage.style.left = "calc(50% - 10px)";
	this.appendChild(this.valueImage);

	this.uploadInput = new xnode.Input();
	this.uploadInput.type = "file";
	this.uploadInput.style.position = "absolute";
	this.uploadInput.style.zIndex = 2;
	this.uploadInput.style.opacity = 0;
	this.uploadInput.style.width = "100%";
	this.uploadInput.style.height = "100%";

	this.uploadButton = new xnode.Div();
	this.uploadButton.className = "ui icon button mini";

	this.uploadIcon=new xnode.I();
	this.uploadIcon.className="upload icon";
	this.uploadButton.appendChild(this.uploadIcon);

	this.uploadDiv = new xnode.Div();
	this.uploadDiv.appendChild(this.uploadInput);
	this.uploadDiv.appendChild(this.uploadButton);
	this.uploadDiv.style.position = "absolute";
	this.uploadDiv.style.top = "13px";
	this.uploadDiv.style.right = "10px";
	this.uploadDiv.style.overflow="hidden";

	this.appendChild(this.uploadDiv);
}

inherits(ResourceImageValueView, xnode.Div);

/**
 * Set url of the image to be shown as default
 * @method setDefaultValue
 */
ResourceImageValueView.prototype.setDefaultValue = function(defaultValue) {
	this.defaultImage.src = defaultValue;
}

/**
 * Set url of image to appear as value.
 * @method setValue
 */
ResourceImageValueView.prototype.setValue = function(value) {
	this.valueImage.src = value;
}

module.exports = ResourceImageValueView;
},{"inherits":1,"xnode":2}],23:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");
var ResourcePositionValueView = require("./ResourcePositionValueView");
var ResourceImageValueView = require("./ResourceImageValueView");
var ResourceColorValueView = require("./ResourceColorValueView");

/**
 * Show a table row for each resource item.
 * @class ResourceItemView
 */
function ResourceItemView() {
	xnode.Tr.call(this);

	this.style.height = "50px";

	this.keyTd = new xnode.Td();
	this.keyTd.style.width = "50%";
	this.appendChild(this.keyTd);

	this.valueTd = new xnode.Td();
	this.valueTd.style.position = "relative";
	this.valueTd.style.width = "50%";
	this.appendChild(this.valueTd);

	this.valueView = null;
	this.itemType = null;
	this.value = null;
	this.defaultValue = null;
}

inherits(ResourceItemView, xnode.Tr);

/**
 * Set key. Will appear in the left column.
 */
ResourceItemView.prototype.setKey = function(value) {
	this.keyTd.innerHTML = value;
}

/**
 * Set abstract value to appear as default value.
 * @method setDefaultValue
 */
ResourceItemView.prototype.setDefaultValue = function(defaultValue) {
	this.defaultValue = defaultValue;

	if (this.valueView)
		this.valueView.setDefaultValue(this.defaultValue);
}

/**
 * Set abstract value to appear in the value column.
 * @method setValue
 */
ResourceItemView.prototype.setValue = function(value) {
	this.value = value;

	if (this.valueView)
		this.valueView.setValue(this.value);
}

/**
 * Set the type of the item. This will create a value
 * view and populate the right side of the table.
 * @method setItemType
 */
ResourceItemView.prototype.setItemType = function(itemType) {
	if (itemType == this.itemType)
		return;

	if (this.valueView)
		this.valueTd.removeChild(this.valueView);

	this.valueView = null;
	this.itemType = itemType;

	switch (this.itemType) {
		case "position":
			this.valueView = new ResourcePositionValueView();
			break;

		case "image":
			this.valueView = new ResourceImageValueView();
			break;

		case "color":
			this.valueView = new ResourceColorValueView();
			break;
	}

	if (this.valueView) {
		this.valueTd.appendChild(this.valueView);
		this.valueView.setDefaultValue(this.defaultValue);
		this.valueView.setValue(this.value);
	}
}

module.exports = ResourceItemView;
},{"./ResourceColorValueView":21,"./ResourceImageValueView":22,"./ResourcePositionValueView":25,"inherits":1,"xnode":2}],24:[function(require,module,exports){
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

	this.tabHeaders = new xnode.Div();
	this.tabHeaders.className = "ui top attached tabular menu";
	this.appendChild(this.tabHeaders);
}

inherits(ResourcePaneView, xnode.Div);

/**
 * Get holder for the tab headers.
 * @method getTabHeaderHolder
 */
ResourcePaneView.prototype.getTabHeaderHolder = function() {
	return this.tabHeaders;
}

/**
 * Get tab holder.
 * @method getTabHolder
 */
ResourcePaneView.prototype.getTabHolder = function() {
	return this;
}

module.exports = ResourcePaneView;
},{"./ResourceTabHeaderView":26,"./ResourceTabView":27,"inherits":1,"xnode":2,"xnodecollection":6}],25:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");

/**
 * The value view for a position.
 * @class ResourcePositionValueView
 */
function ResourcePositionValueView() {
	xnode.Div.call(this);

	this.defaultValueView = new xnode.Div();
	this.defaultValueView.style.position = "absolute";
	this.defaultValueView.style.width = "50%";
	this.defaultValueView.style.top = "15px";

	this.appendChild(this.defaultValueView);

	this.valueDiv = new xnode.Div();
	this.valueDiv.style.position = "absolute";
	this.valueDiv.style.right = "10px";
	this.valueDiv.style.top = "10px";
	this.valueDiv.style.width = "50%";

	this.valueDiv.className = "ui input fluid mini";
	this.appendChild(this.valueDiv);

	this.valueInput = new xnode.Input();
	this.valueInput.type = "text";
	this.valueDiv.appendChild(this.valueInput);
}

inherits(ResourcePositionValueView, xnode.Div);

/**
 * Set position value for default.
 * @method setDefaultValue
 */
ResourcePositionValueView.prototype.setDefaultValue = function(defaultValue) {
	this.defaultValueView.innerHTML = defaultValue;
}

/**
 * Set position value for current.
 * @method setValue
 */
ResourcePositionValueView.prototype.setValue = function(value) {
	this.valueInput.value = value;
}

module.exports = ResourcePositionValueView;
},{"inherits":1,"xnode":2}],26:[function(require,module,exports){
var xnode = require("xnode");
var inherits = require("inherits");

/**
 * The tab header.
 * @class ResourceTabHeaderView
 */
function ResourceTabHeaderView() {
	xnode.A.call(this);
	this.className = "item";
}

inherits(ResourceTabHeaderView, xnode.A);

/**
 * Set label.
 * @class setLabel
 */
ResourceTabHeaderView.prototype.setLabel = function(label) {
	this.innerHTML = label;
}

/**
 * Set active state.
 * @class setActive
 */
ResourceTabHeaderView.prototype.setActive = function(active) {
	if (active)
		this.className = "active item";

	else
		this.className = "item";
}

module.exports = ResourceTabHeaderView;
},{"inherits":1,"xnode":2}],27:[function(require,module,exports){
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

	this.descriptionP = new xnode.P();
	this.inner.appendChild(this.descriptionP);

	this.accordion = new xnode.Div();
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
 * Set description.
 * @method setDescription
 */
ResourceTabView.prototype.setDescription = function(description) {
	this.descriptionP.innerHTML = description;
}

/**
 * Get div holding the categories.
 * @method getCategoryHolder
 */
ResourceTabView.prototype.getCategoryHolder = function() {
	return this.accordion;
}

/**
 * Set category collection.
 * @method setCategoryCollection
 */
/*ResourceTabView.prototype.setCategoryCollection = function(collection) {
	this.accordion.setDataSource(collection);
}*/

/**
 * Get category manager.
 * @method getCategoryManager
 */
/*ResourceTabView.prototype.getCategoryManager = function() {
	return this.accordion;
}*/

module.exports = ResourceTabView;
},{"./ResourceCategoryView":20,"inherits":1,"xnode":2,"xnodecollection":6}]},{},[14])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy94bm9kZS9zcmMveG5vZGUuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3hub2RlY29sbGVjdGlvbi9zcmMvQ29sbGVjdGlvblZpZXcuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uVmlld01hbmFnZXIuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy95YWVkL3NyYy9FdmVudERpc3BhdGNoZXIuanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9jb250cm9sbGVyL0FwcENvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9SZXNvdXJjZUNhdGVnb3J5Q29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL1Jlc291cmNlSXRlbUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9SZXNvdXJjZVRhYkNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9SZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXIuanMiLCJzcmMvZmlkZGxldWkuanMiLCJzcmMvbW9kZWwvQXBwTW9kZWwuanMiLCJzcmMvbW9kZWwvQ2F0ZWdvcnlNb2RlbC5qcyIsInNyYy9tb2RlbC9SZXNvdXJjZUl0ZW1Nb2RlbC5qcyIsInNyYy91dGlscy9Db2xvclV0aWwuanMiLCJzcmMvdmlldy9BcHBWaWV3LmpzIiwic3JjL3ZpZXcvUmVzb3VyY2VDYXRlZ29yeVZpZXcuanMiLCJzcmMvdmlldy9SZXNvdXJjZUNvbG9yVmFsdWVWaWV3LmpzIiwic3JjL3ZpZXcvUmVzb3VyY2VJbWFnZVZhbHVlVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlSXRlbVZpZXcuanMiLCJzcmMvdmlldy9SZXNvdXJjZVBhbmVWaWV3LmpzIiwic3JjL3ZpZXcvUmVzb3VyY2VQb3NpdGlvblZhbHVlVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlVGFiSGVhZGVyVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlVGFiVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIihmdW5jdGlvbigpIHtcblx0LyoqXG5cdCAqIFRoZSBiYXNpYyB4bm9kZSBjbGFzcy5cblx0ICogSXQgc2V0cyB0aGUgdW5kZXJseWluZyBub2RlIGVsZW1lbnQgYnkgY2FsbGluZ1xuXHQgKiBkb2N1bWVudC5jcmVhdGVFbGVtZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBYTm9kZSh0eXBlLCBjb250ZW50KSB7XG5cdFx0dGhpcy5ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuXHRcdGlmIChjb250ZW50ICE9PSB1bmRlZmluZWQpXG5cdFx0XHR0aGlzLm5vZGUuaW5uZXJIVE1MID0gY29udGVudDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIG1ldGhvZCBjcmVhdGVzIGFuIGV4dGVuZGVkIGNsYXNzIHVzaW5nXG5cdCAqIHRoZSBYTm9kZSBjbGFzcyBkZWZpbmVkIGFib3ZlLlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoZWxlbWVudFR5cGUsIGNvbnRlbnQpIHtcblx0XHR2YXIgZiA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcblx0XHRcdFhOb2RlLmNhbGwodGhpcywgZWxlbWVudFR5cGUsIGNvbnRlbnQpO1xuXHRcdH07XG5cblx0XHRmLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoWE5vZGUucHJvdG90eXBlKTtcblx0XHRmLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGY7XG5cblx0XHRyZXR1cm4gZjtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSByZWFkIG9ubHkgcHJvcGVydHkgdGhhdCByZXR1cm5zIHRoZVxuXHQgKiB2YWx1ZSBvZiB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBvZiB0aGVcblx0ICogdW5kZXJseWluZyBub2RlIG9iamVjdC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVhOb2RlUmVhZE9ubHlQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoWE5vZGUucHJvdG90eXBlLCBwcm9wZXJ0eU5hbWUsIHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm5vZGVbcHJvcGVydHlOYW1lXTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSByZWFkIHdyaXRlIHByb3BlcnR5IHRoYXQgb3BlcmF0ZXMgb25cblx0ICogdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgb2YgdGhlIHVuZGVybHlpbmdcblx0ICogbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KHByb3BlcnR5TmFtZSkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShYTm9kZS5wcm90b3R5cGUsIHByb3BlcnR5TmFtZSwge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMubm9kZVtwcm9wZXJ0eU5hbWVdO1xuXHRcdFx0fSxcblxuXHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHR0aGlzLm5vZGVbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG1ldGhvZCB0aGF0IHJvdXRlcyB0aGUgY2FsbCB0aHJvdWdoLCBkb3duXG5cdCAqIHRvIHRoZSBzYW1lIG1ldGhvZCBvbiB0aGUgdW5kZXJseWluZyBub2RlIG9iamVjdC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVhOb2RlTWV0aG9kKG1ldGhvZE5hbWUpIHtcblx0XHRYTm9kZS5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLm5vZGVbbWV0aG9kTmFtZV0uYXBwbHkodGhpcy5ub2RlLCBhcmd1bWVudHMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBNb2RpZnkgdGhlIE5vZGUucHJvcGVydHkgZnVuY3Rpb24sIHNvIHRoYXQgaXQgYWNjZXB0c1xuXHQgKiBYTm9kZSBvYmplY3RzLiBBbGwgWE5vZGUgb2JqZWN0cyB3aWxsIGJlIGNoYW5nZWQgdG9cblx0ICogdGhlIHVuZGVybHlpbmcgbm9kZSBvYmplY3RzLCBhbmQgdGhlIGNvcnJlc3BvbmRpbmdcblx0ICogbWV0aG9kIHdpbGwgYmUgY2FsbGVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlTm9kZVRvWE5vZGVNZXRob2RXcmFwcGVyKG1ldGhvZE5hbWUpIHtcblx0XHR2YXIgb3JpZ2luYWxGdW5jdGlvbiA9IE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuXG5cdFx0Tm9kZS5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdGZvciAodmFyIGEgaW4gYXJndW1lbnRzKSB7XG5cdFx0XHRcdGlmIChhcmd1bWVudHNbYV0gaW5zdGFuY2VvZiBYTm9kZSlcblx0XHRcdFx0XHRhcmd1bWVudHNbYV0gPSBhcmd1bWVudHNbYV0ubm9kZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG9yaWdpbmFsRnVuY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHVwIHJlYWQgb25seSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVSZWFkT25seVByb3BlcnR5KFwic3R5bGVcIik7XG5cblx0LyoqXG5cdCAqIFNldCB1cCByZWFkL3dyaXRlIHByb3BlcnRpZXMuXG5cdCAqL1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwiaW5uZXJIVE1MXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwiaHJlZlwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImlkXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwidmFsdWVcIik7XG5cdGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkoXCJ0eXBlXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwiY2xhc3NOYW1lXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwic3JjXCIpO1xuXG5cdC8qKlxuXHQgKiBTZXQgdXAgbWV0aG9kcyB0byBiZSByb3V0ZWQgdG8gdGhlIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcImFwcGVuZENoaWxkXCIpO1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcInJlbW92ZUNoaWxkXCIpO1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcImFkZEV2ZW50TGlzdGVuZXJcIik7XG5cdGNyZWF0ZVhOb2RlTWV0aG9kKFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiKTtcblxuXHQvKipcblx0ICogU2V0IHVwIG1ldGhvZHMgb24gTm9kZS5wcm9wZXJ0eS5cblx0ICovXG5cdGNyZWF0ZU5vZGVUb1hOb2RlTWV0aG9kV3JhcHBlcihcImFwcGVuZENoaWxkXCIpO1xuXHRjcmVhdGVOb2RlVG9YTm9kZU1ldGhvZFdyYXBwZXIoXCJyZW1vdmVDaGlsZFwiKTtcblxuXHQvKipcblx0ICogQ3JlYXRlIGV2ZW50IGxpc3RlbmVyIGFsaWFzZXMuXG5cdCAqL1xuXHRYTm9kZS5wcm90b3R5cGUub24gPSBYTm9kZS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0WE5vZGUucHJvdG90eXBlLm9mZiA9IFhOb2RlLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXG5cdC8qKlxuXHQgKiBXb3JrIGJvdGggYXMgYSBucG0gbW9kdWxlIGFuZCBzdGFuZGFsb25lLlxuXHQgKi9cblx0dmFyIHRhcmdldDtcblxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdHRhcmdldCA9IHt9O1xuXHRcdG1vZHVsZS5leHBvcnRzID0gdGFyZ2V0O1xuXHR9IGVsc2Uge1xuXHRcdHhub2RlID0ge307XG5cdFx0dGFyZ2V0ID0geG5vZGU7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGV4dGVuZGVkIGNsYXNzZXMuXG5cdCAqL1xuXHR0YXJnZXQuRGl2ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJkaXZcIik7XG5cdHRhcmdldC5CdXR0b24gPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImJ1dHRvblwiKTtcblx0dGFyZ2V0LlVsID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJ1bFwiKTtcblx0dGFyZ2V0LkxpID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJsaVwiKTtcblx0dGFyZ2V0LkEgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImFcIik7XG5cdHRhcmdldC5PcHRpb24gPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcIm9wdGlvblwiKTtcblx0dGFyZ2V0LlNlbGVjdCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwic2VsZWN0XCIpO1xuXHR0YXJnZXQuSW5wdXQgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImlucHV0XCIpO1xuXHR0YXJnZXQuTmF2ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJuYXZcIik7XG5cdHRhcmdldC5TcGFuID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJzcGFuXCIpO1xuXHR0YXJnZXQuUCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwicFwiKTtcblx0dGFyZ2V0LlRhYmxlID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJ0YWJsZVwiKTtcblx0dGFyZ2V0LlRoZWFkID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJ0aGVhZFwiKTtcblx0dGFyZ2V0LlRib2R5ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJ0Ym9keVwiKTtcblx0dGFyZ2V0LlRyID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJ0clwiKTtcblx0dGFyZ2V0LlRkID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJ0ZFwiKTtcblx0dGFyZ2V0LlRoID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJ0aFwiKTtcblx0dGFyZ2V0LkltZyA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwiaW1nXCIpO1xuXHR0YXJnZXQuSSA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwiaVwiKTtcblx0dGFyZ2V0LkIgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImJcIik7XG59KSgpOyIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwieWFlZFwiKTtcblxuLyoqXG4gKiBDb2xsZWN0aW9uLlxuICogQGNsYXNzIENvbGxlY3Rpb25cbiAqL1xuZnVuY3Rpb24gQ29sbGVjdGlvbigpIHtcblx0dGhpcy5pdGVtcyA9IFtdO1xufVxuXG5pbmhlcml0cyhDb2xsZWN0aW9uLCBFdmVudERpc3BhdGNoZXIpO1xuXG4vKipcbiAqIEFkZCBpdGVtIGF0IGVuZC5cbiAqIEBtZXRob2QgYWRkSXRlbVxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5hZGRJdGVtID0gZnVuY3Rpb24oaXRlbSkge1xuXHR0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG5cblx0dGhpcy50cmlnZ2VyQ2hhbmdlKFwiYWRkXCIsIGl0ZW0sIHRoaXMuaXRlbXMubGVuZ3RoIC0gMSk7XG59XG5cbi8qKlxuICogQWRkIGl0ZW0gYXQgaW5kZXguXG4gKiBAbWV0aG9kIGFkZEl0ZW1cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuYWRkSXRlbUF0ID0gZnVuY3Rpb24oaW5kZXgsIGl0ZW0pIHtcblx0aWYgKGluZGV4IDwgMClcblx0XHRpbmRleCA9IDA7XG5cblx0aWYgKGluZGV4ID4gdGhpcy5pdGVtcy5sZW5ndGgpXG5cdFx0aW5kZXggPSB0aGlzLml0ZW1zLmxlbmd0aDtcblxuXHR2YXIgYWZ0ZXIgPSB0aGlzLml0ZW1zLnNwbGljZShpbmRleCk7XG5cdHRoaXMuaXRlbXMucHVzaChpdGVtKTtcblx0dGhpcy5pdGVtcyA9IHRoaXMuaXRlbXMuY29uY2F0KGFmdGVyKTtcblxuXHR0aGlzLnRyaWdnZXJDaGFuZ2UoXCJhZGRcIiwgaXRlbSwgaW5kZXgpO1xufVxuXG4vKipcbiAqIEdldCBsZW5ndGguXG4gKiBAbWV0aG9kIGdldExlbmd0aFxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5nZXRMZW5ndGggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoO1xufVxuXG4vKipcbiAqIEdldCBpdGVtIGF0IGluZGV4LlxuICogQG1ldGhvZCBnZXRJdGVtQXRcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuZ2V0SXRlbUF0ID0gZnVuY3Rpb24oaW5kZXgpIHtcblx0cmV0dXJuIHRoaXMuaXRlbXNbaW5kZXhdO1xufVxuXG4vKipcbiAqIEZpbmQgaXRlbSBpbmRleC5cbiAqIEBtZXRob2QgZ2V0SXRlbUluZGV4XG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmdldEl0ZW1JbmRleCA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0cmV0dXJuIHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgaXRlbSBhdC5cbiAqIEBtZXRob2QgcmVtb3ZlSXRlbUF0XG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLnJlbW92ZUl0ZW1BdCA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cdGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5pdGVtcy5sZW5ndGgpXG5cdFx0cmV0dXJuO1xuXG5cdHZhciBpdGVtID0gdGhpcy5nZXRJdGVtQXQoaW5kZXgpO1xuXG5cdHRoaXMuaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcblx0dGhpcy50cmlnZ2VyQ2hhbmdlKFwicmVtb3ZlXCIsIGl0ZW0sIGluZGV4KTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgaXRlbS5cbiAqIEBtZXRob2QgcmVtb3ZlSXRlbVxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5yZW1vdmVJdGVtID0gZnVuY3Rpb24oaXRlbSkge1xuXHR2YXIgaW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChpdGVtKTtcblxuXHR0aGlzLnJlbW92ZUl0ZW1BdChpbmRleCk7XG59XG5cbi8qKlxuICogVHJpZ2dlciBjaGFuZ2UgZXZlbnQuXG4gKiBAbWV0aG9kIHRyaWdnZXJDaGFuZ2VcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLnRyaWdnZXJDaGFuZ2UgPSBmdW5jdGlvbihldmVudEtpbmQsIGl0ZW0sIGluZGV4KSB7XG5cdHRoaXMudHJpZ2dlcih7XG5cdFx0dHlwZTogZXZlbnRLaW5kLFxuXHRcdGl0ZW06IGl0ZW0sXG5cdFx0aW5kZXg6IGluZGV4XG5cdH0pO1xuXG5cdHRoaXMudHJpZ2dlcih7XG5cdFx0dHlwZTogXCJjaGFuZ2VcIixcblx0XHRraW5kOiBldmVudEtpbmQsXG5cdFx0aXRlbTogaXRlbSxcblx0XHRpbmRleDogaW5kZXhcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sbGVjdGlvbjsiLCJ2YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcInlhZWRcIik7XG52YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgQ29sbGVjdGlvblZpZXdNYW5hZ2VyPXJlcXVpcmUoXCIuL0NvbGxlY3Rpb25WaWV3TWFuYWdlclwiKTtcblxuLyoqXG4gKiBDb2xsZWN0aW9uVmlldy5cbiAqIEBjbGFzcyBDb2xsZWN0aW9uVmlld1xuICovXG5mdW5jdGlvbiBDb2xsZWN0aW9uVmlldygpIHtcblx0eG5vZGUuRGl2LmNhbGwodGhpcyk7XG5cblx0dGhpcy5tYW5hZ2VyPW5ldyBDb2xsZWN0aW9uVmlld01hbmFnZXIodGhpcyk7XG59XG5cbmluaGVyaXRzKENvbGxlY3Rpb25WaWV3LCB4bm9kZS5EaXYpO1xuXG4vKipcbiAqIFNldCBpdGVtIHJlbmRlcmVyIGNsYXNzLlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJDbGFzc1xuICovXG5Db2xsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0SXRlbVJlbmRlcmVyQ2xhc3MgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLm1hbmFnZXIuc2V0SXRlbVJlbmRlcmVyQ2xhc3ModmFsdWUpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIHJlbmRlcmVyIGZhY3RvcnkuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckZhY3RvcnlcbiAqL1xuQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLnNldEl0ZW1SZW5kZXJlckZhY3RvcnkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLm1hbmFnZXIuc2V0SXRlbVJlbmRlcmVyRmFjdG9yeSh2YWx1ZSk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gY29udHJvbGxlciBjbGFzcy5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyQ2xhc3NcbiAqL1xuQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLnNldEl0ZW1Db250cm9sbGVyQ2xhc3MgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLm1hbmFnZXIuc2V0SXRlbUNvbnRyb2xsZXJDbGFzcyh2YWx1ZSk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gY29udHJvbGxlciBmYWN0b3J5LlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJGYWN0b3J5XG4gKi9cbkNvbGxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXRJdGVtQ29udHJvbGxlckZhY3RvcnkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLm1hbmFnZXIuc2V0SXRlbUNvbnRyb2xsZXJGYWN0b3J5KHZhbHVlKTtcbn1cblxuLyoqXG4gKiBTZXQgZGF0YSBzb3VyY2UuXG4gKiBAbWV0aG9kIHNldERhdGFTb3VyY2VcbiAqL1xuQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLnNldERhdGFTb3VyY2UgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLm1hbmFnZXIuc2V0RGF0YVNvdXJjZSh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sbGVjdGlvblZpZXc7IiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCJ5YWVkXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xuXG4vKipcbiAqIENvbGxlY3Rpb25WaWV3TWFuYWdlci5cbiAqIEBjbGFzcyBDb2xsZWN0aW9uVmlld01hbmFnZXJcbiAqL1xuZnVuY3Rpb24gQ29sbGVjdGlvblZpZXdNYW5hZ2VyKHRhcmdldCkge1xuXHR0aGlzLml0ZW1SZW5kZXJlcnMgPSBbXTtcblx0dGhpcy5pdGVtUmVuZGVyZXJDbGFzcyA9IG51bGw7XG5cdHRoaXMuaXRlbVJlbmRlcmVyRmFjdG9yeSA9IG51bGw7XG5cdHRoaXMuaXRlbUNvbnRyb2xsZXJDbGFzcyA9IG51bGw7XG5cdHRoaXMuaXRlbUNvbnRyb2xsZXJGYWN0b3J5ID0gbnVsbDtcblx0dGhpcy5kYXRhU291cmNlID0gbnVsbDtcblx0dGhpcy50YXJnZXQgPSBudWxsO1xuXG5cdHRoaXMuc2V0VGFyZ2V0KHRhcmdldCk7XG59XG5cbi8qKlxuICogU2V0IHRhcmdldC5cbiAqIEBtZXRob2Qgc2V0VGFyZ2V0XG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0VGFyZ2V0ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5yZW1vdmVBbGxJdGVtUmVuZGVyZXJzKCk7XG5cdHRoaXMudGFyZ2V0PXZhbHVlO1xuXHR0aGlzLnJlbW92ZUFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSByZW5kZXJlciBjbGFzcy5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyQ2xhc3NcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5zZXRJdGVtUmVuZGVyZXJDbGFzcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBpdGVtIHJlbmRlcmVyIGNsYXNzIHNob3VsZCBiZSBhIGZ1bmN0aW9uXCIpO1xuXG5cdHRoaXMuaXRlbVJlbmRlcmVyQ2xhc3MgPSB2YWx1ZTtcblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIHJlbmRlcmVyIGZhY3RvcnkuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckZhY3RvcnlcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5zZXRJdGVtUmVuZGVyZXJGYWN0b3J5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIGl0ZW0gcmVuZGVyZXIgZmFjdG9yeSBzaG91bGQgYmUgYSBmdW5jdGlvblwiKTtcblxuXHR0aGlzLml0ZW1SZW5kZXJlckZhY3RvcnkgPSB2YWx1ZTtcblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIGNvbnRyb2xsZXIgY2xhc3MuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckNsYXNzXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0SXRlbUNvbnRyb2xsZXJDbGFzcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBpdGVtIHJlbmRlcmVyIGNsYXNzIHNob3VsZCBiZSBhIGZ1bmN0aW9uXCIpO1xuXG5cdHRoaXMuaXRlbUNvbnRyb2xsZXJDbGFzcyA9IHZhbHVlO1xuXHR0aGlzLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gY29udHJvbGxlciBmYWN0b3J5LlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJGYWN0b3J5XG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0SXRlbUNvbnRyb2xsZXJGYWN0b3J5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIGl0ZW0gcmVuZGVyZXIgZmFjdG9yeSBzaG91bGQgYmUgYSBmdW5jdGlvblwiKTtcblxuXHR0aGlzLml0ZW1Db250cm9sbGVyRmFjdG9yeSA9IHZhbHVlO1xuXHR0aGlzLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogU2V0IGRhdGEgc291cmNlLlxuICogQG1ldGhvZCBzZXREYXRhU291cmNlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0RGF0YVNvdXJjZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh0aGlzLmRhdGFTb3VyY2UpIHtcblx0XHR0aGlzLmRhdGFTb3VyY2Uub2ZmKFwiY2hhbmdlXCIsIHRoaXMub25EYXRhU291cmNlQ2hhbmdlLCB0aGlzKTtcblx0fVxuXG5cdHRoaXMuZGF0YVNvdXJjZSA9IHZhbHVlO1xuXG5cdGlmICh0aGlzLmRhdGFTb3VyY2UpIHtcblx0XHR0aGlzLmRhdGFTb3VyY2Uub24oXCJjaGFuZ2VcIiwgdGhpcy5vbkRhdGFTb3VyY2VDaGFuZ2UsIHRoaXMpO1xuXHR9XG5cblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNvbWV0aGluZyBpbiB0aGUgZGF0YSBzb3VyY2Ugd2FzIGNoYW5nZWQuXG4gKiBAbWV0aG9kIG9uRGF0YVNvdXJjZUNoYW5nZVxuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5vbkRhdGFTb3VyY2VDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbGwgaXRlbSByZW5kZXJlcnMuXG4gKiBAbWV0aG9kIHJlbW92ZUFsbEl0ZW1SZW5kZXJlcnNcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUucmVtb3ZlQWxsSXRlbVJlbmRlcmVycyA9IGZ1bmN0aW9uKCkge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlbVJlbmRlcmVycy5sZW5ndGg7IGkrKykge1xuXHRcdGlmICh0aGlzLml0ZW1SZW5kZXJlcnNbaV0uX19jb250cm9sbGVyKVxuXHRcdFx0dGhpcy5pdGVtUmVuZGVyZXJzW2ldLl9fY29udHJvbGxlci5zZXREYXRhKG51bGwpO1xuXG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5pdGVtUmVuZGVyZXJzW2ldLnNldERhdGEobnVsbCk7XG5cblx0XHR0aGlzLnRhcmdldC5yZW1vdmVDaGlsZCh0aGlzLml0ZW1SZW5kZXJlcnNbaV0pO1xuXHR9XG5cblx0dGhpcy5pdGVtUmVuZGVyZXJzID0gW107XG59XG5cbi8qKlxuICogUmVmcmVzaCBhbGwgaXRlbSByZW5kZXJlcnMuXG4gKiBAbWV0aG9kIHJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnJlZnJlc2hBbGxJdGVtUmVuZGVyZXJzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVtb3ZlQWxsSXRlbVJlbmRlcmVycygpO1xuXG5cdGlmICghdGhpcy5kYXRhU291cmNlKVxuXHRcdHJldHVybjtcblxuXHRpZiAoIXRoaXMuaXRlbVJlbmRlcmVyQ2xhc3MgJiYgIXRoaXMuaXRlbVJlbmRlcmVyRmFjdG9yeSlcblx0XHRyZXR1cm47XG5cblx0aWYgKCF0aGlzLnRhcmdldClcblx0XHRyZXR1cm47XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRhdGFTb3VyY2UuZ2V0TGVuZ3RoKCk7IGkrKykge1xuXHRcdHZhciBkYXRhID0gdGhpcy5kYXRhU291cmNlLmdldEl0ZW1BdChpKTtcblx0XHR2YXIgcmVuZGVyZXIgPSB0aGlzLmNyZWF0ZUl0ZW1SZW5kZXJlcigpO1xuXG5cdFx0aWYgKHRoaXMuaXRlbUNvbnRyb2xsZXJDbGFzcyB8fCB0aGlzLml0ZW1Db250cm9sbGVyRmFjdG9yeSkge1xuXHRcdFx0cmVuZGVyZXIuX19jb250cm9sbGVyID0gdGhpcy5jcmVhdGVJdGVtQ29udHJvbGxlcihyZW5kZXJlcik7XG5cdFx0XHRyZW5kZXJlci5fX2NvbnRyb2xsZXIuc2V0RGF0YShkYXRhKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVuZGVyZXIuc2V0RGF0YShkYXRhKTtcblx0XHR9XG5cblx0XHR0aGlzLml0ZW1SZW5kZXJlcnMucHVzaChyZW5kZXJlcik7XG5cdFx0dGhpcy50YXJnZXQuYXBwZW5kQ2hpbGQocmVuZGVyZXIpO1xuXHR9XG59XG5cbi8qKlxuICogQ3JlYXRlIGl0ZW0gcmVuZGVyZXIuXG4gKiBAbWV0aG9kIGNyZWF0ZUl0ZW1SZW5kZXJlclxuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5jcmVhdGVJdGVtUmVuZGVyZXIgPSBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMuaXRlbVJlbmRlcmVyRmFjdG9yeSlcblx0XHRyZXR1cm4gdGhpcy5pdGVtUmVuZGVyZXJGYWN0b3J5KCk7XG5cblx0aWYgKHRoaXMuaXRlbVJlbmRlcmVyQ2xhc3MpXG5cdFx0cmV0dXJuIG5ldyB0aGlzLml0ZW1SZW5kZXJlckNsYXNzKCk7XG5cblx0dGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY3JlYXRlIGl0ZW0gcmVuZGVyZXIhXCIpO1xufVxuXG4vKipcbiAqIENyZWF0ZSBpdGVtIGNvbnRyb2xsZXIuXG4gKiBAbWV0aG9kIGNyZWF0ZUl0ZW1Db250cm9sbGVyXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLmNyZWF0ZUl0ZW1Db250cm9sbGVyID0gZnVuY3Rpb24ocmVuZGVyZXIpIHtcblx0aWYgKHRoaXMuaXRlbUNvbnRyb2xsZXJGYWN0b3J5KVxuXHRcdHJldHVybiB0aGlzLml0ZW1Db250cm9sbGVyRmFjdG9yeShyZW5kZXJlcik7XG5cblx0aWYgKHRoaXMuaXRlbUNvbnRyb2xsZXJDbGFzcylcblx0XHRyZXR1cm4gbmV3IHRoaXMuaXRlbUNvbnRyb2xsZXJDbGFzcyhyZW5kZXJlcik7XG5cblx0dGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY3JlYXRlIGl0ZW0gY29udHJvbGxlciFcIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sbGVjdGlvblZpZXdNYW5hZ2VyOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRDb2xsZWN0aW9uOiByZXF1aXJlKFwiLi9Db2xsZWN0aW9uXCIpLFxuXHRDb2xsZWN0aW9uVmlldzogcmVxdWlyZShcIi4vQ29sbGVjdGlvblZpZXdcIiksXG5cdENvbGxlY3Rpb25WaWV3TWFuYWdlcjogcmVxdWlyZShcIi4vQ29sbGVjdGlvblZpZXdNYW5hZ2VyXCIpXG59OyIsIi8qKlxuICogQVMzL2pxdWVyeSBzdHlsZSBldmVudCBkaXNwYXRjaGVyLiBTbGlnaHRseSBtb2RpZmllZC4gVGhlXG4gKiBqcXVlcnkgc3R5bGUgb24vb2ZmL3RyaWdnZXIgc3R5bGUgb2YgYWRkaW5nIGxpc3RlbmVycyBpc1xuICogY3VycmVudGx5IHRoZSBwcmVmZXJyZWQgb25lLlxuICpcbiAqIFRoZSBvbiBtZXRob2QgZm9yIGFkZGluZyBsaXN0ZW5lcnMgdGFrZXMgYW4gZXh0cmEgcGFyYW1ldGVyIHdoaWNoIGlzIHRoZVxuICogc2NvcGUgaW4gd2hpY2ggbGlzdGVuZXJzIHNob3VsZCBiZSBjYWxsZWQuIFNvIHRoaXM6XG4gKlxuICogICAgIG9iamVjdC5vbihcImV2ZW50XCIsIGxpc3RlbmVyLCB0aGlzKTtcbiAqXG4gKiBIYXMgdGhlIHNhbWUgZnVuY3Rpb24gd2hlbiBhZGRpbmcgZXZlbnRzIGFzOlxuICpcbiAqICAgICBvYmplY3Qub24oXCJldmVudFwiLCBsaXN0ZW5lci5iaW5kKHRoaXMpKTtcbiAqXG4gKiBIb3dldmVyLCB0aGUgZGlmZmVyZW5jZSBpcyB0aGF0IGlmIHdlIHVzZSB0aGUgc2Vjb25kIG1ldGhvZCBpdFxuICogd2lsbCBub3QgYmUgcG9zc2libGUgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgbGF0ZXIsIHVubGVzc1xuICogdGhlIGNsb3N1cmUgY3JlYXRlZCBieSBiaW5kIGlzIHN0b3JlZCBzb21ld2hlcmUuIElmIHRoZVxuICogZmlyc3QgbWV0aG9kIGlzIHVzZWQsIHdlIGNhbiByZW1vdmUgdGhlIGxpc3RlbmVyIHdpdGg6XG4gKlxuICogICAgIG9iamVjdC5vZmYoXCJldmVudFwiLCBsaXN0ZW5lciwgdGhpcyk7XG4gKlxuICogQGNsYXNzIEV2ZW50RGlzcGF0Y2hlclxuICovXG5mdW5jdGlvbiBFdmVudERpc3BhdGNoZXIoKSB7XG5cdHRoaXMubGlzdGVuZXJNYXAgPSB7fTtcbn1cblxuLyoqXG4gKiBBZGQgZXZlbnQgbGlzdGVuZXIuXG4gKiBAbWV0aG9kIGFkZEV2ZW50TGlzdGVuZXJcbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lciwgc2NvcGUpIHtcblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwKVxuXHRcdHRoaXMubGlzdGVuZXJNYXAgPSB7fTtcblxuXHRpZiAoIWV2ZW50VHlwZSlcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFdmVudCB0eXBlIHJlcXVpcmVkIGZvciBldmVudCBkaXNwYXRjaGVyXCIpO1xuXG5cdGlmICghbGlzdGVuZXIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTGlzdGVuZXIgcmVxdWlyZWQgZm9yIGV2ZW50IGRpc3BhdGNoZXJcIik7XG5cblx0dGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHNjb3BlKTtcblxuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXAuaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSlcblx0XHR0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV0gPSBbXTtcblxuXHR0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV0ucHVzaCh7XG5cdFx0bGlzdGVuZXI6IGxpc3RlbmVyLFxuXHRcdHNjb3BlOiBzY29wZVxuXHR9KTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXIuXG4gKiBAbWV0aG9kIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lciwgc2NvcGUpIHtcblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwKVxuXHRcdHRoaXMubGlzdGVuZXJNYXAgPSB7fTtcblxuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXAuaGFzT3duUHJvcGVydHkoZXZlbnRUeXBlKSlcblx0XHRyZXR1cm47XG5cblx0dmFyIGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBsaXN0ZW5lck9iaiA9IGxpc3RlbmVyc1tpXTtcblxuXHRcdGlmIChsaXN0ZW5lciA9PSBsaXN0ZW5lck9iai5saXN0ZW5lciAmJiBzY29wZSA9PSBsaXN0ZW5lck9iai5zY29wZSkge1xuXHRcdFx0bGlzdGVuZXJzLnNwbGljZShpLCAxKTtcblx0XHRcdGktLTtcblx0XHR9XG5cdH1cblxuXHRpZiAoIWxpc3RlbmVycy5sZW5ndGgpXG5cdFx0ZGVsZXRlIHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXTtcbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBldmVudC5cbiAqIEBtZXRob2QgZGlzcGF0Y2hFdmVudFxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQgPSBmdW5jdGlvbihldmVudCAvKiAuLi4gKi8gKSB7XG5cdGlmICghdGhpcy5saXN0ZW5lck1hcClcblx0XHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG5cblx0dmFyIGV2ZW50VHlwZTtcblx0dmFyIGxpc3RlbmVyUGFyYW1zO1xuXG5cdGlmICh0eXBlb2YgZXZlbnQgPT0gXCJzdHJpbmdcIikge1xuXHRcdGV2ZW50VHlwZSA9IGV2ZW50O1xuXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxuXHRcdFx0bGlzdGVuZXJQYXJhbXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG5cdFx0ZWxzZSBsaXN0ZW5lclBhcmFtcyA9IFt7XG5cdFx0XHR0eXBlOiBldmVudFR5cGUsXG5cdFx0XHR0YXJnZXQ6IHRoaXNcblx0XHR9XTtcblx0fSBlbHNlIHtcblx0XHRldmVudFR5cGUgPSBldmVudC50eXBlO1xuXHRcdGV2ZW50LnRhcmdldCA9IHRoaXM7XG5cdFx0bGlzdGVuZXJQYXJhbXMgPSBbZXZlbnRdO1xuXHR9XG5cblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpXG5cdFx0cmV0dXJuO1xuXG5cdGZvciAodmFyIGkgaW4gdGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdKSB7XG5cdFx0dmFyIGxpc3RlbmVyT2JqID0gdGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdW2ldO1xuXHRcdGxpc3RlbmVyT2JqLmxpc3RlbmVyLmFwcGx5KGxpc3RlbmVyT2JqLnNjb3BlLCBsaXN0ZW5lclBhcmFtcyk7XG5cdH1cbn1cblxuLyoqXG4gKiBKcXVlcnkgc3R5bGUgYWxpYXMgZm9yIGFkZEV2ZW50TGlzdGVuZXJcbiAqIEBtZXRob2Qgb25cbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblxuLyoqXG4gKiBKcXVlcnkgc3R5bGUgYWxpYXMgZm9yIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAqIEBtZXRob2Qgb2ZmXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub2ZmID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXG4vKipcbiAqIEpxdWVyeSBzdHlsZSBhbGlhcyBmb3IgZGlzcGF0Y2hFdmVudFxuICogQG1ldGhvZCB0cmlnZ2VyXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUudHJpZ2dlciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudDtcblxuLyoqXG4gKiBNYWtlIHNvbWV0aGluZyBhbiBldmVudCBkaXNwYXRjaGVyLiBDYW4gYmUgdXNlZCBmb3IgbXVsdGlwbGUgaW5oZXJpdGFuY2UuXG4gKiBAbWV0aG9kIGluaXRcbiAqIEBzdGF0aWNcbiAqL1xuRXZlbnREaXNwYXRjaGVyLmluaXQgPSBmdW5jdGlvbihjbHMpIHtcblx0Y2xzLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyO1xuXHRjbHMucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cdGNscy5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudDtcblx0Y2xzLnByb3RvdHlwZS5vbiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub247XG5cdGNscy5wcm90b3R5cGUub2ZmID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5vZmY7XG5cdGNscy5wcm90b3R5cGUudHJpZ2dlciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUudHJpZ2dlcjtcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gRXZlbnREaXNwYXRjaGVyO1xufSIsInZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciBBcHBWaWV3ID0gcmVxdWlyZShcIi4uL3ZpZXcvQXBwVmlld1wiKTtcbnZhciBBcHBNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9BcHBNb2RlbFwiKTtcbnZhciBBcHBDb250cm9sbGVyID0gcmVxdWlyZShcIi4uL2NvbnRyb2xsZXIvQXBwQ29udHJvbGxlclwiKTtcblxuLyoqXG4gKiBUaGUgbWFpbiByZXNvdXJjZSBmaWRkbGUgYXBwIGNsYXNzLlxuICogQGNsYXNzIEFwcFxuICovXG5mdW5jdGlvbiBBcHAoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMuc3R5bGUudG9wID0gMDtcblx0dGhpcy5zdHlsZS5ib3R0b20gPSAwO1xuXHR0aGlzLnN0eWxlLmxlZnQgPSAwO1xuXHR0aGlzLnN0eWxlLnJpZ2h0ID0gMDtcblxuXHR0aGlzLmFwcFZpZXcgPSBuZXcgQXBwVmlldygpO1xuXHR0aGlzLmFwcE1vZGVsID0gbmV3IEFwcE1vZGVsKCk7XG5cdHRoaXMuYXBwQ29udHJvbGxlciA9IG5ldyBBcHBDb250cm9sbGVyKHRoaXMuYXBwTW9kZWwsIHRoaXMuYXBwVmlldyk7XG5cblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLmFwcFZpZXcpO1xufVxuXG5pbmhlcml0cyhBcHAsIHhub2RlLkRpdik7XG5cbi8qKlxuICogR2V0IG1vZGVsLlxuICogQG1ldGhvZCBnZXRNb2RlbFxuICovXG5BcHAucHJvdG90eXBlLmdldE1vZGVsID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmFwcE1vZGVsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcDsiLCJ2YXIgUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyID0gcmVxdWlyZShcIi4vUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyXCIpO1xudmFyIFJlc291cmNlVGFiQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL1Jlc291cmNlVGFiQ29udHJvbGxlclwiKTtcbnZhciBSZXNvdXJjZVRhYkhlYWRlclZpZXcgPSByZXF1aXJlKFwiLi4vdmlldy9SZXNvdXJjZVRhYkhlYWRlclZpZXdcIik7XG52YXIgUmVzb3VyY2VUYWJWaWV3ID0gcmVxdWlyZShcIi4uL3ZpZXcvUmVzb3VyY2VUYWJWaWV3XCIpO1xudmFyIHhub2RlYyA9IHJlcXVpcmUoXCJ4bm9kZWNvbGxlY3Rpb25cIik7XG5cbi8qKlxuICogQXBwIGNvbnRyb2xsZXJcbiAqIEBjbGFzcyBBcHBDb250cm9sbGVyXG4gKi9cbmZ1bmN0aW9uIEFwcENvbnRyb2xsZXIoYXBwTW9kZWwsIGFwcFZpZXcpIHtcblx0dGhpcy5hcHBNb2RlbCA9IGFwcE1vZGVsO1xuXHR0aGlzLmFwcFZpZXcgPSBhcHBWaWV3O1xuXG5cdHRoaXMudGFiSGVhZGVyTWFuYWdlciA9IG5ldyB4bm9kZWMuQ29sbGVjdGlvblZpZXdNYW5hZ2VyKCk7XG5cdHRoaXMudGFiSGVhZGVyTWFuYWdlci5zZXRUYXJnZXQodGhpcy5hcHBWaWV3LmdldFJlc291cmNlUGFuZVZpZXcoKS5nZXRUYWJIZWFkZXJIb2xkZXIoKSk7XG5cdHRoaXMudGFiSGVhZGVyTWFuYWdlci5zZXRJdGVtQ29udHJvbGxlckNsYXNzKFJlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlcik7XG5cdHRoaXMudGFiSGVhZGVyTWFuYWdlci5zZXRJdGVtUmVuZGVyZXJDbGFzcyhSZXNvdXJjZVRhYkhlYWRlclZpZXcpO1xuXHR0aGlzLnRhYkhlYWRlck1hbmFnZXIuc2V0RGF0YVNvdXJjZSh0aGlzLmFwcE1vZGVsLmdldENhdGVnb3J5Q29sbGVjdGlvbigpKTtcblxuXHR0aGlzLnRhYk1hbmFnZXIgPSBuZXcgeG5vZGVjLkNvbGxlY3Rpb25WaWV3TWFuYWdlcigpO1xuXHR0aGlzLnRhYk1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuYXBwVmlldy5nZXRSZXNvdXJjZVBhbmVWaWV3KCkuZ2V0VGFiSG9sZGVyKCkpO1xuXHR0aGlzLnRhYk1hbmFnZXIuc2V0SXRlbUNvbnRyb2xsZXJDbGFzcyhSZXNvdXJjZVRhYkNvbnRyb2xsZXIpO1xuXHR0aGlzLnRhYk1hbmFnZXIuc2V0SXRlbVJlbmRlcmVyQ2xhc3MoUmVzb3VyY2VUYWJWaWV3KTtcblx0dGhpcy50YWJNYW5hZ2VyLnNldERhdGFTb3VyY2UodGhpcy5hcHBNb2RlbC5nZXRDYXRlZ29yeUNvbGxlY3Rpb24oKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwQ29udHJvbGxlcjsiLCJ2YXIgUmVzb3VyY2VJdGVtQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL1Jlc291cmNlSXRlbUNvbnRyb2xsZXJcIik7XG52YXIgUmVzb3VyY2VJdGVtVmlldyA9IHJlcXVpcmUoXCIuLi92aWV3L1Jlc291cmNlSXRlbVZpZXdcIik7XG52YXIgeG5vZGVjID0gcmVxdWlyZShcInhub2RlY29sbGVjdGlvblwiKTtcblxuLyoqXG4gKiBDb250cm9sIGEgcmVzb3VyY2UgY2F0ZWdvcnkuXG4gKiBAbWV0aG9kIFJlc291cmNlVGFiQ29udHJvbGxlclxuICovXG5mdW5jdGlvbiBSZXNvdXJjZUNhdGVnb3J5Q29udHJvbGxlcihjYXRlZ29yeVZpZXcpIHtcblx0dGhpcy5jYXRlZ29yeVZpZXcgPSBjYXRlZ29yeVZpZXc7XG5cblx0dGhpcy5jYXRlZ29yeVZpZXcub24oXCJ0aXRsZUNsaWNrXCIsIHRoaXMub25DYXRlZ29yeVZpZXdUaXRsZUNsaWNrLCB0aGlzKTtcblxuXHR0aGlzLml0ZW1NYW5hZ2VyID0gbmV3IHhub2RlYy5Db2xsZWN0aW9uVmlld01hbmFnZXIoKTtcblx0dGhpcy5pdGVtTWFuYWdlci5zZXRUYXJnZXQodGhpcy5jYXRlZ29yeVZpZXcuZ2V0SXRlbUhvbGRlcigpKTtcblx0dGhpcy5pdGVtTWFuYWdlci5zZXRJdGVtUmVuZGVyZXJDbGFzcyhSZXNvdXJjZUl0ZW1WaWV3KTtcblx0dGhpcy5pdGVtTWFuYWdlci5zZXRJdGVtQ29udHJvbGxlckNsYXNzKFJlc291cmNlSXRlbUNvbnRyb2xsZXIpO1xufVxuXG4vKipcbiAqIFNldCBkYXRhLlxuICogQG1ldGhvZCBzZXREYXRhXG4gKi9cblJlc291cmNlQ2F0ZWdvcnlDb250cm9sbGVyLnByb3RvdHlwZS5zZXREYXRhID0gZnVuY3Rpb24oY2F0ZWdvcnlNb2RlbCkge1xuXHRpZiAodGhpcy5jYXRlZ29yeU1vZGVsKSB7XG5cdFx0dGhpcy5pdGVtTWFuYWdlci5zZXREYXRhU291cmNlKG51bGwpO1xuXG5cdFx0dGhpcy5jYXRlZ29yeU1vZGVsLm9mZihcImNoYW5nZVwiLCB0aGlzLm9uQ2F0ZWdvcnlNb2RlbENoYW5nZSwgdGhpcyk7XG5cdH1cblxuXHR0aGlzLmNhdGVnb3J5TW9kZWwgPSBjYXRlZ29yeU1vZGVsO1xuXG5cdGlmICh0aGlzLmNhdGVnb3J5TW9kZWwpIHtcblx0XHR0aGlzLml0ZW1NYW5hZ2VyLnNldERhdGFTb3VyY2UodGhpcy5jYXRlZ29yeU1vZGVsLmdldEl0ZW1Db2xsZWN0aW9uKCkpO1xuXG5cdFx0dGhpcy5jYXRlZ29yeU1vZGVsLm9uKFwiY2hhbmdlXCIsIHRoaXMub25DYXRlZ29yeU1vZGVsQ2hhbmdlLCB0aGlzKTtcblx0XHR0aGlzLmNhdGVnb3J5Vmlldy5zZXRBY3RpdmUoY2F0ZWdvcnlNb2RlbC5pc0FjdGl2ZSgpKTtcblx0XHR0aGlzLmNhdGVnb3J5Vmlldy5zZXRMYWJlbChjYXRlZ29yeU1vZGVsLmdldExhYmVsKCkpO1xuXHRcdHRoaXMuY2F0ZWdvcnlWaWV3LnNldERlc2NyaXB0aW9uKHRoaXMuY2F0ZWdvcnlNb2RlbC5nZXREZXNjcmlwdGlvbigpKTtcblx0fVxufVxuXG4vKipcbiAqIEhhbmRsZSBjaGFuZ2UgaW4gdGhlIG1vZGVsLlxuICogQG1ldGhvZCBvbkNhdGVnb3J5TW9kZWxDaGFuZ2VcbiAqL1xuUmVzb3VyY2VDYXRlZ29yeUNvbnRyb2xsZXIucHJvdG90eXBlLm9uQ2F0ZWdvcnlNb2RlbENoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmNhdGVnb3J5Vmlldy5zZXRBY3RpdmUodGhpcy5jYXRlZ29yeU1vZGVsLmlzQWN0aXZlKCkpO1xuXHR0aGlzLmNhdGVnb3J5Vmlldy5zZXREZXNjcmlwdGlvbih0aGlzLmNhdGVnb3J5TW9kZWwuZ2V0RGVzY3JpcHRpb24oKSk7XG59XG5cbi8qKlxuICogVGl0bGUgY2xpY2suIFRvZ2dsZSB0aGUgYWN0aXZlIHN0YXRlLlxuICogQG1ldGhvZCBvbkNhdGVnb3J5Vmlld1RpdGxlQ2xpY2tcbiAqL1xuUmVzb3VyY2VDYXRlZ29yeUNvbnRyb2xsZXIucHJvdG90eXBlLm9uQ2F0ZWdvcnlWaWV3VGl0bGVDbGljayA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmNhdGVnb3J5TW9kZWwuc2V0QWN0aXZlKCF0aGlzLmNhdGVnb3J5TW9kZWwuaXNBY3RpdmUoKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VDYXRlZ29yeUNvbnRyb2xsZXI7IiwiLyoqXG4gKiBDb250cm9sIGEgcmVzb3VyY2UgaXRlbS5cbiAqIEBjbGFzcyBSZXNvdXJjZUl0ZW1Db250cm9sbGVyXG4gKi9cbmZ1bmN0aW9uIFJlc291cmNlSXRlbUNvbnRyb2xsZXIoaXRlbVZpZXcpIHtcblx0dGhpcy5pdGVtVmlldyA9IGl0ZW1WaWV3O1xufVxuXG4vKipcbiAqIFNldCBpdGVtIG1vZGVsIHRvIHNlcnZlIGFzIGRhdGEuXG4gKiBAbWV0aG9kIHNldERhdGFcbiAqL1xuUmVzb3VyY2VJdGVtQ29udHJvbGxlci5wcm90b3R5cGUuc2V0RGF0YSA9IGZ1bmN0aW9uKGl0ZW1Nb2RlbCkge1xuXHR0aGlzLml0ZW1Nb2RlbCA9IGl0ZW1Nb2RlbDtcblxuXHRpZiAodGhpcy5pdGVtTW9kZWwpIHtcblx0XHR0aGlzLml0ZW1WaWV3LnNldEtleSh0aGlzLml0ZW1Nb2RlbC5nZXRLZXkoKSk7XG5cdFx0dGhpcy5pdGVtVmlldy5zZXREZWZhdWx0VmFsdWUodGhpcy5pdGVtTW9kZWwuZ2V0RGVmYXVsdFZhbHVlKCkpO1xuXHRcdHRoaXMuaXRlbVZpZXcuc2V0VmFsdWUodGhpcy5pdGVtTW9kZWwuZ2V0VmFsdWUoKSk7XG5cblx0XHR0aGlzLml0ZW1WaWV3LnNldEl0ZW1UeXBlKHRoaXMuaXRlbU1vZGVsLmdldEl0ZW1UeXBlKCkpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VJdGVtQ29udHJvbGxlcjsiLCJ2YXIgUmVzb3VyY2VDYXRlZ29yeUNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9SZXNvdXJjZUNhdGVnb3J5Q29udHJvbGxlclwiKTtcbnZhciBSZXNvdXJjZUNhdGVnb3J5VmlldyA9IHJlcXVpcmUoXCIuLi92aWV3L1Jlc291cmNlQ2F0ZWdvcnlWaWV3XCIpO1xudmFyIHhub2RlYyA9IHJlcXVpcmUoXCJ4bm9kZWNvbGxlY3Rpb25cIik7XG5cbi8qKlxuICogQ29udHJvbCBvbmUgcmVzb3VyY2UgdGFiLlxuICogQG1ldGhvZCBSZXNvdXJjZVRhYkNvbnRyb2xsZXJcbiAqL1xuZnVuY3Rpb24gUmVzb3VyY2VUYWJDb250cm9sbGVyKHRhYlZpZXcpIHtcblx0dGhpcy50YWJWaWV3ID0gdGFiVmlldztcblxuXHR0aGlzLmNhdGVnb3J5TWFuYWdlciA9IG5ldyB4bm9kZWMuQ29sbGVjdGlvblZpZXdNYW5hZ2VyKCk7XG5cdHRoaXMuY2F0ZWdvcnlNYW5hZ2VyLnNldFRhcmdldCh0YWJWaWV3LmdldENhdGVnb3J5SG9sZGVyKCkpO1xuXHR0aGlzLmNhdGVnb3J5TWFuYWdlci5zZXRJdGVtUmVuZGVyZXJDbGFzcyhSZXNvdXJjZUNhdGVnb3J5Vmlldyk7XG5cdHRoaXMuY2F0ZWdvcnlNYW5hZ2VyLnNldEl0ZW1Db250cm9sbGVyQ2xhc3MoUmVzb3VyY2VDYXRlZ29yeUNvbnRyb2xsZXIpO1xufVxuXG4vKipcbiAqIFNldCBkYXRhLlxuICogQG1ldGhvZCBzZXREYXRhXG4gKi9cblJlc291cmNlVGFiQ29udHJvbGxlci5wcm90b3R5cGUuc2V0RGF0YSA9IGZ1bmN0aW9uKGNhdGVnb3J5TW9kZWwpIHtcblx0aWYgKHRoaXMuY2F0ZWdvcnlNb2RlbCkge1xuXHRcdHRoaXMuY2F0ZWdvcnlNb2RlbC5vZmYoXCJjaGFuZ2VcIiwgdGhpcy5vbkNhdGVnb3J5TW9kZWxDaGFuZ2UsIHRoaXMpO1xuXHRcdHRoaXMuY2F0ZWdvcnlNYW5hZ2VyLnNldERhdGFTb3VyY2UobnVsbCk7XG5cdH1cblxuXHR0aGlzLmNhdGVnb3J5TW9kZWwgPSBjYXRlZ29yeU1vZGVsO1xuXG5cdGlmICh0aGlzLmNhdGVnb3J5TW9kZWwpIHtcblx0XHR0aGlzLmNhdGVnb3J5TW9kZWwub24oXCJjaGFuZ2VcIiwgdGhpcy5vbkNhdGVnb3J5TW9kZWxDaGFuZ2UsIHRoaXMpO1xuXHRcdHRoaXMudGFiVmlldy5zZXRBY3RpdmUoY2F0ZWdvcnlNb2RlbC5pc0FjdGl2ZSgpKTtcblx0XHR0aGlzLnRhYlZpZXcuc2V0RGVzY3JpcHRpb24oY2F0ZWdvcnlNb2RlbC5nZXREZXNjcmlwdGlvbigpKTtcblxuXHRcdHRoaXMuY2F0ZWdvcnlNYW5hZ2VyLnNldERhdGFTb3VyY2UoY2F0ZWdvcnlNb2RlbC5nZXRDYXRlZ29yeUNvbGxlY3Rpb24oKSk7XG5cdH1cbn1cblxuLyoqXG4gKiBIYW5kbGUgY2hhbmdlIGluIHRoZSBtb2RlbC5cbiAqIEBtZXRob2Qgb25DYXRlZ29yeU1vZGVsQ2hhbmdlXG4gKi9cblJlc291cmNlVGFiQ29udHJvbGxlci5wcm90b3R5cGUub25DYXRlZ29yeU1vZGVsQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMudGFiVmlldy5zZXRBY3RpdmUodGhpcy5jYXRlZ29yeU1vZGVsLmlzQWN0aXZlKCkpO1xuXHR0aGlzLnRhYlZpZXcuc2V0RGVzY3JpcHRpb24odGhpcy5jYXRlZ29yeU1vZGVsLmdldERlc2NyaXB0aW9uKCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlVGFiQ29udHJvbGxlcjsiLCIvKipcbiAqIENvbnRyb2wgdGhlIGhlYWRlciBmaWVsZCBvZiB0aGUgdGFibHMgaW4gdGhlIHJlc291cmNlIHBhbmUuXG4gKiBAbWV0aG9kIFJlc291cmNlVGFiQ29udHJvbGxlclxuICovXG5mdW5jdGlvbiBSZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXIodGFiSGVhZGVyVmlldykge1xuXHR0aGlzLnRhYkhlYWRlclZpZXcgPSB0YWJIZWFkZXJWaWV3O1xuXHR0aGlzLnRhYkhlYWRlclZpZXcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25UYWJIZWFkZXJWaWV3Q2xpY2suYmluZCh0aGlzKSk7XG59XG5cbi8qKlxuICogU2V0IGRhdGEuXG4gKiBAbWV0aG9kIHNldERhdGFcbiAqL1xuUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyLnByb3RvdHlwZS5zZXREYXRhID0gZnVuY3Rpb24oY2F0ZWdvcnlNb2RlbCkge1xuXHRpZiAodGhpcy5jYXRlZ29yeU1vZGVsKSB7XG5cdFx0dGhpcy5jYXRlZ29yeU1vZGVsLm9mZihcImNoYW5nZVwiLCB0aGlzLm9uQ2F0ZWdvcnlNb2RlbENoYW5nZSwgdGhpcyk7XG5cdH1cblxuXHR0aGlzLmNhdGVnb3J5TW9kZWwgPSBjYXRlZ29yeU1vZGVsO1xuXG5cdGlmICh0aGlzLmNhdGVnb3J5TW9kZWwpIHtcblx0XHR0aGlzLmNhdGVnb3J5TW9kZWwub24oXCJjaGFuZ2VcIiwgdGhpcy5vbkNhdGVnb3J5TW9kZWxDaGFuZ2UsIHRoaXMpO1xuXHRcdHRoaXMudGFiSGVhZGVyVmlldy5zZXRMYWJlbChjYXRlZ29yeU1vZGVsLmdldExhYmVsKCkpO1xuXHRcdHRoaXMudGFiSGVhZGVyVmlldy5zZXRBY3RpdmUoY2F0ZWdvcnlNb2RlbC5pc0FjdGl2ZSgpKTtcblx0fVxufVxuXG4vKipcbiAqIFRoZSB0YWIgd2FzIGNsaWNrZWQsIHNldCB0aGlzIHRhYiBhcyB0aGUgYWN0aXZlIG9uZS5cbiAqIEBtZXRob2Qgb25UYWJIZWFkZXJWaWV3Q2xpY2tcbiAqL1xuUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyLnByb3RvdHlwZS5vblRhYkhlYWRlclZpZXdDbGljayA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmNhdGVnb3J5TW9kZWwuc2V0QWN0aXZlKHRydWUpO1xufVxuXG4vKipcbiAqIFRoZSBtb2RlbCBjaGFuZ2VkLlxuICogQG1ldGhvZCBvbkNhdGVnb3J5TW9kZWxDaGFuZ2VcbiAqL1xuUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyLnByb3RvdHlwZS5vbkNhdGVnb3J5TW9kZWxDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0dGhpcy50YWJIZWFkZXJWaWV3LnNldEFjdGl2ZSh0aGlzLmNhdGVnb3J5TW9kZWwuaXNBY3RpdmUoKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VUYWJIZWFkZXJDb250cm9sbGVyOyIsImZpZGRsZXVpID0ge1xuXHRBcHA6IHJlcXVpcmUoXCIuL2FwcC9BcHBcIiksXG5cdENhdGVnb3J5TW9kZWw6IHJlcXVpcmUoXCIuL21vZGVsL0NhdGVnb3J5TW9kZWxcIiksXG5cdFJlc291cmNlSXRlbU1vZGVsOiByZXF1aXJlKFwiLi9tb2RlbC9SZXNvdXJjZUl0ZW1Nb2RlbFwiKVxufTsiLCJ2YXIgeG5vZGVjID0gcmVxdWlyZShcInhub2RlY29sbGVjdGlvblwiKTtcbnZhciBDYXRlZ29yeU1vZGVsID0gcmVxdWlyZShcIi4vQ2F0ZWdvcnlNb2RlbFwiKTtcblxuLyoqXG4gKiBBcHBNb2RlbFxuICogQGNsYXNzIEFwcE1vZGVsXG4gKi9cbmZ1bmN0aW9uIEFwcE1vZGVsKCkge1xuXHR0aGlzLmNhdGVnb3J5Q29sbGVjdGlvbiA9IG5ldyB4bm9kZWMuQ29sbGVjdGlvbigpO1xuXG5cdHRoaXMuaWRDb3VudCA9IDA7XG59XG5cbi8qKlxuICogR2V0IGNhdGVnb3J5IGNvbGxlY3Rpb24uXG4gKiBAbWV0aG9kIGdldENhdGVnb3J5Q29sbGVjdGlvblxuICovXG5BcHBNb2RlbC5wcm90b3R5cGUuZ2V0Q2F0ZWdvcnlDb2xsZWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNhdGVnb3J5Q29sbGVjdGlvbjtcbn1cblxuLyoqXG4gKiBBZGQgY2F0ZWdvcnkgbW9kZWwuXG4gKiBAbWV0aG9kIGFkZENhdGVnb3J5TW9kZWxcbiAqL1xuQXBwTW9kZWwucHJvdG90eXBlLmFkZENhdGVnb3J5TW9kZWwgPSBmdW5jdGlvbihjYXRlZ29yeU1vZGVsKSB7XG5cdGNhdGVnb3J5TW9kZWwuc2V0UGFyZW50TW9kZWwodGhpcyk7XG5cdHRoaXMuY2F0ZWdvcnlDb2xsZWN0aW9uLmFkZEl0ZW0oY2F0ZWdvcnlNb2RlbCk7XG5cblx0aWYgKHRoaXMuY2F0ZWdvcnlDb2xsZWN0aW9uLmdldExlbmd0aCgpID09IDEpXG5cdFx0Y2F0ZWdvcnlNb2RlbC5zZXRBY3RpdmUodHJ1ZSk7XG5cblx0cmV0dXJuIGNhdGVnb3J5TW9kZWw7XG59XG5cbi8qKlxuICogQ3JlYXRlIGFuZCBhZGQgYSBjYXRlZ29yeSBtb2RlbC5cbiAqIEBtZXRob2QgY3JlYXRlQ2F0ZWdvcnlcbiAqL1xuQXBwTW9kZWwucHJvdG90eXBlLmNyZWF0ZUNhdGVnb3J5ID0gZnVuY3Rpb24odGl0bGUpIHtcblx0dmFyIGNhdGVnb3J5TW9kZWwgPSBuZXcgQ2F0ZWdvcnlNb2RlbCh0aXRsZSk7XG5cblx0cmV0dXJuIHRoaXMuYWRkQ2F0ZWdvcnlNb2RlbChjYXRlZ29yeU1vZGVsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBNb2RlbDsiLCJ2YXIgQXBwTW9kZWwgPSByZXF1aXJlKFwiLi9BcHBNb2RlbFwiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwieWFlZFwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZWMgPSByZXF1aXJlKFwieG5vZGVjb2xsZWN0aW9uXCIpO1xuXG4vKipcbiAqIEdldCBjYXRlZ29yeSBtb2RlbC5cbiAqIEBjbGFzcyBDYXRlZ29yeU1vZGVsXG4gKi9cbmZ1bmN0aW9uIENhdGVnb3J5TW9kZWwobGFiZWwpIHtcblx0dGhpcy5sYWJlbCA9IGxhYmVsO1xuXHR0aGlzLnBhcmVudE1vZGVsID0gbnVsbDtcblx0dGhpcy5hY3RpdmUgPSBmYWxzZTtcblx0dGhpcy5jYXRlZ29yeUNvbGxlY3Rpb24gPSBuZXcgeG5vZGVjLkNvbGxlY3Rpb24oKTtcblx0dGhpcy5pdGVtQ29sbGVjdGlvbiA9IG5ldyB4bm9kZWMuQ29sbGVjdGlvbigpO1xuXHR0aGlzLmRlc2NyaXB0aW9uID0gXCJcIjtcbn1cblxuaW5oZXJpdHMoQ2F0ZWdvcnlNb2RlbCwgRXZlbnREaXNwYXRjaGVyKTtcblxuLyoqXG4gKiBTZXQgcmVmZXJlbmNlIHRvIHBhcmVudCBtb2RlbC5cbiAqIEBtZXRob2QgZ2V0UGFyZW50TW9kZWxcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuc2V0UGFyZW50TW9kZWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLnBhcmVudE1vZGVsID0gdmFsdWU7XG59XG5cbi8qKlxuICogR2V0IGxhYmVsLlxuICogQG1ldGhvZCBnZXRMYWJlbFxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5nZXRMYWJlbCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5sYWJlbDtcbn1cblxuLyoqXG4gKiBHZXQgZGVzY3JpcHRpb24uXG4gKiBAbWV0aG9kIGdldExhYmVsXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLmdldERlc2NyaXB0aW9uID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmRlc2NyaXB0aW9uO1xufVxuXG4vKipcbiAqIFNldCBkZXNjcmlwdGlvbi5cbiAqIEBtZXRob2QgZ2V0TGFiZWxcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuc2V0RGVzY3JpcHRpb24gPSBmdW5jdGlvbihkZXNjcmlwdGlvbikge1xuXHR0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG5cblx0dGhpcy50cmlnZ2VyKFwiY2hhbmdlXCIpO1xufVxuXG4vKipcbiAqIEdldCByZWZlcmVuY2UgdG8gYXBwIG1vZGVsLlxuICogQG1ldGhvZCBnZXRBcHBNb2RlbFxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5nZXRBcHBNb2RlbCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIXRoaXMucGFyZW50TW9kZWwpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwidGhlcmUgaXMgbm8gcGFyZW50IVwiKTtcblxuXHR2YXIgcCA9IHRoaXMucGFyZW50TW9kZWw7XG5cblx0d2hpbGUgKHAgJiYgIShwIGluc3RhbmNlb2YgQXBwTW9kZWwpKVxuXHRcdHAgPSBwLnBhcmVudE1vZGVsO1xuXG5cdHJldHVybiBwO1xufVxuXG4vKipcbiAqIFNldCBhY3RpdmUgc3RhdGUuXG4gKiBAbWV0aG9kIHNldEFjdGl2ZVxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5zZXRBY3RpdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgPT0gdGhpcy5hY3RpdmUpXG5cdFx0cmV0dXJuO1xuXG5cdHZhciBzaWJsaW5ncyA9IHRoaXMucGFyZW50TW9kZWwuZ2V0Q2F0ZWdvcnlDb2xsZWN0aW9uKCk7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzaWJsaW5ncy5nZXRMZW5ndGgoKTsgaSsrKVxuXHRcdGlmIChzaWJsaW5ncy5nZXRJdGVtQXQoaSkgIT0gdGhpcylcblx0XHRcdHNpYmxpbmdzLmdldEl0ZW1BdChpKS5zZXRBY3RpdmUoZmFsc2UpO1xuXG5cdHRoaXMuYWN0aXZlID0gdmFsdWU7XG5cdHRoaXMudHJpZ2dlcihcImNoYW5nZVwiKTtcbn1cblxuLyoqXG4gKiBJcyB0aGlzIGNhdGVnb3J5IHRoZSBhY3RpdmUgb25lP1xuICogQG1ldGhvZCBpc0FjdGl2ZVxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5hY3RpdmU7XG59XG5cbi8qKlxuICogR2V0IGNhdGVnb3J5IGNvbGxlY3Rpb24gZm9yIHN1YiBjYXRlZ29yaWVzLlxuICogQG1ldGhvZCBnZXRDYXRlZ29yeUNvbGxlY3Rpb25cbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuZ2V0Q2F0ZWdvcnlDb2xsZWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNhdGVnb3J5Q29sbGVjdGlvbjtcbn1cblxuLyoqXG4gKiBHZXQgaXRlbSBjb2xsZWN0aW9uLlxuICogQG1ldGhvZCBnZXRJdGVtQ29sbGVjdGlvblxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5nZXRJdGVtQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5pdGVtQ29sbGVjdGlvbjtcbn1cblxuLyoqXG4gKiBBZGQgc3ViIGNhdGVnb3J5IG1vZGVsLlxuICogQG1ldGhvZCBhZGRDYXRlZ29yeU1vZGVsXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLmFkZENhdGVnb3J5TW9kZWwgPSBmdW5jdGlvbihjYXRlZ29yeU1vZGVsKSB7XG5cdGNhdGVnb3J5TW9kZWwuc2V0UGFyZW50TW9kZWwodGhpcyk7XG5cdHRoaXMuY2F0ZWdvcnlDb2xsZWN0aW9uLmFkZEl0ZW0oY2F0ZWdvcnlNb2RlbCk7XG5cblx0cmV0dXJuIGNhdGVnb3J5TW9kZWw7XG59XG5cbi8qKlxuICogQ3JlYXRlIGFuZCBhZGQgYSBjYXRlZ29yeSBtb2RlbC5cbiAqIEBtZXRob2QgY3JlYXRlQ2F0ZWdvcnlcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuY3JlYXRlQ2F0ZWdvcnkgPSBmdW5jdGlvbih0aXRsZSkge1xuXHR2YXIgY2F0ZWdvcnlNb2RlbCA9IG5ldyBDYXRlZ29yeU1vZGVsKHRpdGxlKTtcblxuXHRyZXR1cm4gdGhpcy5hZGRDYXRlZ29yeU1vZGVsKGNhdGVnb3J5TW9kZWwpO1xufVxuXG4vKipcbiAqIEFkZCByZXNvdXJjZSBpdGVtIG1vZGVsLlxuICogQG1ldGhvZCBhZGRSZXNvdXJjZUl0ZW1Nb2RlbFxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5hZGRSZXNvdXJjZUl0ZW1Nb2RlbCA9IGZ1bmN0aW9uKHJlc291cmNlSXRlbU1vZGVsKSB7XG5cdHRoaXMuaXRlbUNvbGxlY3Rpb24uYWRkSXRlbShyZXNvdXJjZUl0ZW1Nb2RlbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2F0ZWdvcnlNb2RlbDsiLCIvKipcbiAqIFJlc291cmNlSXRlbU1vZGVsXG4gKiBAY2xhc3MgUmVzb3VyY2VJdGVtTW9kZWxcbiAqL1xuZnVuY3Rpb24gUmVzb3VyY2VJdGVtTW9kZWwoa2V5LCBkZWZhdWx0VmFsdWUsIHZhbHVlLCB0eXBlKSB7XG5cdHRoaXMua2V5ID0ga2V5O1xuXHR0aGlzLmRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRWYWx1ZTtcblx0dGhpcy52YWx1ZSA9IHZhbHVlO1xuXG5cdHRoaXMuaXRlbVR5cGUgPSB0eXBlO1xuXG5cdGlmICghdGhpcy5pdGVtVHlwZSlcblx0XHR0aGlzLml0ZW1UeXBlID0gXCJwb3NpdGlvblwiO1xufVxuXG4vKipcbiAqIEdldCBrZXkuXG4gKiBAbWV0aG9kIGdldEtleVxuICovXG5SZXNvdXJjZUl0ZW1Nb2RlbC5wcm90b3R5cGUuZ2V0S2V5ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmtleTtcbn1cblxuLyoqXG4gKiBHZXQgZGVmYXVsdCB2YWx1ZS5cbiAqIEBtZXRob2QgZ2V0RGVmYXVsdFZhbHVlXG4gKi9cblJlc291cmNlSXRlbU1vZGVsLnByb3RvdHlwZS5nZXREZWZhdWx0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZGVmYXVsdFZhbHVlO1xufVxuXG4vKipcbiAqIEdldCBjdXN0b21pemVkIHZhbHVlLlxuICogQG1ldGhvZCBnZXRWYWx1ZVxuICovXG5SZXNvdXJjZUl0ZW1Nb2RlbC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudmFsdWU7XG59XG5cbi8qKlxuICogU2V0IHZhbHVlLlxuICogQG1ldGhvZCBzZXRWYWx1ZVxuICovXG5SZXNvdXJjZUl0ZW1Nb2RlbC5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLnZhbHVlID0gdmFsdWU7XG59XG5cbi8qKlxuICogR2V0IGl0ZW0gdHlwZS5cbiAqIEBtZXRob2QgZ2V0SXRlbVR5cGVcbiAqL1xuUmVzb3VyY2VJdGVtTW9kZWwucHJvdG90eXBlLmdldEl0ZW1UeXBlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLml0ZW1UeXBlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlSXRlbU1vZGVsOyIsIi8qKlxuICogQ29sb3IgdXRpbGl0aWVzLlxuICogQGNsYXNzIENvbG9yVXRpbFxuICovXG5mdW5jdGlvbiBDb2xvclV0aWwoKSB7fVxuXG4vKipcbiAqIFBhcnNlIGh0bWwgY29sb3IuXG4gKiBAbWV0aG9kIHBhcnNlSFRNTENvbG9yXG4gKi9cbkNvbG9yVXRpbC5wYXJzZUhUTUxDb2xvciA9IGZ1bmN0aW9uKGh0bWxDb2xvcikge1xuXHRpZiAoaHRtbENvbG9yID09PSB1bmRlZmluZWQpXG5cdFx0aHRtbENvbG9yID0gXCJcIjtcblxuXHR2YXIgcyA9IGh0bWxDb2xvci50b1N0cmluZygpLnRyaW0oKS5yZXBsYWNlKFwiI1wiLCBcIlwiKTtcblx0dmFyIGMgPSB7XG5cdFx0cmVkOiBwYXJzZUludChzWzBdICsgc1sxXSwgMTYpLFxuXHRcdGdyZWVuOiBwYXJzZUludChzWzJdICsgc1szXSwgMTYpLFxuXHRcdGJsdWU6IHBhcnNlSW50KHNbNF0gKyBzWzVdLCAxNiksXG5cdH1cblxuXHRpZiAoaXNOYU4oYy5yZWQpKVxuXHRcdGMucmVkID0gMDtcblxuXHRpZiAoaXNOYU4oYy5ncmVlbikpXG5cdFx0Yy5ncmVlbiA9IDA7XG5cblx0aWYgKGlzTmFOKGMuYmx1ZSkpXG5cdFx0Yy5ibHVlID0gMDtcblxuXHRyZXR1cm4gYztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xvclV0aWw7IiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIFJlc291cmNlUGFuZVZpZXcgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVBhbmVWaWV3XCIpO1xuXG4vKipcbiAqIE1haW4gYXBwbGljYXRpb24gdmlldy5cbiAqIEBjbGFzcyBBcHBWaWV3XG4gKi9cbmZ1bmN0aW9uIEFwcFZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMuc3R5bGUudG9wID0gMDtcblx0dGhpcy5zdHlsZS5sZWZ0ID0gMDtcblx0dGhpcy5zdHlsZS5yaWdodCA9IDA7XG5cdHRoaXMuc3R5bGUuYm90dG9tID0gMDtcblxuXHR0aGlzLnJlc291cmNlUGFuZVZpZXcgPSBuZXcgUmVzb3VyY2VQYW5lVmlldygpO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMucmVzb3VyY2VQYW5lVmlldyk7XG59XG5cbmluaGVyaXRzKEFwcFZpZXcsIHhub2RlLkRpdik7XG5cbi8qKlxuICogR2V0IGEgcmVmZXJlbmNlIHRvIHRoZSByZXNvdXJjZSBwYW5lLlxuICogQG1ldGhvZCBnZXRSZXNvdXJjZVBhbmVWaWV3XG4gKi9cbkFwcFZpZXcucHJvdG90eXBlLmdldFJlc291cmNlUGFuZVZpZXcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMucmVzb3VyY2VQYW5lVmlldztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBWaWV3OyIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwieWFlZFwiKTtcbnZhciBSZXNvdXJjZUl0ZW1WaWV3ID0gcmVxdWlyZShcIi4vUmVzb3VyY2VJdGVtVmlld1wiKTtcblxuLyoqXG4gKiBUaGUgdmlldyBvZiBvbmUgcmVzb3VyY2UgY2F0ZWdvcnkuXG4gKiBAY2xhc3MgUmVzb3VyY2VDYXRlZ29yeVZpZXdcbiAqL1xuZnVuY3Rpb24gUmVzb3VyY2VDYXRlZ29yeVZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMudGl0bGUgPSBuZXcgeG5vZGUuRGl2KCk7XG5cdHRoaXMudGl0bGUuY2xhc3NOYW1lID0gXCJ0aXRsZVwiO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMudGl0bGUpO1xuXHR0aGlzLnRpdGxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uVGl0bGVDbGljay5iaW5kKHRoaXMpKTtcblxuXHR2YXIgaWNvbiA9IG5ldyB4bm9kZS5EaXYoKTtcblx0aWNvbi5jbGFzc05hbWUgPSBcImRyb3Bkb3duIGljb25cIjtcblx0dGhpcy50aXRsZS5hcHBlbmRDaGlsZChpY29uKTtcblxuXHR0aGlzLnRpdGxlU3BhbiA9IG5ldyB4bm9kZS5TcGFuKCk7XG5cdHRoaXMudGl0bGUuYXBwZW5kQ2hpbGQodGhpcy50aXRsZVNwYW4pO1xuXG5cdHRoaXMuY29udGVudCA9IG5ldyB4bm9kZS5EaXYoKTtcblx0dGhpcy5jb250ZW50LmNsYXNzTmFtZSA9IFwiY29udGVudFwiO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMuY29udGVudCk7XG5cblx0dGhpcy5kZXNjcmlwdGlvblAgPSBuZXcgeG5vZGUuUCgpO1xuXHR0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5kZXNjcmlwdGlvblApO1xuXG5cdHRoaXMuaXRlbVRhYmxlID0gbmV3IHhub2RlLlRhYmxlKCk7XG5cdHRoaXMuaXRlbVRhYmxlLmNsYXNzTmFtZSA9IFwidWkgdGFibGUgdW5zdGFja2FibGUgZGVmaW5pdGlvblwiO1xuXHR0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5pdGVtVGFibGUpO1xuXG5cdHRoaXMuaXRlbVRhYmxlQm9keSA9IG5ldyB4bm9kZS5UYm9keSgpO1xuXHR0aGlzLml0ZW1UYWJsZS5hcHBlbmRDaGlsZCh0aGlzLml0ZW1UYWJsZUJvZHkpO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZUNhdGVnb3J5VmlldywgeG5vZGUuRGl2KTtcbkV2ZW50RGlzcGF0Y2hlci5pbml0KFJlc291cmNlQ2F0ZWdvcnlWaWV3KTtcblxuLyoqXG4gKiBTZXQgdGhlIGxhYmVsLlxuICogQG1ldGhvZCBzZXRMYWJlbFxuICovXG5SZXNvdXJjZUNhdGVnb3J5Vmlldy5wcm90b3R5cGUuc2V0TGFiZWwgPSBmdW5jdGlvbihsYWJlbCkge1xuXHR0aGlzLnRpdGxlU3Bhbi5pbm5lckhUTUwgPSBsYWJlbDtcbn1cblxuLyoqXG4gKiBTaG91bGQgdGhpcyBiZSBhY3RpdmUgb3Igbm90P1xuICogQG1ldGhvZCBzZXRBY3RpdmVcbiAqL1xuUmVzb3VyY2VDYXRlZ29yeVZpZXcucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKGFjdGl2ZSkge1xuXHRpZiAoYWN0aXZlKSB7XG5cdFx0dGhpcy50aXRsZS5jbGFzc05hbWUgPSBcImFjdGl2ZSB0aXRsZVwiO1xuXHRcdHRoaXMuY29udGVudC5jbGFzc05hbWUgPSBcImFjdGl2ZSBjb250ZW50XCI7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy50aXRsZS5jbGFzc05hbWUgPSBcInRpdGxlXCI7XG5cdFx0dGhpcy5jb250ZW50LmNsYXNzTmFtZSA9IFwiY29udGVudFwiO1xuXHR9XG59XG5cbi8qKlxuICogVGhlIGRlc2NyaXB0aW9uLlxuICogQG1ldGhvZCBzZXREZXNjcmlwdGlvblxuICovXG5SZXNvdXJjZUNhdGVnb3J5Vmlldy5wcm90b3R5cGUuc2V0RGVzY3JpcHRpb24gPSBmdW5jdGlvbihkZXNjcmlwdGlvbikge1xuXHR0aGlzLmRlc2NyaXB0aW9uUC5pbm5lckhUTUwgPSBkZXNjcmlwdGlvbjtcbn1cblxuLyoqXG4gKiBUaGUgdGl0bGUgd2FzIGNsaWNrZWQuIERpc3BhdGNoIGZ1cnRoZXIuXG4gKiBAbWV0aG9kIG9uVGl0bGVDbGlja1xuICovXG5SZXNvdXJjZUNhdGVnb3J5Vmlldy5wcm90b3R5cGUub25UaXRsZUNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMudHJpZ2dlcihcInRpdGxlQ2xpY2tcIik7XG59XG5cbi8qKlxuICogR2V0IGhvbGRlciBmb3IgdGhlIGl0ZW1zLlxuICogQG1ldGhvZCBnZXRJdGVtSG9sZGVyXG4gKi9cblJlc291cmNlQ2F0ZWdvcnlWaWV3LnByb3RvdHlwZS5nZXRJdGVtSG9sZGVyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLml0ZW1UYWJsZUJvZHk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VDYXRlZ29yeVZpZXc7IiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIENvbG9yVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlscy9Db2xvclV0aWxcIik7XG5cbi8qKlxuICogVGhlIHZhbHVlIHZpZXcgZm9yIGEgY29sb3IuIFRoaXMgc2hvdWxkIGhhdmUgYSBjb2xvciBwaWNrZXIhXG4gKiBDYW5kaWRhdGVzOlxuICogICAtIGh0dHA6Ly93d3cuZGlnaXRhbG1hZ2ljcHJvLmNvbS9qUGlja2VyL1xuICogQGNsYXNzIFJlc291cmNlQ29sb3JWYWx1ZVZpZXdcbiAqL1xuZnVuY3Rpb24gUmVzb3VyY2VDb2xvclZhbHVlVmlldygpIHtcblx0eG5vZGUuRGl2LmNhbGwodGhpcyk7XG5cblx0dGhpcy5kZWZhdWx0VmFsdWVWaWV3ID0gbmV3IHhub2RlLkRpdigpO1xuXHR0aGlzLmRlZmF1bHRWYWx1ZVZpZXcuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMuZGVmYXVsdFZhbHVlVmlldy5zdHlsZS5oZWlnaHQgPSBcIjI1cHhcIjtcblx0dGhpcy5kZWZhdWx0VmFsdWVWaWV3LnN0eWxlLndpZHRoID0gXCI3MHB4XCI7XG5cdHRoaXMuZGVmYXVsdFZhbHVlVmlldy5zdHlsZS50b3AgPSBcIjEycHhcIjtcblx0dGhpcy5kZWZhdWx0VmFsdWVWaWV3LnN0eWxlLmJhY2tncm91bmQgPSBcIiNmZjAwMDBcIlxuXHR0aGlzLmRlZmF1bHRWYWx1ZVZpZXcuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCI1cHhcIjtcblx0dGhpcy5kZWZhdWx0VmFsdWVWaWV3LnN0eWxlLnBhZGRpbmcgPSBcIjNweFwiO1xuXHR0aGlzLmRlZmF1bHRWYWx1ZVZpZXcuc3R5bGUudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcblx0dGhpcy5kZWZhdWx0VmFsdWVWaWV3LnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkICNlMGUwZTBcIjtcblxuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMuZGVmYXVsdFZhbHVlVmlldyk7XG5cblx0dGhpcy52YWx1ZUlucHV0ID0gbmV3IHhub2RlLklucHV0KCk7XG5cdHRoaXMudmFsdWVJbnB1dC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0dGhpcy52YWx1ZUlucHV0LnN0eWxlLmxlZnQgPSBcImNhbGMoNTAlIC0gMTBweClcIjtcblx0dGhpcy52YWx1ZUlucHV0LnN0eWxlLmhlaWdodCA9IFwiMjVweFwiO1xuXHR0aGlzLnZhbHVlSW5wdXQuc3R5bGUud2lkdGggPSBcIjcwcHhcIjtcblx0dGhpcy52YWx1ZUlucHV0LnN0eWxlLnRvcCA9IFwiMTJweFwiO1xuXHR0aGlzLnZhbHVlSW5wdXQuc3R5bGUuYmFja2dyb3VuZCA9IFwiI2ZmMDAwMFwiXG5cdHRoaXMudmFsdWVJbnB1dC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjVweFwiO1xuXHR0aGlzLnZhbHVlSW5wdXQuc3R5bGUucGFkZGluZyA9IFwiM3B4XCI7XG5cdHRoaXMudmFsdWVJbnB1dC5zdHlsZS50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuXHR0aGlzLnZhbHVlSW5wdXQuc3R5bGUuYm9yZGVyID0gXCIxcHggc29saWQgI2UwZTBlMFwiO1xuXHR0aGlzLnZhbHVlSW5wdXQuc3R5bGUub3V0bGluZSA9IDA7XG5cblx0dGhpcy52YWx1ZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdGhpcy5vblZhbHVlSW5wdXRDaGFuZ2UuYmluZCh0aGlzKSk7XG5cblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLnZhbHVlSW5wdXQpO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZUNvbG9yVmFsdWVWaWV3LCB4bm9kZS5EaXYpO1xuXG4vKipcbiAqIFNldCBjb2xvciB2YWx1ZSBmb3IgZGVmYXVsdC5cbiAqIEBtZXRob2Qgc2V0RGVmYXVsdFZhbHVlXG4gKi9cblJlc291cmNlQ29sb3JWYWx1ZVZpZXcucHJvdG90eXBlLnNldERlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKGRlZmF1bHRWYWx1ZSkge1xuXHR0aGlzLmRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRWYWx1ZTtcblx0dGhpcy5kZWZhdWx0VmFsdWVWaWV3LmlubmVySFRNTCA9IGRlZmF1bHRWYWx1ZTtcblx0dGhpcy51cGRhdGVCYWNrZ3JvdW5kQ29sb3JzKCk7XG59XG5cbi8qKlxuICogU2V0IGNvbG9yIHZhbHVlIGZvciBjdXJyZW50LlxuICogQG1ldGhvZCBzZXRWYWx1ZVxuICovXG5SZXNvdXJjZUNvbG9yVmFsdWVWaWV3LnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMudmFsdWUgPSB2YWx1ZTtcblx0dGhpcy52YWx1ZUlucHV0LnZhbHVlID0gdmFsdWU7XG5cdHRoaXMudXBkYXRlQmFja2dyb3VuZENvbG9ycygpO1xufVxuXG4vKipcbiAqIFZhbHVlIGlucHV0IGNoYW5nZS5cbiAqIEBtZXRob2Qgb25WYWx1ZUlucHV0Q2hhbmdlXG4gKi9cblJlc291cmNlQ29sb3JWYWx1ZVZpZXcucHJvdG90eXBlLm9uVmFsdWVJbnB1dENoYW5nZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlSW5wdXQudmFsdWU7XG5cdHRoaXMudXBkYXRlQmFja2dyb3VuZENvbG9ycygpO1xufVxuXG4vKipcbiAqIFVwZGF0ZSBiYWNrZ3JvdW5kIGNvbG9ycy5cbiAqIEBtZXRob2QgdXBkYXRlQmFja2dyb3VuZENvbG9yc1xuICogQHByaXZhdGVcbiAqL1xuUmVzb3VyY2VDb2xvclZhbHVlVmlldy5wcm90b3R5cGUudXBkYXRlQmFja2dyb3VuZENvbG9ycyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmRlZmF1bHRWYWx1ZVZpZXcuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMuZGVmYXVsdFZhbHVlO1xuXHR0aGlzLnZhbHVlSW5wdXQuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMudmFsdWU7XG5cblx0dmFyIGMgPSBDb2xvclV0aWwucGFyc2VIVE1MQ29sb3IodGhpcy5kZWZhdWx0VmFsdWUpO1xuXHR2YXIgYXZnID0gKGMucmVkICsgYy5ncmVlbiArIGMuYmx1ZSkgLyAzO1xuXG5cdGlmIChhdmcgPiAxMjgpXG5cdFx0dGhpcy5kZWZhdWx0VmFsdWVWaWV3LnN0eWxlLmNvbG9yID0gXCIjMDAwMDAwXCI7XG5cblx0ZWxzZVxuXHRcdHRoaXMuZGVmYXVsdFZhbHVlVmlldy5zdHlsZS5jb2xvciA9IFwiI2ZmZmZmZlwiO1xuXG5cdHZhciBjID0gQ29sb3JVdGlsLnBhcnNlSFRNTENvbG9yKHRoaXMudmFsdWUpO1xuXHR2YXIgYXZnID0gKGMucmVkICsgYy5ncmVlbiArIGMuYmx1ZSkgLyAzO1xuXG5cdGlmIChhdmcgPiAxMjgpXG5cdFx0dGhpcy52YWx1ZUlucHV0LnN0eWxlLmNvbG9yID0gXCIjMDAwMDAwXCI7XG5cblx0ZWxzZVxuXHRcdHRoaXMudmFsdWVJbnB1dC5zdHlsZS5jb2xvciA9IFwiI2ZmZmZmZlwiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlQ29sb3JWYWx1ZVZpZXc7IiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xuXG4vKipcbiAqIFZpZXcgYW5kIGVkaXQgdGhlIHZhbHVlIG9mIGFuIGltYWdlLlxuICogQG1ldGhvZCBSZXNvdXJjZUltYWdlVmFsdWVWaWV3XG4gKi9cbmZ1bmN0aW9uIFJlc291cmNlSW1hZ2VWYWx1ZVZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuZGVmYXVsdEltYWdlID0gbmV3IHhub2RlLkltZygpO1xuXHR0aGlzLmRlZmF1bHRJbWFnZS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0dGhpcy5kZWZhdWx0SW1hZ2Uuc3R5bGUudG9wID0gXCIxMHB4XCI7XG5cdHRoaXMuZGVmYXVsdEltYWdlLnN0eWxlLmhlaWdodCA9IFwiMzBweFwiO1xuXHR0aGlzLmRlZmF1bHRJbWFnZS5zdHlsZS53aWR0aCA9IFwiYXV0b1wiO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMuZGVmYXVsdEltYWdlKTtcblxuXHR0aGlzLnZhbHVlSW1hZ2UgPSBuZXcgeG5vZGUuSW1nKCk7XG5cdHRoaXMudmFsdWVJbWFnZS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0dGhpcy52YWx1ZUltYWdlLnN0eWxlLnRvcCA9IFwiMTBweFwiO1xuXHR0aGlzLnZhbHVlSW1hZ2Uuc3R5bGUuaGVpZ2h0ID0gXCIzMHB4XCI7XG5cdHRoaXMudmFsdWVJbWFnZS5zdHlsZS53aWR0aCA9IFwiYXV0b1wiO1xuXHR0aGlzLnZhbHVlSW1hZ2Uuc3R5bGUubGVmdCA9IFwiY2FsYyg1MCUgLSAxMHB4KVwiO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMudmFsdWVJbWFnZSk7XG5cblx0dGhpcy51cGxvYWRJbnB1dCA9IG5ldyB4bm9kZS5JbnB1dCgpO1xuXHR0aGlzLnVwbG9hZElucHV0LnR5cGUgPSBcImZpbGVcIjtcblx0dGhpcy51cGxvYWRJbnB1dC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0dGhpcy51cGxvYWRJbnB1dC5zdHlsZS56SW5kZXggPSAyO1xuXHR0aGlzLnVwbG9hZElucHV0LnN0eWxlLm9wYWNpdHkgPSAwO1xuXHR0aGlzLnVwbG9hZElucHV0LnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG5cdHRoaXMudXBsb2FkSW5wdXQuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG5cblx0dGhpcy51cGxvYWRCdXR0b24gPSBuZXcgeG5vZGUuRGl2KCk7XG5cdHRoaXMudXBsb2FkQnV0dG9uLmNsYXNzTmFtZSA9IFwidWkgaWNvbiBidXR0b24gbWluaVwiO1xuXG5cdHRoaXMudXBsb2FkSWNvbj1uZXcgeG5vZGUuSSgpO1xuXHR0aGlzLnVwbG9hZEljb24uY2xhc3NOYW1lPVwidXBsb2FkIGljb25cIjtcblx0dGhpcy51cGxvYWRCdXR0b24uYXBwZW5kQ2hpbGQodGhpcy51cGxvYWRJY29uKTtcblxuXHR0aGlzLnVwbG9hZERpdiA9IG5ldyB4bm9kZS5EaXYoKTtcblx0dGhpcy51cGxvYWREaXYuYXBwZW5kQ2hpbGQodGhpcy51cGxvYWRJbnB1dCk7XG5cdHRoaXMudXBsb2FkRGl2LmFwcGVuZENoaWxkKHRoaXMudXBsb2FkQnV0dG9uKTtcblx0dGhpcy51cGxvYWREaXYuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMudXBsb2FkRGl2LnN0eWxlLnRvcCA9IFwiMTNweFwiO1xuXHR0aGlzLnVwbG9hZERpdi5zdHlsZS5yaWdodCA9IFwiMTBweFwiO1xuXHR0aGlzLnVwbG9hZERpdi5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwiO1xuXG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy51cGxvYWREaXYpO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZUltYWdlVmFsdWVWaWV3LCB4bm9kZS5EaXYpO1xuXG4vKipcbiAqIFNldCB1cmwgb2YgdGhlIGltYWdlIHRvIGJlIHNob3duIGFzIGRlZmF1bHRcbiAqIEBtZXRob2Qgc2V0RGVmYXVsdFZhbHVlXG4gKi9cblJlc291cmNlSW1hZ2VWYWx1ZVZpZXcucHJvdG90eXBlLnNldERlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKGRlZmF1bHRWYWx1ZSkge1xuXHR0aGlzLmRlZmF1bHRJbWFnZS5zcmMgPSBkZWZhdWx0VmFsdWU7XG59XG5cbi8qKlxuICogU2V0IHVybCBvZiBpbWFnZSB0byBhcHBlYXIgYXMgdmFsdWUuXG4gKiBAbWV0aG9kIHNldFZhbHVlXG4gKi9cblJlc291cmNlSW1hZ2VWYWx1ZVZpZXcucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy52YWx1ZUltYWdlLnNyYyA9IHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlSW1hZ2VWYWx1ZVZpZXc7IiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIFJlc291cmNlUG9zaXRpb25WYWx1ZVZpZXcgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVBvc2l0aW9uVmFsdWVWaWV3XCIpO1xudmFyIFJlc291cmNlSW1hZ2VWYWx1ZVZpZXcgPSByZXF1aXJlKFwiLi9SZXNvdXJjZUltYWdlVmFsdWVWaWV3XCIpO1xudmFyIFJlc291cmNlQ29sb3JWYWx1ZVZpZXcgPSByZXF1aXJlKFwiLi9SZXNvdXJjZUNvbG9yVmFsdWVWaWV3XCIpO1xuXG4vKipcbiAqIFNob3cgYSB0YWJsZSByb3cgZm9yIGVhY2ggcmVzb3VyY2UgaXRlbS5cbiAqIEBjbGFzcyBSZXNvdXJjZUl0ZW1WaWV3XG4gKi9cbmZ1bmN0aW9uIFJlc291cmNlSXRlbVZpZXcoKSB7XG5cdHhub2RlLlRyLmNhbGwodGhpcyk7XG5cblx0dGhpcy5zdHlsZS5oZWlnaHQgPSBcIjUwcHhcIjtcblxuXHR0aGlzLmtleVRkID0gbmV3IHhub2RlLlRkKCk7XG5cdHRoaXMua2V5VGQuc3R5bGUud2lkdGggPSBcIjUwJVwiO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMua2V5VGQpO1xuXG5cdHRoaXMudmFsdWVUZCA9IG5ldyB4bm9kZS5UZCgpO1xuXHR0aGlzLnZhbHVlVGQuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG5cdHRoaXMudmFsdWVUZC5zdHlsZS53aWR0aCA9IFwiNTAlXCI7XG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy52YWx1ZVRkKTtcblxuXHR0aGlzLnZhbHVlVmlldyA9IG51bGw7XG5cdHRoaXMuaXRlbVR5cGUgPSBudWxsO1xuXHR0aGlzLnZhbHVlID0gbnVsbDtcblx0dGhpcy5kZWZhdWx0VmFsdWUgPSBudWxsO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZUl0ZW1WaWV3LCB4bm9kZS5Ucik7XG5cbi8qKlxuICogU2V0IGtleS4gV2lsbCBhcHBlYXIgaW4gdGhlIGxlZnQgY29sdW1uLlxuICovXG5SZXNvdXJjZUl0ZW1WaWV3LnByb3RvdHlwZS5zZXRLZXkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLmtleVRkLmlubmVySFRNTCA9IHZhbHVlO1xufVxuXG4vKipcbiAqIFNldCBhYnN0cmFjdCB2YWx1ZSB0byBhcHBlYXIgYXMgZGVmYXVsdCB2YWx1ZS5cbiAqIEBtZXRob2Qgc2V0RGVmYXVsdFZhbHVlXG4gKi9cblJlc291cmNlSXRlbVZpZXcucHJvdG90eXBlLnNldERlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKGRlZmF1bHRWYWx1ZSkge1xuXHR0aGlzLmRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRWYWx1ZTtcblxuXHRpZiAodGhpcy52YWx1ZVZpZXcpXG5cdFx0dGhpcy52YWx1ZVZpZXcuc2V0RGVmYXVsdFZhbHVlKHRoaXMuZGVmYXVsdFZhbHVlKTtcbn1cblxuLyoqXG4gKiBTZXQgYWJzdHJhY3QgdmFsdWUgdG8gYXBwZWFyIGluIHRoZSB2YWx1ZSBjb2x1bW4uXG4gKiBAbWV0aG9kIHNldFZhbHVlXG4gKi9cblJlc291cmNlSXRlbVZpZXcucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy52YWx1ZSA9IHZhbHVlO1xuXG5cdGlmICh0aGlzLnZhbHVlVmlldylcblx0XHR0aGlzLnZhbHVlVmlldy5zZXRWYWx1ZSh0aGlzLnZhbHVlKTtcbn1cblxuLyoqXG4gKiBTZXQgdGhlIHR5cGUgb2YgdGhlIGl0ZW0uIFRoaXMgd2lsbCBjcmVhdGUgYSB2YWx1ZVxuICogdmlldyBhbmQgcG9wdWxhdGUgdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIHRhYmxlLlxuICogQG1ldGhvZCBzZXRJdGVtVHlwZVxuICovXG5SZXNvdXJjZUl0ZW1WaWV3LnByb3RvdHlwZS5zZXRJdGVtVHlwZSA9IGZ1bmN0aW9uKGl0ZW1UeXBlKSB7XG5cdGlmIChpdGVtVHlwZSA9PSB0aGlzLml0ZW1UeXBlKVxuXHRcdHJldHVybjtcblxuXHRpZiAodGhpcy52YWx1ZVZpZXcpXG5cdFx0dGhpcy52YWx1ZVRkLnJlbW92ZUNoaWxkKHRoaXMudmFsdWVWaWV3KTtcblxuXHR0aGlzLnZhbHVlVmlldyA9IG51bGw7XG5cdHRoaXMuaXRlbVR5cGUgPSBpdGVtVHlwZTtcblxuXHRzd2l0Y2ggKHRoaXMuaXRlbVR5cGUpIHtcblx0XHRjYXNlIFwicG9zaXRpb25cIjpcblx0XHRcdHRoaXMudmFsdWVWaWV3ID0gbmV3IFJlc291cmNlUG9zaXRpb25WYWx1ZVZpZXcoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcImltYWdlXCI6XG5cdFx0XHR0aGlzLnZhbHVlVmlldyA9IG5ldyBSZXNvdXJjZUltYWdlVmFsdWVWaWV3KCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgXCJjb2xvclwiOlxuXHRcdFx0dGhpcy52YWx1ZVZpZXcgPSBuZXcgUmVzb3VyY2VDb2xvclZhbHVlVmlldygpO1xuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHRpZiAodGhpcy52YWx1ZVZpZXcpIHtcblx0XHR0aGlzLnZhbHVlVGQuYXBwZW5kQ2hpbGQodGhpcy52YWx1ZVZpZXcpO1xuXHRcdHRoaXMudmFsdWVWaWV3LnNldERlZmF1bHRWYWx1ZSh0aGlzLmRlZmF1bHRWYWx1ZSk7XG5cdFx0dGhpcy52YWx1ZVZpZXcuc2V0VmFsdWUodGhpcy52YWx1ZSk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZUl0ZW1WaWV3OyIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciB4bm9kZWMgPSByZXF1aXJlKFwieG5vZGVjb2xsZWN0aW9uXCIpO1xudmFyIFJlc291cmNlVGFiSGVhZGVyVmlldyA9IHJlcXVpcmUoXCIuL1Jlc291cmNlVGFiSGVhZGVyVmlld1wiKTtcbnZhciBSZXNvdXJjZVRhYlZpZXcgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVRhYlZpZXdcIik7XG5cbi8qKlxuICogVGhlIGxlZnQgcGFydCBvZiB0aGUgYXBwLCBzaG93aW5nIHRoZSByZXNvdXJjZXMuXG4gKiBAY2xhc3MgUmVzb3VyY2VQYW5lVmlld1xuICovXG5mdW5jdGlvbiBSZXNvdXJjZVBhbmVWaWV3KCkge1xuXHR4bm9kZS5EaXYuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHR0aGlzLnN0eWxlLnRvcCA9IFwiMTBweFwiO1xuXHR0aGlzLnN0eWxlLmxlZnQgPSBcIjEwcHhcIjtcblx0dGhpcy5zdHlsZS53aWR0aCA9IFwiNTAlXCI7XG5cdHRoaXMuc3R5bGUuYm90dG9tID0gXCIxMHB4XCI7XG5cblx0dGhpcy50YWJIZWFkZXJzID0gbmV3IHhub2RlLkRpdigpO1xuXHR0aGlzLnRhYkhlYWRlcnMuY2xhc3NOYW1lID0gXCJ1aSB0b3AgYXR0YWNoZWQgdGFidWxhciBtZW51XCI7XG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy50YWJIZWFkZXJzKTtcbn1cblxuaW5oZXJpdHMoUmVzb3VyY2VQYW5lVmlldywgeG5vZGUuRGl2KTtcblxuLyoqXG4gKiBHZXQgaG9sZGVyIGZvciB0aGUgdGFiIGhlYWRlcnMuXG4gKiBAbWV0aG9kIGdldFRhYkhlYWRlckhvbGRlclxuICovXG5SZXNvdXJjZVBhbmVWaWV3LnByb3RvdHlwZS5nZXRUYWJIZWFkZXJIb2xkZXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudGFiSGVhZGVycztcbn1cblxuLyoqXG4gKiBHZXQgdGFiIGhvbGRlci5cbiAqIEBtZXRob2QgZ2V0VGFiSG9sZGVyXG4gKi9cblJlc291cmNlUGFuZVZpZXcucHJvdG90eXBlLmdldFRhYkhvbGRlciA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZVBhbmVWaWV3OyIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcblxuLyoqXG4gKiBUaGUgdmFsdWUgdmlldyBmb3IgYSBwb3NpdGlvbi5cbiAqIEBjbGFzcyBSZXNvdXJjZVBvc2l0aW9uVmFsdWVWaWV3XG4gKi9cbmZ1bmN0aW9uIFJlc291cmNlUG9zaXRpb25WYWx1ZVZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuZGVmYXVsdFZhbHVlVmlldyA9IG5ldyB4bm9kZS5EaXYoKTtcblx0dGhpcy5kZWZhdWx0VmFsdWVWaWV3LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHR0aGlzLmRlZmF1bHRWYWx1ZVZpZXcuc3R5bGUud2lkdGggPSBcIjUwJVwiO1xuXHR0aGlzLmRlZmF1bHRWYWx1ZVZpZXcuc3R5bGUudG9wID0gXCIxNXB4XCI7XG5cblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLmRlZmF1bHRWYWx1ZVZpZXcpO1xuXG5cdHRoaXMudmFsdWVEaXYgPSBuZXcgeG5vZGUuRGl2KCk7XG5cdHRoaXMudmFsdWVEaXYuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMudmFsdWVEaXYuc3R5bGUucmlnaHQgPSBcIjEwcHhcIjtcblx0dGhpcy52YWx1ZURpdi5zdHlsZS50b3AgPSBcIjEwcHhcIjtcblx0dGhpcy52YWx1ZURpdi5zdHlsZS53aWR0aCA9IFwiNTAlXCI7XG5cblx0dGhpcy52YWx1ZURpdi5jbGFzc05hbWUgPSBcInVpIGlucHV0IGZsdWlkIG1pbmlcIjtcblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLnZhbHVlRGl2KTtcblxuXHR0aGlzLnZhbHVlSW5wdXQgPSBuZXcgeG5vZGUuSW5wdXQoKTtcblx0dGhpcy52YWx1ZUlucHV0LnR5cGUgPSBcInRleHRcIjtcblx0dGhpcy52YWx1ZURpdi5hcHBlbmRDaGlsZCh0aGlzLnZhbHVlSW5wdXQpO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZVBvc2l0aW9uVmFsdWVWaWV3LCB4bm9kZS5EaXYpO1xuXG4vKipcbiAqIFNldCBwb3NpdGlvbiB2YWx1ZSBmb3IgZGVmYXVsdC5cbiAqIEBtZXRob2Qgc2V0RGVmYXVsdFZhbHVlXG4gKi9cblJlc291cmNlUG9zaXRpb25WYWx1ZVZpZXcucHJvdG90eXBlLnNldERlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKGRlZmF1bHRWYWx1ZSkge1xuXHR0aGlzLmRlZmF1bHRWYWx1ZVZpZXcuaW5uZXJIVE1MID0gZGVmYXVsdFZhbHVlO1xufVxuXG4vKipcbiAqIFNldCBwb3NpdGlvbiB2YWx1ZSBmb3IgY3VycmVudC5cbiAqIEBtZXRob2Qgc2V0VmFsdWVcbiAqL1xuUmVzb3VyY2VQb3NpdGlvblZhbHVlVmlldy5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLnZhbHVlSW5wdXQudmFsdWUgPSB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZVBvc2l0aW9uVmFsdWVWaWV3OyIsInZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcblxuLyoqXG4gKiBUaGUgdGFiIGhlYWRlci5cbiAqIEBjbGFzcyBSZXNvdXJjZVRhYkhlYWRlclZpZXdcbiAqL1xuZnVuY3Rpb24gUmVzb3VyY2VUYWJIZWFkZXJWaWV3KCkge1xuXHR4bm9kZS5BLmNhbGwodGhpcyk7XG5cdHRoaXMuY2xhc3NOYW1lID0gXCJpdGVtXCI7XG59XG5cbmluaGVyaXRzKFJlc291cmNlVGFiSGVhZGVyVmlldywgeG5vZGUuQSk7XG5cbi8qKlxuICogU2V0IGxhYmVsLlxuICogQGNsYXNzIHNldExhYmVsXG4gKi9cblJlc291cmNlVGFiSGVhZGVyVmlldy5wcm90b3R5cGUuc2V0TGFiZWwgPSBmdW5jdGlvbihsYWJlbCkge1xuXHR0aGlzLmlubmVySFRNTCA9IGxhYmVsO1xufVxuXG4vKipcbiAqIFNldCBhY3RpdmUgc3RhdGUuXG4gKiBAY2xhc3Mgc2V0QWN0aXZlXG4gKi9cblJlc291cmNlVGFiSGVhZGVyVmlldy5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24oYWN0aXZlKSB7XG5cdGlmIChhY3RpdmUpXG5cdFx0dGhpcy5jbGFzc05hbWUgPSBcImFjdGl2ZSBpdGVtXCI7XG5cblx0ZWxzZVxuXHRcdHRoaXMuY2xhc3NOYW1lID0gXCJpdGVtXCI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VUYWJIZWFkZXJWaWV3OyIsInZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciB4bm9kZWMgPSByZXF1aXJlKFwieG5vZGVjb2xsZWN0aW9uXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIFJlc291cmNlQ2F0ZWdvcnlWaWV3ID0gcmVxdWlyZShcIi4vUmVzb3VyY2VDYXRlZ29yeVZpZXdcIik7XG5cbi8qKlxuICogVGhlIHZpZXcgZm9yIHRoZSBjb250ZW50IHRoYXQgZ29lcyBpbnRvIG9uZSB0YWIuXG4gKiBAY2xhc3MgUmVzb3VyY2VUYWJWaWV3XG4gKi9cbmZ1bmN0aW9uIFJlc291cmNlVGFiVmlldygpIHtcblx0eG5vZGUuRGl2LmNhbGwodGhpcyk7XG5cdHRoaXMuY2xhc3NOYW1lID0gXCJ1aSBib3R0b20gYXR0YWNoZWQgYWN0aXZlIHRhYiBzZWdtZW50XCI7XG5cblx0dGhpcy5pbm5lciA9IG5ldyB4bm9kZS5EaXYoKTtcblx0dGhpcy5pbm5lci5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcblx0dGhpcy5pbm5lci5zdHlsZS5oZWlnaHQgPSBcImNhbGMoMTAwJSAtIDY1cHgpXCI7XG5cdHRoaXMuaW5uZXIuc3R5bGUucGFkZGluZyA9IFwiMXB4XCI7XG5cdHRoaXMuaW5uZXIuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLmlubmVyKTtcblxuXHR0aGlzLmRlc2NyaXB0aW9uUCA9IG5ldyB4bm9kZS5QKCk7XG5cdHRoaXMuaW5uZXIuYXBwZW5kQ2hpbGQodGhpcy5kZXNjcmlwdGlvblApO1xuXG5cdHRoaXMuYWNjb3JkaW9uID0gbmV3IHhub2RlLkRpdigpO1xuXHR0aGlzLmFjY29yZGlvbi5jbGFzc05hbWUgPSBcInVpIHN0eWxlZCBmbHVpZCBhY2NvcmRpb25cIjtcblx0dGhpcy5pbm5lci5hcHBlbmRDaGlsZCh0aGlzLmFjY29yZGlvbik7XG59XG5cbmluaGVyaXRzKFJlc291cmNlVGFiVmlldywgeG5vZGUuRGl2KTtcblxuLyoqXG4gKiBTaG91bGQgdGhpcyBiZSB0aGUgYWN0aXZlIHRhYj9cbiAqIEBtZXRob2Qgc2V0QWN0aXZlXG4gKi9cblJlc291cmNlVGFiVmlldy5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24oYWN0aXZlKSB7XG5cdGlmIChhY3RpdmUpIHtcblx0XHR0aGlzLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cdFx0dGhpcy5jbGFzc05hbWUgPSBcInVpIGJvdHRvbSBhdHRhY2hlZCBhY3RpdmUgdGFiIHNlZ21lbnQgYWN0aXZlXCI7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0dGhpcy5jbGFzc05hbWUgPSBcInVpIGJvdHRvbSBhdHRhY2hlZCBhY3RpdmUgdGFiIHNlZ21lbnRcIjtcblx0fVxufVxuXG4vKipcbiAqIFNldCBkZXNjcmlwdGlvbi5cbiAqIEBtZXRob2Qgc2V0RGVzY3JpcHRpb25cbiAqL1xuUmVzb3VyY2VUYWJWaWV3LnByb3RvdHlwZS5zZXREZXNjcmlwdGlvbiA9IGZ1bmN0aW9uKGRlc2NyaXB0aW9uKSB7XG5cdHRoaXMuZGVzY3JpcHRpb25QLmlubmVySFRNTCA9IGRlc2NyaXB0aW9uO1xufVxuXG4vKipcbiAqIEdldCBkaXYgaG9sZGluZyB0aGUgY2F0ZWdvcmllcy5cbiAqIEBtZXRob2QgZ2V0Q2F0ZWdvcnlIb2xkZXJcbiAqL1xuUmVzb3VyY2VUYWJWaWV3LnByb3RvdHlwZS5nZXRDYXRlZ29yeUhvbGRlciA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5hY2NvcmRpb247XG59XG5cbi8qKlxuICogU2V0IGNhdGVnb3J5IGNvbGxlY3Rpb24uXG4gKiBAbWV0aG9kIHNldENhdGVnb3J5Q29sbGVjdGlvblxuICovXG4vKlJlc291cmNlVGFiVmlldy5wcm90b3R5cGUuc2V0Q2F0ZWdvcnlDb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuXHR0aGlzLmFjY29yZGlvbi5zZXREYXRhU291cmNlKGNvbGxlY3Rpb24pO1xufSovXG5cbi8qKlxuICogR2V0IGNhdGVnb3J5IG1hbmFnZXIuXG4gKiBAbWV0aG9kIGdldENhdGVnb3J5TWFuYWdlclxuICovXG4vKlJlc291cmNlVGFiVmlldy5wcm90b3R5cGUuZ2V0Q2F0ZWdvcnlNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmFjY29yZGlvbjtcbn0qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlVGFiVmlldzsiXX0=
