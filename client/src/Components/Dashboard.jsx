import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const Dashboard = (props) => {
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
        axios.get("http://localhost:8080/api/ipify")
            .then((res) => {
                console.log(res.data);
                setIPs(res.data);
            })
            .catch((err) => {console.log(err)});
    }, []);

    const updateIPs = () => {
        axios.get("http://localhost:8080/api/ipify")
            .then((res) => {
                console.log(res.data);
                setIPs(res.data);
            })
            .catch((err) => {console.log(err)});
   }

    const handleDelete = (e) => {
        e.preventDefault();
        let id = e.target.id;
        axios.delete(`http://localhost:8080/api/ipify/${id}`)
            .then((res) => {
                console.log(res.data);
                updateIPs();
            })
            .catch((err) => {console.log(err)});
        console.log(e.target.id);
    }

    const handleCalculate = (e) => {
        e.preventDefault();
        setCalcIp(true);
        let ip = IPAddress;
        let subnet = Subnet;
        let ret = calculateIPDetails(ip, subnet);
        setIPCalc(ret);
    };

    function calculateIPDetails(ip, subnet) {
        function ipToBinaryString(ip) {
            return ip.split('.').map(function(octet) {
                return parseInt(octet).toString(2).padStart(8, '0');
            }).join('');
        }

        function binaryStringToIp(binStr) {
            return binStr.match(/.{1,8}/g).map(function(bin) {
                return parseInt(bin, 2).toString();
            }).join('.');
        }

        let ipBinary = ipToBinaryString(ip);
        let subnetBinary = ipToBinaryString(subnet);

        let networkBinary = '';
        for (let i = 0; i < 32; i++) {
            networkBinary += ipBinary[i] === '1' && subnetBinary[i] === '1' ? '1' : '0';
        }

        let broadcastBinary = '';
        for (let i = 0; i < 32; i++) {
            broadcastBinary += subnetBinary[i] === '1' ? ipBinary[i] : '1';
        }

        let networkAddress = binaryStringToIp(networkBinary);
        let broadcastAddress = binaryStringToIp(broadcastBinary);
        let firstUsableIp = binaryStringToIp((BigInt('0b' + networkBinary) + BigInt(1)).toString(2).padStart(32, '0'));
        let lastUsableIp = binaryStringToIp((BigInt('0b' + broadcastBinary) - BigInt(1)).toString(2).padStart(32, '0'));
        let usableIpCount = BigInt('0b' + broadcastBinary) - BigInt('0b' + networkBinary) - BigInt(1);

        return {
            networkAddress: networkAddress,
            broadcastAddress: broadcastAddress,
            firstUsableIp: firstUsableIp,
            lastUsableIp: lastUsableIp,
            usableIpCount: usableIpCount.toString(),
            gateway: firstUsableIp
        };
    }

    const handleAdd = (e) => {
        e.preventDefault();
        setUniqueError(false);
        setErrors({});
        setIPv4ValidationError(false);
        const cookies = new Cookies();
        let userId = cookies.get('userId'); 
        axios.post('http://localhost:8080/api/ipify', {
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
                setIPAddress('');
                setCustomerName('');
                setSubnet('');
                updateIPs();
            })
            .catch((err) => {
                if(err.response.data.unique) {
                    setUniqueError(true);
                }
                if (err.response.data.ipv4validation) {
                    setIPv4ValidationError(true);
                }
                if (err.response) {
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
                    Your Assigned IPs
                </h1>
                <div className="list mt-5 mb-5">
                    {
                        Object.keys(ips).length > 0 ?
                        <table className="w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-lg font-bold uppercase">
                                <tr>
                                    <td>Customer Name</td>
                                    <td>IP Address</td>
                                    <td>Subnet Mask</td>
                                </tr>
                            </thead>
                            <tbody>
                            {
                            ips.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.customerName}</td>
                                    <td>{item.ip}</td>
                                    <td>{item.subnetmask}</td>
                                    <td>
                                        <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={handleDelete} id={item._id}>Delete</button>
                                        <Link to={`/manage/${item._id}`}><button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Manage</button></Link>
                                    </td>
                                </tr>
                            ))
                            }
                            </tbody>
                        </table>
                        :
                        <div className="p-5">
                            <span>You have no assigned IP's in the database.</span>
                        </div>
                    }
                </div>
                <h1 className="text-1xl font-bold">
                    Manage / Calculate
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
                            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={handleCalculate} >Calculate</button>
                            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={handleAdd} >Add</button>
                        </div>

                        {
                            calcIp ?
                            <div className="mt-8">
                                <table className="table-auto w-full text-lg font-mono text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <tr>
                                        <td>Network Address</td>
                                        <td>{ipCalc.networkAddress}</td>
                                    </tr>
                                    <tr>
                                        <td>Broadcast Address</td>
                                        <td>{ipCalc.broadcastAddress}</td>
                                    </tr>
                                    <tr>
                                        <td>First Usable IP</td>
                                        <td>{ipCalc.firstUsableIp}</td>
                                    </tr>
                                    <tr>
                                        <td>Last Usable IP</td>
                                        <td>{ipCalc.lastUsableIp}</td>
                                    </tr>
                                    <tr>
                                        <td>Usable IP Count</td>
                                        <td>{ipCalc.usableIpCount}</td>
                                    </tr>
                                    <tr>
                                        <td>Gateway</td>
                                        <td>{ipCalc.gateway}</td>                                
                                    </tr>
                                </table>
                            </div>
                            : false
                        }
                    </form>
                </div>
            </div>
        </div>
        </div>
    </div>
    )
}

export default Dashboard;