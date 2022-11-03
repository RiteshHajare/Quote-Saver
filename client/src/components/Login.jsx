import React from 'react'
import axios from 'axios'

function Login() {

    function handleClick() {
        console.log("jj");
        window.open("http://localhost:4000/auth", "_self");
    }


    return (
        <div className='login'>
            <div className="card">
                <button className='btn btn-social btn-google' onClick={handleClick}><i class="fa-brands fa-google"></i>Sign up with Google</button>
            </div>
        </div>
    )
}

export default Login