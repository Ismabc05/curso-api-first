const express = require("express")
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const OpenAPiValidator = require("express-openapi-validator")
const app = express()
const port = 3000

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

app.get("/hello", (req, res ) => {
    res.json({message: "Hello world"})
})

app.post("/users", (req, res) => {
    const { name, age, email } = req.body

    const newUser = {
        id: Date.now().toString(),
        name,
        age,
        email,
    }

    res.status(201).json(newUser)
})

const users = [{
    id: 1,
    name: "John Doe",
    age: 30,
    email: "joe@example.com",
}, {
    id: 2,
    name: "Jane Smith",
    age: 25,
    email: "jane@example.com"
}, {
    id: 3,
    name: "Bob Johnson",
    age: 40,
    email: "bob@example.com"
}] // este array es para simular una base de datos.

app.get("/users/:id", (req, res) => {
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

app.post("/users/:id", (req, res) => {
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

