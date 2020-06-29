# react-hooks-ssr-state-leak

Steps to repro:
1. Clone this repository
1. Install dependencies: `npm i`
1. Start the server: `node index.js`
1: Load the test page in a browser: `http://localhost:3000`; 
   1. observe the components render as expected
1. Next, load the test page with a `triggerError` param: `http://localhost:3000?triggerError=true`
   1. You should see an error message: `Triggering an error during a re-render!!!`
1. Finally, attempt to reload the original page:  `http://localhost:3000`
   1. You will see an error message saying `Rendered more hooks than during the previous render`
