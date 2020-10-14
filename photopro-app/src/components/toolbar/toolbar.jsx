import React from 'react';
import './toolbar.css';
import { useHistory } from 'react-router-dom';

function Toolbar() {
  const history = useHistory();
  const loggedIn = localStorage.getItem('userLoggedIn');
  console.log('buttons think ' + loggedIn);

  const handleSignInClicked = () => {
    history.push('/login');
  };

  const handleSignUpClicked = () => {
    history.push('/signup');
  };

  const handleProfileClicked = function () {
    history.push('/profile/1');
  };

  const handleLogoutClicked = () => {
    localStorage.clear();
    history.push('/');
    history.go(0); // forces the page to re-render if you are already on it which causes it to display the right information
  };

  let buttons;
  if (loggedIn === 'true') {
    buttons = (
      <div className="flex-container-buttons">
        <button>Collections</button>
        <button onClick={handleProfileClicked}>Profile</button>
        <button onClick={handleLogoutClicked}>Log Out</button>
      </div>
    );
  } else {
    buttons = (
      <div className="flex-container-buttons">
        <button onClick={handleSignInClicked}>Sign in</button>
        <button onClick={handleSignUpClicked}>Getting Started</button>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="flex-container-toolbar">
        <div className="toolbar-left">
          <button>Upload Photo</button>
        </div>
        <h1 className="toolbar-text">PhotoPro</h1>
        {buttons}
      </div>
    </React.Fragment>
  );
}

export default Toolbar;
