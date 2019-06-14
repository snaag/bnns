import React from 'react';
import ReactDom from 'react-dom';
import { hot } from 'react-hot-loader/root';

import Script from './Scripts';
import './index.css';

const Hot = hot(Script);

ReactDom.render(<Hot />, document.querySelector('#root'));
