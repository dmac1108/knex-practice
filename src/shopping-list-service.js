const ShoppingListService = {
    getShoppingList(knex){
        return knex
        .select('*')
        .from('shopping_list')
    },
    insertShoppingListItem(knex,item){
        return knex
        .insert(item)
        .into('shopping_list')
        .returning('*')
        .then(rows =>{
        return rows[0]})
    },
    getShoppingListItemById(knex,testId){
        return knex
        .select('*')
        .from('shopping_list')
        .where('id', testId)
        .first()
    },
    updateShoppingListItem(knex,id,items){
        return knex('shopping_list')
        .where({id})
        .update(items)
    },
    deleteShoppingListItem(knex,id){
        return knex('shopping_list')
        .where({ id })
        .delete()
    }

}

module.exports = ShoppingListService;