
//-- (req.url=="/" && req.method==="GET") bazadagi malumotlarni ko'rsaatish uchun

//-- (req.url=="/NEW" && req.method==="POST") yangi mahsulot  qoshish uchun agar unday mahsulot bolsa faqat qiymatini qoshadi

//-- (req.url=="/DELETE" && req.method==="POST") id boyicha malumot o'chirish uchun

const http=require("http")
const fs=require("fs").promises


http.createServer(async (req, res )=>{
     let data =await fs.readFile(process.cwd()+ "/baza.json", "utf8")
    let baza=data? JSON.parse(data) : []

  res.setHeader("Content-Type", "application/json");
  if(req.url==="/" && req.method==="GET")
  {
    
    res.end(JSON.stringify(baza))

   }
  else if(req.url==="/NEW" && req.method==="POST")
   {
    req.on("data", async (data)=>{
      const newdata=JSON.parse(data)
      let n=true
      
      for(let i=0; i<baza.length; i++)
      {
        if(baza[i].name===newdata.name)
        {
          
          baza[i].value +=newdata.value
          await fs.writeFile(process.cwd()+"/baza.json", JSON.stringify(baza , null, 2), "utf8")
          res.end("Bu mahsulot mavjud")
          n=false
        }
      }
      if(n)
      {
        newdata.id=(baza[baza.length-1]?.id || 0) +1
        baza.push(newdata)
        await fs.writeFile(process.cwd()+"/baza.json", JSON.stringify(baza , null, 2))
        res.end("Yangi mahsulot qoshildi")

      }
        
     

    })
  }
  else if(req.url==="/DELETE" && req.method==="POST")
   {
    req.on("data", async (data)=>{
      const newdata=JSON.parse(data)
      let n=true
      
      for(let i=0; i<baza.length; i++)
      {
        if(baza[i].id===newdata.id)
        {
          
          baza.splice(i, 1)
          await fs.writeFile(process.cwd()+"/baza.json", JSON.stringify(baza , null, 2), "utf8")
          res.end(`ID: ${newdata.id} bo'lgan ma'lumot o'chirildi `)
          n=false
        }
      }
      if(n){
        res.end( `Bunday ID: ${newdata.id} bolgan ma'lumot mavjud emas`)
      }
      
        
     

    })
  }
}).listen(5000, ()=>
{
    console.log("ishlamoqda");
})