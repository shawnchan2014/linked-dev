import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProfileGitHub extends Component {
  render() {
    return (
      <div>
        <h1>Profile GitHub</h1>
      </div>
    );
  }
}

ProfileGitHub.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileGitHub;
