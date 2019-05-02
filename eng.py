import requests
from bs4 import BeautifulSoup
import os

# Information about Drama
seasons_and_episodes = {
	1:22,
	2:23,
	3:23,
	4:22,
	5:22,
	6:14
}

seasons = seasons_and_episodes.keys()
episodes = seasons_and_episodes.values()
name = 'Brooklyn-nine-nine'
base_url = 'https://www.springfieldspringfield.co.uk/view_episode_scripts.php?tv-show=brooklyn-nine-nine&episode='

# Information about SAVE
save_url = ""

# Information about scripts
stop_words = ['<div class="scrolling-script-container">','                   			 ','</div>','[',']','                   			','                   			']

# Make folder
def createFolder(directory):
	try:
		if not os.path.exists(directory):
			os.makedirs(directory)
	except OSError:
		print ('Error: Creating directory. ' +  directory)

for season in range(1, len(seasons)+1):
	createFolder('/Users/isang-a/Desktop/Scripts/'+name+'/'+str(season))

for item in seasons_and_episodes.items():
	s = item[0]
	es = item[1]

	

	for e in range(1,es+1):
		if s<10:
			inform = 's0'+str(s)
		else:
			inform = 's'+str(s)

		if e<10:
			inform += 'e0'+str(e)
		else:
			inform += 'e'+str(e)
		url = base_url + inform
		print(url)

		save_url = name+'/'+str(s)+'/'+inform+'.txt'
		f = open(save_url, 'w')

		# HTTP GET Request
		req = requests.get(url)

		# HTML 소스 가져오기
		html = req.text
		soup = BeautifulSoup(html, 'html.parser')

		# BeautifulSoup으로 html소스를 python객체로 변환하기
		# 첫 인자는 html소스코드, 두 번째 인자는 어떤 parser를 이용할지 명시.
		# 이 글에서는 Python 내장 html.parser를 이용했다.
		soup = BeautifulSoup(html, 'html.parser')

		txt = soup.select(
			'div.main-content > div.main-content-left > div.episode_script > div.scrolling-script-container'
			)

		scripts = str(txt)
		scripts = scripts.replace("<br/>","\n\n")
		for w in stop_words:
			scripts = scripts.replace(w, "")
		
		f.write(scripts)
		f.close()
