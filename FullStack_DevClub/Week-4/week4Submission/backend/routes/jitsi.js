const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config()
const { checkAuth } = require('../middleware/userAuth');


const assignToken = (data) => {
  const payLoad = {
    "aud": "jitsi",
    "iss": "chat",
    "sub": "vpaas-magic-cookie-b24439535c154e6db6e54aadc36b02c3",
    "room": data.room,
    "exp": Date.now() + 60 * 60000,
    "context": {
      "user": {
        "name": data.name,
        "id": data.uid,
      },
      "features": {
        "livestreaming": "false",
        "outbound-call": "false",
        "transcription": "false",
        "recording": "false"
      }
    }

  }

  const header = {
    header: {
      "alg": "RS256",
      "typ": "JWT",
      "kid": "vpaas-magic-cookie-b24439535c154e6db6e54aadc36b02c3/08c6d5"
    }
  }

  const token = jwt.sign(payLoad, process.env.JITSI_TOKEN_SECRET, header);
  return { token };

};


router.post('/', checkAuth, async (req, res) => {

  res.json(assignToken(req.body))
});

module.exports = router;
