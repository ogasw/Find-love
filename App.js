import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const register = async (username, password) => {
    const response = await axios.post('http://localhost:5000/api/register', { username, password });
    setCurrentUser(response.data);
  };

  const login = async (username, password) => {
    const response = await axios.post('http://localhost:5000/api/login', { username, password });
    setCurrentUser(response.data);
  };

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/api/users');
    setUsers(response.data);
  };

  useEffect(() => {
    if (currentUser) fetchUsers();
  }, [currentUser]);

  return (
    <div>
      {!currentUser ? (
        <div>
          <h2>Register/Login</h2>
          <button onClick={() => register('user1', 'password1')}>Register</button>
          <button onClick={() => login('user1', 'password1')}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {currentUser.username}</h2>
          <h3>Potential Matches</h3>
          {users.map(user => (
            <div key={user._id}>
              <p>{user.username}</p>
              <button>Like</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
    
