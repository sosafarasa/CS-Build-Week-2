import React, { useState, useEffect } from 'react';
import axios from 'axios';
import traverse from '../functions/Traverse.js';

function Adventure(props) {
    const [searchedRooms, setRooms] = useState({})
    // const [currMap, setMap] = useState({})
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

    function traverseMap() {
        if (currInfo && currInfo.title) {
            setRooms(traverse(currInfo, searchedRooms))
        }
    }

    console.log(currInfo);
    console.log(searchedRooms);

    return (
        <div>
            <button onClick={(e) => {
                e.preventDefault()
                props.setLocalKey();
                localStorage.removeItem('key')
            }}>
                Logout
            </button>

            <p>adventure</p>

            <button onClick={traverseMap}>traverseMap</button>

            <div>
                {searchedRooms[0] && searchedRooms[0].title}
            </div>
        </div>
    )
}

export default Adventure;