const knex = require("../database/database");
const fileSystem = require("fs");
const fastcsv = require("fast-csv");
const { resourceLimits } = require("worker_threads");

const getTableItems = async (req, res) => {
    const [schema, table] = Object.values(req.params);
    // const [schema, table, download] = Object.values(req.params);
    // if(typeof download === bool){
    //     res.send(`Download should be true or false`);
    //     return;
    // }
    if(schema && table){
        
        const information = await knex.withSchema(schema)
        .select('*')
        .from(table);
        
 
        // if(download){
        //     const writeStream = fileSystem.createWriteStream(`./files/${table}-information.csv`);
        //     fastcsv.write(information)
        //         .on("finish", ()=>{
        //             res.send(`<a href='./files/${table}-information.csv' download='${table}-information.csv' id='download-link'></a><script>document.getElementById('download-link').click();</script>`)
        //         }).pipe(writeStream);
        // }else{
            res.send(information);
        // }

    }
    else{
        res.sendStatus(404);
    }


}

const getTableItem = async (req, res) => {

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

// const getTableItemByParameters = async (req, res) => {

//     const [schema, table, id, first_name, last_name] = Object.values(req.params);
//     const requestedId =  parseInt(id);

//     if(requestedId === null || requestedId===undefined || isNaN(requestedId)){
//         res.sendStatus(404);
//     }else{  
//         const actor = await knex.withSchema(schema)
//         .select('*')
//         .from(table).where(`${table}_id`, requestedId).andWhere();
//         if(actor){
//             res.send(actor);
//         }else{
//             res.sendStatus(404);
//         }
        
//     }
    
// }

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

const updateItemById = async (req, res) => {
    const [schema, table, id] = Object.values(req.params);
    const requestedId =  parseInt(id);

    const currentDate = new Date();
    if(schema && table){
        const actorForUpdate = {
            [`${table}_id`]:requestedId,
            ...req.body,
            last_update:currentDate
        }
        if(requestedId === null || requestedId===undefined || isNaN(requestedId)){
            res.sendStatus(404);
        
        }else{
            await knex.withSchema(schema)
            .from(table)
            .where(`${table}_id`, requestedId)
            .update(actorForUpdate);

            res.send(`Item with ${table}_id ${requestedId} has been updated!`);
        }

}


}

const deleteItemById = async (req, res) => {
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
    // getTableItemByParameters,
    postItem,
    updateItemById,
    deleteItemById
}