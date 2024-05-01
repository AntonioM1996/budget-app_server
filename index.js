const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");

const app = express();
const firebaseApp = initializeApp({
    credential: applicationDefault()
});
const Role = db.role;

var corsOptions = {
    origin: "http://localhost:19000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// require('./app/routes/auth.routes')(app);

function initial() {
    Role.estimatedDocumentCount().then(result => {
        if (result === 0) {
            new Role({
                name: "user"
            }).save();

            new Role({
                name: "moderator"
            }).save();

            new Role({
                name: "admin"
            }).save();
        }
    });

    // TEST INSERT USER IN FIREBASE

    /* getAuth().createUser({
        email: 'user@example.com',
        emailVerified: false,
        phoneNumber: '+11234567890',
        password: 'secretPassword',
        displayName: 'John Doe',
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false
    }).then(userRecord => {
        console.log("NEW USER -- " + userRecord.uid);
    }).catch((error) => {
        console.log('Error creating new user:', error);
    }); */
}

db.mongoose
    .connect(`mongodb+srv://${dbConfig.USERNAME}:${dbConfig.PASSWORD}@cluster0.ubi3i.mongodb.net/budget-app?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => {
        console.log("Successfully connected to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// simple route
app.get("/", (req, res) => {
    res.json({ message: "S I U M" });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});