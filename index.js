// const fs = require('fs')
import fs from 'fs';
import bencode from "bencode"
import tracker from './tracker'

const torrent = bencode.decode(fs.readFileSync('./puppy.torrent'))

tracker.getPeers(torrent, peers => {
    console.log('List of peers : ', peers);
})