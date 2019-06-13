import React, { useState, useRef, useEffect } from 'react';
const cheerio = require('cheerio');
const axios = require('axios');

//https://jongmin92.github.io/2017/05/26/Emily/4-crawling/
const Scripts = () => {
  const [seasons, setSeasons] = useState([]);
  const [seasonIdx, setSeasonIdx] = useState(-1);
  const [episodeNow, setEpisodeNow] = useState([]);
  const [episodeIdx, setEpisodeIdx] = useState(-1);
  const episodes = useRef([]);
  const mounted = useRef(false);
  const click = useRef(false);
  const cors_url = 'https://cors-anywhere.herokuapp.com/';
  const bnn_url =
    'https://www.springfieldspringfield.co.uk/episode_scripts.php?tv-show=brooklyn-nine-nine';
  const scriptUrl =
    'https://www.springfieldspringfield.co.uk/view_episode_scripts.php?tv-show=brooklyn-nine-nine&episode=';

  const [script, setScript] = useState('');
  const [title, setTitle] = useState('');
  const scriptClicked = useRef(false);



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

  const showEpisode = (e) => {
    click.current = true;
    const idx = e.target.name - 1; // episode 정보에 접근할 index. 왜냐하면 episode[] 는 각 [[s1의 eps], [s2의 eps]..] 로 되어있어서

    setSeasonIdx(idx+1);

    setEpisodeNow(episodes.current[idx]);

    scriptClicked.current = false;
    setTitle('');
    setScript('');
  };

  const clickEpisode = (e) => {
    setEpisodeIdx(e.target.name);
  };

  // 임의의 script, title을 가져오는 함수
  const getScripts = async () => {

    setTitle('');
    let info = "s";
    seasonIdx > 9 ? info+=seasonIdx : info+="0"+seasonIdx ;
    info = info + "e";
    episodeIdx > 9 ? info+=episodeIdx : info+="0"+episodeIdx ;
    scriptClicked.current = true;

    try {
      const html = await axios.get(
        cors_url+scriptUrl+info,
        { headers: { 'Access-Control-Allow-Origin': '*' } },
      );

      const str = html.data.replace(/<br> /g, '\n');
      let $ = cheerio.load(str);
      const title = $('h3')
        .text()
        .trim();
      const scripts = $('div.scrolling-script-container')
        .text()
        .trim();
      // console.log(title);
      // console.log(scripts);
      setTitle(title);
      setScript(scripts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
  },[episodeNow, seasonIdx]);

  useEffect(() => {
    if(episodeIdx > 0) {
      getScripts();
    }
  },[episodeIdx]);

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
        <h1 className="loadingPage">Loading...</h1>:
        <div>
          {episodeIdx > 0 && <p className="info">You choose the {seasonIdx}-{episodeIdx}</p>}
          <h2>Seasons</h2>
          <h3>
            {seasons.map((v) => {
              return (
                <button className="season" name={/\d+/.exec(v)} onClick={showEpisode}>{v}</button>
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
              <li><button className="episode" name={/^\d+/.exec(v)} onClick={clickEpisode}>{v}</button></li>
            )
          })}
        </div>
      }

      {/*{(script.length > 2 && title.length > 2) &&*/}
      {/*  <div>*/}
      {/*    <h4>{title}</h4>*/}
      {/*    <h4>This is script</h4>*/}
      {/*  </div>*/}
      {/*}*/}

      {
        scriptClicked.current &&
          (title.length < 2 ?
            <h4 className="loadingScript">Waiting for scripts loading...</h4> :
              <div>
                <h4 className="title">{title}</h4>
                <h5 className="script">{script}</h5>
              </div>


          )
      }

    </>
  );
};

export default Scripts;
