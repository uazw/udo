function UEvent() {
	this.handlers = {};
}
UEvent.prototype = {
	trigger: function (name, params) {
		if (this.handlers[name]) {
			this.handlers[name](params);
		} else {
			return;
		}
	},
	on: function (name, callback) {
		this.handlers[name] = callback;
	}
};

var Tab = (function () {
	function Tab(tabNode) {
		var self = this;
		init();
		
		self.on('beforeHidden', function () {
			console.log('i will going..');
		});
		self.on('afterHidden', function () {
			console.log('gone');
		});
	
		self.active = function() {
			self.tabNode.setAttribute('class', 'active');
			self.tabContentDiv.style['display'] = 'block';
		};
		
		self.disActive = function() {
			self.tabNode.removeAttribute('class');
			self.tabContentDiv.style['display'] = 'none';		
		};
		
		function getTabContentId() {
			return self.tabNode.firstChild.getAttribute('for');
		}
		
		function init() {
			UEvent.call(self);
			self.tabNode = tabNode;
			self.tabContentDiv = document.getElementById(getTabContentId());
		}
	}
	Tab.prototype = Object.create(UEvent.prototype);
	return Tab;
})();

var TabSet = (function () {
	function TabSet(id) {
		var self = this;	
		
		var tabsNodes = document.getElementById(id).getElementsByTagName('li');
		self.tabs = [];
		
		eachHTMLCollection(tabsNodes, function (tabNode) {
			var tab = new Tab(tabNode);
			self.tabs.push(tab);
			
			tabNode.addEventListener('click', function () {
				_tabChange(tab);
			});
		});
		self.currentTab = self.tabs[0];
		
		function _tabChange(tab) {
			self.currentTab.trigger('beforeHidden');
			self.currentTab.disActive();
			self.currentTab.trigger('afterHidden');
			tab.active();
			self.currentTab = tab;
		}
	}
	
	TabSet.prototype = Object.create(UEvent.prototype);	
	return TabSet;
})();

var MultiPage  = (function () {
	function MultiPage(id) {
		var self = this;
		init();
		
		function multiPageDiv() {
			return document.getElementById(id);
		}
		
		function selectElement() {
			return multiPageDiv().getElementsByTagName('select')[0];
		}
		
		
		function valuesOfOption() {
			var optionElements = selectElement().getElementsByTagName('option');
			var optionValues = [];
			eachHTMLCollection(optionElements, function (element) {
				optionValues.push(element.getAttribute('value'));
			});
			
			return optionValues;
		}
		
		function frontButton() {
			return multiPageDiv().getElementsByTagName('a')[0];
		}
		
		function nextButton() {
			return multiPageDiv().getElementsByTagName('a')[1];
		}
		
		function selectedElementChange(element) {
			self.trigger('beforeItemChange', element);
			selectElement().value = element;
			self.currentKey = element;
			self.trigger('afterItemChange', self.currentKey);
		}
		
		function findKeyIndexWithOffset() {
			
		}
		
		function init() {
			UEvent.call(self);
			frontButton().addEventListener('click', function () {	
				//TODO change to front key
				var index = valuesOfOption().indexOf(self.currentKey);
				selectedElementChange(valuesOfOption()[index-1]);
			});
			nextButton().addEventListener('click', function () {
				//TODO change to next key
				var index = valuesOfOption().indexOf(self.currentKey);
				console.log(valuesOfOption()[index+1]);
				selectedElementChange(valuesOfOption()[index+1]);		
			});
			
			
			self.on('beforeItemChange', function (params) {
				console.log(params);
			});
			
			self.on('afterItemChange', function (params) {
				console.log(params);
			})
			self.currentKey = valuesOfOption()[0];
		}	
	}
	
	MultiPage.prototype = Object.create(UEvent.prototype);
	return MultiPage;
})();



function eachHTMLCollection(tags, func) {
	for (var i = 0; i < tags.length; i++) {
		func(tags.item(i));
	}
}
