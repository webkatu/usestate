# usestate

usestate gives the webcomponents a new life cycle.

It is effective when doing data binding.

```
$ npm i -S usestate
```

## Usage

```javascript
import useState from 'usestate';

class Component extends HTMLElement {
	/* ... */
}

export default useState(Component)
```

or

```javascript
import useState from 'usestate';

@useState
export default class Component extends HTMLElement {
	/* ... */
}
```

## What can I do with it?

A component with usestate can use the following methods.
- `getState()`
- `setState(object)`
- `stateChangedCallback(stateName, oldValue, newValue)`
- `static get observedState`

`stateChangedCallback()` is called when a state is changed. Only called for observed state. So `stateChangedCallback()` is like `attributeChangedCallback()`.

You can use `setState()` to change a state. `setState()` find the difference of state.

You should define the state to be observed by `observedState()` method.

`observedState()` method is a static getter method that returns an array of state names like `observedAttributes()`.

## example

```javascript
import useState from 'usestate'

class HelloElement extends HTMLElement {
	constructor() {
		super();
		
		const input = document.createElement('input');
		input.type = 'text';
		input.onkeyup = (e) => {
			this.setState({ name: e.target.value });
		}
		this.appendChild(input);
		
		this.p = document.createElement('p');
		this.appendChild(this.p);
	}

	stateChangedCallback(stateName, oldValue, newValue) {
		switch(stateName) {
			case 'name':
				this.p.textContent = `Hello, ${newValue}`;
		}
	}

	static get observedState() { return ['name']; }
}

customElements.define('hello-element', HelloElement);

const helloElement = new (useState(HelloElement));
document.body.appendChild(helloElement);

helloElement.setState({ name: 'world' });
```

With flux.

```javascript
import EventEmitter from 'events'
import useState from 'usestate'

const dispatcher = new EventEmitter();

class Store extends EventEmitter {
	constructor() {
		super();

		this.name = '';

		dispatcher.on('inputName', (value) => {
			this.name = value;
			this.emit('CHANGE');
		});
	}
}
const store = new Store()

class HelloElement extends HTMLElement {
	constructor() {
		super();

		this.handleStoreChange = this.handleStoreChange.bind(this);
		
		const input = document.createElement('input');
		input.type = 'text';
		input.onkeyup = (e) => {
			dispatcher.emit('inputName', input.value);
		}
		this.appendChild(input);
		
		this.p = document.createElement('p');
		this.appendChild(this.p);
	}

	handleStoreChange() {
		this.setState(store);
	}

	connectedCallback() {
		store.on('CHANGE', this.handleStoreChange);
		//initialization
		this.handleStoreChange();
	}

	disconnectedCallback() {
		store.removeListener('CHANGE', this.handleStoreChange);
	}

	stateChangedCallback(stateName, oldValue, newValue) {
		switch(stateName) {
			case 'name':
				this.p.textContent = `Hello, ${newValue}`;
		}
	}

	static get observedState() { return ['name']; }
}

customElements.define('hello-element', HelloElement);

const helloElement = new (useState(HelloElement));
document.body.appendChild(helloElement);
```

## License

ISC