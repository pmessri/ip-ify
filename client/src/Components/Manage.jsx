import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const Dashboard = (props) => {
    const { id } = useParams();

    const Navigate = useNavigate();

    const [ ips, setIPs ] = useState('');
    const [ calcIp, setCalcIp ] = useState(false);
    const [ ipCalc, setIPCalc ] = useState({});
    const [ IPAddress, setIPAddress ] = useState('');
    const [ CustomerName, setCustomerName ] = useState('');
    const [ Subnet, setSubnet ] = useState('');
    const [ Errors, setErrors ] = useState( {} );
    const [ UniqueError, setUniqueError ] = useState(false);
    const [ IPv4ValidationError, setIPv4ValidationError ] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/ipify/${id}`)
            .then((res) => {
                console.log(res.data);
                setCustomerName(res.data.customerName);
                setIPAddress(res.data.ip);
                setSubnet(res.data.subnetmask);
            })
            .catch((err) => {console.log(err)});
    }, []);

    const handleDelete = (e) => {
        e.preventDefault();
        axios.delete(`http://localhost:8080/api/ipify/${id}`)
            .then((res) => {
                console.log(res.data);
                Navigate("/dashboard");
            })
            .catch((err) => {console.log(err)});
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        const cookies = new Cookies();
        let userId = cookies.get('userId'); 
        axios.put(`http://localhost:8080/api/ipify/${id}`, {
            userId: userId,
            ip: IPAddress,
            customerName: CustomerName,
            subnetmask: Subnet
        })
            .then((res) => {
                console.log(res.data);
                setErrors({});
                setUniqueError(false);
                setIPv4ValidationError(false);
                Navigate("/dashboard");
            })
            .catch((err) => {
                console.log(err);
                console.log('gothere-1');
                if(err.response.data.unique) {
                    setUniqueError(true);
                }
                else if (err.response.data.ipv4validation) {
                    setIPv4ValidationError(true);
                }
                else if (err.response) {
                    console.log('gothere-3');
                    setErrors(err.response.data.error.errors);
                }
            });
    };

    return (
    <div className="w-[800px] mt-[20px]">
        <div className="border border-double border-8 rounded-3xl">
        <div className="p-5">
            <h1 className="text-2xl font-bold">
                ip-ify
            </h1>
            <div className="p-5">
                <h1 className="text-1xl font-bold">
                    Update
                </h1>
                <div className="p-5">
                    <form name="userRegistration">
                        <div className="mt-0">
                        <label htmlFor="customer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Customer Name</label>
                        <input type="text" name="customername" id="customername" value={CustomerName} onChange={(e) => setCustomerName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>

                        <div className="mt-5">
                        <label htmlFor="ip" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">IP Address</label>
                        <input type="text" name="ip" id="ip" value={IPAddress} onChange={(e) => setIPAddress(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>

                        <div className="mt-5">
                        <label htmlFor="subnet" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Subnet Mask</label>
                        <input type="text" name="subnet" id="subnet" value={Subnet} onChange={(e) => setSubnet(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>

                        {
                            Object.keys(Errors).length > 0 ?
                            <div className="mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                { Errors.customerName ? <div>{Errors.customerName.message }</div> : false }
                                { Errors.ip ? <div>{Errors.ip.message}</div> : false }
                                { Errors.subnetmask ? <div>{Errors.subnetmask.message}</div> : false }
                            </div>
                            : false
                        }
                        {
                            UniqueError ?
                            <div className="mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                IP Must be Unique.
                            </div>
                            : false
                        }
                        {
                            IPv4ValidationError ?
                            <div className="mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                IP Must be an RFC compliant IPv4 Address.
                            </div>
                            : false
                        }

                        <div className="mt-8">
                            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={handleUpdate} >Update</button>
                            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={handleDelete} >Delete</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    </div>
    )
}

export default Dashboard;