import React, { Component, ChangeEvent } from 'react';
import axios from 'axios';

interface AppState {
  data: { id: number; _id: string; message: string }[];
  message: string | null;
  intervalIsSet: NodeJS.Timeout | null;
  idToDelete: string | null;
  idToUpdate: string | null;
  updateToApply: string | null;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      data: [],
      message: null,
      intervalIsSet: null,
      idToDelete: null,
      idToUpdate: null,
      updateToApply: null,
    };
  }

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      const interval = setInterval(this.getDataFromDb, 1000);
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
      const response = await fetch('http://localhost:3001/api/getData');
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      const res = await response.json();
      this.setState({ data: res.data });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  putDataToDB = async (message: string | null) => {
    const { data } = this.state;
    const currentIds = data.map((item) => item.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      idToBeAdded += 1;
    }

    if (message) {
      try {
        await axios.post('http://localhost:3001/api/putData', {
          id: idToBeAdded,
          message,
        });
        this.getDataFromDb();
      } catch (err) {
        console.error('Failed to add data:', err);
      }
    }
  };

  deleteFromDB = async (idToDelete: string | null) => {
    const { data } = this.state;
    if (idToDelete) {
      const objIdToDelete = data.find(
        (dat) => dat.id === parseInt(idToDelete),
      )?._id;
      if (objIdToDelete) {
        try {
          await axios.delete('http://localhost:3001/api/deleteData', {
            data: { id: objIdToDelete },
          });
          this.getDataFromDb();
        } catch (err) {
          console.error('Failed to delete data:', err);
        }
      }
    }
  };

  updateDB = async (
    idToUpdate: string | null,
    updateToApply: string | null,
  ) => {
    const { data } = this.state;
    if (idToUpdate && updateToApply) {
      const objIdToUpdate = data.find(
        (dat) => dat.id === parseInt(idToUpdate),
      )?._id;
      if (objIdToUpdate) {
        try {
          await axios.post('http://localhost:3001/api/updateData', {
            id: objIdToUpdate,
            update: { message: updateToApply },
          });
          this.getDataFromDb();
        } catch (err) {
          console.error('Failed to update data:', err);
        }
      }
    }
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ [e.target.name]: e.target.value } as unknown as Pick<
      AppState,
      keyof AppState
    >);
  };

  render() {
    const { data, message, idToDelete, idToUpdate, updateToApply } = this.state;
    return (
      <div>
        <ul>
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
                <li style={{ padding: '10px' }} key={dat._id}>
                  <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                  <span style={{ color: 'gray' }}> data: </span> {dat.message}
                </li>
              ))}
        </ul>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            name="message"
            onChange={this.handleChange}
            placeholder="add something in the database"
            style={{ width: '200px' }}
            value={message || ''}
          />
          <button type="button" onClick={() => this.putDataToDB(message)}>
            ADD
          </button>
        </div>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            name="idToDelete"
            style={{ width: '200px' }}
            onChange={this.handleChange}
            placeholder="put id of item to delete here"
            value={idToDelete || ''}
          />
          <button type="button" onClick={() => this.deleteFromDB(idToDelete)}>
            DELETE
          </button>
        </div>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            name="idToUpdate"
            style={{ width: '200px' }}
            onChange={this.handleChange}
            placeholder="id of item to update here"
            value={idToUpdate || ''}
          />
          <input
            type="text"
            name="updateToApply"
            style={{ width: '200px' }}
            onChange={this.handleChange}
            placeholder="put new value of the item here"
            value={updateToApply || ''}
          />
          <button
            type="button"
            onClick={() => this.updateDB(idToUpdate, updateToApply)}
          >
            UPDATE
          </button>
        </div>
      </div>
    );
  }
}

export default App;
