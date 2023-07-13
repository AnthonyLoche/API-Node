const express = require("express");
const server = express();
const router = express.Router();
const fs = require("fs");

server.use(express.json({ extended: true }));

const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger_output.json');

server.use('', swaggerUi.serve, swaggerUi.setup(swaggerFile));
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: false }));

const readFile = () => {
    const content = fs.readFileSync("./data/itens.json", "utf-8");
    return JSON.parse(content);
}

const writeFile = (content) => {
    const uptadeFile = JSON.stringify(content);
    fs.writeFileSync("./data/itens.json", uptadeFile, "utf-8");
}

router.get("/", (req, res) => {
    const content = readFile();
    res.send(content);
})

router.post("/", (req, res) => {
    const { name, email, phone, gender, age, profession, city } = req.body;
    const currentContent = readFile();
    const id = Math.random().toString(32).substring(2, 9);
    currentContent.push({ id, name, email, phone, gender, age, profession, city });
    writeFile(currentContent);
    res.send(`Dados Cadastrados Com Sucesso`);
})

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, phone, gender, age, profession, city } = req.body;
    const currentContent = readFile();
    const selectedItem = currentContent.findIndex((item) => item.id === id);
    const { id: cId, name: cName, email: cEmail, phone: cPhone, gender: cGender, age: cAge, profession: cProfession, city: cCity } = currentContent[selectedItem];

    const newObject = {
        id: cId,
        name: name ? name : cName,
        email: email ? email : cEmail,
        phone: phone ? phone : cPhone,
        gender: gender ? gender : cGender,
        age: age ? age : cAge,
        profession: profession ? profession : cProfession,
        city: city ? city : cCity
    };

    currentContent[selectedItem] = newObject;
    writeFile(currentContent);
    res.send(`Dados Atualizados com Sucesso :) ${currentContent}`);
})

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const currentContent = readFile();
    const selectedItem = currentContent.findIndex((item) => item.id === id);
    currentContent.splice(selectedItem, 1);
    writeFile(currentContent)
    res.send("Dados Deletados com Sucesso :)");
})

server.use(router);
server.listen(3000, () => {
    console.log("API Funcionando com Sucesso :)")
})

