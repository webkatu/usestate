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
- `setState(object)`
- `stateChangedCallback(name, oldValue, newValue)`
- `static get observedState`

`stateChangedCallback()` is called when a state is changed. Only called for observed state. So `stateChangedCallback()` is like `attributeChangedCallback()`.

You can use `setState()` to change a state.

You should define the state to be observed by `observedState()` method.

`observedState()` method is a static getter method that returns an array of state names like `observedAttributes()`.

## example

```javascript
import useState from 'usestate';

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
		if(stateName === 'name') {
			this.p.textContent = `Hello, ${newValue}`;
		}
	}

	static get observedState() { return ['name']; }
}

customElements.define('hello-element', HelloElement);

export default useState(HelloElement)
```

## License

ISC