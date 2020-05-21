var models = require('express-cassandra');

models.setDirectory(__dirname + '/models').bind(
    {
        clientOptions: {
            contactPoints: ['127.0.0.1'],
            protocolOptions: { port: 9042 },
            keyspace: 'whatsapp_optin',
            queryOptions: {consistency: models.consistencies.one}
        },
        ormOptions: {
            defaultReplicationStrategy : {
                class: 'SimpleStrategy',
                replication_factor: 1
            },
            migration: 'safe'
        }
    },
    function(err) {
        if(err) {
            console.log("erro no bind do cassandra", err);
            throw err
        } else {
            console.log('connection established');
        };
    }
);

module.exports = models;