const express = require("express")
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const OpenAPiValidator = require("express-openapi-validator")
const jwt = require("jsonwebtoken")
const app = express()
const port = 3000
const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_key"

const swaggerDocument = YAML.load("./openapi.yaml") // Uso la librería yamljs para leer un archivo YAML.
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument)) // Esto configura una ruta en tu servidor Express donde podras ver ese archivo yaml
app.use(express.json())

app.use( // este middelware permite validar que la documentacion escrita en nuestra archivo openapi.yaml se cumpla cuando la definamos
    OpenAPiValidator.middleware({
        apiSpec: swaggerDocument,
        validateRequests: true,
        validateResponses: true,
        ignorePaths: /.*\/docs.*/, // que ignore docs ya que es la ruta donde se muestra la documentacion
    })
)

app.use((err, req, res, next) => { // este middleware nos trae informacion sobre el error
    res.status(err.status || 500).json({
        message: err.message,
        error: err.errors
    });
});

app.get("/v1/hello", (req, res ) => {
    res.json({message: "Hello world"})
})

app.get("/v2/hello", (req, res ) => {
    res.json({message: "Hello world v2"})
})

app.post("/v1/users", (req, res) => {
    const { name, age, email } = req.body

    const newUser = {
        id: Date.now().toString(),
        name,
        age,
        email,
    }

    res.status(201).json(newUser)
})

app.post("/v1/auth/login", (req, res) => {
    const { email, password } = req.body
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
        return res.status(401).json({ message: "Email o contraseña incorrectos" })
    }

    const token = jwt.sign(
        { sub: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "1h" }
    )

    res.json({ token })
})

const users = [{
    id: 1,
    name: "John Doe",
    age: 30,
    email: "joe@example.com",
    password: "password123"
}, {
    id: 2,
    name: "Jane Smith",
    age: 25,
    email: "jane@example.com",
    password: "qwerty123"
}, {
    id: 3,
    name: "Bob Johnson",
    age: 40,
    email: "bob@example.com",
    password: "pass456"
}]

const products = [{
    id: 1,
    name: "Laptop",
    description: "Laptop de alto rendimiento",
    price: 999.99,
    category: "Electronics",
    tags: ["portable", "gaming"],
    inStock: true,
    specifications: {
        processor: "Intel i7",
        ram: "16GB",
        storage: "512GB SSD"
    },
    ratings: [{
        score: 5,
        comment: "Excelente producto"
    }]
}, {
    id: 2,
    name: "JavaScript Guide",
    description: "Guía completa de JavaScript",
    price: 29.99,
    category: "Books",
    tags: ["programming", "tutorial"],
    inStock: true,
    specifications: {},
    ratings: [{
        score: 4,
        comment: "Muy útil"
    }]
}]

app.get("/v1/users/:id", (req, res) => {
    const id = req.params.id
    const user = users.find((u) => u.id === id)

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.json({
        id: parseInt(id, 10),
        name: user.name,
    })
})

app.post("/v1/users/:id", (req, res) => {
    const id = req.params.id
    const { name, age, email } = req.body
    const existingUser = users.findIndex((u) => u.id === id)

    if (existingUser === -1) {
        return res.status(404).json({ message: "Usuario no encontrado" })
    }

    const updatedUser = {
        id,
        name,
        age,
        email,
    }

    users[existingUser] = updatedUser

    res.json(updatedUser)
})

app.post("/v1/products", (req, res) => {
    const { name, price, category, description, tags, inStock, specifications, ratings } = req.body

    const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name,
        price,
        category,
        description,
        tags,
        inStock,
        specifications,
        ratings
    }

    products.push(newProduct)
    res.status(201).json(newProduct)
})

app.get("/v1/products", (req, res) => {
    res.json(products)
})

app.get("/v1/products/:id", (req, res) => {
    const id = parseInt(req.params.id, 10)
    const product = products.find((p) => p.id === id)

    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" })
    }

    res.json(product)
})

app.put("/v1/products/:id", (req, res) => {
    const id = parseInt(req.params.id, 10)
    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
        return res.status(404).json({ message: "Producto no encontrado" })
    }

    const { name, price, category, description, tags, inStock, specifications, ratings } = req.body

    const updatedProduct = {
        id,
        name,
        price,
        category,
        description,
        tags,
        inStock,
        specifications,
        ratings
    }

    products[productIndex] = updatedProduct
    res.json(updatedProduct)
})

app.delete("/v1/products/:id", (req, res) => {
    const id = parseInt(req.params.id, 10)
    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
        return res.status(404).json({ message: "Producto no encontrado" })
    }

    products.splice(productIndex, 1)
    res.status(204).send()
})













app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    console.log(`Swagger UI available at http://localhost:${port}/v1`)
    console.log(`Swagger UI available at http://localhost:${port}/v2`)
})

