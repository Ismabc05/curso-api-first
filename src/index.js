const express = require("express")
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const app = express()
const port = 3000

const swaggerDocument = YAML.load("./openapi.yaml") // Uso la librería yamljs para leer un archivo YAML.

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument)) // Esto configura una ruta en tu servidor Express donde podras ver ese archivo yaml

app.get("/hello", (req, res ) => {
    res.json({message: "Hello world"})
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})