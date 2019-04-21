import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import ProfileActions from './ProfileActions';

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashbaordContent;

    if (profile === null || loading) {
      dashbaordContent = (
        <div className='text-center'>
          <Spinner />
        </div>
      );
    } else {
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        dashbaordContent = (
          <div>
            <p className='lead text-muted'>
              Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>{' '}
            </p>
            <ProfileActions />
            {/* TODO: exp and edu */}
            <div style={{ marginBottom: '60px' }} />
            <button
              onClick={this.onDeleteClick.bind(this)}
              className='btn btn-danger'
            >
              Delete My Account
            </button>
          </div>
        );
      } else {
        // User is logged in but has no profile
        dashbaordContent = (
          <div>
            <p className='lead text-muted'>Welcome {user.name}</p>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to='/create-profile' className='btn btn-lg btn-info'>
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className='dashboard'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <h1 className='diplay-4'>Dashboard</h1>
              {dashbaordContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

const mapDispatchToProps = {
  getCurrentProfile,
  deleteAccount
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
