require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})


function searchByProduceName(searchTerm){
knexInstance.
select('product_id', 'name', 'price', 'category')
.from('amazong_products')
.where('name', 'ILIKE', `%${searchTerm}%`)
.then(result => {
    console.log(result)
})
}

function paginateProducts(page) {
    const productPerPage = 10;
    const offset = paginateProducts * (page -1);
    knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .limit(productPerPage)
    .offset(offset)
    .then(result => {
        console.log(result)
    })
}

paginateProducts(2);

function getProductsWithImages(){
    knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .whereNotNull('image')
    .then(result =>{
        console.log(result)
    })
}

getProductsWithImages();

searchByProduceName('holo');

function mostPopularVideosForDays(days){
    knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where('date_viewed', '>', knexInstance.raw(`now()-'?? days'::Interval`, days))
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
        {column: 'region', order: 'ASC'},
        {column: 'views', order: 'DESC'},
    ])
    .then(result =>{
        console.log(result);
    })
}

mostPopularVideosForDays(30);
