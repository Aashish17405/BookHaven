const zod=require('zod');

const createBook = zod.object({
    name:zod.string(),
    available:zod.number(),
    author:zod.string(),
    publicationYear:zod.number(),
})

module.exports = createBook;