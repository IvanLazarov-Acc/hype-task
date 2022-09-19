const knex = require("../database/database");

const getTableItems = async (req, res) => {
    const [schema, table] = Object.values(req.params);
    const information = await knex.withSchema(schema)
    .select('*')
    .from(table);
    
    res.send(information);
}

const getTableItem = async (req, res) => {
    //Check after email returned console.log(req);
    const [schema, table, id] = Object.values(req.params);
    const requestedId =  parseInt(id);

    console.log(schema, table, typeof requestedId);
    if(requestedId === null || requestedId===undefined || isNaN(requestedId)){
        res.sendStatus(404);
    }else{  
        const actor = await knex.withSchema(schema)
        .select('*')
        .from(table).where(`${table}_id`, requestedId);
        if(actor){
            res.send(actor);
        }else{
            res.sendStatus(404);
        }
        
    }
    
}

const postItem = async (req, res) => {
    
    const [schema, table] = Object.values(req.params);
    const currentDate = new Date();
    
    console.log(req.body);
    if(schema && table){
        const idCount = await knex.withSchema(schema)
        .count(`${table}_id`)
        .from(table);
        let nextId = parseInt(idCount[0].count)+5;
        // // let nextId = currentDate.getTime();
        // console.log(nextId);


       if(idCount == nextId){
        res.send(`The Id is already used, please chose another Id`);
       }else{
        const itemForDb = {
            [`${table}_id`]:nextId,
            ...req.body,
            last_update:currentDate
        }
        
       
    
        await knex.withSchema(schema).insert(itemForDb).into(table);
    
        res.send(`New Item with id - ${nextId} have been added in table ${table} to the database!`);
       }
    
 
    }else{
        res.sendStatus(404);
    }


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
    if(requestedId === null || requestedId===undefined || typeof requestedId !== typeof number){
        res.sendStatus(404);
        return;
    }
    await knex.withSchema('mystore')
        .from('actor')
        .where("actor_id", requestedId)
        .update(actorForUpdate, ["actor_id", "first_name", "last_name", "last_update"]);

        res.send(`Actor with actor_id ${requestedId} has been updated!`);
}

const deleteActorById = async (req, res) => {
    const [schema, table, requestedId] = Object.values(req.params);
    console.log(schema, table, requestedId);
    if(requestedId === null || requestedId===undefined || typeof requestedId !== typeof number){
        res.sendStatus(404);
        return;
    }
    if(table === "address"){
        await knex.withSchema(schema)
        .from(table).where(`${table}_id`, requestedId).using(table).whereRaw(`${table}.${table}_id = customer.${table}_id`).del();
    }else{
        await knex.withSchema(schema)
        .from(table).where(`${table}_id`, requestedId).del();
    }
    

    res.send(`${table}_id ${requestedId} has been deleated from table ${table}!`);
}


module.exports = {
    getTableItems,
    getTableItem,
    postItem,
    updateActorById,
    deleteActorById
}