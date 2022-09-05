const pup = require("puppeteer") ;
const url = "https://www.marinetraffic.com";


//Web Scrapping
const searchShip = async(i) => {

    try {
        const browser = await pup.launch({headless:true,args:['--no-sandbox','--disable-setuid-sandbox'],})
        const page = await browser.newPage()
        page.setViewport({ width: 1920, height: 1080 });
        console.log("Iniciei")
        console.log(i)
        
        await page.goto(url)
        console.log("Fui para a URL")
    
        await page.waitForSelector(".css-1hy2vtq")
    
        await page.click(".css-1hy2vtq")
        const button = await page.$(".css-47sehv");
        await button.evaluate(b => b.click());
        await page.waitForSelector("#searchMarineTraffic")
        await page.click("#searchMarineTraffic")
        await page.waitForSelector("#searchMT")
        await page.type("#searchMT",searchFor[i].imo)
        await page.waitForTimeout(1000)
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter')
        await page.waitForTimeout(6000)
    
        console.log("Pagina acessada")
    
        const text = await page.evaluate(() => Array.from(document.querySelectorAll('.MuiCollapse-root'), element => element.textContent));
        const compilator = text[1]
        if (compilator == 'undefined'){
            console.log("O texto está undefined")
        }
        const slicer = compilator.slice(compilator.search("The vessel"),compilator.search("What kind of ship is this?"))
        const title = compilator.slice(compilator.search("Container Ship"),compilator.search("is currently located"))
    
        situation.push(slicer)
        vessels.push(title)
        await browser.close()
    } catch (error) {
        console.log("Ocorreu um erro, estamos refazendo o shipping")
        await searchShip(i)
    }
};
//Called to Web Scrapping
 async function webScrapping(imoList){
    situation = [] ;
    vessels = [];
    searchFor = imoList
    for (i = 0;  i <searchFor.length; i++){
        try {
            await searchShip(i)
            
        } catch (error) {
            console.log(error)
        }
    }

    return [vessels,situation]
};

module.exports= {webScrapping,searchShip}