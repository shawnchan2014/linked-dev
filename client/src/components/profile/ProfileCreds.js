import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProfileCreds extends Component {
  render() {
    return (
      <div>
        <h1>Profile Creds</h1>
      </div>
    );
  }
}

ProfileCreds.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileCreds;
