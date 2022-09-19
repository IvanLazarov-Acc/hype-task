const knex = require("../database/database");

const getActors = async (req, res) => {
    const actors = await knex.withSchema('mystore')
    .select('*')
    .from('actor');
    
    res.send(actors);
}

const getActorById = async (req, res) => {
    //Check after email returned console.log(req);
    const requestedId = req.params.id;

    if(requestedId === null || requestedId===undefined){
        res.sendStatus(404);
    }else{
        const actor = await knex.withSchema('mystore')
        .select('*')
        .from('actor').where("actor_id", requestedId);
        if(actor){
            res.send(actor);
        }else{
            res.sendStatus(404);
        }
        
    }
    
}

const postActor = async (req, res) => {
    const {firstName, lastName} = req.body;
    const currentDate = new Date();
    
    console.log(req.body);

    const idCount = await knex.withSchema('mystore')
    .count("actor_id")
    .from('actor');
    let nextId = parseInt(idCount[0].count)+1;
    console.log(nextId);

    const actorForDb = {
        actor_id:nextId,
        first_name:firstName,
        last_name:lastName,
        last_update:currentDate
    }

    await knex.withSchema('mystore').insert(actorForDb).into("actor");

    res.send(`Actor with Name ${firstName} ${lastName} have been added to the database!`);
}

const updateActorById = async (req, res) => {
    const requestedId = req.params.id;
    const currentDate = new Date();
    const {firstName, lastName} = req.body;

    const actorForUpdate = {
        actor_id:requestedId,
        first_name:firstName,
        last_name:lastName,
        last_update:currentDate
    }

    await knex.withSchema('mystore')
        .from('actor')
        .where("actor_id", requestedId)
        .update(actorForUpdate, ["actor_id", "first_name", "last_name", "last_update"]);

        res.send(`Actor with actor_id ${requestedId} has been updated!`);
}

const deleteActorById = async (req, res) => {
    const requestedId = req.params.id;

    await knex.withSchema('mystore')
        .from('actor').where("actor_id", requestedId).del();

    res.send(`Actor with actor_id ${requestedId} has been deleated!`);
}


module.exports = {
    getActors,
    getActorById,
    postActor,
    updateActorById,
    deleteActorById
}