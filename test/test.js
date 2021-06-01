const {Snake} = require('../src/Snake')

document.addEventListener('DOMContentLoaded', ()=>{
    //const element = document.querySelector('body')
    const element = document.body
    //c onsole.log("main elemenet", element)
    const snake = new Snake(element)
}, false);