/**
 * Database Interface
 *
 */
var databaseInterface = {
    //crud
    save: function save() {
        throw new Error('.save() method not implemented.');
    },
    get: function get() {
        throw new Error('.get() method not implemented.');
    },
    remove: function del() {
        throw new Error('.delete() method not implemented.');
    }, 
    //chainable query
    query: function query(collectionName) {

        return {

            all: function all() {
                throw new Error('.query().all() method not implemented.');
            },

            count: function count() {
                throw new Error('.query().count() method not implemented.');
            },

            filter: function filter() {
                throw new Error('.query().filter() method not implemented.');
            },

            first: function first() {
                throw new Error('.query().first() method not implemented.');
            },

            pagination: function pagination() {
                throw new Error('.query().pagination() method not implemented.');
            },

            update: function update() {
                throw new Error('.query().update() method not implemented.');
            }
            

        }

    }

};

module.exports = databaseInterface;