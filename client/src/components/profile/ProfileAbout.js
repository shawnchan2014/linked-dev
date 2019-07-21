import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from '../../validation/is-empty';

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    // Get first name
    const firstName = profile.user.name.trim().split(' ')[0];

    // Skill list
    const skills = profile.skills.map((skill, index) => (
      <div key={index} className='p-3'>
        {<i className='fas fa-check pr-1' />} {skill}
      </div>
    ));

    return (
      <div class='row'>
        <div class='col-md-12'>
          <div class='card card-body bg-light mb-3'>
            {isEmpty(profile.bio) ? null : (
              <div>
                <h3 class='text-center text-info'>Bio</h3>
                <p class='lead'>
                  <span>{profile.bio}</span>
                </p>
                <hr />
              </div>
            )}
            <h3 class='text-center text-info'>Skill Set</h3>
            <div class='row'>
              <div class='d-flex flex-wrap justify-content-center align-items-center'>
                {skills}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
