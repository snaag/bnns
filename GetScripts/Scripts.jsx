import React, { useState, useRef, useEffect } from 'react';
const cheerio = require('cheerio');
const axios = require('axios');

//https://jongmin92.github.io/2017/05/26/Emily/4-crawling/
const Scripts = () => {
  const [seasons, setSeasons] = useState([]);
  const [episodeNow, setEpisodeNow] = useState([]);
  const episodes = useRef([]);
  const mounted = useRef(false);
  const click = useRef(false);
  const cors_url = 'https://cors-anywhere.herokuapp.com/';
  const bnn_url =
    'https://www.springfieldspringfield.co.uk/episode_scripts.php?tv-show=brooklyn-nine-nine';


  // 임의의 script, title을 가져오는 함수
  // const getScripts = async () => {
  //   try {
  //     const html = await axios.get(
  //       `https://cors-anywhere.herokuapp.com/https://www.springfieldspringfield.co.uk/view_episode_scripts.php?tv-show=brooklyn-nine-nine&episode=s01e01`,
  //       { headers: { 'Access-Control-Allow-Origin': '*' } },
  //     );
  //
  //     const str = html.data.replace(/<br> /g, '\n');
  //     let $ = cheerio.load(str);
  //     const title = $('h3')
  //       .text()
  //       .trim();
  //     const scripts = $('div.scrolling-script-container')
  //       .text()
  //       .trim();
  //     console.log(title);
  //     console.log(scripts);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const getSeasons = async () => {
    try {
      const html = await axios.get(cors_url + bnn_url, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });

      const document = html.data;
      const str = document.replace(/<br> /g, '\n');
      let $ = cheerio.load(str);
      const cnt_seasons = $('.season-episodes').length;
      const newSeasons = [];

      for (let a=1; a < cnt_seasons+1; a++) {
        console.log(a);
        const name_season = $(`#season${a}`).text().trim();
        const e = $(`#season${a} ~ a`);
        newSeasons.push(name_season);

        const cntEpisode = e.length;
        const eachEpisodes = [];
        for (let b=0; b < cntEpisode; b++) {
          eachEpisodes.push(e[b].children[0].data);
        }
        episodes.current.push(eachEpisodes);
      }
      setSeasons((prevSeasons) => [...prevSeasons, ...newSeasons]);

    } catch (error) {
      console.error(error);
    }

  };

  // const loadEpisodes = async (season) => {
  //   try {
  //     const html = await axios.get(cors_url + bnn_url, {
  //       headers: { 'Access-Control-Allow-Origin': '*' },
  //     });
  //
  //     const document = html.data;
  //     const str = document.replace(/<br> /g, '\n');
  //     let $ = cheerio.load(str);
  //     // const cnt_seasons = $(`.${season} > .season-episode-title`).length;
  //     const cnt_seasons = $(`#content_container > div.main-content > div.main-content-left > div:nth-child(${season}) > a`).length;
  //
  //     //#content_container > div.main-content > div.main-content-left > div:nth-child(5) > a:nth-child(2)
  //     console.log(cnt_seasons);
  //     for (let a=1; a < cnt_seasons+1; a++) {
  //       const name_episodes = $(`#season${a}`).text().trim();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const showEpisode = (e) => {
    click.current = true;
    const idx = e.target.name - 1; // episode 정보에 접근할 index. 왜냐하면 episode[] 는 각 [[s1의 eps], [s2의 eps]..] 로 되어있어서

    setEpisodeNow(episodes.current[idx]);
  };

  useEffect(() => {
  },[episodeNow]);

  useEffect(() => {

    // componentDidMount
    if (!mounted.current) {
      mounted.current = true;
      getSeasons();
    } else {
      // componentDidUpdate

    }
  }, [seasons]);
  return (
    <>
      {episodes.current.length<1 ?
        <h1 className="loading">Loading...</h1>:
        <div>
          <h2>Seasons</h2>
          <h3>
            {seasons.map((v) => {
              return (
                <button name={/\d+/.exec(v)} onClick={showEpisode}>{v}</button>
              )
            })}
          </h3>
        </div>
      }




      {click.current &&
        <div>
          <h2>Episodes</h2>
          {episodeNow.map((v) => {
            return (
            <li>{v}</li>
            )
          })}
        </div>
      }

    </>
  );
};

export default Scripts;
