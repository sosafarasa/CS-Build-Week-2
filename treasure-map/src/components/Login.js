import React, { useState } from 'react';
import axios from 'axios';

function Login(props) {
    const [userToken, setUserToken] = useState('')

    function handleTokenChange(e) {
        setUserToken(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault()
        localStorage.setItem('key', userToken)
        props.setLocalKey()
    }

    return (
        <>
            <form className='login-form' onSubmit={handleSubmit}>
                <label>Enter Your Auth token</label>
                <input
                    value={userToken}
                    onChange={handleTokenChange}
                    name='userToken'
                />

            </form>
        </>
    )

}

export default Login;