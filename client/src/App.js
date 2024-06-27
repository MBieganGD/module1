import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    updateToApply: null,
  };

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/getData");
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const res = await response.json();
      this.setState({ data: res.data });
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  putDataToDB = async (message) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    try {
      await axios.post("http://localhost:3001/api/putData", {
        id: idToBeAdded,
        message: message,
      });
      this.getDataFromDb(); // Refresh data after addition
    } catch (err) {
      console.error("Failed to add data:", err);
    }
  };

  deleteFromDB = async (idToDelete) => {
    let objIdToDelete = null;
    this.state.data.forEach((dat) => {
      if (dat.id === idToDelete) {
        objIdToDelete = dat._id;
      }
    });

    try {
      await axios.delete("http://localhost:3001/api/deleteData", {
        data: {
          id: objIdToDelete,
        },
      });
      this.getDataFromDb(); // Refresh data after deletion
    } catch (err) {
      console.error("Failed to delete data:", err);
    }
  };

  updateDB = async (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach((dat) => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    try {
      await axios.post("http://localhost:3001/api/updateData", {
        id: objIdToUpdate,
        update: { message: updateToApply },
      });
      this.getDataFromDb(); // Refresh data after update
    } catch (err) {
      console.error("Failed to update data:", err);
    }
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <ul>
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map((dat) => (
                <li style={{ padding: "10px" }} key={dat._id}>
                  <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                  <span style={{ color: "gray" }}> data: </span>
                  {dat.message}
                </li>
              ))}
        </ul>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            onChange={(e) => this.setState({ message: e.target.value })}
            placeholder="add something in the database"
            style={{ width: "200px" }}
          />
          <button onClick={() => this.putDataToDB(this.state.message)}>
            ADD
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={(e) => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={(e) => this.setState({ idToUpdate: e.target.value })}
            placeholder="id of item to update here"
          />
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={(e) => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of the item here"
          />
          <button
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
          </button>
        </div>
      </div>
    );
  }
}

export default App;
