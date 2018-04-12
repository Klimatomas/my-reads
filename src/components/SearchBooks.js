import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import * as BookAPI from "../BooksAPI";
import Book from "./Book";

class SearchBooks extends Component {
  state = {
    query: "",
    searchedBooks: []
  };

  updateQuery = query => {
    this.setState(() => ({
      query
    }));
    if (!query) {
      this.setState(() => ({
        searchedBooks: []
      }));
      return;
    }
    BookAPI.search(query).then(books => {
      this.setState(() => ({
        searchedBooks:
          !books || books.error === "empty query"
            ? []
            : this.mergeSearchResultWithBooks(books)
      }));
    });
  };

  mergeSearchResultWithBooks = searchResults =>
    searchResults.map(res => {
      const book = this.props.books.find(bk => res.id === bk.id);
      if (book) res.shelf = book.shelf;
      return res;
    });

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={this.state.query}
              onChange={e => this.updateQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {this.state.searchedBooks.map(book => (
              <li key={book.id}>
                <Book book={book} onUpdateShelf={this.props.onUpdateShelf} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

SearchBooks.propTypes = {
  onUpdateShelf: PropTypes.func.isRequired,
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      authors: PropTypes.arrayOf(PropTypes.string),
      shelf: PropTypes.string,
      imageLinks: PropTypes.shape({
        thumbnail: PropTypes.string,
        smallThumbnail: PropTypes.string
      })
    }).isRequired
  ).isRequired
};

export default SearchBooks;
