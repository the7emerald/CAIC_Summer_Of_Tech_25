import React, { useState, useEffect } from 'react';
import { auth, database } from '../utils/firebase';
import { ref, onValue, set, get } from "firebase/database";

const LangDropdown = () => {
    let currentUser = auth.currentUser
    const [selectedLang, setLang] = useState('en')
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'zh-Hans', name: 'Chinese (Simplified)' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ar', name: 'Arabic' },
        { code: 'ru', name: 'Russian' },
    ];


    useEffect(() => {
        currentUser = auth.currentUser
        if (!currentUser) return
        const userRef = ref(database, `ChatUsers/${currentUser.uid}/preferredLanguage`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setLang(data);
                console.log(data);
            }
        });
    }, [currentUser])

    const changeLang = (newLang) => {
        const userRef = ref(database, `ChatUsers/${currentUser.uid}/preferredLanguage`);
        set(userRef, newLang)
    }

    return (
        <select style={{ "marginTop": "7px", "marginBottom": "5px" }} value={selectedLang} onChange={(e) => changeLang(e.target.value)}>
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    {lang.name}
                </option>
            ))}
        </select>
    );
};

export default LangDropdown;
