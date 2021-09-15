/* eslint-disable no-undef */
const {
    Users
} = require('../models/users');
const {
    getUsersById, deleteUsersById
} = require('../services/usersRepository.service');


const usersGET = async (req, res) => {
    const usersList = await getUsersById();
    if (usersList && usersList.length > 0) {
        res.status(200).send(usersList);
    } else {
        res.status(200).send('There is not users to be shown');
    }
}

const usersCreatePOST = async (req, res) => {
    const {
        body: {
            user
        }
    } = req;

    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    const finalUser = new Users(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
        .then(() => res.json({
            user: finalUser.toAuthJSON()
        }));
}

const usersGETById = async (req, res) => {
    const idParam = req.params.id ? req.params.id : null;
    const usersList = await getUsersById(idParam);
    if (usersList && usersList.length > 0) {
        res.status(200).send(usersList);
    } else {
        res.status(200).send('There is not users to be shown');
    }
}

const usersDeleteById = async(req, res) => {
    const idParam = req.params.id ? req.params.id : null;

    await deleteUsersById(idParam)
    .then(() => {
        res.status(204).send('user deleted')
    })
    .catch(error => res.status(404).send('error deleting user', error))

}


module.exports = {
    usersCreatePOST,
    usersGET,
    usersGETById,
    usersDeleteById
}