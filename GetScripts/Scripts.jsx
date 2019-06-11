import React, { useState, useRef, useEffect } from 'react';
const cheerio = require('cheerio');
const axios = require('axios');

//https://jongmin92.github.io/2017/05/26/Emily/4-crawling/
const Scripts = () => {
  const [seasons, setSeasons] = useState(0);
  const [episodes, setEpisodes] = useState(0);
  const mounted = useRef(false);
  const cors_url = 'https://cors-anywhere.herokuapp.com/';
  const base_url = 'https://www.springfieldspringfield.co.uk/episode_scripts.php?tv-show=brooklyn-nine-nine';


  const onChangeContents = (e) => {
    if(e.target.name === 'seasons')
      setSeasons(e.target.value);
    else
      setEpisodes(e.target.value);
  };

  const onClickDownload = () => {
    window.alert('You click the button!');
  };

  const onClickSeason = () => {
    getSeasonsList();
    // getScripts();
  };

  // Brooklyn nine-nine의 모든 season 목록을 가져오는 함수
  const getSeasonsList = async () => {
    try {
      const html = await axios.get(cors_url+base_url,{headers: {'Access-Control-Allow-Origin': '*'}});

      const str = html.data.replace(/<br> /g, '\n');
      let $ = cheerio.load(str);
      const seasons = $('#content_container > div.main-content > div.main-content-left > div:nth-child(7)').text().trim();
      // document를 얻어와서 document.querySelectorAll('.season-episodes').length;를 쓰고싶은데 어떡하지

      console.log(seasons);

    } catch (error) {
      console.log(error);
    }
  };

  // 임의의 script, title을 가져오는 함수
  const getScripts = async () => {
    try {
      const html = await axios.get(`https://cors-anywhere.herokuapp.com/https://www.springfieldspringfield.co.uk/view_episode_scripts.php?tv-show=brooklyn-nine-nine&episode=s01e01`,{headers: {'Access-Control-Allow-Origin': '*'}});

      const str = html.data.replace(/<br> /g, '\n');
      let $ = cheerio.load(str);
      const title = $('h3').text().trim();
      const scripts = $('div.scrolling-script-container').text().trim();
      console.log(title);
      console.log(scripts);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    // componentDidMount
    if(!mounted.current) {
      mounted.current = true;

    } else {
      window.alert(`${seasons} and ${episodes}`);
    }
  },[episodes, seasons]);


  return (
    <>
      <h3>Seasons: {seasons}, Episodes: {episodes}</h3>

      <div>
        <h3>Seasons</h3>
        <input type='number' name='seasons' value={seasons} onChange={onChangeContents} />
        <button onClick={onClickSeason}>Next</button>
      </div>

      <h3>Episodes</h3>
      <input type='number' name='episodes' value={episodes} onChange={onChangeContents} />
      <button onClick={onClickDownload}>Download</button>
    </>
  );
};

export default Scripts;