import React, { useEffect, useRef, useState } from "react";

import { database } from "../utils/firebase";
import { ref, onValue } from "firebase/database";

const Contact = ({ userid, updatePartner, partnerId }) => {
  const [contact, setContact] = useState();

  useEffect(() => {
    console.log(userid);
    const userRef = ref(database, `ChatUsers/${userid}`);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setContact(data);
        console.log(data);
      }
    });
  }, [])

  const func = () => {
    updatePartner(userid)
    console.log(userid)
  }

  return (
    <>
      {contact ?
        (
          <button className={`contact${partnerId === userid ? "-current" : ""}`} onClick={func}>{contact.username} - {contact.status}</button>
        ) :
        (<></>)
      }
    </>
  );
};

export default Contact;