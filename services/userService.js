const users = require('../data/users');
require('dotenv').config();

const token = process.env.API_HEADER_TOKEN;
const omitPassword = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const userService = {
  getUsers(page = 1, perPage = 6) {
    const start = (page - 1) * perPage;
    const paginatedUsers = users.slice(start, start + perPage).map(omitPassword);
    
    return {
      page,
      per_page: perPage,
      total: users.length,
      total_pages: Math.ceil(users.length / perPage),
      data: paginatedUsers
    };
  },

  getUserById(id) {
    const user = users.find(user => user.id === parseInt(id));
    return user ? omitPassword(user) : null;
  },

  addUser(userData) {
    const newUser = {
      id: users.length + 1,
      ...userData,
      avatar: `https://randomuser.me/api/portraits/men/${users.length + 1}.jpg`
    };
    users.push(newUser);
    return omitPassword(newUser);
  },

  updateUser(id, userData) {
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...userData,
      id: parseInt(id)
    };
    return omitPassword(users[index]);
  },

  deleteUser(id) {
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },

  loginUser(email, password) {
    const user = users.find(user => user.email === email);
    if (user && user.password === password) {
      return { 
        token,
        user: omitPassword(user)
      };
    }
    return null;
  }
};

module.exports = userService;