const functions = require('firebase-functions')
const admin = require('firebase-admin')
const firebaseHelper = require('firebase-functions-helper')
const express = require('express')
const bodyParser = require('body-parser')

admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

const app = express()
const main = express()

//redirect url
main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

const contactsCollection = 'contacts';

exports.webApi = functions.https.onRequest(main)

// Add new contact
app.post('/contacts', (req, res) => {
    console.log(req.body)
    firebaseHelper.firestore
        .createNewDocument(db, contactsCollection, req.body);
    res.send('Create a new contact');
})

// Update new contact
app.patch('/contacts/:contactId', (req, res) => {
    firebaseHelper.firestore
        .updateDocument(db, contactsCollection, req.params.contactId, req.body);
    res.send('Update a new contact');
})

// View a contact
app.get('/contacts/:contactId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, contactsCollection, req.params.contactId)
        .then(doc => res.status(200).send(doc));
})

// View all contacts
app.get('/contacts', (req, res) => {
    firebaseHelper.firestore
        .backup(db, contactsCollection)
        .then(data => res.status(200).send(data))
})

// Delete a contact 
app.delete('/contacts/:contactId', (req, res) => {
    firebaseHelper.firestore
        .deleteDocument(db, contactsCollection, req.params.contactId);
    res.send('Contact is deleted');
})

