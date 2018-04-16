import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import MapComponent from './MapComponent';

ReactDOM.render(<MapComponent />, document.getElementById('root'));
registerServiceWorker();
