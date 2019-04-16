import React, { Component } from 'react'
import ReactQuill from 'react-quill'
import socket from '../utils/socket'
import { SOURCE_USER } from '../utils/constant'
import { offset as Offset } from 'caret-pos';
import 'react-quill/dist/quill.snow.css'

import Caret from './caret'

export default class QuillEditor extends Component {
    constructor(props){
        super(props)
        this.state = { 
            carets: [],
            interval: null,
            changes: []
        } // You can also pass a Quill Delta here
        this.quillReference = React.createRef();

        this.handleChange = this.handleChange.bind(this)
        this.updateContents = this.updateContents.bind(this)
        this.selectionChange = this.selectionChange.bind(this)
        this.caretChange = this.caretChange.bind(this)
        this.isNewUser = this.isNewUser.bind(this)
        this.insertCaret = this.insertCaret.bind(this)
        this.updateCaret = this.updateCaret.bind(this)
        this.emitChanges = this.emitChanges.bind(this)
        

        socket.on('update', this.updateContents)
        socket.on('caret change', this.caretChange)
    }

    isNewUser(newCaret, carets){
        var isNewUser = true
        for(var index = 0; index < carets.length; index++){
            var caret = carets[index]
            if(caret.socket === newCaret.socket){
                isNewUser = false
                break
            }
        }
        return isNewUser
    }

    insertCaret(newCaret, carets){
        carets.push(newCaret)
        this.setState({
            carets: carets
        })
    }

    updateCaret(newCaret, carets){
        for(var index = 0; index < carets.length; index++){
            var caret = carets[index]
            if(caret.socket === newCaret.socket){
                caret.position = newCaret.position
                break
            }
        }
        this.setState({
            carets: carets
        })
    }

    caretChange(newCaret){
        var carets = this.state.carets;
        var isNewUser = this.isNewUser(newCaret, carets)
        if(isNewUser === true){
            this.insertCaret(newCaret, carets)
        } else {
            this.updateCaret(newCaret, carets)
        }
    }

    updateContents(changes){
        var editor = this.quillReference.current.getEditor()
        console.log(changes)
        changes.forEach(change => {
            editor.updateContents(change)
        });
    }

    emitChanges(){
        socket.emit('update', this.state.changes)
        this.setState({
            changes: []
        })
    }

    handleChange(value, change, source) { 
        if(SOURCE_USER === source){
            var changes = this.state.changes
            changes.push(change)
            this.setState({
                changes
            })
            clearTimeout(this.state.interval);
            this.state.interval = setTimeout(this.emitChanges, 500)
        }
    }

    selectionChange(){
        const editorClass = '.ql-editor'
        const editor = document.querySelector(editorClass)
        const offset = Offset(editor)
        socket.emit('caret change', {
            position: offset
        })
    }

    render() {
        return (
            <div>
                <ReactQuill
                    ref={ this.quillReference }
                    onChange={ this.handleChange } 
                    onChangeSelection={ this.selectionChange }
                />
                <Caret carets={ this.state.carets }/>
            </div>
        )
    }
}