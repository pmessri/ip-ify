
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
    
console.log(calculateIPDetails('216.240.143.34', '255.255.255.0'));