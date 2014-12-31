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
},{"../controller/AppController":9,"../model/AppModel":15,"../view/AppView":18,"inherits":1,"xnode":2}],9:[function(require,module,exports){
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
},{"../view/ResourceTabHeaderView":24,"../view/ResourceTabView":25,"./ResourceTabController":12,"./ResourceTabHeaderController":13,"xnodecollection":6}],10:[function(require,module,exports){
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
},{"../view/ResourceItemView":21,"./ResourceItemController":11,"xnodecollection":6}],11:[function(require,module,exports){
function ResourceItemController(itemView) {
	this.itemView = itemView;
}

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
},{"../view/ResourceCategoryView":19,"./ResourceCategoryController":10,"xnodecollection":6}],13:[function(require,module,exports){
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
},{"./ResourcePaneView":22,"inherits":1,"xnode":2}],19:[function(require,module,exports){
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
},{"./ResourceItemView":21,"inherits":1,"xnode":2,"yaed":7}],20:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");

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

ResourceImageValueView.prototype.setDefaultValue = function(defaultValue) {
	this.defaultImage.src = defaultValue;
}

ResourceImageValueView.prototype.setValue = function(value) {
	this.valueImage.src = value;
}

module.exports = ResourceImageValueView;
},{"inherits":1,"xnode":2}],21:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");
var ResourcePositionValueView = require("./ResourcePositionValueView");
var ResourceImageValueView = require("./ResourceImageValueView");

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
			this.valueView = new ResourcePositionValueView();
			break;

		case "image":
			this.valueView = new ResourceImageValueView();
			break;
	}

	if (this.valueView) {
		this.valueTd.appendChild(this.valueView);
		this.valueView.setDefaultValue(this.defaultValue);
		this.valueView.setValue(this.value);
	}
}

module.exports = ResourceItemView;
},{"./ResourceImageValueView":20,"./ResourcePositionValueView":23,"inherits":1,"xnode":2}],22:[function(require,module,exports){
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
},{"./ResourceTabHeaderView":24,"./ResourceTabView":25,"inherits":1,"xnode":2,"xnodecollection":6}],23:[function(require,module,exports){
var inherits = require("inherits");
var xnode = require("xnode");

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

ResourcePositionValueView.prototype.setDefaultValue = function(defaultValue) {
	this.defaultValueView.innerHTML = defaultValue;
}

ResourcePositionValueView.prototype.setValue = function(value) {
	this.valueInput.value = value;
}

module.exports = ResourcePositionValueView;
},{"inherits":1,"xnode":2}],24:[function(require,module,exports){
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
},{"inherits":1,"xnode":2}],25:[function(require,module,exports){
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
},{"./ResourceCategoryView":19,"inherits":1,"xnode":2,"xnodecollection":6}]},{},[14])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy94bm9kZS9zcmMveG5vZGUuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3hub2RlY29sbGVjdGlvbi9zcmMvQ29sbGVjdGlvblZpZXcuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9Db2xsZWN0aW9uVmlld01hbmFnZXIuanMiLCJub2RlX21vZHVsZXMveG5vZGVjb2xsZWN0aW9uL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy95YWVkL3NyYy9FdmVudERpc3BhdGNoZXIuanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9jb250cm9sbGVyL0FwcENvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9SZXNvdXJjZUNhdGVnb3J5Q29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL1Jlc291cmNlSXRlbUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9SZXNvdXJjZVRhYkNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9SZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXIuanMiLCJzcmMvZmlkZGxldWkuanMiLCJzcmMvbW9kZWwvQXBwTW9kZWwuanMiLCJzcmMvbW9kZWwvQ2F0ZWdvcnlNb2RlbC5qcyIsInNyYy9tb2RlbC9SZXNvdXJjZUl0ZW1Nb2RlbC5qcyIsInNyYy92aWV3L0FwcFZpZXcuanMiLCJzcmMvdmlldy9SZXNvdXJjZUNhdGVnb3J5Vmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlSW1hZ2VWYWx1ZVZpZXcuanMiLCJzcmMvdmlldy9SZXNvdXJjZUl0ZW1WaWV3LmpzIiwic3JjL3ZpZXcvUmVzb3VyY2VQYW5lVmlldy5qcyIsInNyYy92aWV3L1Jlc291cmNlUG9zaXRpb25WYWx1ZVZpZXcuanMiLCJzcmMvdmlldy9SZXNvdXJjZVRhYkhlYWRlclZpZXcuanMiLCJzcmMvdmlldy9SZXNvdXJjZVRhYlZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIoZnVuY3Rpb24oKSB7XG5cdC8qKlxuXHQgKiBUaGUgYmFzaWMgeG5vZGUgY2xhc3MuXG5cdCAqIEl0IHNldHMgdGhlIHVuZGVybHlpbmcgbm9kZSBlbGVtZW50IGJ5IGNhbGxpbmdcblx0ICogZG9jdW1lbnQuY3JlYXRlRWxlbWVudFxuXHQgKi9cblx0ZnVuY3Rpb24gWE5vZGUodHlwZSwgY29udGVudCkge1xuXHRcdHRoaXMubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cblx0XHRpZiAoY29udGVudCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0dGhpcy5ub2RlLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBtZXRob2QgY3JlYXRlcyBhbiBleHRlbmRlZCBjbGFzcyB1c2luZ1xuXHQgKiB0aGUgWE5vZGUgY2xhc3MgZGVmaW5lZCBhYm92ZS5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KGVsZW1lbnRUeXBlLCBjb250ZW50KSB7XG5cdFx0dmFyIGYgPSBmdW5jdGlvbihjb250ZW50KSB7XG5cdFx0XHRYTm9kZS5jYWxsKHRoaXMsIGVsZW1lbnRUeXBlLCBjb250ZW50KTtcblx0XHR9O1xuXG5cdFx0Zi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFhOb2RlLnByb3RvdHlwZSk7XG5cdFx0Zi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBmO1xuXG5cdFx0cmV0dXJuIGY7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcmVhZCBvbmx5IHByb3BlcnR5IHRoYXQgcmV0dXJucyB0aGVcblx0ICogdmFsdWUgb2YgdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgb2YgdGhlXG5cdCAqIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZVJlYWRPbmx5UHJvcGVydHkocHJvcGVydHlOYW1lKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFhOb2RlLnByb3RvdHlwZSwgcHJvcGVydHlOYW1lLCB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5ub2RlW3Byb3BlcnR5TmFtZV07XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcmVhZCB3cml0ZSBwcm9wZXJ0eSB0aGF0IG9wZXJhdGVzIG9uXG5cdCAqIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5IG9mIHRoZSB1bmRlcmx5aW5nXG5cdCAqIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoWE5vZGUucHJvdG90eXBlLCBwcm9wZXJ0eU5hbWUsIHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm5vZGVbcHJvcGVydHlOYW1lXTtcblx0XHRcdH0sXG5cblx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0dGhpcy5ub2RlW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBtZXRob2QgdGhhdCByb3V0ZXMgdGhlIGNhbGwgdGhyb3VnaCwgZG93blxuXHQgKiB0byB0aGUgc2FtZSBtZXRob2Qgb24gdGhlIHVuZGVybHlpbmcgbm9kZSBvYmplY3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVYTm9kZU1ldGhvZChtZXRob2ROYW1lKSB7XG5cdFx0WE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5ub2RlW21ldGhvZE5hbWVdLmFwcGx5KHRoaXMubm9kZSwgYXJndW1lbnRzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogTW9kaWZ5IHRoZSBOb2RlLnByb3BlcnR5IGZ1bmN0aW9uLCBzbyB0aGF0IGl0IGFjY2VwdHNcblx0ICogWE5vZGUgb2JqZWN0cy4gQWxsIFhOb2RlIG9iamVjdHMgd2lsbCBiZSBjaGFuZ2VkIHRvXG5cdCAqIHRoZSB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0cywgYW5kIHRoZSBjb3JyZXNwb25kaW5nXG5cdCAqIG1ldGhvZCB3aWxsIGJlIGNhbGxlZC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZU5vZGVUb1hOb2RlTWV0aG9kV3JhcHBlcihtZXRob2ROYW1lKSB7XG5cdFx0dmFyIG9yaWdpbmFsRnVuY3Rpb24gPSBOb2RlLnByb3RvdHlwZVttZXRob2ROYW1lXTtcblxuXHRcdE5vZGUucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRmb3IgKHZhciBhIGluIGFyZ3VtZW50cykge1xuXHRcdFx0XHRpZiAoYXJndW1lbnRzW2FdIGluc3RhbmNlb2YgWE5vZGUpXG5cdFx0XHRcdFx0YXJndW1lbnRzW2FdID0gYXJndW1lbnRzW2FdLm5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB1cCByZWFkIG9ubHkgcHJvcGVydGllcy5cblx0ICovXG5cdGNyZWF0ZVhOb2RlUmVhZE9ubHlQcm9wZXJ0eShcInN0eWxlXCIpO1xuXG5cdC8qKlxuXHQgKiBTZXQgdXAgcmVhZC93cml0ZSBwcm9wZXJ0aWVzLlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImlubmVySFRNTFwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImhyZWZcIik7XG5cdGNyZWF0ZVhOb2RlUmVhZFdyaXRlUHJvcGVydHkoXCJpZFwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcInZhbHVlXCIpO1xuXHRjcmVhdGVYTm9kZVJlYWRXcml0ZVByb3BlcnR5KFwidHlwZVwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcImNsYXNzTmFtZVwiKTtcblx0Y3JlYXRlWE5vZGVSZWFkV3JpdGVQcm9wZXJ0eShcInNyY1wiKTtcblxuXHQvKipcblx0ICogU2V0IHVwIG1ldGhvZHMgdG8gYmUgcm91dGVkIHRvIHRoZSB1bmRlcmx5aW5nIG5vZGUgb2JqZWN0LlxuXHQgKi9cblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJhcHBlbmRDaGlsZFwiKTtcblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJyZW1vdmVDaGlsZFwiKTtcblx0Y3JlYXRlWE5vZGVNZXRob2QoXCJhZGRFdmVudExpc3RlbmVyXCIpO1xuXHRjcmVhdGVYTm9kZU1ldGhvZChcInJlbW92ZUV2ZW50TGlzdGVuZXJcIik7XG5cblx0LyoqXG5cdCAqIFNldCB1cCBtZXRob2RzIG9uIE5vZGUucHJvcGVydHkuXG5cdCAqL1xuXHRjcmVhdGVOb2RlVG9YTm9kZU1ldGhvZFdyYXBwZXIoXCJhcHBlbmRDaGlsZFwiKTtcblx0Y3JlYXRlTm9kZVRvWE5vZGVNZXRob2RXcmFwcGVyKFwicmVtb3ZlQ2hpbGRcIik7XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBldmVudCBsaXN0ZW5lciBhbGlhc2VzLlxuXHQgKi9cblx0WE5vZGUucHJvdG90eXBlLm9uID0gWE5vZGUucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cdFhOb2RlLnByb3RvdHlwZS5vZmYgPSBYTm9kZS5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblxuXHQvKipcblx0ICogV29yayBib3RoIGFzIGEgbnBtIG1vZHVsZSBhbmQgc3RhbmRhbG9uZS5cblx0ICovXG5cdHZhciB0YXJnZXQ7XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IHRhcmdldDtcblx0fSBlbHNlIHtcblx0XHR4bm9kZSA9IHt9O1xuXHRcdHRhcmdldCA9IHhub2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBleHRlbmRlZCBjbGFzc2VzLlxuXHQgKi9cblx0dGFyZ2V0LkRpdiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwiZGl2XCIpO1xuXHR0YXJnZXQuQnV0dG9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdHRhcmdldC5VbCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwidWxcIik7XG5cdHRhcmdldC5MaSA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwibGlcIik7XG5cdHRhcmdldC5BID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJhXCIpO1xuXHR0YXJnZXQuT3B0aW9uID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJvcHRpb25cIik7XG5cdHRhcmdldC5TZWxlY3QgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcInNlbGVjdFwiKTtcblx0dGFyZ2V0LklucHV0ID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJpbnB1dFwiKTtcblx0dGFyZ2V0Lk5hdiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwibmF2XCIpO1xuXHR0YXJnZXQuU3BhbiA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwic3BhblwiKTtcblx0dGFyZ2V0LlAgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcInBcIik7XG5cdHRhcmdldC5UYWJsZSA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwidGFibGVcIik7XG5cdHRhcmdldC5UaGVhZCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwidGhlYWRcIik7XG5cdHRhcmdldC5UYm9keSA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwidGJvZHlcIik7XG5cdHRhcmdldC5UciA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwidHJcIik7XG5cdHRhcmdldC5UZCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwidGRcIik7XG5cdHRhcmdldC5UaCA9IGNyZWF0ZUV4dGVuZGVkWE5vZGVFbGVtZW50KFwidGhcIik7XG5cdHRhcmdldC5JbWcgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImltZ1wiKTtcblx0dGFyZ2V0LkkgPSBjcmVhdGVFeHRlbmRlZFhOb2RlRWxlbWVudChcImlcIik7XG5cdHRhcmdldC5CID0gY3JlYXRlRXh0ZW5kZWRYTm9kZUVsZW1lbnQoXCJiXCIpO1xufSkoKTsiLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZShcInlhZWRcIik7XG5cbi8qKlxuICogQ29sbGVjdGlvbi5cbiAqIEBjbGFzcyBDb2xsZWN0aW9uXG4gKi9cbmZ1bmN0aW9uIENvbGxlY3Rpb24oKSB7XG5cdHRoaXMuaXRlbXMgPSBbXTtcbn1cblxuaW5oZXJpdHMoQ29sbGVjdGlvbiwgRXZlbnREaXNwYXRjaGVyKTtcblxuLyoqXG4gKiBBZGQgaXRlbSBhdCBlbmQuXG4gKiBAbWV0aG9kIGFkZEl0ZW1cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuYWRkSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0dGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuXG5cdHRoaXMudHJpZ2dlckNoYW5nZShcImFkZFwiLCBpdGVtLCB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpO1xufVxuXG4vKipcbiAqIEFkZCBpdGVtIGF0IGluZGV4LlxuICogQG1ldGhvZCBhZGRJdGVtXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmFkZEl0ZW1BdCA9IGZ1bmN0aW9uKGluZGV4LCBpdGVtKSB7XG5cdGlmIChpbmRleCA8IDApXG5cdFx0aW5kZXggPSAwO1xuXG5cdGlmIChpbmRleCA+IHRoaXMuaXRlbXMubGVuZ3RoKVxuXHRcdGluZGV4ID0gdGhpcy5pdGVtcy5sZW5ndGg7XG5cblx0dmFyIGFmdGVyID0gdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgpO1xuXHR0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG5cdHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmNvbmNhdChhZnRlcik7XG5cblx0dGhpcy50cmlnZ2VyQ2hhbmdlKFwiYWRkXCIsIGl0ZW0sIGluZGV4KTtcbn1cblxuLyoqXG4gKiBHZXQgbGVuZ3RoLlxuICogQG1ldGhvZCBnZXRMZW5ndGhcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcbn1cblxuLyoqXG4gKiBHZXQgaXRlbSBhdCBpbmRleC5cbiAqIEBtZXRob2QgZ2V0SXRlbUF0XG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmdldEl0ZW1BdCA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cdHJldHVybiB0aGlzLml0ZW1zW2luZGV4XTtcbn1cblxuLyoqXG4gKiBGaW5kIGl0ZW0gaW5kZXguXG4gKiBAbWV0aG9kIGdldEl0ZW1JbmRleFxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5nZXRJdGVtSW5kZXggPSBmdW5jdGlvbihpdGVtKSB7XG5cdHJldHVybiB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGl0ZW0gYXQuXG4gKiBAbWV0aG9kIHJlbW92ZUl0ZW1BdFxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5yZW1vdmVJdGVtQXQgPSBmdW5jdGlvbihpbmRleCkge1xuXHRpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuaXRlbXMubGVuZ3RoKVxuXHRcdHJldHVybjtcblxuXHR2YXIgaXRlbSA9IHRoaXMuZ2V0SXRlbUF0KGluZGV4KTtcblxuXHR0aGlzLml0ZW1zLnNwbGljZShpbmRleCwgMSk7XG5cdHRoaXMudHJpZ2dlckNoYW5nZShcInJlbW92ZVwiLCBpdGVtLCBpbmRleCk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGl0ZW0uXG4gKiBAbWV0aG9kIHJlbW92ZUl0ZW1cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUucmVtb3ZlSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0dmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgoaXRlbSk7XG5cblx0dGhpcy5yZW1vdmVJdGVtQXQoaW5kZXgpO1xufVxuXG4vKipcbiAqIFRyaWdnZXIgY2hhbmdlIGV2ZW50LlxuICogQG1ldGhvZCB0cmlnZ2VyQ2hhbmdlXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS50cmlnZ2VyQ2hhbmdlID0gZnVuY3Rpb24oZXZlbnRLaW5kLCBpdGVtLCBpbmRleCkge1xuXHR0aGlzLnRyaWdnZXIoe1xuXHRcdHR5cGU6IGV2ZW50S2luZCxcblx0XHRpdGVtOiBpdGVtLFxuXHRcdGluZGV4OiBpbmRleFxuXHR9KTtcblxuXHR0aGlzLnRyaWdnZXIoe1xuXHRcdHR5cGU6IFwiY2hhbmdlXCIsXG5cdFx0a2luZDogZXZlbnRLaW5kLFxuXHRcdGl0ZW06IGl0ZW0sXG5cdFx0aW5kZXg6IGluZGV4XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb247IiwidmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCJ5YWVkXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIENvbGxlY3Rpb25WaWV3TWFuYWdlcj1yZXF1aXJlKFwiLi9Db2xsZWN0aW9uVmlld01hbmFnZXJcIik7XG5cbi8qKlxuICogQ29sbGVjdGlvblZpZXcuXG4gKiBAY2xhc3MgQ29sbGVjdGlvblZpZXdcbiAqL1xuZnVuY3Rpb24gQ29sbGVjdGlvblZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMubWFuYWdlcj1uZXcgQ29sbGVjdGlvblZpZXdNYW5hZ2VyKHRoaXMpO1xufVxuXG5pbmhlcml0cyhDb2xsZWN0aW9uVmlldywgeG5vZGUuRGl2KTtcblxuLyoqXG4gKiBTZXQgaXRlbSByZW5kZXJlciBjbGFzcy5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyQ2xhc3NcbiAqL1xuQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLnNldEl0ZW1SZW5kZXJlckNsYXNzID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldEl0ZW1SZW5kZXJlckNsYXNzKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSByZW5kZXJlciBmYWN0b3J5LlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJGYWN0b3J5XG4gKi9cbkNvbGxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXRJdGVtUmVuZGVyZXJGYWN0b3J5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldEl0ZW1SZW5kZXJlckZhY3RvcnkodmFsdWUpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIGNvbnRyb2xsZXIgY2xhc3MuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckNsYXNzXG4gKi9cbkNvbGxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXRJdGVtQ29udHJvbGxlckNsYXNzID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldEl0ZW1Db250cm9sbGVyQ2xhc3ModmFsdWUpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIGNvbnRyb2xsZXIgZmFjdG9yeS5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyRmFjdG9yeVxuICovXG5Db2xsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0SXRlbUNvbnRyb2xsZXJGYWN0b3J5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldEl0ZW1Db250cm9sbGVyRmFjdG9yeSh2YWx1ZSk7XG59XG5cbi8qKlxuICogU2V0IGRhdGEgc291cmNlLlxuICogQG1ldGhvZCBzZXREYXRhU291cmNlXG4gKi9cbkNvbGxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXREYXRhU291cmNlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5tYW5hZ2VyLnNldERhdGFTb3VyY2UodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb25WaWV3OyIsInZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwieWFlZFwiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcblxuLyoqXG4gKiBDb2xsZWN0aW9uVmlld01hbmFnZXIuXG4gKiBAY2xhc3MgQ29sbGVjdGlvblZpZXdNYW5hZ2VyXG4gKi9cbmZ1bmN0aW9uIENvbGxlY3Rpb25WaWV3TWFuYWdlcih0YXJnZXQpIHtcblx0dGhpcy5pdGVtUmVuZGVyZXJzID0gW107XG5cdHRoaXMuaXRlbVJlbmRlcmVyQ2xhc3MgPSBudWxsO1xuXHR0aGlzLml0ZW1SZW5kZXJlckZhY3RvcnkgPSBudWxsO1xuXHR0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MgPSBudWxsO1xuXHR0aGlzLml0ZW1Db250cm9sbGVyRmFjdG9yeSA9IG51bGw7XG5cdHRoaXMuZGF0YVNvdXJjZSA9IG51bGw7XG5cdHRoaXMudGFyZ2V0ID0gbnVsbDtcblxuXHR0aGlzLnNldFRhcmdldCh0YXJnZXQpO1xufVxuXG4vKipcbiAqIFNldCB0YXJnZXQuXG4gKiBAbWV0aG9kIHNldFRhcmdldFxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldFRhcmdldCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMucmVtb3ZlQWxsSXRlbVJlbmRlcmVycygpO1xuXHR0aGlzLnRhcmdldD12YWx1ZTtcblx0dGhpcy5yZW1vdmVBbGxJdGVtUmVuZGVyZXJzKCk7XG59XG5cbi8qKlxuICogU2V0IGl0ZW0gcmVuZGVyZXIgY2xhc3MuXG4gKiBAbWV0aG9kIHNldEl0ZW1SZW5kZXJlckNsYXNzXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0SXRlbVJlbmRlcmVyQ2xhc3MgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgaXRlbSByZW5kZXJlciBjbGFzcyBzaG91bGQgYmUgYSBmdW5jdGlvblwiKTtcblxuXHR0aGlzLml0ZW1SZW5kZXJlckNsYXNzID0gdmFsdWU7XG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSByZW5kZXJlciBmYWN0b3J5LlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJGYWN0b3J5XG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuc2V0SXRlbVJlbmRlcmVyRmFjdG9yeSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBpdGVtIHJlbmRlcmVyIGZhY3Rvcnkgc2hvdWxkIGJlIGEgZnVuY3Rpb25cIik7XG5cblx0dGhpcy5pdGVtUmVuZGVyZXJGYWN0b3J5ID0gdmFsdWU7XG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTZXQgaXRlbSBjb250cm9sbGVyIGNsYXNzLlxuICogQG1ldGhvZCBzZXRJdGVtUmVuZGVyZXJDbGFzc1xuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldEl0ZW1Db250cm9sbGVyQ2xhc3MgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgaXRlbSByZW5kZXJlciBjbGFzcyBzaG91bGQgYmUgYSBmdW5jdGlvblwiKTtcblxuXHR0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MgPSB2YWx1ZTtcblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNldCBpdGVtIGNvbnRyb2xsZXIgZmFjdG9yeS5cbiAqIEBtZXRob2Qgc2V0SXRlbVJlbmRlcmVyRmFjdG9yeVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldEl0ZW1Db250cm9sbGVyRmFjdG9yeSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBpdGVtIHJlbmRlcmVyIGZhY3Rvcnkgc2hvdWxkIGJlIGEgZnVuY3Rpb25cIik7XG5cblx0dGhpcy5pdGVtQ29udHJvbGxlckZhY3RvcnkgPSB2YWx1ZTtcblx0dGhpcy5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycygpO1xufVxuXG4vKipcbiAqIFNldCBkYXRhIHNvdXJjZS5cbiAqIEBtZXRob2Qgc2V0RGF0YVNvdXJjZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnNldERhdGFTb3VyY2UgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodGhpcy5kYXRhU291cmNlKSB7XG5cdFx0dGhpcy5kYXRhU291cmNlLm9mZihcImNoYW5nZVwiLCB0aGlzLm9uRGF0YVNvdXJjZUNoYW5nZSwgdGhpcyk7XG5cdH1cblxuXHR0aGlzLmRhdGFTb3VyY2UgPSB2YWx1ZTtcblxuXHRpZiAodGhpcy5kYXRhU291cmNlKSB7XG5cdFx0dGhpcy5kYXRhU291cmNlLm9uKFwiY2hhbmdlXCIsIHRoaXMub25EYXRhU291cmNlQ2hhbmdlLCB0aGlzKTtcblx0fVxuXG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBTb21ldGhpbmcgaW4gdGhlIGRhdGEgc291cmNlIHdhcyBjaGFuZ2VkLlxuICogQG1ldGhvZCBvbkRhdGFTb3VyY2VDaGFuZ2VcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUub25EYXRhU291cmNlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVmcmVzaEFsbEl0ZW1SZW5kZXJlcnMoKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYWxsIGl0ZW0gcmVuZGVyZXJzLlxuICogQG1ldGhvZCByZW1vdmVBbGxJdGVtUmVuZGVyZXJzXG4gKiBAcHJpdmF0ZVxuICovXG5Db2xsZWN0aW9uVmlld01hbmFnZXIucHJvdG90eXBlLnJlbW92ZUFsbEl0ZW1SZW5kZXJlcnMgPSBmdW5jdGlvbigpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZW1SZW5kZXJlcnMubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAodGhpcy5pdGVtUmVuZGVyZXJzW2ldLl9fY29udHJvbGxlcilcblx0XHRcdHRoaXMuaXRlbVJlbmRlcmVyc1tpXS5fX2NvbnRyb2xsZXIuc2V0RGF0YShudWxsKTtcblxuXHRcdGVsc2Vcblx0XHRcdHRoaXMuaXRlbVJlbmRlcmVyc1tpXS5zZXREYXRhKG51bGwpO1xuXG5cdFx0dGhpcy50YXJnZXQucmVtb3ZlQ2hpbGQodGhpcy5pdGVtUmVuZGVyZXJzW2ldKTtcblx0fVxuXG5cdHRoaXMuaXRlbVJlbmRlcmVycyA9IFtdO1xufVxuXG4vKipcbiAqIFJlZnJlc2ggYWxsIGl0ZW0gcmVuZGVyZXJzLlxuICogQG1ldGhvZCByZWZyZXNoQWxsSXRlbVJlbmRlcmVyc1xuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5yZWZyZXNoQWxsSXRlbVJlbmRlcmVycyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbW92ZUFsbEl0ZW1SZW5kZXJlcnMoKTtcblxuXHRpZiAoIXRoaXMuZGF0YVNvdXJjZSlcblx0XHRyZXR1cm47XG5cblx0aWYgKCF0aGlzLml0ZW1SZW5kZXJlckNsYXNzICYmICF0aGlzLml0ZW1SZW5kZXJlckZhY3RvcnkpXG5cdFx0cmV0dXJuO1xuXG5cdGlmICghdGhpcy50YXJnZXQpXG5cdFx0cmV0dXJuO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kYXRhU291cmNlLmdldExlbmd0aCgpOyBpKyspIHtcblx0XHR2YXIgZGF0YSA9IHRoaXMuZGF0YVNvdXJjZS5nZXRJdGVtQXQoaSk7XG5cdFx0dmFyIHJlbmRlcmVyID0gdGhpcy5jcmVhdGVJdGVtUmVuZGVyZXIoKTtcblxuXHRcdGlmICh0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MgfHwgdGhpcy5pdGVtQ29udHJvbGxlckZhY3RvcnkpIHtcblx0XHRcdHJlbmRlcmVyLl9fY29udHJvbGxlciA9IHRoaXMuY3JlYXRlSXRlbUNvbnRyb2xsZXIocmVuZGVyZXIpO1xuXHRcdFx0cmVuZGVyZXIuX19jb250cm9sbGVyLnNldERhdGEoZGF0YSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbmRlcmVyLnNldERhdGEoZGF0YSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5pdGVtUmVuZGVyZXJzLnB1c2gocmVuZGVyZXIpO1xuXHRcdHRoaXMudGFyZ2V0LmFwcGVuZENoaWxkKHJlbmRlcmVyKTtcblx0fVxufVxuXG4vKipcbiAqIENyZWF0ZSBpdGVtIHJlbmRlcmVyLlxuICogQG1ldGhvZCBjcmVhdGVJdGVtUmVuZGVyZXJcbiAqIEBwcml2YXRlXG4gKi9cbkNvbGxlY3Rpb25WaWV3TWFuYWdlci5wcm90b3R5cGUuY3JlYXRlSXRlbVJlbmRlcmVyID0gZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLml0ZW1SZW5kZXJlckZhY3RvcnkpXG5cdFx0cmV0dXJuIHRoaXMuaXRlbVJlbmRlcmVyRmFjdG9yeSgpO1xuXG5cdGlmICh0aGlzLml0ZW1SZW5kZXJlckNsYXNzKVxuXHRcdHJldHVybiBuZXcgdGhpcy5pdGVtUmVuZGVyZXJDbGFzcygpO1xuXG5cdHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNyZWF0ZSBpdGVtIHJlbmRlcmVyIVwiKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgaXRlbSBjb250cm9sbGVyLlxuICogQG1ldGhvZCBjcmVhdGVJdGVtQ29udHJvbGxlclxuICogQHByaXZhdGVcbiAqL1xuQ29sbGVjdGlvblZpZXdNYW5hZ2VyLnByb3RvdHlwZS5jcmVhdGVJdGVtQ29udHJvbGxlciA9IGZ1bmN0aW9uKHJlbmRlcmVyKSB7XG5cdGlmICh0aGlzLml0ZW1Db250cm9sbGVyRmFjdG9yeSlcblx0XHRyZXR1cm4gdGhpcy5pdGVtQ29udHJvbGxlckZhY3RvcnkocmVuZGVyZXIpO1xuXG5cdGlmICh0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MpXG5cdFx0cmV0dXJuIG5ldyB0aGlzLml0ZW1Db250cm9sbGVyQ2xhc3MocmVuZGVyZXIpO1xuXG5cdHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNyZWF0ZSBpdGVtIGNvbnRyb2xsZXIhXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb25WaWV3TWFuYWdlcjsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0Q29sbGVjdGlvbjogcmVxdWlyZShcIi4vQ29sbGVjdGlvblwiKSxcblx0Q29sbGVjdGlvblZpZXc6IHJlcXVpcmUoXCIuL0NvbGxlY3Rpb25WaWV3XCIpLFxuXHRDb2xsZWN0aW9uVmlld01hbmFnZXI6IHJlcXVpcmUoXCIuL0NvbGxlY3Rpb25WaWV3TWFuYWdlclwiKVxufTsiLCIvKipcbiAqIEFTMy9qcXVlcnkgc3R5bGUgZXZlbnQgZGlzcGF0Y2hlci4gU2xpZ2h0bHkgbW9kaWZpZWQuIFRoZVxuICoganF1ZXJ5IHN0eWxlIG9uL29mZi90cmlnZ2VyIHN0eWxlIG9mIGFkZGluZyBsaXN0ZW5lcnMgaXNcbiAqIGN1cnJlbnRseSB0aGUgcHJlZmVycmVkIG9uZS5cbiAqXG4gKiBUaGUgb24gbWV0aG9kIGZvciBhZGRpbmcgbGlzdGVuZXJzIHRha2VzIGFuIGV4dHJhIHBhcmFtZXRlciB3aGljaCBpcyB0aGVcbiAqIHNjb3BlIGluIHdoaWNoIGxpc3RlbmVycyBzaG91bGQgYmUgY2FsbGVkLiBTbyB0aGlzOlxuICpcbiAqICAgICBvYmplY3Qub24oXCJldmVudFwiLCBsaXN0ZW5lciwgdGhpcyk7XG4gKlxuICogSGFzIHRoZSBzYW1lIGZ1bmN0aW9uIHdoZW4gYWRkaW5nIGV2ZW50cyBhczpcbiAqXG4gKiAgICAgb2JqZWN0Lm9uKFwiZXZlbnRcIiwgbGlzdGVuZXIuYmluZCh0aGlzKSk7XG4gKlxuICogSG93ZXZlciwgdGhlIGRpZmZlcmVuY2UgaXMgdGhhdCBpZiB3ZSB1c2UgdGhlIHNlY29uZCBtZXRob2QgaXRcbiAqIHdpbGwgbm90IGJlIHBvc3NpYmxlIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXJzIGxhdGVyLCB1bmxlc3NcbiAqIHRoZSBjbG9zdXJlIGNyZWF0ZWQgYnkgYmluZCBpcyBzdG9yZWQgc29tZXdoZXJlLiBJZiB0aGVcbiAqIGZpcnN0IG1ldGhvZCBpcyB1c2VkLCB3ZSBjYW4gcmVtb3ZlIHRoZSBsaXN0ZW5lciB3aXRoOlxuICpcbiAqICAgICBvYmplY3Qub2ZmKFwiZXZlbnRcIiwgbGlzdGVuZXIsIHRoaXMpO1xuICpcbiAqIEBjbGFzcyBFdmVudERpc3BhdGNoZXJcbiAqL1xuZnVuY3Rpb24gRXZlbnREaXNwYXRjaGVyKCkge1xuXHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG59XG5cbi8qKlxuICogQWRkIGV2ZW50IGxpc3RlbmVyLlxuICogQG1ldGhvZCBhZGRFdmVudExpc3RlbmVyXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHNjb3BlKSB7XG5cdGlmICghdGhpcy5saXN0ZW5lck1hcClcblx0XHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG5cblx0aWYgKCFldmVudFR5cGUpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiRXZlbnQgdHlwZSByZXF1aXJlZCBmb3IgZXZlbnQgZGlzcGF0Y2hlclwiKTtcblxuXHRpZiAoIWxpc3RlbmVyKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIkxpc3RlbmVyIHJlcXVpcmVkIGZvciBldmVudCBkaXNwYXRjaGVyXCIpO1xuXG5cdHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGxpc3RlbmVyLCBzY29wZSk7XG5cblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpXG5cdFx0dGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdID0gW107XG5cblx0dGhpcy5saXN0ZW5lck1hcFtldmVudFR5cGVdLnB1c2goe1xuXHRcdGxpc3RlbmVyOiBsaXN0ZW5lcixcblx0XHRzY29wZTogc2NvcGVcblx0fSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVyLlxuICogQG1ldGhvZCByZW1vdmVFdmVudExpc3RlbmVyXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHNjb3BlKSB7XG5cdGlmICghdGhpcy5saXN0ZW5lck1hcClcblx0XHR0aGlzLmxpc3RlbmVyTWFwID0ge307XG5cblx0aWYgKCF0aGlzLmxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KGV2ZW50VHlwZSkpXG5cdFx0cmV0dXJuO1xuXG5cdHZhciBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgbGlzdGVuZXJPYmogPSBsaXN0ZW5lcnNbaV07XG5cblx0XHRpZiAobGlzdGVuZXIgPT0gbGlzdGVuZXJPYmoubGlzdGVuZXIgJiYgc2NvcGUgPT0gbGlzdGVuZXJPYmouc2NvcGUpIHtcblx0XHRcdGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRpLS07XG5cdFx0fVxuXHR9XG5cblx0aWYgKCFsaXN0ZW5lcnMubGVuZ3RoKVxuXHRcdGRlbGV0ZSB0aGlzLmxpc3RlbmVyTWFwW2V2ZW50VHlwZV07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggZXZlbnQuXG4gKiBAbWV0aG9kIGRpc3BhdGNoRXZlbnRcbiAqL1xuRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24oZXZlbnQgLyogLi4uICovICkge1xuXHRpZiAoIXRoaXMubGlzdGVuZXJNYXApXG5cdFx0dGhpcy5saXN0ZW5lck1hcCA9IHt9O1xuXG5cdHZhciBldmVudFR5cGU7XG5cdHZhciBsaXN0ZW5lclBhcmFtcztcblxuXHRpZiAodHlwZW9mIGV2ZW50ID09IFwic3RyaW5nXCIpIHtcblx0XHRldmVudFR5cGUgPSBldmVudDtcblxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSlcblx0XHRcdGxpc3RlbmVyUGFyYW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuXHRcdGVsc2UgbGlzdGVuZXJQYXJhbXMgPSBbe1xuXHRcdFx0dHlwZTogZXZlbnRUeXBlLFxuXHRcdFx0dGFyZ2V0OiB0aGlzXG5cdFx0fV07XG5cdH0gZWxzZSB7XG5cdFx0ZXZlbnRUeXBlID0gZXZlbnQudHlwZTtcblx0XHRldmVudC50YXJnZXQgPSB0aGlzO1xuXHRcdGxpc3RlbmVyUGFyYW1zID0gW2V2ZW50XTtcblx0fVxuXG5cdGlmICghdGhpcy5saXN0ZW5lck1hcC5oYXNPd25Qcm9wZXJ0eShldmVudFR5cGUpKVxuXHRcdHJldHVybjtcblxuXHRmb3IgKHZhciBpIGluIHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXSkge1xuXHRcdHZhciBsaXN0ZW5lck9iaiA9IHRoaXMubGlzdGVuZXJNYXBbZXZlbnRUeXBlXVtpXTtcblx0XHRsaXN0ZW5lck9iai5saXN0ZW5lci5hcHBseShsaXN0ZW5lck9iai5zY29wZSwgbGlzdGVuZXJQYXJhbXMpO1xuXHR9XG59XG5cbi8qKlxuICogSnF1ZXJ5IHN0eWxlIGFsaWFzIGZvciBhZGRFdmVudExpc3RlbmVyXG4gKiBAbWV0aG9kIG9uXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub24gPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5cbi8qKlxuICogSnF1ZXJ5IHN0eWxlIGFsaWFzIGZvciByZW1vdmVFdmVudExpc3RlbmVyXG4gKiBAbWV0aG9kIG9mZlxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblxuLyoqXG4gKiBKcXVlcnkgc3R5bGUgYWxpYXMgZm9yIGRpc3BhdGNoRXZlbnRcbiAqIEBtZXRob2QgdHJpZ2dlclxuICovXG5FdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnRyaWdnZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQ7XG5cbi8qKlxuICogTWFrZSBzb21ldGhpbmcgYW4gZXZlbnQgZGlzcGF0Y2hlci4gQ2FuIGJlIHVzZWQgZm9yIG11bHRpcGxlIGluaGVyaXRhbmNlLlxuICogQG1ldGhvZCBpbml0XG4gKiBAc3RhdGljXG4gKi9cbkV2ZW50RGlzcGF0Y2hlci5pbml0ID0gZnVuY3Rpb24oY2xzKSB7XG5cdGNscy5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0Y2xzLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyO1xuXHRjbHMucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQ7XG5cdGNscy5wcm90b3R5cGUub24gPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLm9uO1xuXHRjbHMucHJvdG90eXBlLm9mZiA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUub2ZmO1xuXHRjbHMucHJvdG90eXBlLnRyaWdnZXIgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnRyaWdnZXI7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IEV2ZW50RGlzcGF0Y2hlcjtcbn0iLCJ2YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgQXBwVmlldyA9IHJlcXVpcmUoXCIuLi92aWV3L0FwcFZpZXdcIik7XG52YXIgQXBwTW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWwvQXBwTW9kZWxcIik7XG52YXIgQXBwQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuLi9jb250cm9sbGVyL0FwcENvbnRyb2xsZXJcIik7XG5cbi8qKlxuICogVGhlIG1haW4gcmVzb3VyY2UgZmlkZGxlIGFwcCBjbGFzcy5cbiAqIEBjbGFzcyBBcHBcbiAqL1xuZnVuY3Rpb24gQXBwKCkge1xuXHR4bm9kZS5EaXYuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHR0aGlzLnN0eWxlLnRvcCA9IDA7XG5cdHRoaXMuc3R5bGUuYm90dG9tID0gMDtcblx0dGhpcy5zdHlsZS5sZWZ0ID0gMDtcblx0dGhpcy5zdHlsZS5yaWdodCA9IDA7XG5cblx0dGhpcy5hcHBWaWV3ID0gbmV3IEFwcFZpZXcoKTtcblx0dGhpcy5hcHBNb2RlbCA9IG5ldyBBcHBNb2RlbCgpO1xuXHR0aGlzLmFwcENvbnRyb2xsZXIgPSBuZXcgQXBwQ29udHJvbGxlcih0aGlzLmFwcE1vZGVsLCB0aGlzLmFwcFZpZXcpO1xuXG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5hcHBWaWV3KTtcbn1cblxuaW5oZXJpdHMoQXBwLCB4bm9kZS5EaXYpO1xuXG4vKipcbiAqIEdldCBtb2RlbC5cbiAqIEBtZXRob2QgZ2V0TW9kZWxcbiAqL1xuQXBwLnByb3RvdHlwZS5nZXRNb2RlbCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5hcHBNb2RlbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHA7IiwidmFyIFJlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL1Jlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlclwiKTtcbnZhciBSZXNvdXJjZVRhYkNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVRhYkNvbnRyb2xsZXJcIik7XG52YXIgUmVzb3VyY2VUYWJIZWFkZXJWaWV3ID0gcmVxdWlyZShcIi4uL3ZpZXcvUmVzb3VyY2VUYWJIZWFkZXJWaWV3XCIpO1xudmFyIFJlc291cmNlVGFiVmlldyA9IHJlcXVpcmUoXCIuLi92aWV3L1Jlc291cmNlVGFiVmlld1wiKTtcbnZhciB4bm9kZWMgPSByZXF1aXJlKFwieG5vZGVjb2xsZWN0aW9uXCIpO1xuXG4vKipcbiAqIEFwcCBjb250cm9sbGVyXG4gKiBAY2xhc3MgQXBwQ29udHJvbGxlclxuICovXG5mdW5jdGlvbiBBcHBDb250cm9sbGVyKGFwcE1vZGVsLCBhcHBWaWV3KSB7XG5cdHRoaXMuYXBwTW9kZWwgPSBhcHBNb2RlbDtcblx0dGhpcy5hcHBWaWV3ID0gYXBwVmlldztcblxuXHR0aGlzLnRhYkhlYWRlck1hbmFnZXIgPSBuZXcgeG5vZGVjLkNvbGxlY3Rpb25WaWV3TWFuYWdlcigpO1xuXHR0aGlzLnRhYkhlYWRlck1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuYXBwVmlldy5nZXRSZXNvdXJjZVBhbmVWaWV3KCkuZ2V0VGFiSGVhZGVySG9sZGVyKCkpO1xuXHR0aGlzLnRhYkhlYWRlck1hbmFnZXIuc2V0SXRlbUNvbnRyb2xsZXJDbGFzcyhSZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXIpO1xuXHR0aGlzLnRhYkhlYWRlck1hbmFnZXIuc2V0SXRlbVJlbmRlcmVyQ2xhc3MoUmVzb3VyY2VUYWJIZWFkZXJWaWV3KTtcblx0dGhpcy50YWJIZWFkZXJNYW5hZ2VyLnNldERhdGFTb3VyY2UodGhpcy5hcHBNb2RlbC5nZXRDYXRlZ29yeUNvbGxlY3Rpb24oKSk7XG5cblx0dGhpcy50YWJNYW5hZ2VyID0gbmV3IHhub2RlYy5Db2xsZWN0aW9uVmlld01hbmFnZXIoKTtcblx0dGhpcy50YWJNYW5hZ2VyLnNldFRhcmdldCh0aGlzLmFwcFZpZXcuZ2V0UmVzb3VyY2VQYW5lVmlldygpLmdldFRhYkhvbGRlcigpKTtcblx0dGhpcy50YWJNYW5hZ2VyLnNldEl0ZW1Db250cm9sbGVyQ2xhc3MoUmVzb3VyY2VUYWJDb250cm9sbGVyKTtcblx0dGhpcy50YWJNYW5hZ2VyLnNldEl0ZW1SZW5kZXJlckNsYXNzKFJlc291cmNlVGFiVmlldyk7XG5cdHRoaXMudGFiTWFuYWdlci5zZXREYXRhU291cmNlKHRoaXMuYXBwTW9kZWwuZ2V0Q2F0ZWdvcnlDb2xsZWN0aW9uKCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcENvbnRyb2xsZXI7IiwidmFyIFJlc291cmNlSXRlbUNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9SZXNvdXJjZUl0ZW1Db250cm9sbGVyXCIpO1xudmFyIFJlc291cmNlSXRlbVZpZXcgPSByZXF1aXJlKFwiLi4vdmlldy9SZXNvdXJjZUl0ZW1WaWV3XCIpO1xudmFyIHhub2RlYyA9IHJlcXVpcmUoXCJ4bm9kZWNvbGxlY3Rpb25cIik7XG5cbi8qKlxuICogQ29udHJvbCBhIHJlc291cmNlIGNhdGVnb3J5LlxuICogQG1ldGhvZCBSZXNvdXJjZVRhYkNvbnRyb2xsZXJcbiAqL1xuZnVuY3Rpb24gUmVzb3VyY2VDYXRlZ29yeUNvbnRyb2xsZXIoY2F0ZWdvcnlWaWV3KSB7XG5cdHRoaXMuY2F0ZWdvcnlWaWV3ID0gY2F0ZWdvcnlWaWV3O1xuXG5cdHRoaXMuY2F0ZWdvcnlWaWV3Lm9uKFwidGl0bGVDbGlja1wiLCB0aGlzLm9uQ2F0ZWdvcnlWaWV3VGl0bGVDbGljaywgdGhpcyk7XG5cblx0dGhpcy5pdGVtTWFuYWdlciA9IG5ldyB4bm9kZWMuQ29sbGVjdGlvblZpZXdNYW5hZ2VyKCk7XG5cdHRoaXMuaXRlbU1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuY2F0ZWdvcnlWaWV3LmdldEl0ZW1Ib2xkZXIoKSk7XG5cdHRoaXMuaXRlbU1hbmFnZXIuc2V0SXRlbVJlbmRlcmVyQ2xhc3MoUmVzb3VyY2VJdGVtVmlldyk7XG5cdHRoaXMuaXRlbU1hbmFnZXIuc2V0SXRlbUNvbnRyb2xsZXJDbGFzcyhSZXNvdXJjZUl0ZW1Db250cm9sbGVyKTtcbn1cblxuLyoqXG4gKiBTZXQgZGF0YS5cbiAqIEBtZXRob2Qgc2V0RGF0YVxuICovXG5SZXNvdXJjZUNhdGVnb3J5Q29udHJvbGxlci5wcm90b3R5cGUuc2V0RGF0YSA9IGZ1bmN0aW9uKGNhdGVnb3J5TW9kZWwpIHtcblx0aWYgKHRoaXMuY2F0ZWdvcnlNb2RlbCkge1xuXHRcdHRoaXMuaXRlbU1hbmFnZXIuc2V0RGF0YVNvdXJjZShudWxsKTtcblxuXHRcdHRoaXMuY2F0ZWdvcnlNb2RlbC5vZmYoXCJjaGFuZ2VcIiwgdGhpcy5vbkNhdGVnb3J5TW9kZWxDaGFuZ2UsIHRoaXMpO1xuXHR9XG5cblx0dGhpcy5jYXRlZ29yeU1vZGVsID0gY2F0ZWdvcnlNb2RlbDtcblxuXHRpZiAodGhpcy5jYXRlZ29yeU1vZGVsKSB7XG5cdFx0dGhpcy5pdGVtTWFuYWdlci5zZXREYXRhU291cmNlKHRoaXMuY2F0ZWdvcnlNb2RlbC5nZXRJdGVtQ29sbGVjdGlvbigpKTtcblxuXHRcdHRoaXMuY2F0ZWdvcnlNb2RlbC5vbihcImNoYW5nZVwiLCB0aGlzLm9uQ2F0ZWdvcnlNb2RlbENoYW5nZSwgdGhpcyk7XG5cdFx0dGhpcy5jYXRlZ29yeVZpZXcuc2V0QWN0aXZlKGNhdGVnb3J5TW9kZWwuaXNBY3RpdmUoKSk7XG5cdFx0dGhpcy5jYXRlZ29yeVZpZXcuc2V0TGFiZWwoY2F0ZWdvcnlNb2RlbC5nZXRMYWJlbCgpKTtcblx0XHR0aGlzLmNhdGVnb3J5Vmlldy5zZXREZXNjcmlwdGlvbih0aGlzLmNhdGVnb3J5TW9kZWwuZ2V0RGVzY3JpcHRpb24oKSk7XG5cdH1cbn1cblxuLyoqXG4gKiBIYW5kbGUgY2hhbmdlIGluIHRoZSBtb2RlbC5cbiAqIEBtZXRob2Qgb25DYXRlZ29yeU1vZGVsQ2hhbmdlXG4gKi9cblJlc291cmNlQ2F0ZWdvcnlDb250cm9sbGVyLnByb3RvdHlwZS5vbkNhdGVnb3J5TW9kZWxDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jYXRlZ29yeVZpZXcuc2V0QWN0aXZlKHRoaXMuY2F0ZWdvcnlNb2RlbC5pc0FjdGl2ZSgpKTtcblx0dGhpcy5jYXRlZ29yeVZpZXcuc2V0RGVzY3JpcHRpb24odGhpcy5jYXRlZ29yeU1vZGVsLmdldERlc2NyaXB0aW9uKCkpO1xufVxuXG4vKipcbiAqIFRpdGxlIGNsaWNrLiBUb2dnbGUgdGhlIGFjdGl2ZSBzdGF0ZS5cbiAqIEBtZXRob2Qgb25DYXRlZ29yeVZpZXdUaXRsZUNsaWNrXG4gKi9cblJlc291cmNlQ2F0ZWdvcnlDb250cm9sbGVyLnByb3RvdHlwZS5vbkNhdGVnb3J5Vmlld1RpdGxlQ2xpY2sgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jYXRlZ29yeU1vZGVsLnNldEFjdGl2ZSghdGhpcy5jYXRlZ29yeU1vZGVsLmlzQWN0aXZlKCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlQ2F0ZWdvcnlDb250cm9sbGVyOyIsImZ1bmN0aW9uIFJlc291cmNlSXRlbUNvbnRyb2xsZXIoaXRlbVZpZXcpIHtcblx0dGhpcy5pdGVtVmlldyA9IGl0ZW1WaWV3O1xufVxuXG5SZXNvdXJjZUl0ZW1Db250cm9sbGVyLnByb3RvdHlwZS5zZXREYXRhID0gZnVuY3Rpb24oaXRlbU1vZGVsKSB7XG5cdHRoaXMuaXRlbU1vZGVsID0gaXRlbU1vZGVsO1xuXG5cdGlmICh0aGlzLml0ZW1Nb2RlbCkge1xuXHRcdHRoaXMuaXRlbVZpZXcuc2V0S2V5KHRoaXMuaXRlbU1vZGVsLmdldEtleSgpKTtcblx0XHR0aGlzLml0ZW1WaWV3LnNldERlZmF1bHRWYWx1ZSh0aGlzLml0ZW1Nb2RlbC5nZXREZWZhdWx0VmFsdWUoKSk7XG5cdFx0dGhpcy5pdGVtVmlldy5zZXRWYWx1ZSh0aGlzLml0ZW1Nb2RlbC5nZXRWYWx1ZSgpKTtcblxuXHRcdHRoaXMuaXRlbVZpZXcuc2V0SXRlbVR5cGUodGhpcy5pdGVtTW9kZWwuZ2V0SXRlbVR5cGUoKSk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZUl0ZW1Db250cm9sbGVyOyIsInZhciBSZXNvdXJjZUNhdGVnb3J5Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL1Jlc291cmNlQ2F0ZWdvcnlDb250cm9sbGVyXCIpO1xudmFyIFJlc291cmNlQ2F0ZWdvcnlWaWV3ID0gcmVxdWlyZShcIi4uL3ZpZXcvUmVzb3VyY2VDYXRlZ29yeVZpZXdcIik7XG52YXIgeG5vZGVjID0gcmVxdWlyZShcInhub2RlY29sbGVjdGlvblwiKTtcblxuLyoqXG4gKiBDb250cm9sIG9uZSByZXNvdXJjZSB0YWIuXG4gKiBAbWV0aG9kIFJlc291cmNlVGFiQ29udHJvbGxlclxuICovXG5mdW5jdGlvbiBSZXNvdXJjZVRhYkNvbnRyb2xsZXIodGFiVmlldykge1xuXHR0aGlzLnRhYlZpZXcgPSB0YWJWaWV3O1xuXG5cdHRoaXMuY2F0ZWdvcnlNYW5hZ2VyID0gbmV3IHhub2RlYy5Db2xsZWN0aW9uVmlld01hbmFnZXIoKTtcblx0dGhpcy5jYXRlZ29yeU1hbmFnZXIuc2V0VGFyZ2V0KHRhYlZpZXcuZ2V0Q2F0ZWdvcnlIb2xkZXIoKSk7XG5cdHRoaXMuY2F0ZWdvcnlNYW5hZ2VyLnNldEl0ZW1SZW5kZXJlckNsYXNzKFJlc291cmNlQ2F0ZWdvcnlWaWV3KTtcblx0dGhpcy5jYXRlZ29yeU1hbmFnZXIuc2V0SXRlbUNvbnRyb2xsZXJDbGFzcyhSZXNvdXJjZUNhdGVnb3J5Q29udHJvbGxlcik7XG59XG5cbi8qKlxuICogU2V0IGRhdGEuXG4gKiBAbWV0aG9kIHNldERhdGFcbiAqL1xuUmVzb3VyY2VUYWJDb250cm9sbGVyLnByb3RvdHlwZS5zZXREYXRhID0gZnVuY3Rpb24oY2F0ZWdvcnlNb2RlbCkge1xuXHRpZiAodGhpcy5jYXRlZ29yeU1vZGVsKSB7XG5cdFx0dGhpcy5jYXRlZ29yeU1vZGVsLm9mZihcImNoYW5nZVwiLCB0aGlzLm9uQ2F0ZWdvcnlNb2RlbENoYW5nZSwgdGhpcyk7XG5cdFx0dGhpcy5jYXRlZ29yeU1hbmFnZXIuc2V0RGF0YVNvdXJjZShudWxsKTtcblx0fVxuXG5cdHRoaXMuY2F0ZWdvcnlNb2RlbCA9IGNhdGVnb3J5TW9kZWw7XG5cblx0aWYgKHRoaXMuY2F0ZWdvcnlNb2RlbCkge1xuXHRcdHRoaXMuY2F0ZWdvcnlNb2RlbC5vbihcImNoYW5nZVwiLCB0aGlzLm9uQ2F0ZWdvcnlNb2RlbENoYW5nZSwgdGhpcyk7XG5cdFx0dGhpcy50YWJWaWV3LnNldEFjdGl2ZShjYXRlZ29yeU1vZGVsLmlzQWN0aXZlKCkpO1xuXHRcdHRoaXMudGFiVmlldy5zZXREZXNjcmlwdGlvbihjYXRlZ29yeU1vZGVsLmdldERlc2NyaXB0aW9uKCkpO1xuXG5cdFx0dGhpcy5jYXRlZ29yeU1hbmFnZXIuc2V0RGF0YVNvdXJjZShjYXRlZ29yeU1vZGVsLmdldENhdGVnb3J5Q29sbGVjdGlvbigpKTtcblx0fVxufVxuXG4vKipcbiAqIEhhbmRsZSBjaGFuZ2UgaW4gdGhlIG1vZGVsLlxuICogQG1ldGhvZCBvbkNhdGVnb3J5TW9kZWxDaGFuZ2VcbiAqL1xuUmVzb3VyY2VUYWJDb250cm9sbGVyLnByb3RvdHlwZS5vbkNhdGVnb3J5TW9kZWxDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0dGhpcy50YWJWaWV3LnNldEFjdGl2ZSh0aGlzLmNhdGVnb3J5TW9kZWwuaXNBY3RpdmUoKSk7XG5cdHRoaXMudGFiVmlldy5zZXREZXNjcmlwdGlvbih0aGlzLmNhdGVnb3J5TW9kZWwuZ2V0RGVzY3JpcHRpb24oKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VUYWJDb250cm9sbGVyOyIsIi8qKlxuICogQ29udHJvbCB0aGUgaGVhZGVyIGZpZWxkIG9mIHRoZSB0YWJscyBpbiB0aGUgcmVzb3VyY2UgcGFuZS5cbiAqIEBtZXRob2QgUmVzb3VyY2VUYWJDb250cm9sbGVyXG4gKi9cbmZ1bmN0aW9uIFJlc291cmNlVGFiSGVhZGVyQ29udHJvbGxlcih0YWJIZWFkZXJWaWV3KSB7XG5cdHRoaXMudGFiSGVhZGVyVmlldyA9IHRhYkhlYWRlclZpZXc7XG5cdHRoaXMudGFiSGVhZGVyVmlldy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vblRhYkhlYWRlclZpZXdDbGljay5iaW5kKHRoaXMpKTtcbn1cblxuLyoqXG4gKiBTZXQgZGF0YS5cbiAqIEBtZXRob2Qgc2V0RGF0YVxuICovXG5SZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXIucHJvdG90eXBlLnNldERhdGEgPSBmdW5jdGlvbihjYXRlZ29yeU1vZGVsKSB7XG5cdGlmICh0aGlzLmNhdGVnb3J5TW9kZWwpIHtcblx0XHR0aGlzLmNhdGVnb3J5TW9kZWwub2ZmKFwiY2hhbmdlXCIsIHRoaXMub25DYXRlZ29yeU1vZGVsQ2hhbmdlLCB0aGlzKTtcblx0fVxuXG5cdHRoaXMuY2F0ZWdvcnlNb2RlbCA9IGNhdGVnb3J5TW9kZWw7XG5cblx0aWYgKHRoaXMuY2F0ZWdvcnlNb2RlbCkge1xuXHRcdHRoaXMuY2F0ZWdvcnlNb2RlbC5vbihcImNoYW5nZVwiLCB0aGlzLm9uQ2F0ZWdvcnlNb2RlbENoYW5nZSwgdGhpcyk7XG5cdFx0dGhpcy50YWJIZWFkZXJWaWV3LnNldExhYmVsKGNhdGVnb3J5TW9kZWwuZ2V0TGFiZWwoKSk7XG5cdFx0dGhpcy50YWJIZWFkZXJWaWV3LnNldEFjdGl2ZShjYXRlZ29yeU1vZGVsLmlzQWN0aXZlKCkpO1xuXHR9XG59XG5cbi8qKlxuICogVGhlIHRhYiB3YXMgY2xpY2tlZCwgc2V0IHRoaXMgdGFiIGFzIHRoZSBhY3RpdmUgb25lLlxuICogQG1ldGhvZCBvblRhYkhlYWRlclZpZXdDbGlja1xuICovXG5SZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXIucHJvdG90eXBlLm9uVGFiSGVhZGVyVmlld0NsaWNrID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuY2F0ZWdvcnlNb2RlbC5zZXRBY3RpdmUodHJ1ZSk7XG59XG5cbi8qKlxuICogVGhlIG1vZGVsIGNoYW5nZWQuXG4gKiBAbWV0aG9kIG9uQ2F0ZWdvcnlNb2RlbENoYW5nZVxuICovXG5SZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXIucHJvdG90eXBlLm9uQ2F0ZWdvcnlNb2RlbENoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnRhYkhlYWRlclZpZXcuc2V0QWN0aXZlKHRoaXMuY2F0ZWdvcnlNb2RlbC5pc0FjdGl2ZSgpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZVRhYkhlYWRlckNvbnRyb2xsZXI7IiwiZmlkZGxldWkgPSB7XG5cdEFwcDogcmVxdWlyZShcIi4vYXBwL0FwcFwiKSxcblx0Q2F0ZWdvcnlNb2RlbDogcmVxdWlyZShcIi4vbW9kZWwvQ2F0ZWdvcnlNb2RlbFwiKSxcblx0UmVzb3VyY2VJdGVtTW9kZWw6IHJlcXVpcmUoXCIuL21vZGVsL1Jlc291cmNlSXRlbU1vZGVsXCIpXG59OyIsInZhciB4bm9kZWMgPSByZXF1aXJlKFwieG5vZGVjb2xsZWN0aW9uXCIpO1xudmFyIENhdGVnb3J5TW9kZWwgPSByZXF1aXJlKFwiLi9DYXRlZ29yeU1vZGVsXCIpO1xuXG4vKipcbiAqIEFwcE1vZGVsXG4gKiBAY2xhc3MgQXBwTW9kZWxcbiAqL1xuZnVuY3Rpb24gQXBwTW9kZWwoKSB7XG5cdHRoaXMuY2F0ZWdvcnlDb2xsZWN0aW9uID0gbmV3IHhub2RlYy5Db2xsZWN0aW9uKCk7XG5cblx0dGhpcy5pZENvdW50ID0gMDtcbn1cblxuLyoqXG4gKiBHZXQgY2F0ZWdvcnkgY29sbGVjdGlvbi5cbiAqIEBtZXRob2QgZ2V0Q2F0ZWdvcnlDb2xsZWN0aW9uXG4gKi9cbkFwcE1vZGVsLnByb3RvdHlwZS5nZXRDYXRlZ29yeUNvbGxlY3Rpb24gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY2F0ZWdvcnlDb2xsZWN0aW9uO1xufVxuXG4vKipcbiAqIEFkZCBjYXRlZ29yeSBtb2RlbC5cbiAqIEBtZXRob2QgYWRkQ2F0ZWdvcnlNb2RlbFxuICovXG5BcHBNb2RlbC5wcm90b3R5cGUuYWRkQ2F0ZWdvcnlNb2RlbCA9IGZ1bmN0aW9uKGNhdGVnb3J5TW9kZWwpIHtcblx0Y2F0ZWdvcnlNb2RlbC5zZXRQYXJlbnRNb2RlbCh0aGlzKTtcblx0dGhpcy5jYXRlZ29yeUNvbGxlY3Rpb24uYWRkSXRlbShjYXRlZ29yeU1vZGVsKTtcblxuXHRpZiAodGhpcy5jYXRlZ29yeUNvbGxlY3Rpb24uZ2V0TGVuZ3RoKCkgPT0gMSlcblx0XHRjYXRlZ29yeU1vZGVsLnNldEFjdGl2ZSh0cnVlKTtcblxuXHRyZXR1cm4gY2F0ZWdvcnlNb2RlbDtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW5kIGFkZCBhIGNhdGVnb3J5IG1vZGVsLlxuICogQG1ldGhvZCBjcmVhdGVDYXRlZ29yeVxuICovXG5BcHBNb2RlbC5wcm90b3R5cGUuY3JlYXRlQ2F0ZWdvcnkgPSBmdW5jdGlvbih0aXRsZSkge1xuXHR2YXIgY2F0ZWdvcnlNb2RlbCA9IG5ldyBDYXRlZ29yeU1vZGVsKHRpdGxlKTtcblxuXHRyZXR1cm4gdGhpcy5hZGRDYXRlZ29yeU1vZGVsKGNhdGVnb3J5TW9kZWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcE1vZGVsOyIsInZhciBBcHBNb2RlbCA9IHJlcXVpcmUoXCIuL0FwcE1vZGVsXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoXCJ5YWVkXCIpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIHhub2RlYyA9IHJlcXVpcmUoXCJ4bm9kZWNvbGxlY3Rpb25cIik7XG5cbi8qKlxuICogR2V0IGNhdGVnb3J5IG1vZGVsLlxuICogQGNsYXNzIENhdGVnb3J5TW9kZWxcbiAqL1xuZnVuY3Rpb24gQ2F0ZWdvcnlNb2RlbChsYWJlbCkge1xuXHR0aGlzLmxhYmVsID0gbGFiZWw7XG5cdHRoaXMucGFyZW50TW9kZWwgPSBudWxsO1xuXHR0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXHR0aGlzLmNhdGVnb3J5Q29sbGVjdGlvbiA9IG5ldyB4bm9kZWMuQ29sbGVjdGlvbigpO1xuXHR0aGlzLml0ZW1Db2xsZWN0aW9uID0gbmV3IHhub2RlYy5Db2xsZWN0aW9uKCk7XG5cdHRoaXMuZGVzY3JpcHRpb24gPSBcIlwiO1xufVxuXG5pbmhlcml0cyhDYXRlZ29yeU1vZGVsLCBFdmVudERpc3BhdGNoZXIpO1xuXG4vKipcbiAqIFNldCByZWZlcmVuY2UgdG8gcGFyZW50IG1vZGVsLlxuICogQG1ldGhvZCBnZXRQYXJlbnRNb2RlbFxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5zZXRQYXJlbnRNb2RlbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMucGFyZW50TW9kZWwgPSB2YWx1ZTtcbn1cblxuLyoqXG4gKiBHZXQgbGFiZWwuXG4gKiBAbWV0aG9kIGdldExhYmVsXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLmdldExhYmVsID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmxhYmVsO1xufVxuXG4vKipcbiAqIEdldCBkZXNjcmlwdGlvbi5cbiAqIEBtZXRob2QgZ2V0TGFiZWxcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuZ2V0RGVzY3JpcHRpb24gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZGVzY3JpcHRpb247XG59XG5cbi8qKlxuICogU2V0IGRlc2NyaXB0aW9uLlxuICogQG1ldGhvZCBnZXRMYWJlbFxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5zZXREZXNjcmlwdGlvbiA9IGZ1bmN0aW9uKGRlc2NyaXB0aW9uKSB7XG5cdHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcblxuXHR0aGlzLnRyaWdnZXIoXCJjaGFuZ2VcIik7XG59XG5cbi8qKlxuICogR2V0IHJlZmVyZW5jZSB0byBhcHAgbW9kZWwuXG4gKiBAbWV0aG9kIGdldEFwcE1vZGVsXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLmdldEFwcE1vZGVsID0gZnVuY3Rpb24oKSB7XG5cdGlmICghdGhpcy5wYXJlbnRNb2RlbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ0aGVyZSBpcyBubyBwYXJlbnQhXCIpO1xuXG5cdHZhciBwID0gdGhpcy5wYXJlbnRNb2RlbDtcblxuXHR3aGlsZSAocCAmJiAhKHAgaW5zdGFuY2VvZiBBcHBNb2RlbCkpXG5cdFx0cCA9IHAucGFyZW50TW9kZWw7XG5cblx0cmV0dXJuIHA7XG59XG5cbi8qKlxuICogU2V0IGFjdGl2ZSBzdGF0ZS5cbiAqIEBtZXRob2Qgc2V0QWN0aXZlXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSA9PSB0aGlzLmFjdGl2ZSlcblx0XHRyZXR1cm47XG5cblx0dmFyIHNpYmxpbmdzID0gdGhpcy5wYXJlbnRNb2RlbC5nZXRDYXRlZ29yeUNvbGxlY3Rpb24oKTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHNpYmxpbmdzLmdldExlbmd0aCgpOyBpKyspXG5cdFx0aWYgKHNpYmxpbmdzLmdldEl0ZW1BdChpKSAhPSB0aGlzKVxuXHRcdFx0c2libGluZ3MuZ2V0SXRlbUF0KGkpLnNldEFjdGl2ZShmYWxzZSk7XG5cblx0dGhpcy5hY3RpdmUgPSB2YWx1ZTtcblx0dGhpcy50cmlnZ2VyKFwiY2hhbmdlXCIpO1xufVxuXG4vKipcbiAqIElzIHRoaXMgY2F0ZWdvcnkgdGhlIGFjdGl2ZSBvbmU/XG4gKiBAbWV0aG9kIGlzQWN0aXZlXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLmlzQWN0aXZlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmFjdGl2ZTtcbn1cblxuLyoqXG4gKiBHZXQgY2F0ZWdvcnkgY29sbGVjdGlvbiBmb3Igc3ViIGNhdGVnb3JpZXMuXG4gKiBAbWV0aG9kIGdldENhdGVnb3J5Q29sbGVjdGlvblxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5nZXRDYXRlZ29yeUNvbGxlY3Rpb24gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY2F0ZWdvcnlDb2xsZWN0aW9uO1xufVxuXG4vKipcbiAqIEdldCBpdGVtIGNvbGxlY3Rpb24uXG4gKiBAbWV0aG9kIGdldEl0ZW1Db2xsZWN0aW9uXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLmdldEl0ZW1Db2xsZWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLml0ZW1Db2xsZWN0aW9uO1xufVxuXG4vKipcbiAqIEFkZCBzdWIgY2F0ZWdvcnkgbW9kZWwuXG4gKiBAbWV0aG9kIGFkZENhdGVnb3J5TW9kZWxcbiAqL1xuQ2F0ZWdvcnlNb2RlbC5wcm90b3R5cGUuYWRkQ2F0ZWdvcnlNb2RlbCA9IGZ1bmN0aW9uKGNhdGVnb3J5TW9kZWwpIHtcblx0Y2F0ZWdvcnlNb2RlbC5zZXRQYXJlbnRNb2RlbCh0aGlzKTtcblx0dGhpcy5jYXRlZ29yeUNvbGxlY3Rpb24uYWRkSXRlbShjYXRlZ29yeU1vZGVsKTtcblxuXHRyZXR1cm4gY2F0ZWdvcnlNb2RlbDtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW5kIGFkZCBhIGNhdGVnb3J5IG1vZGVsLlxuICogQG1ldGhvZCBjcmVhdGVDYXRlZ29yeVxuICovXG5DYXRlZ29yeU1vZGVsLnByb3RvdHlwZS5jcmVhdGVDYXRlZ29yeSA9IGZ1bmN0aW9uKHRpdGxlKSB7XG5cdHZhciBjYXRlZ29yeU1vZGVsID0gbmV3IENhdGVnb3J5TW9kZWwodGl0bGUpO1xuXG5cdHJldHVybiB0aGlzLmFkZENhdGVnb3J5TW9kZWwoY2F0ZWdvcnlNb2RlbCk7XG59XG5cbi8qKlxuICogQWRkIHJlc291cmNlIGl0ZW0gbW9kZWwuXG4gKiBAbWV0aG9kIGFkZFJlc291cmNlSXRlbU1vZGVsXG4gKi9cbkNhdGVnb3J5TW9kZWwucHJvdG90eXBlLmFkZFJlc291cmNlSXRlbU1vZGVsID0gZnVuY3Rpb24ocmVzb3VyY2VJdGVtTW9kZWwpIHtcblx0dGhpcy5pdGVtQ29sbGVjdGlvbi5hZGRJdGVtKHJlc291cmNlSXRlbU1vZGVsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYXRlZ29yeU1vZGVsOyIsIi8qKlxuICogUmVzb3VyY2VJdGVtTW9kZWxcbiAqIEBjbGFzcyBSZXNvdXJjZUl0ZW1Nb2RlbFxuICovXG5mdW5jdGlvbiBSZXNvdXJjZUl0ZW1Nb2RlbChrZXksIGRlZmF1bHRWYWx1ZSwgdmFsdWUsIHR5cGUpIHtcblx0dGhpcy5rZXkgPSBrZXk7XG5cdHRoaXMuZGVmYXVsdFZhbHVlID0gZGVmYXVsdFZhbHVlO1xuXHR0aGlzLnZhbHVlID0gdmFsdWU7XG5cblx0dGhpcy5pdGVtVHlwZSA9IHR5cGU7XG5cblx0aWYgKCF0aGlzLml0ZW1UeXBlKVxuXHRcdHRoaXMuaXRlbVR5cGUgPSBcInBvc2l0aW9uXCI7XG59XG5cbi8qKlxuICogR2V0IGtleS5cbiAqIEBtZXRob2QgZ2V0S2V5XG4gKi9cblJlc291cmNlSXRlbU1vZGVsLnByb3RvdHlwZS5nZXRLZXkgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMua2V5O1xufVxuXG4vKipcbiAqIEdldCBkZWZhdWx0IHZhbHVlLlxuICogQG1ldGhvZCBnZXREZWZhdWx0VmFsdWVcbiAqL1xuUmVzb3VyY2VJdGVtTW9kZWwucHJvdG90eXBlLmdldERlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5kZWZhdWx0VmFsdWU7XG59XG5cbi8qKlxuICogR2V0IGN1c3RvbWl6ZWQgdmFsdWUuXG4gKiBAbWV0aG9kIGdldFZhbHVlXG4gKi9cblJlc291cmNlSXRlbU1vZGVsLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy52YWx1ZTtcbn1cblxuLyoqXG4gKiBTZXQgdmFsdWUuXG4gKiBAbWV0aG9kIHNldFZhbHVlXG4gKi9cblJlc291cmNlSXRlbU1vZGVsLnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMudmFsdWUgPSB2YWx1ZTtcbn1cblxuLyoqXG4gKiBHZXQgaXRlbSB0eXBlLlxuICogQG1ldGhvZCBnZXRJdGVtVHlwZVxuICovXG5SZXNvdXJjZUl0ZW1Nb2RlbC5wcm90b3R5cGUuZ2V0SXRlbVR5cGUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuaXRlbVR5cGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VJdGVtTW9kZWw7IiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIFJlc291cmNlUGFuZVZpZXcgPSByZXF1aXJlKFwiLi9SZXNvdXJjZVBhbmVWaWV3XCIpO1xuXG4vKipcbiAqIE1haW4gYXBwbGljYXRpb24gdmlldy5cbiAqIEBjbGFzcyBBcHBWaWV3XG4gKi9cbmZ1bmN0aW9uIEFwcFZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMuc3R5bGUudG9wID0gMDtcblx0dGhpcy5zdHlsZS5sZWZ0ID0gMDtcblx0dGhpcy5zdHlsZS5yaWdodCA9IDA7XG5cdHRoaXMuc3R5bGUuYm90dG9tID0gMDtcblxuXHR0aGlzLnJlc291cmNlUGFuZVZpZXcgPSBuZXcgUmVzb3VyY2VQYW5lVmlldygpO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMucmVzb3VyY2VQYW5lVmlldyk7XG59XG5cbmluaGVyaXRzKEFwcFZpZXcsIHhub2RlLkRpdik7XG5cbkFwcFZpZXcucHJvdG90eXBlLmdldFJlc291cmNlUGFuZVZpZXcgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMucmVzb3VyY2VQYW5lVmlldztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBWaWV3OyIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciB4bm9kZSA9IHJlcXVpcmUoXCJ4bm9kZVwiKTtcbnZhciBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKFwieWFlZFwiKTtcbnZhciBSZXNvdXJjZUl0ZW1WaWV3ID0gcmVxdWlyZShcIi4vUmVzb3VyY2VJdGVtVmlld1wiKTtcblxuLyoqXG4gKiBUaGUgdmlldyBvZiBvbmUgcmVzb3VyY2UgY2F0ZWdvcnkuXG4gKiBAY2xhc3MgUmVzb3VyY2VDYXRlZ29yeVZpZXdcbiAqL1xuZnVuY3Rpb24gUmVzb3VyY2VDYXRlZ29yeVZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMudGl0bGUgPSBuZXcgeG5vZGUuRGl2KCk7XG5cdHRoaXMudGl0bGUuY2xhc3NOYW1lID0gXCJ0aXRsZVwiO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMudGl0bGUpO1xuXHR0aGlzLnRpdGxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uVGl0bGVDbGljay5iaW5kKHRoaXMpKTtcblxuXHR2YXIgaWNvbiA9IG5ldyB4bm9kZS5EaXYoKTtcblx0aWNvbi5jbGFzc05hbWUgPSBcImRyb3Bkb3duIGljb25cIjtcblx0dGhpcy50aXRsZS5hcHBlbmRDaGlsZChpY29uKTtcblxuXHR0aGlzLnRpdGxlU3BhbiA9IG5ldyB4bm9kZS5TcGFuKCk7XG5cdHRoaXMudGl0bGUuYXBwZW5kQ2hpbGQodGhpcy50aXRsZVNwYW4pO1xuXG5cdHRoaXMuY29udGVudCA9IG5ldyB4bm9kZS5EaXYoKTtcblx0dGhpcy5jb250ZW50LmNsYXNzTmFtZSA9IFwiY29udGVudFwiO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMuY29udGVudCk7XG5cblx0dGhpcy5kZXNjcmlwdGlvblAgPSBuZXcgeG5vZGUuUCgpO1xuXHR0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5kZXNjcmlwdGlvblApO1xuXG5cdHRoaXMuaXRlbVRhYmxlID0gbmV3IHhub2RlLlRhYmxlKCk7XG5cdHRoaXMuaXRlbVRhYmxlLmNsYXNzTmFtZSA9IFwidWkgdGFibGUgdW5zdGFja2FibGUgZGVmaW5pdGlvblwiO1xuXHR0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5pdGVtVGFibGUpO1xuXG5cdHRoaXMuaXRlbVRhYmxlQm9keSA9IG5ldyB4bm9kZS5UYm9keSgpO1xuXHR0aGlzLml0ZW1UYWJsZS5hcHBlbmRDaGlsZCh0aGlzLml0ZW1UYWJsZUJvZHkpO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZUNhdGVnb3J5VmlldywgeG5vZGUuRGl2KTtcbkV2ZW50RGlzcGF0Y2hlci5pbml0KFJlc291cmNlQ2F0ZWdvcnlWaWV3KTtcblxuLyoqXG4gKiBTZXQgdGhlIGxhYmVsLlxuICogQG1ldGhvZCBzZXRMYWJlbFxuICovXG5SZXNvdXJjZUNhdGVnb3J5Vmlldy5wcm90b3R5cGUuc2V0TGFiZWwgPSBmdW5jdGlvbihsYWJlbCkge1xuXHR0aGlzLnRpdGxlU3Bhbi5pbm5lckhUTUwgPSBsYWJlbDtcbn1cblxuLyoqXG4gKiBTaG91bGQgdGhpcyBiZSBhY3RpdmUgb3Igbm90P1xuICogQG1ldGhvZCBzZXRBY3RpdmVcbiAqL1xuUmVzb3VyY2VDYXRlZ29yeVZpZXcucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKGFjdGl2ZSkge1xuXHRpZiAoYWN0aXZlKSB7XG5cdFx0dGhpcy50aXRsZS5jbGFzc05hbWUgPSBcImFjdGl2ZSB0aXRsZVwiO1xuXHRcdHRoaXMuY29udGVudC5jbGFzc05hbWUgPSBcImFjdGl2ZSBjb250ZW50XCI7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy50aXRsZS5jbGFzc05hbWUgPSBcInRpdGxlXCI7XG5cdFx0dGhpcy5jb250ZW50LmNsYXNzTmFtZSA9IFwiY29udGVudFwiO1xuXHR9XG59XG5cbi8qKlxuICogVGhlIGRlc2NyaXB0aW9uLlxuICogQG1ldGhvZCBzZXREZXNjcmlwdGlvblxuICovXG5SZXNvdXJjZUNhdGVnb3J5Vmlldy5wcm90b3R5cGUuc2V0RGVzY3JpcHRpb24gPSBmdW5jdGlvbihkZXNjcmlwdGlvbikge1xuXHR0aGlzLmRlc2NyaXB0aW9uUC5pbm5lckhUTUwgPSBkZXNjcmlwdGlvbjtcbn1cblxuLyoqXG4gKiBUaGUgdGl0bGUgd2FzIGNsaWNrZWQuIERpc3BhdGNoIGZ1cnRoZXIuXG4gKiBAbWV0aG9kIG9uVGl0bGVDbGlja1xuICovXG5SZXNvdXJjZUNhdGVnb3J5Vmlldy5wcm90b3R5cGUub25UaXRsZUNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMudHJpZ2dlcihcInRpdGxlQ2xpY2tcIik7XG59XG5cbi8qKlxuICogR2V0IGhvbGRlciBmb3IgdGhlIGl0ZW1zLlxuICogQG1ldGhvZCBnZXRJdGVtSG9sZGVyXG4gKi9cblJlc291cmNlQ2F0ZWdvcnlWaWV3LnByb3RvdHlwZS5nZXRJdGVtSG9sZGVyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLml0ZW1UYWJsZUJvZHk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VDYXRlZ29yeVZpZXc7IiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xuXG5mdW5jdGlvbiBSZXNvdXJjZUltYWdlVmFsdWVWaWV3KCkge1xuXHR4bm9kZS5EaXYuY2FsbCh0aGlzKTtcblxuXHR0aGlzLmRlZmF1bHRJbWFnZSA9IG5ldyB4bm9kZS5JbWcoKTtcblx0dGhpcy5kZWZhdWx0SW1hZ2Uuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMuZGVmYXVsdEltYWdlLnN0eWxlLnRvcCA9IFwiMTBweFwiO1xuXHR0aGlzLmRlZmF1bHRJbWFnZS5zdHlsZS5oZWlnaHQgPSBcIjMwcHhcIjtcblx0dGhpcy5kZWZhdWx0SW1hZ2Uuc3R5bGUud2lkdGggPSBcImF1dG9cIjtcblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLmRlZmF1bHRJbWFnZSk7XG5cblx0dGhpcy52YWx1ZUltYWdlID0gbmV3IHhub2RlLkltZygpO1xuXHR0aGlzLnZhbHVlSW1hZ2Uuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMudmFsdWVJbWFnZS5zdHlsZS50b3AgPSBcIjEwcHhcIjtcblx0dGhpcy52YWx1ZUltYWdlLnN0eWxlLmhlaWdodCA9IFwiMzBweFwiO1xuXHR0aGlzLnZhbHVlSW1hZ2Uuc3R5bGUud2lkdGggPSBcImF1dG9cIjtcblx0dGhpcy52YWx1ZUltYWdlLnN0eWxlLmxlZnQgPSBcImNhbGMoNTAlIC0gMTBweClcIjtcblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLnZhbHVlSW1hZ2UpO1xuXG5cdHRoaXMudXBsb2FkSW5wdXQgPSBuZXcgeG5vZGUuSW5wdXQoKTtcblx0dGhpcy51cGxvYWRJbnB1dC50eXBlID0gXCJmaWxlXCI7XG5cdHRoaXMudXBsb2FkSW5wdXQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMudXBsb2FkSW5wdXQuc3R5bGUuekluZGV4ID0gMjtcblx0dGhpcy51cGxvYWRJbnB1dC5zdHlsZS5vcGFjaXR5ID0gMDtcblx0dGhpcy51cGxvYWRJbnB1dC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuXHR0aGlzLnVwbG9hZElucHV0LnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xuXG5cdHRoaXMudXBsb2FkQnV0dG9uID0gbmV3IHhub2RlLkRpdigpO1xuXHR0aGlzLnVwbG9hZEJ1dHRvbi5jbGFzc05hbWUgPSBcInVpIGljb24gYnV0dG9uIG1pbmlcIjtcblxuXHR0aGlzLnVwbG9hZEljb249bmV3IHhub2RlLkkoKTtcblx0dGhpcy51cGxvYWRJY29uLmNsYXNzTmFtZT1cInVwbG9hZCBpY29uXCI7XG5cdHRoaXMudXBsb2FkQnV0dG9uLmFwcGVuZENoaWxkKHRoaXMudXBsb2FkSWNvbik7XG5cblx0dGhpcy51cGxvYWREaXYgPSBuZXcgeG5vZGUuRGl2KCk7XG5cdHRoaXMudXBsb2FkRGl2LmFwcGVuZENoaWxkKHRoaXMudXBsb2FkSW5wdXQpO1xuXHR0aGlzLnVwbG9hZERpdi5hcHBlbmRDaGlsZCh0aGlzLnVwbG9hZEJ1dHRvbik7XG5cdHRoaXMudXBsb2FkRGl2LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHR0aGlzLnVwbG9hZERpdi5zdHlsZS50b3AgPSBcIjEzcHhcIjtcblx0dGhpcy51cGxvYWREaXYuc3R5bGUucmlnaHQgPSBcIjEwcHhcIjtcblx0dGhpcy51cGxvYWREaXYuc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIjtcblxuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMudXBsb2FkRGl2KTtcbn1cblxuaW5oZXJpdHMoUmVzb3VyY2VJbWFnZVZhbHVlVmlldywgeG5vZGUuRGl2KTtcblxuUmVzb3VyY2VJbWFnZVZhbHVlVmlldy5wcm90b3R5cGUuc2V0RGVmYXVsdFZhbHVlID0gZnVuY3Rpb24oZGVmYXVsdFZhbHVlKSB7XG5cdHRoaXMuZGVmYXVsdEltYWdlLnNyYyA9IGRlZmF1bHRWYWx1ZTtcbn1cblxuUmVzb3VyY2VJbWFnZVZhbHVlVmlldy5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLnZhbHVlSW1hZ2Uuc3JjID0gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VJbWFnZVZhbHVlVmlldzsiLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG52YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgUmVzb3VyY2VQb3NpdGlvblZhbHVlVmlldyA9IHJlcXVpcmUoXCIuL1Jlc291cmNlUG9zaXRpb25WYWx1ZVZpZXdcIik7XG52YXIgUmVzb3VyY2VJbWFnZVZhbHVlVmlldyA9IHJlcXVpcmUoXCIuL1Jlc291cmNlSW1hZ2VWYWx1ZVZpZXdcIik7XG5cbmZ1bmN0aW9uIFJlc291cmNlSXRlbVZpZXcoKSB7XG5cdHhub2RlLlRyLmNhbGwodGhpcyk7XG5cblx0dGhpcy5zdHlsZS5oZWlnaHQgPSBcIjUwcHhcIjtcblxuXHR0aGlzLmtleVRkID0gbmV3IHhub2RlLlRkKCk7XG5cdHRoaXMua2V5VGQuc3R5bGUud2lkdGggPSBcIjUwJVwiO1xuXHR0aGlzLmFwcGVuZENoaWxkKHRoaXMua2V5VGQpO1xuXG5cdHRoaXMudmFsdWVUZCA9IG5ldyB4bm9kZS5UZCgpO1xuXHR0aGlzLnZhbHVlVGQuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG5cdHRoaXMudmFsdWVUZC5zdHlsZS53aWR0aCA9IFwiNTAlXCI7XG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy52YWx1ZVRkKTtcblxuXHR0aGlzLnZhbHVlVmlldyA9IG51bGw7XG5cdHRoaXMuaXRlbVR5cGUgPSBudWxsO1xuXHR0aGlzLnZhbHVlID0gbnVsbDtcblx0dGhpcy5kZWZhdWx0VmFsdWUgPSBudWxsO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZUl0ZW1WaWV3LCB4bm9kZS5Ucik7XG5cblJlc291cmNlSXRlbVZpZXcucHJvdG90eXBlLnNldEtleSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHRoaXMua2V5VGQuaW5uZXJIVE1MID0gdmFsdWU7XG59XG5cblJlc291cmNlSXRlbVZpZXcucHJvdG90eXBlLnNldERlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKGRlZmF1bHRWYWx1ZSkge1xuXHR0aGlzLmRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRWYWx1ZTtcblxuXHRpZiAodGhpcy52YWx1ZVZpZXcpXG5cdFx0dGhpcy52YWx1ZVZpZXcuc2V0RGVmYXVsdFZhbHVlKHRoaXMuZGVmYXVsdFZhbHVlKTtcbn1cblxuUmVzb3VyY2VJdGVtVmlldy5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLnZhbHVlID0gdmFsdWU7XG5cblx0aWYgKHRoaXMudmFsdWVWaWV3KVxuXHRcdHRoaXMudmFsdWVWaWV3LnNldFZhbHVlKHRoaXMudmFsdWUpO1xufVxuXG5SZXNvdXJjZUl0ZW1WaWV3LnByb3RvdHlwZS5zZXRJdGVtVHlwZSA9IGZ1bmN0aW9uKGl0ZW1UeXBlKSB7XG5cdGlmIChpdGVtVHlwZSA9PSB0aGlzLml0ZW1UeXBlKVxuXHRcdHJldHVybjtcblxuXHRpZiAodGhpcy52YWx1ZVZpZXcpXG5cdFx0dGhpcy52YWx1ZVRkLnJlbW92ZUNoaWxkKHRoaXMudmFsdWVWaWV3KTtcblxuXHR0aGlzLnZhbHVlVmlldyA9IG51bGw7XG5cdHRoaXMuaXRlbVR5cGUgPSBpdGVtVHlwZTtcblxuXHRzd2l0Y2ggKHRoaXMuaXRlbVR5cGUpIHtcblx0XHRjYXNlIFwicG9zaXRpb25cIjpcblx0XHRcdHRoaXMudmFsdWVWaWV3ID0gbmV3IFJlc291cmNlUG9zaXRpb25WYWx1ZVZpZXcoKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcImltYWdlXCI6XG5cdFx0XHR0aGlzLnZhbHVlVmlldyA9IG5ldyBSZXNvdXJjZUltYWdlVmFsdWVWaWV3KCk7XG5cdFx0XHRicmVhaztcblx0fVxuXG5cdGlmICh0aGlzLnZhbHVlVmlldykge1xuXHRcdHRoaXMudmFsdWVUZC5hcHBlbmRDaGlsZCh0aGlzLnZhbHVlVmlldyk7XG5cdFx0dGhpcy52YWx1ZVZpZXcuc2V0RGVmYXVsdFZhbHVlKHRoaXMuZGVmYXVsdFZhbHVlKTtcblx0XHR0aGlzLnZhbHVlVmlldy5zZXRWYWx1ZSh0aGlzLnZhbHVlKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlSXRlbVZpZXc7IiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xudmFyIHhub2RlYyA9IHJlcXVpcmUoXCJ4bm9kZWNvbGxlY3Rpb25cIik7XG52YXIgUmVzb3VyY2VUYWJIZWFkZXJWaWV3ID0gcmVxdWlyZShcIi4vUmVzb3VyY2VUYWJIZWFkZXJWaWV3XCIpO1xudmFyIFJlc291cmNlVGFiVmlldyA9IHJlcXVpcmUoXCIuL1Jlc291cmNlVGFiVmlld1wiKTtcblxuLyoqXG4gKiBUaGUgbGVmdCBwYXJ0IG9mIHRoZSBhcHAsIHNob3dpbmcgdGhlIHJlc291cmNlcy5cbiAqIEBjbGFzcyBSZXNvdXJjZVBhbmVWaWV3XG4gKi9cbmZ1bmN0aW9uIFJlc291cmNlUGFuZVZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHRoaXMuc3R5bGUudG9wID0gXCIxMHB4XCI7XG5cdHRoaXMuc3R5bGUubGVmdCA9IFwiMTBweFwiO1xuXHR0aGlzLnN0eWxlLndpZHRoID0gXCI1MCVcIjtcblx0dGhpcy5zdHlsZS5ib3R0b20gPSBcIjEwcHhcIjtcblxuXHR0aGlzLnRhYkhlYWRlcnMgPSBuZXcgeG5vZGUuRGl2KCk7XG5cdHRoaXMudGFiSGVhZGVycy5jbGFzc05hbWUgPSBcInVpIHRvcCBhdHRhY2hlZCB0YWJ1bGFyIG1lbnVcIjtcblx0dGhpcy5hcHBlbmRDaGlsZCh0aGlzLnRhYkhlYWRlcnMpO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZVBhbmVWaWV3LCB4bm9kZS5EaXYpO1xuXG4vKipcbiAqIEdldCBob2xkZXIgZm9yIHRoZSB0YWIgaGVhZGVycy5cbiAqIEBtZXRob2QgZ2V0VGFiSGVhZGVySG9sZGVyXG4gKi9cblJlc291cmNlUGFuZVZpZXcucHJvdG90eXBlLmdldFRhYkhlYWRlckhvbGRlciA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy50YWJIZWFkZXJzO1xufVxuXG4vKipcbiAqIEdldCB0YWIgaG9sZGVyLlxuICogQG1ldGhvZCBnZXRUYWJIb2xkZXJcbiAqL1xuUmVzb3VyY2VQYW5lVmlldy5wcm90b3R5cGUuZ2V0VGFiSG9sZGVyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlUGFuZVZpZXc7IiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpO1xudmFyIHhub2RlID0gcmVxdWlyZShcInhub2RlXCIpO1xuXG5mdW5jdGlvbiBSZXNvdXJjZVBvc2l0aW9uVmFsdWVWaWV3KCkge1xuXHR4bm9kZS5EaXYuY2FsbCh0aGlzKTtcblxuXHR0aGlzLmRlZmF1bHRWYWx1ZVZpZXcgPSBuZXcgeG5vZGUuRGl2KCk7XG5cdHRoaXMuZGVmYXVsdFZhbHVlVmlldy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0dGhpcy5kZWZhdWx0VmFsdWVWaWV3LnN0eWxlLndpZHRoID0gXCI1MCVcIjtcblx0dGhpcy5kZWZhdWx0VmFsdWVWaWV3LnN0eWxlLnRvcCA9IFwiMTVweFwiO1xuXG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5kZWZhdWx0VmFsdWVWaWV3KTtcblxuXHR0aGlzLnZhbHVlRGl2ID0gbmV3IHhub2RlLkRpdigpO1xuXHR0aGlzLnZhbHVlRGl2LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHR0aGlzLnZhbHVlRGl2LnN0eWxlLnJpZ2h0ID0gXCIxMHB4XCI7XG5cdHRoaXMudmFsdWVEaXYuc3R5bGUudG9wID0gXCIxMHB4XCI7XG5cdHRoaXMudmFsdWVEaXYuc3R5bGUud2lkdGggPSBcIjUwJVwiO1xuXG5cdHRoaXMudmFsdWVEaXYuY2xhc3NOYW1lID0gXCJ1aSBpbnB1dCBmbHVpZCBtaW5pXCI7XG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy52YWx1ZURpdik7XG5cblx0dGhpcy52YWx1ZUlucHV0ID0gbmV3IHhub2RlLklucHV0KCk7XG5cdHRoaXMudmFsdWVJbnB1dC50eXBlID0gXCJ0ZXh0XCI7XG5cdHRoaXMudmFsdWVEaXYuYXBwZW5kQ2hpbGQodGhpcy52YWx1ZUlucHV0KTtcbn1cblxuaW5oZXJpdHMoUmVzb3VyY2VQb3NpdGlvblZhbHVlVmlldywgeG5vZGUuRGl2KTtcblxuUmVzb3VyY2VQb3NpdGlvblZhbHVlVmlldy5wcm90b3R5cGUuc2V0RGVmYXVsdFZhbHVlID0gZnVuY3Rpb24oZGVmYXVsdFZhbHVlKSB7XG5cdHRoaXMuZGVmYXVsdFZhbHVlVmlldy5pbm5lckhUTUwgPSBkZWZhdWx0VmFsdWU7XG59XG5cblJlc291cmNlUG9zaXRpb25WYWx1ZVZpZXcucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy52YWx1ZUlucHV0LnZhbHVlID0gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzb3VyY2VQb3NpdGlvblZhbHVlVmlldzsiLCJ2YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKFwiaW5oZXJpdHNcIik7XG5cbi8qKlxuICogVGhlIHRhYiBoZWFkZXIuXG4gKiBAY2xhc3MgUmVzb3VyY2VUYWJIZWFkZXJWaWV3XG4gKi9cbmZ1bmN0aW9uIFJlc291cmNlVGFiSGVhZGVyVmlldygpIHtcblx0eG5vZGUuQS5jYWxsKHRoaXMpO1xuXHR0aGlzLmNsYXNzTmFtZSA9IFwiaXRlbVwiO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZVRhYkhlYWRlclZpZXcsIHhub2RlLkEpO1xuXG4vKipcbiAqIFNldCBsYWJlbC5cbiAqIEBjbGFzcyBzZXRMYWJlbFxuICovXG5SZXNvdXJjZVRhYkhlYWRlclZpZXcucHJvdG90eXBlLnNldExhYmVsID0gZnVuY3Rpb24obGFiZWwpIHtcblx0dGhpcy5pbm5lckhUTUwgPSBsYWJlbDtcbn1cblxuLyoqXG4gKiBTZXQgYWN0aXZlIHN0YXRlLlxuICogQGNsYXNzIHNldEFjdGl2ZVxuICovXG5SZXNvdXJjZVRhYkhlYWRlclZpZXcucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKGFjdGl2ZSkge1xuXHRpZiAoYWN0aXZlKVxuXHRcdHRoaXMuY2xhc3NOYW1lID0gXCJhY3RpdmUgaXRlbVwiO1xuXG5cdGVsc2Vcblx0XHR0aGlzLmNsYXNzTmFtZSA9IFwiaXRlbVwiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc291cmNlVGFiSGVhZGVyVmlldzsiLCJ2YXIgeG5vZGUgPSByZXF1aXJlKFwieG5vZGVcIik7XG52YXIgeG5vZGVjID0gcmVxdWlyZShcInhub2RlY29sbGVjdGlvblwiKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoXCJpbmhlcml0c1wiKTtcbnZhciBSZXNvdXJjZUNhdGVnb3J5VmlldyA9IHJlcXVpcmUoXCIuL1Jlc291cmNlQ2F0ZWdvcnlWaWV3XCIpO1xuXG4vKipcbiAqIFRoZSB2aWV3IGZvciB0aGUgY29udGVudCB0aGF0IGdvZXMgaW50byBvbmUgdGFiLlxuICogQGNsYXNzIFJlc291cmNlVGFiVmlld1xuICovXG5mdW5jdGlvbiBSZXNvdXJjZVRhYlZpZXcoKSB7XG5cdHhub2RlLkRpdi5jYWxsKHRoaXMpO1xuXHR0aGlzLmNsYXNzTmFtZSA9IFwidWkgYm90dG9tIGF0dGFjaGVkIGFjdGl2ZSB0YWIgc2VnbWVudFwiO1xuXG5cdHRoaXMuaW5uZXIgPSBuZXcgeG5vZGUuRGl2KCk7XG5cdHRoaXMuaW5uZXIuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG5cdHRoaXMuaW5uZXIuc3R5bGUuaGVpZ2h0ID0gXCJjYWxjKDEwMCUgLSA2NXB4KVwiO1xuXHR0aGlzLmlubmVyLnN0eWxlLnBhZGRpbmcgPSBcIjFweFwiO1xuXHR0aGlzLmlubmVyLnN0eWxlLm92ZXJmbG93WSA9IFwic2Nyb2xsXCI7XG5cdHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5pbm5lcik7XG5cblx0dGhpcy5kZXNjcmlwdGlvblAgPSBuZXcgeG5vZGUuUCgpO1xuXHR0aGlzLmlubmVyLmFwcGVuZENoaWxkKHRoaXMuZGVzY3JpcHRpb25QKTtcblxuXHR0aGlzLmFjY29yZGlvbiA9IG5ldyB4bm9kZS5EaXYoKTtcblx0dGhpcy5hY2NvcmRpb24uY2xhc3NOYW1lID0gXCJ1aSBzdHlsZWQgZmx1aWQgYWNjb3JkaW9uXCI7XG5cdHRoaXMuaW5uZXIuYXBwZW5kQ2hpbGQodGhpcy5hY2NvcmRpb24pO1xufVxuXG5pbmhlcml0cyhSZXNvdXJjZVRhYlZpZXcsIHhub2RlLkRpdik7XG5cbi8qKlxuICogU2hvdWxkIHRoaXMgYmUgdGhlIGFjdGl2ZSB0YWI/XG4gKiBAbWV0aG9kIHNldEFjdGl2ZVxuICovXG5SZXNvdXJjZVRhYlZpZXcucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKGFjdGl2ZSkge1xuXHRpZiAoYWN0aXZlKSB7XG5cdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXHRcdHRoaXMuY2xhc3NOYW1lID0gXCJ1aSBib3R0b20gYXR0YWNoZWQgYWN0aXZlIHRhYiBzZWdtZW50IGFjdGl2ZVwiO1xuXHR9IGVsc2Uge1xuXHRcdHRoaXMuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdHRoaXMuY2xhc3NOYW1lID0gXCJ1aSBib3R0b20gYXR0YWNoZWQgYWN0aXZlIHRhYiBzZWdtZW50XCI7XG5cdH1cbn1cblxuLyoqXG4gKiBTZXQgZGVzY3JpcHRpb24uXG4gKiBAbWV0aG9kIHNldERlc2NyaXB0aW9uXG4gKi9cblJlc291cmNlVGFiVmlldy5wcm90b3R5cGUuc2V0RGVzY3JpcHRpb24gPSBmdW5jdGlvbihkZXNjcmlwdGlvbikge1xuXHR0aGlzLmRlc2NyaXB0aW9uUC5pbm5lckhUTUwgPSBkZXNjcmlwdGlvbjtcbn1cblxuLyoqXG4gKiBHZXQgZGl2IGhvbGRpbmcgdGhlIGNhdGVnb3JpZXMuXG4gKiBAbWV0aG9kIGdldENhdGVnb3J5SG9sZGVyXG4gKi9cblJlc291cmNlVGFiVmlldy5wcm90b3R5cGUuZ2V0Q2F0ZWdvcnlIb2xkZXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuYWNjb3JkaW9uO1xufVxuXG4vKipcbiAqIFNldCBjYXRlZ29yeSBjb2xsZWN0aW9uLlxuICogQG1ldGhvZCBzZXRDYXRlZ29yeUNvbGxlY3Rpb25cbiAqL1xuLypSZXNvdXJjZVRhYlZpZXcucHJvdG90eXBlLnNldENhdGVnb3J5Q29sbGVjdGlvbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcblx0dGhpcy5hY2NvcmRpb24uc2V0RGF0YVNvdXJjZShjb2xsZWN0aW9uKTtcbn0qL1xuXG4vKipcbiAqIEdldCBjYXRlZ29yeSBtYW5hZ2VyLlxuICogQG1ldGhvZCBnZXRDYXRlZ29yeU1hbmFnZXJcbiAqL1xuLypSZXNvdXJjZVRhYlZpZXcucHJvdG90eXBlLmdldENhdGVnb3J5TWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5hY2NvcmRpb247XG59Ki9cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZVRhYlZpZXc7Il19
