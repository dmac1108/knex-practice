require('dotenv').config()
const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex');

describe('ShoppingListService object', function (){
    let db
    const testData = [
        {
        id: 1,
        name: 'carrots',
        price: '1.99',
        date_added: new Date('2019-01-22T16:28:32.615Z'),
        checked: true,
        category: 'Snack'
    },
    {
        id: 2,
        name: 'hot dogs',
        price: '3.99',
        date_added: new Date('2019-01-30T16:28:32.615Z'),
        checked: true,
        category: 'Main'
    },
    {
        id: 3,
        name: 'potato chips',
        price: '4.99',
        date_added: new Date('2019-01-30T16:28:32.615Z'),
        checked: false,
        category: 'Snack'
    },
];
    before(() =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    beforeEach(() => db('shopping_list').truncate())

    after(()=> db('shopping_list').truncate())

    after(() => db.destroy())

    context(`given 'shopping_list' has data`, ()=>{
        beforeEach(()=>{
            return db
            .into('shopping_list')
            .insert(testData)
        })

        it(`getShoppingList returns all items from 'shopping_list' table`, ()=>{
            return ShoppingListService.getShoppingList(db)
            .then(actual => {
                expect(actual).to.eql(testData)
            })

        })
        it(`getShoppingListItembyId returns the selected item from 'shopping_list' table`, () =>{
            const testItem = testData[1];
            return ShoppingListService.getShoppingListItemById(db,testItem.id)
            .then(actual =>{
                expect(actual).to.eql(testItem)
            })

        })
        it(`updateShoppingListItem returns the updated item from 'shopping_list' table`, () =>{
            const idOfItemToUpdate = 1;
            const updatedItemFields = {
                name: 'organic carrots',
                price: '1.99',
                date_added: new Date('2019-01-22T16:28:32.615Z'),
                checked: false,
                category: 'Snack'
            }
            return ShoppingListService.updateShoppingListItem(db, idOfItemToUpdate, updatedItemFields)
            .then(() =>{
                ShoppingListService.getShoppingListItemById(db, idOfItemToUpdate)
                .then(shoppingItem => {
                    expect(shoppingItem).to.eql({
                        id: idOfItemToUpdate,
                        ...updatedItemFields,
                    })
                })
            })
        })
        it(`deletedShoppingList() removes an article by id from 'shopping_list' table`, () => {
            const shoppingListItemId = 3
            return ShoppingListService.deleteShoppingListItem(db, shoppingListItemId)
            .then(() => ShoppingListService.getShoppingList(db)
            .then(shoppingList => {
                const expected = testData.filter(item => item.id !== shoppingListItemId)
                expect(shoppingList).to.eql(expected)
            }))
        })
    })

    context(`given 'shopping_list' table has no data`, () =>{
            it(`getShoppingList returns an empty array`, ()=>{
                return ShoppingListService.getShoppingList(db)
                .then(actual =>{
                    expect(actual).to.eql([])
                })
            })

            it(`insertShoppingListItem inserts a new shopping list item into 'shopping_list' and resolves the id `, () =>{
                const newShoppingListItem = {
                    name: 'ice cream',
                    price: '4.50',
                    checked: true,
                    category: 'Snack',
                    date_added: new Date('2019-02-30T16:28:32.615Z')
                }
                return ShoppingListService.insertShoppingListItem(db, newShoppingListItem)
                .then(actual =>{
                    expect(actual).to.eql({
                        id: 1,
                        name: newShoppingListItem.name,
                        price: newShoppingListItem.price,
                        checked: newShoppingListItem.checked,
                        category: newShoppingListItem.category,
                        date_added: newShoppingListItem.date_added
                    })
                }
                  
                )
            })
        })


    
    

    
})