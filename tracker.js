// const fs = require('fs')
import fs from 'fs';
import bencode from "bencode"

import dgram from 'dgram'
import { Buffer } from 'buffer';
import Url from 'url';
import crypto from 'crypto'

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

function buildConnReq() {
    const buf = Buffer.alloc(16)

    buf.writeUInt32BE(0x417, 0)
    buf.writeUint32BE(0x27101980, 4)

    buf.writeUInt32BE(0, 8);

    crypto.randomBytes(4).copy(buf, 12)

    return buf
}

function parseConnResponse(resp){
    return {
        action: resp.readUInt32BE(0),
        transactionId: resp.readUInt32BE(4),
        connectionId: resp.slice(8)
    }
}