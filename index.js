const express  =  require('express')
const { MongoClient } = require('mongodb');
const cors  = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s17ux.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()
        const database = client.db("onlineShop");
        const productCollection = database.collection("products");

        // Products Get Api
        app.get('/products',async(req,res)=>{
            const cursor = productCollection.find({})
            const page = req.query.page
            const size = parseInt(req.query.size)
            const count = await cursor.count()
            let result
            if(page){
                result = await cursor.skip(page*size).limit(size).toArray()

            }else{
               result = await cursor.toArray()
            }
            res.send({
                count,
                result
            })
        })
        // Post APi by keys
        app.post('/products/keys',async(req,res)=>{
            const keys = req.body
            const query = {key: {$in: keys }}
            const products = await productCollection.find(query).toArray()
            res.json(products)
        })

    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send("Hello,I came Express Server")
})

app.listen(port,()=>{
    console.log("listening port",port);
})