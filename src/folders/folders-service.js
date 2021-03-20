const FoldersService = {
    getAllFolders(knex) {
        console.log(knex)
        return knex.select('*').from('noteful_folders')
    },
    addFolder(knex, newFolder) {
        return knex
        .insert(newFolder)
        .into('noteful_folders')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deleteFolder(knex, id) {
        console.log(id)
        return knex('noteful_folders')
        .where({ id })
        .delete()
    }
}

module.exports = FoldersService