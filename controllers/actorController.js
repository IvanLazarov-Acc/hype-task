const knex = require("../database/database");
const fileSystem = require("fs");
const fastcsv = require("fast-csv");
const e = require("express");


const getTableItems = async (req,res) =>{
    let [schema, table, download] = Object.values(req.params);
    if(download===undefined || download.toLowerCase() !== "true"){
        if(schema && table ){
            const information = await knex.withSchema(schema)
            .select('*')
            .from(table);

            res.send(information);
        }else{
            res.sendStatus(404);
        }
    }
    else if(download.toLowerCase() ==="true"){
        download=true;
 
        if(download!==true){
            res.send(`Download should be true`); 
        }
        else if(schema && table ){
            const information = await knex.withSchema(schema)
            .select('*')
            .from(table);
           

 
            if(download){
                const writeStream = fileSystem.createWriteStream(`./files/${table}-information.csv`);
                fastcsv.write(information)
                    .on("finish", ()=>{
                        // res.send(`<a href='./files/${table}-information.csv' download='${table}-information.csv' id='download-link'></a><script>document.getElementById('download-link').click();</script>`)
                        console.log("The file is about to be downloaded");
                    }).pipe(writeStream);
             
                res.download(`./files/${table}-information.csv`);
                }
                else{
                    res.sendStatus(404);
                }

        }
    } 
    
}

const getTableItem = async (req, res) => {

    const [schema, table, id] = Object.values(req.params);
    const requestedId =  parseInt(id);

    if(schema && table){
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
    }else{
        res.sendStatus(404);
    }
    
    
}



const postItem = async (req, res) => {
    
    const [schema, table] = Object.values(req.params);
    const currentDate = new Date();
    
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
    const [schema, table, id] = Object.values(req.params);
    const requestedId =  parseInt(id);

    console.log(schema, table, requestedId);
    if(schema && table){
        if(requestedId === null || requestedId===undefined || isNaN(requestedId)){
            res.sendStatus(404);
            
        }else{
            await knex.withSchema(schema)
            // .from(table).where(`${table}_id`, requestedId).del();
            .where(knex.raw(`DELETE FROM ${table} WHERE ${table}_id=${requestedId}`));
    
        
    
            res.send(`${table}_id ${requestedId} has been deleated from table ${table}!`);
        }
        
            
    }else{
        res.sendStatus(404);  
    }
    
}


module.exports = {
    getTableItems,
    getTableItem,
    postItem,
    updateItemById,
    deleteItemById
}