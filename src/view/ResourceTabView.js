var xnode = require("xnode");
var inherits = require("inherits");
var xnodeui = require("xnodeui");

function ResourceTabView() {
	xnode.Div.call(this);

//	this.innerHTML="hello";

/*	this.container=new xnode.Div();
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
	}, 0);*/
}

inherits(ResourceTabView, xnode.Div);

ResourceTabView.prototype.setData = function(data) {
	if (data) {
			this.id = data.id;

			//this.innerHTML = "hello world: " + data.label;
	}
}

module.exports = ResourceTabView;