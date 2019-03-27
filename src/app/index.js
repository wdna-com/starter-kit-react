import React from 'react';

import getRoundedPi from '../helpers/Math';

const App = () => (
  <div>
    Starter Kit - The value of PI is approximately <span>{getRoundedPi()}</span>
  </div>
);

export default App;
