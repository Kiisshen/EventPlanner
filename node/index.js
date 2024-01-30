require('dotenv').config();

var Express = require("express");
var cors = require("cors")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const uuid4 = require("uuid4");

var app = Express();

app.use(cookieParser());
app.use(cors({
    credentials: true,
    exposedHeaders:["Authorization"]
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(Express.json());

app.listen(5038, () => {
    console.log("Server is running on port 5038");
});

const CONNECTION_STRING = 'mongodb+srv://Kiisshhen:password@kiisshensolutions.a3jvdbj.mongodb.net/PlanTogether?retryWrites=true&w=majority';
mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var database = mongoose.connection;
database.on('error', () => console.log("error in connecting database"));
database.once('open', () => console.log("Connected to Database"));

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    }
});
const UserModel = mongoose.model("users", userSchema);

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },
    eventOrganizerID: {
        type: String,
        required: true,
    },
    eventOrganizerName: {
        type: String,
        required: true,
    },
    eventID: {
        type: String,
        required: true,
    },
    eventDescription: {
        type: String,
        required: true,
    },
    participants: {
        type: Array,
        required: true,
    }
});
const EventModel = mongoose.model("events", eventSchema);

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

app.post("/login", async (request, response) => {
    try {
        const { username, password } = request.body;
        const user = await UserModel.findOne({ userName: username })

        if(user.userName != null && user.password === password){
            const accessToken = jwt.sign(user.userID, process.env.ACCESS_TOKEN)
            response.json({ success: true, cookie: accessToken });
        }
        else{
            response.status(401).json({ success: false, error: 'Virheellinen salasana tai käyttäjätunnus' });
        }
    }
    catch (error) {
        response.status(401).json({ success: false, error: 'Virheellinen salasana tai käyttäjätunnus' });
    }
})

app.post('/adduser', async (request, response) => {
    try{        
        const {name, pass} = request.body
        const existingUsers = await UserModel.find({userName: name})
        if (existingUsers.length > 0){
            throw new Error("User already exists");
        }
        const user = {
            userName: name,
            password: pass,
            userID: uuid4()
        };
        const newuser = await UserModel.insertMany(user);
        response.json({success: true, user: newuser})
    }
    catch (error){
        response.json({success: false, err: error})
    }
})

app.get('/getevents', authenticateToken, async (request, response) => {
    try {
        const events = await EventModel.find({});
        const user = await UserModel.findOne( {userID: request.user} )
        response.json({events: events, ownID: request.user, username: user.userName});
    } catch (error) {
        console.error("Error fetching events:", error);
    };
})

app.post('/addEvent', authenticateToken, async (request, response) => {
    console.log(request.user)
    try {
        const { eventName, eventDesc} = request.body;
        const organizerName = await UserModel.findOne({userID: request.user})
        const event = {
            eventName: eventName,
            eventOrganizerID: request.user,
            eventOrganizerName: organizerName.userName,
            eventID: uuid4(),
            eventDescription: eventDesc,
            participants: []
        };
        const newevent = await EventModel.insertMany(event);
        response.json({success: true})
    }
    catch (error){
        response.json({success: false, error})
    }
})

app.post('/addparticipant', authenticateToken, async (request, response) => {
    try {
        const {eventID} = request.body;
        const event = await EventModel.findOne({ eventID: eventID });
        const user = await UserModel.findOne({ userID: request.user });
    
        event.participants.push(user.userName);
    
        await event.save();
    
        response.json({success: true})
    }
    catch (error){
        response.json({success: false, error})
    }
})

app.post('/removeparticipant', authenticateToken, async (request, response) => {
    try {
        const { eventID } = request.body;
        const event = await EventModel.findOne({ eventID: eventID });
        const user = await UserModel.findOne({ userID: request.user });
        const participantIndex = event.participants.indexOf(user.userName);
    
        if (participantIndex !== -1) {
            event.participants.splice(participantIndex, 1);
            await event.save();
            response.json({success: true})
        } 
        else {
            response.json({success: false})
        }
    }
    catch (error) {
        response.json({success: false})
    }
});

app.post('/deleteevent', authenticateToken, async (request, response) => {
    try {
        const { eventID } = request.body;
        const event = await EventModel.findOneAndDelete({ eventID: eventID });
        if(event){
            response.json({success: true})
        }
        else {
            response.json({success: false})
        }
    }
    catch (error){
        console.log(error)
        response.json({success: false})
    }
})
