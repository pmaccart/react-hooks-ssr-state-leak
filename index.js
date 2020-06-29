const ReactDOMServer = require('react-dom/server');
const React = require('react');
const http = require('http');
const url = require('url');

const PORT = 3000;

function reducer(state, action) {
  const { type, value } = action;

  switch (type) {
    case 'increment':
      return typeof value !== 'undefined' ? { count: value } : { count: state.count + 1 };
    case 'decrement':
      return typeof value !== 'undefined' ? { count: value } : { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function InnerComponent({ triggerError, maxCount }) {
	const [state, dispatch] = React.useReducer(reducer, { count: 1 });
  if (state.count > 2 && triggerError) {
  	// This will raise an error on a component re-render, which will prevent render count
  	// from being reset back to 0;
    throw new Error('Triggering an error during a re-render!!!');
  }

  if (state.count < maxCount) {
		dispatch({ type: 'increment' });
  }

  return React.createElement(
      "div",
      null,
      "Inner Count: ",
      state.count
    );
}

function OuterComponent({ triggerError }) {
	const [ count ] = React.useState(1);

	return React.createElement(
		'div',
		null,
		"Outer Count: ", 
		count,
		React.createElement(InnerComponent, { triggerError, maxCount: 5 })
	);
}

const requestListener = function (req, res) {
	const queryObject = url.parse(req.url, true).query;

	try {
		const output = ReactDOMServer.renderToString(React.createElement(OuterComponent, { triggerError: queryObject.triggerError === 'true' }));
	  res.writeHead(200);
		res.end(output);
	} catch (e) {
		console.error('Error rendering', e);
		res.writeHead(500);
		res.end(e.message);
	}
}

const server = http.createServer(requestListener);
server.listen(PORT, () => { 
	console.log(`Listening for requests on port ${PORT}`);
	console.log(`To load a working page, first open http://localhost:${PORT}`);
	console.log(`Next, trigger a render error by opening http://localhost:${PORT}?triggerError=true`);
	console.log(`Finally, go back to http://localhost:${PORT}, and observe the error hook state was preserved!`)
});

