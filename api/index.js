const express=require("express")
const cors=require("cors")
const { default: mongoose } = require("mongoose")
const User = require("./models/User")
const Place=require("./models/Place")
const bcrypt = require("bcryptjs")
const jwt=require('jsonwebtoken')
const cookieParser=require("cookie-parser") //used to parse cookie header values from http request and make them available under req.cookies
const imageDownloader=require("image-downloader")
const multer=require("multer")
const fs=require("fs")
const Booking = require("./models/Booking")

require('dotenv').config() //add dotenv file
const app=express() //for endpoints

const bcryptSalt=bcrypt.genSaltSync(10) //did not work before when only genSalt because it is await
//a secret key used to sign the token
const jwtSecret='abcddd'

app.use(express.json()) //need to parse incoming request with json payload to make parsed data available under req.body property 
app.use(cors({
    credentials:true,
    origin:'http://localhost:5173' //so that we could link backend with front end
}))

mongoose.connect(process.env.MONGO_URL)
app.use(cookieParser())
app.use('/uploads',express.static(__dirname+'/uploads'))
app.get('/test',(req,res)=>{
    res.json("test ok")
})

//
function getUserDataFromReq(req){
    return new Promise((resolve,reject)=>{
        jwt.verify(req.cookies.token,jwtSecret,{},async (err,userData)=>{
            if (err) throw err;
            resolve(userData)
        })
    })
}

app.post("/register", async (req,res)=>{
    const {name,email,password}=req.body //get data from request
    try {
        const userDoc=await User.create({
            name,
            email,
            password:bcrypt.hashSync(password,bcryptSalt) //encrypt password
        });
        res.json(userDoc)
    } catch (e) {
        res.status(422).json(e)
    }
})

app.post("/login", async(req,res)=>{
    const {email,password}=req.body;
    const userDoc=await User.findOne({email})
    if (userDoc){
        const passOk=bcrypt.compareSync(password,userDoc.password) //validate password
        if (passOk){
            //generate a JWT token with user details as payload
            jwt.sign({
                email:userDoc.email,
                id:userDoc._id,
                 // name:userDoc.name need to grab the name 1:45 to present the data in the avatar but another way is to get it from id
            },jwtSecret, {}, (err,token)=>{
                //if there is an error during token generation, the error is thrown, stopping further execution
                if (err) throw err;
                //set the generated jwt cookie as a cookie named "token"
                res.cookie('token',token).json(userDoc) //1:33 change to userDoc instead of just pass ok
            })
        } else {
            res.status(422).json('pass not ok')
        }
    } else {
        res.json('not found')
    }
})

app.get("/profile",(req,res)=>{
    const {token}=req.cookies; //extract token from cookies sent with request
    if (token){ //check if a token is present in the cookies
        jwt.verify(token,jwtSecret,{},async (err,userData)=>{//verify the token using secret key jwtSecret
            if (err) throw err;
            const {name,email,_id}=await User.findById(userData.id) //fetch the data from mongoose using id. userData is limited to info encoded into jwt, userDoc includes comprehensive data stored in the databse
            res.json({name,email,_id}) //*user will contain decoded info //at first userDoc only includes all info, exclude pwd and only include id, name and email
        });
    } else {
        res.json(null)
    }
})

app.post('/logout', (req,res)=>{
    res.cookie('token','').json(true)
})

app.post('/upload-by-link',async (req,res)=>{
    const {link}=req.body
    const newName='photo'+Date.now()+'.jpg'
    await imageDownloader.image({
        url:link,
        dest: __dirname+'/uploads/'+newName
    });
    res.json(newName)
})

const photosMiddleware=multer({dest:'uploads/'})
app.post('/upload', photosMiddleware.array('photos',100),(req,res)=>{
    const uploadedFiles=[]
    for (let i=0;i<req.files.length;i++){
        const {path,originalname}=req.files[i]
        const parts=originalname.split('.')
        const ext=parts[parts.length-1]
        const newPath=path+'.'+ext
        fs.renameSync(path,newPath)
        uploadedFiles.push(newPath.replace('uploads\\', '').replace('uploads/', ''))
    }
    res.json(uploadedFiles)
})

app.post('/places', (req,res)=>{
    const {token}=req.cookies; //extract token from cookies sent with request
    const {
        title,address,addedPhotos,description,extraInfo,
        perks,checkIn,checkOut,maxGuests,price
    }=req.body
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{//verify the token using secret key jwtSecret
        if (err) throw err;
        const placeDoc=await Place.create({
            owner:userData.id,price,
            title,address,photos:addedPhotos,description,extraInfo,
            perks,checkIn,checkOut,maxGuests,
    })
    res.json(placeDoc)
    })
})

app.get('/user-places',(req,res)=>{
    const {token}=req.cookies
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        const {id}=userData //shorthand for const id=userData.id
        res.json(await Place.find({owner:id}))
    })
})

app.get('/places/:id',async (req,res)=>{
    const {id}=req.params
    res.json(await Place.findById(id)) //dont need info about owner 
})

app.put('/places/',async(req,res)=>{
    // const {id}=req.params //at first it is here and :id in put but he realized that we grabbed it in placeData
    const {token}=req.cookies; //extract token from cookies sent with request
    const {
        id,title,address,addedPhotos,description,extraInfo,
        perks,checkIn,checkOut,maxGuests,price
    }=req.body
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        if (err) throw err;
        const placeDoc=await Place.findById(id) 
        if (userData.id===placeDoc.owner.toString()){ //does not work first as .owner is an object cant compare with string 
            placeDoc.set({
                owner:userData.id,
                title,address,photos:addedPhotos,description,extraInfo,
                perks,checkIn,checkOut,maxGuests,price
            })
            await placeDoc.save()
            res.json("ok")
        }
    })
})

app.get("/places",async (req,res)=>{
    res.json(await Place.find() )
})

app.post("/bookings", async (req,res)=>{
    const userData=await getUserDataFromReq(req)
    const {
        place,checkIn,checkOut,numberOfGuests,name,phone,price
    }=req.body;
    Booking.create({
        place,checkIn,checkOut,numberOfGuests,name,phone,price,
        user:userData.id  
    }).then((doc)=>{
        // if (err) throw err; 6:12
        res.json(doc)
    }).catch((err)=>{
        throw err
    })
})

app.get('/bookings', async (req,res)=>{
    const userData=await getUserDataFromReq(req)
    res.json(await Booking.find({user:userData.id}).populate('place'))
    //line 57 because when we sign in we used id dont need to _id
})

app.listen(4001)