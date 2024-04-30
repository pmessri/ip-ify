const UserController = require('../controllers/user.controller.js');
const IPController = require('../controllers/ip.controller.js');

module.exports = (app) => {
    app.post('/api/register', UserController.register);
    app.post('/api/login', UserController.login);

    app.get('/api/user', UserController.listUsers);
    app.get('/api/user/:id', UserController.listOneUser);
    app.post('/api/user', UserController.addUser);
    app.put('/api/user/:id', UserController.updateUser);
    app.delete('/api/user/:id', UserController.deleteUser);

    app.get('/api/ipify', IPController.listIPs);
    app.get('/api/ipify/:id', IPController.listOneIP);
    app.post('/api/ipify', IPController.addIP);
    app.put('/api/ipify/:id', IPController.updateIP);
    app.delete('/api/ipify/:id', IPController.deleteIP);
}
