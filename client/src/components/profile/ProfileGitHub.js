import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProfileGitHub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: 'dec4743c1997448f1c0c',
      clientSecret: '0b63a49015e7a185e834b7c996270ccccb759934',
      count: 5,
      sort: 'updated',
      repos: []
    };
  }

  componentDidMount() {
    const { username } = this.props;
    const { count, sort, clientId, clientSecret } = this.state;

    fetch(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
    )
      .then(res => res.json())
      .then(data => {
        if (this.refs.myRefs) {
          this.setState({ repos: data });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    const { repos } = this.state;

    const repoItems = repos.map(repo => (
      <div key={repo.id} className='card card-body mb-2'>
        <div className='row'>
          <div className='col-md-6'>
            <h4>
              <a
                href={repo.html_url}
                className='text-info'
                rel='noopener noreferrer'
                target='_blank'
              >
                {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className='col-md-6'>
            <span className='badge badge-info mr-1'>
              Stars: {repo.stargazers_count}
            </span>
            <span className='badge badge-secondary mr-1'>
              Stars: {repo.watchers_count}
            </span>
            <span className='badge badge-success'>
              Stars: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));

    return (
      <div refs='myRefs'>
        <hr />
        <h3 className='mb-4'>Latest GitHub Repos</h3>
        {repoItems}
      </div>
    );
  }
}

ProfileGitHub.propTypes = {
  username: PropTypes.string.isRequired
};

export default ProfileGitHub;
