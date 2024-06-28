import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import axios from 'axios';
class App extends Component {
    constructor(props) {
        super(props);
        this.getDataFromDb = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/getData');
                if (!response.ok) {
                    throw new Error(`Network response was not ok ${response.statusText}`);
                }
                const res = await response.json();
                this.setState({ data: res.data });
            }
            catch (err) {
                console.error('Failed to fetch data:', err);
            }
        };
        this.putDataToDB = async (message) => {
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
                }
                catch (err) {
                    console.error('Failed to add data:', err);
                }
            }
        };
        this.deleteFromDB = async (idToDelete) => {
            const { data } = this.state;
            if (idToDelete) {
                const objIdToDelete = data.find((dat) => dat.id === parseInt(idToDelete))?._id;
                if (objIdToDelete) {
                    try {
                        await axios.delete('http://localhost:3001/api/deleteData', {
                            data: { id: objIdToDelete },
                        });
                        this.getDataFromDb();
                    }
                    catch (err) {
                        console.error('Failed to delete data:', err);
                    }
                }
            }
        };
        this.updateDB = async (idToUpdate, updateToApply) => {
            const { data } = this.state;
            if (idToUpdate && updateToApply) {
                const objIdToUpdate = data.find((dat) => dat.id === parseInt(idToUpdate))?._id;
                if (objIdToUpdate) {
                    try {
                        await axios.post('http://localhost:3001/api/updateData', {
                            id: objIdToUpdate,
                            update: { message: updateToApply },
                        });
                        this.getDataFromDb();
                    }
                    catch (err) {
                        console.error('Failed to update data:', err);
                    }
                }
            }
        };
        this.handleChange = (e) => {
            this.setState({ [e.target.name]: e.target.value });
        };
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
    render() {
        const { data, message, idToDelete, idToUpdate, updateToApply } = this.state;
        return (_jsxs("div", { children: [_jsx("ul", { children: data.length <= 0
                        ? 'NO DB ENTRIES YET'
                        : data.map((dat) => (_jsxs("li", { style: { padding: '10px' }, children: [_jsx("span", { style: { color: 'gray' }, children: " id: " }), " ", dat.id, " ", _jsx("br", {}), _jsx("span", { style: { color: 'gray' }, children: " data: " }), " ", dat.message] }, dat._id))) }), _jsxs("div", { style: { padding: '10px' }, children: [_jsx("input", { type: "text", name: "message", onChange: this.handleChange, placeholder: "add something in the database", style: { width: '200px' }, value: message || '' }), _jsx("button", { type: "button", onClick: () => this.putDataToDB(message), children: "ADD" })] }), _jsxs("div", { style: { padding: '10px' }, children: [_jsx("input", { type: "text", name: "idToDelete", style: { width: '200px' }, onChange: this.handleChange, placeholder: "put id of item to delete here", value: idToDelete || '' }), _jsx("button", { type: "button", onClick: () => this.deleteFromDB(idToDelete), children: "DELETE" })] }), _jsxs("div", { style: { padding: '10px' }, children: [_jsx("input", { type: "text", name: "idToUpdate", style: { width: '200px' }, onChange: this.handleChange, placeholder: "id of item to update here", value: idToUpdate || '' }), _jsx("input", { type: "text", name: "updateToApply", style: { width: '200px' }, onChange: this.handleChange, placeholder: "put new value of the item here", value: updateToApply || '' }), _jsx("button", { type: "button", onClick: () => this.updateDB(idToUpdate, updateToApply), children: "UPDATE" })] })] }));
    }
}
export default App;
