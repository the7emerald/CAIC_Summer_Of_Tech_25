const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");

const UserCredentials = require('../models/userCredentials');


const checkAuth = async (request, response, next) => {
    try {
        const token = await request.headers.authorization.split(" ")[1];
        const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");
        const user = await decodedToken;

        request.user = user;
        next();

    } catch (error) {
        response.status(401).json({
            error: new Error("Unauthorized"),
        });
    }
};

router.post('/register', async (req, res) => {
    const data = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };
    if (!data.username || !data.password || !data.email) {
        return res.status(500).send("Incomplete Details");
    }
    const existingUser = await UserCredentials.findOne({ username: data.username });

    if (existingUser) {
        return res.status(500).send("Username Already Exists");
    }
    else {
        const saltRounds = 10;
        const hashedPass = await bcryptjs.hash(data.password, saltRounds);
        data.password = hashedPass;

        try {
            const userData = await UserCredentials.insertOne(data);
            res.send("Success");
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await UserCredentials.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).send("username not found");
        }
        const passMatch = await bcryptjs.compare(req.body.password, user.password);
        if (passMatch) {
            const token = jwt.sign({
                username: user.username
            },
                "RANDOM-TOKEN", { expiresIn: '1h' }
            );
            res.status(200).send({ message: 'success', token })
        }
        else {
            res.status(500).send("wrong password");
        }
    }
    catch (error) {
        res.status(500).send("error");
    }
});

router.delete('/profile', checkAuth, async (req, res) => {
    try {
        const user = await UserCredentials.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).send("user not found");
        }
        const userData = await UserCredentials.deleteOne(user);
        res.send("deleted");
    }
    catch (error) {
        res.status(500).send("error");
    }
})

router.get('/profile', checkAuth, async (req, res) => {
    try {
        const user = await UserCredentials.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).send("user not found");
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).send("error");
    }
})

router.put('/profile', checkAuth, async (req, res) => {
    try {
        const user = await UserCredentials.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).send("user not found");
        }
        let newValues = {};
        if (req.body.username) { newValues.username = req.body.username; }
        if (req.body.email) newValues.email = req.body.email;
        if (req.body.password) {
            const saltRounds = 10;
            const hashedPass = await bcryptjs.hash(req.body.password, saltRounds);
            newValues.password = hashedPass;
        }
        userData = await UserCredentials.updateOne({ username: user.username }, newValues, { runValidators: true });
        let token = "";
        if (newValues.username) {
            token = jwt.sign({
                username: newValues.username
            },
                "RANDOM-TOKEN", { expiresIn: '1h' }
            );
        }
        else {
            token = await req.headers.authorization.split(" ")[1];
        }
        res.status(200).send({ message: 'success', token })
    }
    catch (error) {
        res.status(500).send(error.message);
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await UserCredentials.find();
        const extractKey = 'username';
        const result = users.map(item => {
            const { [extractKey]: value } = item;
            return value;
        });
        res.json(result);

    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await UserCredentials.find();
        res.json(users);

    } catch (error) {
        res.status(500)
            .json({ error: error.message });
    }
});

module.exports = router;