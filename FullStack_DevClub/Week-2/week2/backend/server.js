require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 5000

const path = require('path')

const mongoose = require('mongoose');

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const mongoDBURL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/trialDB";
mongoose.connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connection Successful"))
    .catch((err) => console.error("Connection Error:", err));


app.get('/', (req, res) => {
    res.send('Connected to MongoDB!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});