const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv('_mongodb._tcp.cluster0.dbnn8pr.mongodb.net', (err, addresses) => {
  if (err) console.error('SRV Error:', err.message);
  else console.log('SRV:', JSON.stringify(addresses));
  
  dns.resolveTxt('cluster0.dbnn8pr.mongodb.net', (err, records) => {
    if (err) console.error('TXT Error:', err.message);
    else console.log('TXT:', JSON.stringify(records));
  });
});
