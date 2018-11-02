import React, { useState, useEffect } from 'react';

function App() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    document.title = `Window width: ${width}`;
  });

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    // Clean up resize event
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div>
      <p>Window width: {width}</p>
    </div>
  );
}

export default App;
