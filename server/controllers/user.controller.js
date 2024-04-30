const UserModel = require('../models/user.model.js');

const login = (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email, password: password})
        .then( (user) => { console.log(`user: ${user}`); res.json(user) } )
        .catch( (error) => {
            console.log(error);
            res.status(400).json({error});
        })
}

const register = (req, res) => {
    const { body } = req;
    UserModel.create(body)
        .then((user) => res.json(user))
        .catch((error) => {
            console.log(error);
            res.status(400).json({error});
        });
}

const listUsers = (req, res) => {
    UserModel.find({}, null)
        .then((users) => res.json(users))
        .catch((error) => console.log(error));
}

const listOneUser = (req, res) => {
    UserModel.findOne({ _id: req.params.id })
        .then((user) => res.json(user))
        .catch((error) => {
            console.log(error);
            res.status(400).json({error});
        });
}

const addUser = (req, res) => {
    const { body } = req;
    UserModel.create(body)
        .then((user) => res.json(user))
        .catch((error) => {
            console.log(error);
            res.status(400).json({error});
        });
}

const updateUser = (req, res) => {
    UserModel.findByIdAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    })
        .then((user) => res.json(user))
        .catch((error) => {
            console.log(error);
            res.status(400).json({error});
        });
}

const deleteUser = (req, res) => {
    UserModel.deleteOne({ _id: req.params.id })
        .then((user) => res.json(user))
        .catch((error) => console.log(error));
}

module.exports = {
    login,
    register,
    listUsers,
    listOneUser,
    addUser,
    updateUser,
    deleteUser
}