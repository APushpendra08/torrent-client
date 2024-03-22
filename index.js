// const fs = require('fs')
import fs from 'fs';
import bencode from "bencode"

const torrent = bencode.decode(fs.readFileSync('./puppy.torrent'))
// console.log(String.fromCharCode.apply(null, torrent.announce));
console.log(Buffer.from(torrent.announce).toString());
