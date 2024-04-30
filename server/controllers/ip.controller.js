const IPModel = require('../models/ip.model.js');

const listIPs = (req, res) => {
    IPModel.find({}, null)
        .then((users) => res.json(users))
        .catch((error) => console.log(error));
}

const listOneIP = (req, res) => {
    IPModel.findOne({ _id: req.params.id })
        .then((user) => res.json(user))
        .catch((error) => {
            console.log(error);
            res.status(400).json({error});
        });
}

const addIP = (req, res) => {
    const { body } = req;
    IPModel.create(body)
        .then((user) => res.json(user))
        .catch((error) => {
            if (error.code === 11000) {
                res.status(400).json({"unique": true});
                return;
            }
            else if (error.errors.ip) {
                res.status(400).json({"ipv4validation": true});
                return;
            }
            console.log(error);
            res.status(400).json({error});
        });
}

const updateIP = (req, res) => {
    IPModel.findByIdAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    })
        .then((user) => res.json(user))
        .catch((error) => {
            console.log(error);
            if (error.code === 11000) {
                res.status(400).json({"unique": true});
                return;
            }
            else if (error.errors.ip) {
                res.status(400).json({"ipv4validation": true});
                return;
            }
            res.status(400).json({error});
        });
}

const deleteIP = (req, res) => {
    IPModel.deleteOne({ _id: req.params.id })
        .then((user) => res.json(user))
        .catch((error) => console.log(error));
}

module.exports = {
    listIPs,
    listOneIP,
    addIP,
    updateIP,
    deleteIP
}
