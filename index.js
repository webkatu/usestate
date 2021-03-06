const map = new WeakMap();
const privates = function(object) {
	if(! map.has(object)) {
		map.set(object, {});
	}
	return map.get(object);
};

function getState() { return privates(this).state; }

function setState(state) {
	if(typeof state !== 'object' || state === null) return;
	
	const that = privates(this);
	if(typeof that.state !== 'object' || that.state === null) that.state = {};
	const oldState = that.state;
	const newState = that.state = Object.assign({}, that.state, state);

	if(Array.isArray(this.constructor.observedState) === false) return;
	if(typeof this.stateChangedCallback !== 'function') return;

	this.constructor.observedState.forEach(function(name) {
		if(oldState[name] === newState[name]) return;
		this.stateChangedCallback(name, oldState[name], newState[name]);
	}, this);
}

module.exports = function useState(target) {
	if(typeof target !== 'function') throw new TypeError();

	target.prototype.getState = getState;
	target.prototype.setState = setState;
	return target;
}