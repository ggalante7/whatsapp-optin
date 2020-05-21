const model = require("../cassandra/cassandra-express");

async function getHistory(req, res) {
    let params = {
        tenant: model.uuidFromString(req.params.tenant),
        contact: model.uuidFromString(req.params.contact)
    };

    try {
        let results = await model.instance.history.findAsync(params)

        console.log("historyController:getHistory -> success", JSON.stringify({params: params, results: results}));
        res.status(200).send(results).end();
    } catch (error) {
        console.log("historyController:getHistory -> failure", JSON.stringify({params: params, error: error}));
        res.status(400).send({message: "Ocorreu um erro inesperado"}).end();
    }
}