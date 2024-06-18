import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [start, setStart] = useState(0);
  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    fetchPosts();
  }, [isSmallerDevice]);

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data } = await axios.get('/api/v1/posts', {
      params: { start, limit: isSmallerDevice ? 5 : 10 },
    });
    setIsLoading(false);
    if (data.length === 0) {
      setHasMorePosts(false);
    } else {
      setPosts([...posts, ...data]);
      setStart(start + (isSmallerDevice ? 5 : 10));
    }
  };

  const handleClick = () => {
    fetchPosts();
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {hasMorePosts && (
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        )}
      </div>
    </Container>
  );
};

export default Posts;
