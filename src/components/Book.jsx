function Book({name,publicationYear,author,available}){

    return <div className="p-3">
      <img src="/photo.jpg" className="rounded" alt="Description of the image" />
        <div>
          {name}{`(${publicationYear})`}
        </div>
        <div>
          Author: {author}
        </div>
        <div>
          Availble: {available}
        </div>
    </div>
}

export default Book;