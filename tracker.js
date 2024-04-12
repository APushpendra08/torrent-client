// const fs = require('fs')
import fs from 'fs';
import bencode from "bencode"

import dgram from 'dgram'
import { Buffer } from 'buffer';
import Url from 'url';

module.exports.getPeers = (torrent, callback) => {
    const socket = dgram.createSocket('upd4');
    const url = Buffer.from(torrent.announce).toString();

    // 1. send connection request
    udpSend(socket, buildConnReq(), url);

    socket.on('message', response => {
        if(respType(response) === 'connect') {
            // 2. Receive and parse connect request
            const connResp = parseConnResponse(response)

            // 3. Send announce request
            const announceReq = buildAnnounceReq(connResp.connectionId);
            udpSend(socket, announceReq, url)
        } else if(respType(response) === 'announce') {
            // 4. Parse announce response
            const announceResp = parseAnnounceReq(connResp.connectionId);
            // 5. Pass peers to callback
            callback(announceResp.peers)
        }
    })
}

function udpSend(socket, message, rawUrl, callback = () => {} ) {

    const url = Url.parse(rawUrl);
    socket.send(message, 0, message.length, url.port, url.host, callback)
}








// const torrent = bencode.decode(fs.readFileSync('./puppy.torrent'))
// // console.log(String.fromCharCode.apply(null, torrent.announce));
// console.log(Buffer.from(torrent.announce).toString());
// // const url = Url.parse(Buffer.from(torrent.announce).toString());
// // console.log(url)
// const socket = dgram.createSocket('udp4');
// const myMsg = Buffer.from('hello?', 'utf8')
// socket.on('message', msg => {
//     console.log('message is', msg)
// })
