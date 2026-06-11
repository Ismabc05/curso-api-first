const express = require("express")
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const OpenAPiValidator = require("express-openapi-validator")
const app = express()
const port = 3000

const swaggerDocument = YAML.load("./openapi.yaml") // Uso la librería yamljs para leer un archivo YAML.
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument)) // Esto configura una ruta en tu servidor Express donde podras ver ese archivo yaml

app.use( // este middelware permite validar que la documentacion escrita en nuestra archivo openapi.yaml se cumpla cuando la definamos
    OpenAPiValidator.middleware({
        apiSpec: swaggerDocument,
        validateRequests: true,
        validateResponses: true,
        ignorePaths: /.*\/docs.*/, // que ignoter docs ya que es la ruta donde se muestra la documentacion
    })
)

app.use((err, req, res, next) => { // este middleare nos trae informacion sobre el error
    res.status(err.status || 500).json({
        message: err.message,
        error: err.errors
    });
});

app.get("/hello", (req, res ) => {
    res.json({message: "Hello world"})
})

app.get("/", (req, res ) => {
    res.json({message: "Hola mundo"})
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

