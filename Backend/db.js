// Simulasi database menggunakan array
let users = [];

function addUser(username, password) {
  return new Promise((resolve, reject) => {
    // Cek apakah username sudah ada
    if (users.some((user) => user.username === username)) {
      reject("Username sudah terdaftar.");
    } else {
      users.push({ username, password });
      resolve();
    }
  });
}

function authenticateUser(username, password) {
  return new Promise((resolve, reject) => {
    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
      resolve(user);
    } else {
      reject("User tidak ditemukan.");
    }
  });
}

module.exports = {
  addUser,
  authenticateUser,
};
