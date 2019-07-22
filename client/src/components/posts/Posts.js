import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostForm from './PostForm';
import PostFeed from './PostFeed';
import Spinner from '../common/Spinner';
import { getPosts } from '../../actions/postActions';

export class Posts extends Component {
  componentDidMount() {
    this.props.getPosts();
  }

  render() {
    const { posts, loading } = this.props.post;
    let postContent;

    if (posts === null || loading) {
      postContent = (
        <div className='text-center'>
          <Spinner />
        </div>
      );
    } else {
      postContent = <PostFeed posts={posts} />;
    }

    return (
      <div className='feed'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <PostForm />
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

const mapDispatchToProps = {
  getPosts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Posts);
