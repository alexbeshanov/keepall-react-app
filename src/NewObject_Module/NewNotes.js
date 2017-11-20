import React from "react";
import "../style/NewPassword.css";
import "../style/login.css";
import {saveNotesFirebase} from "../Save-Remove/saveNotesFirebase";
import {keepalldatabase} from "../Auth/firebaseConfig";
import {updateNotesFirebase} from "../Save-Remove/updateFirebase";
import {removeFirebaseNotesOne} from "../Save-Remove/removeFirebase";
import {key_gost} from "../Auth/userlogin";
import {ClassGost} from "../gost";

export class NewNotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            valueNameTitle: "",
            valueTextArea: "",
            checkButtonFlag1: false,
            checkButtonFlag2: false,
            prevTitle: "",
            linkData: "",
            saveTag: this.props.location.state.saveTag
        };
    };

    checkNameTitle = (event) => {
        event.target.value = event.target.value.replace(/[^A-Za-zА-Яа-яЁё\s\w\d]/g, '');
        this.setState({valueNameTitle: event.target.value});
        (event.target.value.length < 2) ? this.setState({checkButtonFlag1: false}) : this.setState({checkButtonFlag1: true});
    };
    checkTextArea = (event) => {
        this.setState({valueTextArea: event.target.value});
        (event.target.value.length === 0) ? this.setState({checkButtonFlag2: false}) : this.setState({checkButtonFlag2: true});
    };
    saveNotes = (event) => {
        event.preventDefault();
        if (this.state.saveTag === true) {
            if((this.state.valueNameTitle !== "")&&(this.state.valueTextArea !== "")){
                updateNotesFirebase(
                    this.state.valueNameTitle,
                    this.state.valueTextArea,
                    this.state.prevTitle
                );
                this.props.history.push('/firstpage/notes/');
            }
            else alert("Поля не могут быть пустыми!");
        } else {
            if ((this.state.checkButtonFlag1 === true) && (this.state.checkButtonFlag2 === true)) {
                saveNotesFirebase(
                    this.state.valueNameTitle,
                    this.state.valueTextArea
                );
                this.props.history.push('/firstpage/notes/')
            }
            else alert("Заполните все поля!");
        }
    };
    deleteOne = (event) => {
        event.preventDefault();
        if (this.state.saveTag === true) {
            removeFirebaseNotesOne(this.state.prevTitle);
        }
        this.props.history.push('/firstpage/notes/');
    };

    componentDidMount() {
        if (this.state.saveTag === true) {
            const db1 = keepalldatabase.ref().child("users");
            const db2 = db1.child(localStorage.getItem("USERNAME"));
            const db3 = db2.child("notes");
            const db4 = db3.child(this.props.location.state.linkData);
            const newUser = db4.child("NewName");
            var gost = new ClassGost();
            newUser.on("value", snap => {
                this.setState({
                    valueNameTitle: (gost.Decode(snap.val(), key_gost)).replace(/[^\w\dА-Яа-яЁё\s]/g, ''),
                    prevTitle: (gost.Decode(snap.val(), key_gost)).replace(/[^\w\dА-Яа-яЁё\s]/g, '')
                })
            });
            const newPassword = db4.child("NewText");
            newPassword.on("value", snap => {
                this.setState({
                    valueTextArea: gost.Decode(snap.val(), key_gost).replace(/[^\w\dА-Яа-яЁё\s~`!@#$%^&*()_+-={}:";'<>?]/g, '')
                })
            });
        }
    };

    render() {
        return (
            <div className="newpassword">
                <div className="newpassword-size">
                    <div className="newpassword-size_form">
                        <form onSubmit={this.saveNotes}
                              className="newpassword-size_form_style">
                            <h1>Новая заметка</h1>
                            <input value={this.state.valueNameTitle}
                                   name="nametitle"
                                   className="form-autentification__input form-autentification-style"
                                   type="text"
                                   maxLength="120"
                                   autoComplete="off"
                                   placeholder="Название заметки"
                                   onInput={this.checkNameTitle}
                                   onChange={this.checkNameTitle}/>
                            <textarea value={this.state.valueTextArea}
                                      name="textarea"
                                      className="form-autentification__input form-autentification-style"
                                      type="text"
                                      autoComplete="off"
                                      placeholder="Текст заметки"
                                      onInput={this.checkTextArea}
                                      onChange={this.checkTextArea}/>
                            <button type="submit"
                                    value="Submit"
                                    className={(((this.state.checkButtonFlag1) && (this.state.checkButtonFlag2)) || (this.state.saveTag)) ? "form-autentification form-autentification-style form-button__modificate" : "form-autentification form-autentification-style"}>
                                <p>Сохранить</p></button>
                            <button type="submit"
                                    disabled={!(this.state.saveTag)}
                                    className={(this.state.saveTag) ? "form-autentification form-autentification-style form-button__modificate_delete" : "form-autentification form-autentification-style form-button__modificate_delete2"}
                                    onClick={this.deleteOne}>
                                <h3>Удалить</h3></button>
                        </form>
                    </div>
                </div>
            </div>
        )
    };
}

export default NewNotes;