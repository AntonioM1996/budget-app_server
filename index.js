const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const dbConfig = require("./app/config/db.config");

const app = express();
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