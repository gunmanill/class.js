(function () {

	var initializing = false;
	Class = function () {};

	Class.extends = function (child) {

		initializing = true;
		var new_prototype = new this(),
			parent = this.prototype;
		initializing = false;

		for(var key in child) {
			new_prototype[key] = child[key];
			if(typeof child[key] === 'function')
				new_prototype[key].super = typeof parent[key] === 'function' ? parent[key] : function () {console.log('no super method in parent')};

		}


		var newClass = function() {
			if(!initializing) {
				for(var key in this)
					if(typeof this[key] === 'function') {
						this[key] = (function(self, func) {
							var ret = function() {
								var prev_super = self.super;

								self.super = func.super;
								var ret = func.apply(self, arguments);
								self.super = prev_super;
								return ret;
							};
							ret.super = func.super;

							return ret;
						})(this, this[key]);
					}

				if(this.init)
					this.init.apply(this, arguments);
			}
		};
		newClass.prototype = new_prototype;
		newClass.prototype.constructor = newClass;
		newClass.extends = arguments.callee;

		return newClass;
	}
})();