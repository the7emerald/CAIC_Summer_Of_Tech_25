require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const path = require('path')

const compression = require('compression');
app.use(compression());

// Secure headers
const helmet = require('helmet');
app.use(helmet());

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json())

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);


const admin = require('firebase-admin');
const serviceAccount = require("../../chat-app-a4191-firebase-adminsdk-fbsvc-c380512098.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-app-a4191-default-rtdb.asia-southeast1.firebasedatabase.app",
});
const db = admin.database();




const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

app.use('/api/messages', require('./routes/messages'));

app.use('/api/jitsi', require('./routes/jitsi'));

app.use('/api/upload', require('./routes/fileUploader'));


const mongoose = require('mongoose');
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