const model = require("../cassandra/cassandra-express");

async function getOptins(req, res) {
    let params = {
        tenant: model.uuidFromString(req.params.tenant),
        contact: model.uuidFromString(req.params.contact)
    };

    try {
        let results = await model.instance.optin.findAsync(params)

        console.log("optinController:getOptin -> success", JSON.stringify({params: params, results: results}));
        res.status(200).send(results).end();
    } catch (error) {
        console.log("optinController:getOptin -> failure", JSON.stringify({params: params, error: error}));
        res.status(400).send({message: "Ocorreu um erro inesperado"}).end();
    }
}

async function getOptinByMeanContact(req, res) {
    let params = {
        tenant: model.uuidFromString(req.params.tenant),
        contact: model.uuidFromString(req.params.contact),
        mean_contact: req.params.mean_contact
    };

    try {
        let result = await model.instance.optin.findOneAsync(params);

        console.log("optinController:getOptinByMeanContact -> success", JSON.stringify({params: params, result: result}));

        if (result){
            res.status(200).send(result).end();
        } else {
            res.status(204).send(result).end();
        }
    } catch (error) {
        console.log("optinController:getOptinByMeanContact -> failure", JSON.stringify({params: params, error: error}));
        res.status(400).send({message: "Ocorreu um erro inesperado"}).end();
    }
}

async function getOptinByClient(req, res) {
    let params = {
        tenant: model.uuidFromString(req.params.tenant),
        contact: model.uuidFromString(req.params.contact),
        client_id: req.params.client_id
    };

    try {
        let result = await model.instance.optin.findOneAsync(params, {allow_filtering: true});

        console.log("optinController:getOptinByClient -> success", JSON.stringify({params: params, result: result}));

        if (result){
            res.status(200).send(result).end();
        } else {
            res.status(204).send(result).end();
        }
    } catch (error) {
        console.log("optinController:getOptinByClient -> failure", JSON.stringify({params: params, error: error}));
        res.status(400).send({message: "Ocorreu um erro inesperado"}).end();
    }
}

async function optin(req, res) {
    let params = {
        tenant: model.uuidFromString(req.body.tenant),
        contact: model.uuidFromString(req.body.contact),
        mean_contact: req.body.mean_contact,
        client_id: req.body.client_id,
        origin: req.body.origin,
        context: JSON.stringify(req.body.context)
    }
    try 
    {
        let optin = new model.instance.optin(params);
        await optin.saveAsync();
        await _saveHistory(params, true);

        console.log("optinController:optin -> success", JSON.stringify({params: params}));
        res.status(201).send(optin).end();
    } catch (error) {
        console.log("optinController:optin -> failure", JSON.stringify({params: params, error: error}));
        res.status(400).send({ message: "Ocorreu um erro inesperado"}).end();
    }
}

async function optout(req, res) {
    let params = {
        tenant: model.uuidFromString(req.params.tenant),
        contact: model.uuidFromString(req.params.contact),
        mean_contact: req.params.mean_contact,
        client_id: req.params.client_id
    }

    try {
        await _saveHistory(params, false);
        let optin = await model.instance.optin.findOneAsync(params);
        if (optin){
            await optin.deleteAsync();

            console.log("optinController:optout -> success", JSON.stringify({params: params}));
            res.status(204).end();
        }

        console.log("optinController:optout -> already not at database", JSON.stringify({params: params}));
        res.status(204).end();
    } catch (error) {
        console.log("optinController:optout -> failure", JSON.stringify({params: params, error: error}));
        res.status(400).send({message: "Ocorreu um erro inesperado"}).end();
    }
}

async function _saveHistory(params, status){
    let historyParams = {
        tenant: params.tenant,
        contact: params.contact,
        mean_contact: params.mean_contact,
        client_id: params.client_id
    }
    try {
        console.log("optin", params);
        let optin = await model.instance.optin.findOneAsync(historyParams);
        if (optin){
            historyParams.origin = optin.origin;
            historyParams.context = optin.context;
            historyParams.status = status;
            
            let history = new model.instance.history(historyParams);
            await history.saveAsync();

            console.log("optinController:_saveHistory -> success", JSON.stringify({params: historyParams}));
        }
    } catch (error) {
        console.log("optinController:_saveHistory -> failure", JSON.stringify({params: params, error: error}))
        throw new Error(error);
    }
}


module.exports = {
    getOptins: getOptins,
    getOptinByMeanContact: getOptinByMeanContact,
    getOptinByClient: getOptinByClient,
    optin: optin,
    optout: optout
}