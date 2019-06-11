const request = require('request');
const cheerio = require('cheerio');

var seasons_and_episodes = {
	1:22,
	2:23,
	3:23,
	4:22,
	5:22,
	6:14
};

var inform = ""
var base_url = 'https://www.springfieldspringfield.co.uk/view_episode_scripts.php?tv-show=brooklyn-nine-nine&episode=';


for(var i in seasons_and_episodes) {
	season = i;
	episode = seasons_and_episodes[i];

	for(var e=1; e<episode+1; e++) {
		var url = ""

		if(season < 10) 
			inform = `s0${season}`
		else
			inform = `s${inform}`

		if(e < 10)
			inform += `e0${e}`
		else
			inform += `e${e}`

		url = base_url+inform;
		getScripts(url);
	}
}


function getScripts(url) {
	request(url, function (error, response, data) {
	    if(error) throw error

		const str = data.replace(/<br> /g, '\n');
		let $ = cheerio.load(str);
		const scripts = $('div.scrolling-script-container').text().trim()
		console.log(scripts)
	});
}
