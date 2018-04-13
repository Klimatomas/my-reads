import React, { Component } from "react";
import { Route } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import ListShelves from "./components/ListShelves";
import SearchBooks from "./components/SearchBooks";

class BooksApp extends Component {
  state = {
    books: [],
    isLoading: true
  };

  componentDidMount() {
    BooksAPI.getAll().then(books => {
      this.setState(() => ({
        books,
        isLoading: false
      }));
    });
  }

  updateShelf = (book, shelf) => {
    if (!shelf) return;
    BooksAPI.update(book, shelf).then(() => {
      this.setState(currentState => ({
        books: [
          ...currentState.books.filter(bk => bk.id !== book.id),
          {
            ...book,
            shelf
          }
        ]
      }));
    });
  };

  render() {
    return (
      <div className="app">
        <Route
          exact
          path="/"
          render={() => (
            <ListShelves
              onUpdateShelf={this.updateShelf}
              books={this.state.books}
              isLoading={this.state.isLoading}
            />
          )}
        />
        <Route
          exact
          path="/search"
          render={() => (
            <SearchBooks
              onUpdateShelf={this.updateShelf}
              books={this.state.books}
            />
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
