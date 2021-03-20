const NotesService = {
    getAllNotes(knex) {
        console.log(knex)
        return knex.select('*').from('noteful_notes')
    },
    addNote(knex, newNote) {
        console.log("NEW Note")
        console.log(newNote)
        return knex
        .insert(newNote)
        .into('noteful_notes')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deleteNote(knex, id) {
        console.log(id)
        return knex('noteful_notes')
        .where({ id })
        .delete()
    }
}

module.exports = NotesService