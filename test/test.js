const {Snake} = require('../src/Snake')

document.addEventListener('DOMContentLoaded', ()=>{
    //const element = document.querySelector('body')
    const element = document.body
    //c onsole.log("main elemenet", element)

    const btnStartKigyo = document.getElementById('startKigyo')
    btnStartKigyo.addEventListener('click',event=>{
        console.log('startKigyo');
        const snake = new Snake(element)
    })

}, false);