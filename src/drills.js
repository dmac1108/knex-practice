require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})

function getAllItemsWithText(searchTerm){
knexInstance
.select('*')
.from('shopping_list')
.where('name', 'ILIKE', `%${searchTerm}%`)
.then(result=>{
    console.log(result)
})
}

getAllItemsWithText('loin');

function getAllItemsPaginated(pageNumber){
const itemsPerPage = 6;
const offset = itemsPerPage * (pageNumber-1);
knexInstance
.select('*')
.from('shopping_list')
.limit(itemsPerPage)
    .offset(offset)
    .then(result => {
        console.log(result)
    })


}

getAllItemsPaginated(3);

function getAllItemsCreatedAfter(daysAgo){
knexInstance
.select('*')
.from('shopping_list')
.where('date_added', '>', knexInstance.raw(`now()-'?? days'::Interval`, daysAgo))
.then(result=>{
    console.log(result);
})
}

getAllItemsCreatedAfter(3);

function getTotalCostByCategory(){
knexInstance
.select('category')
.sum('price AS totalprice')
.from('shopping_list')
.groupBy('category')
.then(result=>{
    console.log(result);
})

}

getTotalCostByCategory();