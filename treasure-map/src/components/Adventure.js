import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Adventure(props) {
    const [currMap, setMap] = useState({})
    const [currInfo, setCurrInfo] = useState()

    useEffect(() => {
        const auth = `Token ${localStorage.getItem('key')}`
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
        }

        axios
            .get(`${props.backendUrl}/api/adv/init`, options)
            .then(res => {
                setCurrInfo(res.data)
            })
    }, [props.loggedIn, props.backendUrl] )

    return (
        <div>
            {currInfo && currInfo}
            {currMap && currMap}
        </div>
    )
}

export default Adventure;