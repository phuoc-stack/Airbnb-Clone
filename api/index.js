require('dotenv').config()
const { body, validationResult } = require('express-validator');
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const User = require("./models/User")
const Place = require("./models/Place")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser")
const imageDownloader = require("image-downloader")
const multer = require("multer")
const fs = require("fs")
const Booking = require("./models/Booking")

require('dotenv').config()
const app = express()

const jwtSecret = process.env.JWT_SECRET
const bcryptSalt = bcrypt.genSaltSync(10)

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

mongoose.connect(process.env.MONGO_URL)
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'))
app.get('/test', (req, res) => {
    res.json("test ok")
})

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData)
        })
    })
}

// Validation middleware
const registerValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
];

const placeValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('checkIn').notEmpty().withMessage('Check-in time is required'),
    body('checkOut').notEmpty().withMessage('Check-out time is required'),
    body('maxGuests').isInt({ min: 1 }).withMessage('Maximum guests must be at least 1'),
    body('price').isFloat({ min: 1 }).withMessage('Price must be greater than zero')
];

const bookingValidation = [
    body('checkIn').isISO8601().withMessage('Valid check-in date required'),
    body('checkOut').isISO8601().withMessage('Valid check-out date required')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.checkIn)) {
                throw new Error('Check-out date must be after check-in date');
            }
            return true;
        }),
    body('numberOfGuests').isInt({ min: 1 }).withMessage('At least one guest required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
];

app.post("/register", registerValidation, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        });
        res.json(userDoc)
    } catch (e) {
        res.status(422).json(e)
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email })
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password)
        if (passOk) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id,
            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;

                // Define cookie options with enhanced security
                const cookieOptions = {
                    httpOnly: true,
                    sameSite: 'lax',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                };
                res.cookie('token', token, cookieOptions).json(userDoc)
            })
        } else {
            res.status(422).json('pass not ok')
        }
    } else {
        res.json('not found')
    }
})

app.get("/profile", (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id)
            res.json({ name, email, _id })
        });
    } else {
        res.json(null)
    }
})

app.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'lax',
        expires: new Date(0)
    }).json(true);
});

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body
    const newName = 'photo' + Date.now() + '.jpg'
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName
    });
    res.json(newName)
})

const photosMiddleware = multer({ dest: 'uploads/' })
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = []
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i]
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1]

        // Create a new name for the file
        const newName = 'photo' + Date.now() + (i > 0 ? '_' + i : '') + '.' + ext
        const newPath = __dirname + '/uploads/' + newName

        // Rename from Multer's path to our timestamped path
        fs.renameSync(path, newPath)

        // Push the new filename
        uploadedFiles.push(newName)
    }
    res.json(uploadedFiles)
})

app.post('/places', placeValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.cookies;
    const {
        title, address, addedPhotos, description, extraInfo,
        perks, checkIn, checkOut, maxGuests, price
    } = req.body
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: userData.id, price,
            title, address, photos: addedPhotos, description, extraInfo,
            perks, checkIn, checkOut, maxGuests,
        })
        res.json(placeDoc)
    })
})

app.get('/user-places', (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const { id } = userData
        res.json(await Place.find({ owner: id }))
    })
})

app.get('/places/:id', async (req, res) => {
    const { id } = req.params
    res.json(await Place.findById(id))
})

app.put('/places/', placeValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.cookies;
    const {
        id, title, address, addedPhotos, description, extraInfo,
        perks, checkIn, checkOut, maxGuests, price
    } = req.body
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.findById(id)
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                owner: userData.id,
                title, address, photos: addedPhotos, description, extraInfo,
                perks, checkIn, checkOut, maxGuests, price
            })
            await placeDoc.save()
            res.json("ok")
        }
    })
})

app.get("/places", async (req, res) => {
    res.json(await Place.find())
})

app.post("/bookings", bookingValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userData = await getUserDataFromReq(req)
    const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price
    } = req.body;
    Booking.create({
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
        user: userData.id
    }).then((doc) => {
        res.json(doc)
    }).catch((err) => {
        throw err
    })
})

app.get('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req)
    res.json(await Booking.find({ user: userData.id }).populate('place'))
})

app.get("/search-places", async (req, res) => {
    try {
      const { query, minPrice, maxPrice, perks } = req.query;
      
      // Build the search conditions
      let searchConditions = {};
      
      // Text search in title or address
      if (query) {
        searchConditions.$or = [
          { title: { $regex: query, $options: 'i' } },
          { address: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ];
      }
      
      // Price range
      if (minPrice !== undefined || maxPrice !== undefined) {
        searchConditions.price = {};
        if (minPrice !== undefined) searchConditions.price.$gte = parseInt(minPrice);
        if (maxPrice !== undefined) searchConditions.price.$lte = parseInt(maxPrice);
      }
      
      // Perks/amenities
      if (perks && perks.length) {
        const perksArray = Array.isArray(perks) ? perks : [perks];
        searchConditions.perks = { $all: perksArray };
      }
      
      const places = await Place.find(searchConditions).limit(50);
      res.json(places);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Error searching places", 
        error: error.message 
      });
    }
});
  
app.listen(4001)