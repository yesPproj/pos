import React, { useState } from 'react';
import styled from 'styled-components';

const HelpButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #707070;
  font-size: 1.2em;
`;

const HelpModal = styled.div`
  position: absolute;
  top: 60px; /* Adjust top position as needed */
  right: 20px; /* Position to the right of the sidebar */
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #707070;
`;

const HelpContent = () => (
  <HelpModal>
    <CloseButton>&times;</CloseButton>
    <h3>How to Use This App</h3>
    <p>
      This is a help section explaining how to navigate and use different features of the app.
    </p>
    <p>
      You can add more detailed instructions, links to documentation, or even interactive guides here.
    </p>
  </HelpModal>
);

const Help = () => {
  const [showHelp, setShowHelp] = useState(false);

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <>
      <HelpButton onClick={toggleHelp}>
        ?
      </HelpButton>
      {showHelp && <HelpContent />}
    </>
  );
};

export default Help;
