var xnode = require("xnode");
var inherits = require("inherits");
var AppView=require("../view/AppView");

function App() {
	xnode.Div.call(this);

	this.style.position = "absolute";
	this.style.top = 0;
	this.style.bottom = 0;
	this.style.left = 0;
	this.style.right = 0;

	//	this.appModel=new AppModel();
	this.appView = new AppView();
	//	this.a

	this.appendChild(this.appView);
}

inherits(App, xnode.Div);

module.exports = App;