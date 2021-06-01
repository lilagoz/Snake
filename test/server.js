const express = require('express')
const app = express()
const port = 8080

const browserify = require('browserify')

app.use(express.static('test'))

app.get('/bundle.js', (req,res)=>{
  try {
    browserify('./test/test.js', {
      debug: true
    })
      //.add()  
      .bundle()
      .on('error',error=>{
        console.error("Valami baj lehet.", error)
        res.send('/* Nincs itt semmi */')    
      })
      .pipe(res)
      .cat
  } catch (error) {
    res.send('/* Nincs itt semmi */')    
    console.error("Valami baj lehet.", error)
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})