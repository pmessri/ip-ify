import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const UserRegistration = (props) => {
    const Navigate = useNavigate();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpw, setConfirmpw] = useState('');

    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');

    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [registerErrors, setRegisterErrors] = useState({});
    const [loginErrors, setLoginErrors] = useState(false);

    const handleRegistration = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/register', {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password
        })
            .then((res) => {
                console.log(res.data);
                setRegisterErrors({});
                setRegisterSuccess(true);
            })
            .catch((err) => {
                if (err.response) {
                    setRegisterErrors(err.response.data.error.errors);
                }
            });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/login', {
            email: emailLogin,
            password: passwordLogin
        })
            .then((res) => {
                if (res.data) {
                    const cookies = new Cookies();
                    cookies.set('userId', res.data._id, { path: '/' });
                    Navigate('/dashboard');
                } else {
                    setLoginErrors(true);
                }
            })
            .catch((err) => {
                if (err.response) {
                    setLoginErrors(true);
                }
            });
    };

    return (
    <div className="w-[800px] mt-[20px]">
        <div className="border border-double border-8 rounded-3xl">
        <div className="p-5">
            <h1 className="text-2xl font-bold">
                Registration
            </h1>
            <div className="p-5">
                <form name="userRegistration">
                    <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Firstname</label>
                    <input type="text" name="firstname" id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Lastname</label>
                    <input type="text" name="lastname" id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
                    <input type="text" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
                    <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <label htmlFor="confirmpw" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Confirm Password</label>
                    <input type="password" name="confirmpw" id="confirmpw" value={confirmpw} onChange={(e) => setConfirmpw(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <br/>
                    <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={handleRegistration}>Register</button>
                </form>
                    {
                        registerSuccess ?
                        <div className="mt-5 bg-green-100 border border-green-400 text-blue-700 px-4 py-3 rounded relative">
                            Registration Successful. You may now Login.
                        </div>
                        : false
                    }
                    {
                        Object.keys(registerErrors).length > 0 ? 
                        <div className="mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            { registerErrors.firstname ? <div>{registerErrors.firstname.message }</div> : false }
                            { registerErrors.lastname ? <div>{registerErrors.lastname.message}</div> : false }
                            { registerErrors.email ? <div>{registerErrors.email.message}</div> : false }
                            { registerErrors.password ? <div>{registerErrors.password.message}</div> : false }
                        </div>
                        : false
                    }
            </div>
            <h1 className="text-2xl font-bold">
                Login 
            </h1>
            <div className="p-5">
                <form name="userLogin">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Username</label>
                    <input type="text" name="emailLogin" id="emailLogin" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
                    <input type="password" name="passwordLogin" id="passwordLogin" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <br/>
                    <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={handleLogin}>Login</button>
                </form>
                    {
                        loginErrors ? 
                        <div className="mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            Unsuccessful login, please try again.
                        </div>
                        : false
                    }
            </div>
        </div>
        </div>
    </div>
    )
}

export default UserRegistration;