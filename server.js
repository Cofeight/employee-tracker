const express = require('express');
const mysql = require('mysql2');
//const inquirer = require('inquirer');

const app = express();
const PORT = process.env.PORT || 3001;

//middleware set-up
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.listen(PORT, ()=>{console.log(`You have tuned in to the melodic sounds of PORT:${PORT}`);})