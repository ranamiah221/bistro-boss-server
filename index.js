const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors({
  origin:['http://localhost:5173']
}))
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ungcn7e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    // DB and collection..
    const menuCollection=client.db('bistroBoss').collection('menus')
    const reviewCollection=client.db('bistroBoss').collection('reviews')
    const cartCollection=client.db('bistroBoss').collection('carts')
    // get all menu from DB
    app.get('/menus', async(req, res)=>{
        const result = await menuCollection.find().toArray()
        res.send(result)
    })
 
    // get all reviews from DB
    app.get('/reviews', async(req, res)=>{
        const result = await reviewCollection.find().toArray()
        res.send(result)
    })
   //carts collection....
   app.get('/carts', async(req, res)=>{
    const email = req.query?.email;
    const query ={email : email}
    const result = await cartCollection.find(query).toArray();
    res.send(result);
   })

   app.post('/carts', async(req, res)=>{
    const cartItem = req.body;
    const result = await cartCollection.insertOne(cartItem)
    res.send(result);
   })
   
  //  deleted api..
  app.delete('/cart/:id', async(req, res)=>{
    const id= req.params.id;
    console.log(id)
    const query = {_id : new ObjectId(id)}
    const result = await cartCollection.deleteOne(query)
    res.send(result);
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('bistro boss server')
})

app.listen(port, ()=>{
    console.log(`bistro boss server running port: ${port}`)
})