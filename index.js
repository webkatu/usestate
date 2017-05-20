function setState(state) {
	if(typeof state !== 'object' || state === null) return;
	
	if(typeof this.state !== 'object' || this.state === null) this.state = {};
	const oldState = this.state;
	const newState = this.state = Object.assign({}, this.state, state);

	if(Array.isArray(this.constructor.observedState) === false) return;
	if(typeof this.stateChangedCallback !== 'function') return;

	this.constructor.observedState.forEach((name) => {
		if(oldState[name] === newState[name]) return;
		this.stateChangedCallback(name, oldState[name], newState[name]);
	});
}

export default function useState(target) {
	if(typeof target !== 'function') throw new TypeError();

	target.prototype.setState = setState;
	return target;
}