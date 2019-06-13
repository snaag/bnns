import React, { useState, useRef, useEffect } from 'react';
const cheerio = require('cheerio');
const axios = require('axios');
import styled from 'styled-components';

const StyledH1 = styled.h1`
  margin: 40px;
  border: 5px dotted blue;
`;

const Scripts = () => {
  const [seasons, setSeasons] = useState([]);
  const [seasonIdx, setSeasonIdx] = useState(-1);
  const [episodeNow, setEpisodeNow] = useState([]);
  const [episodeIdx, setEpisodeIdx] = useState(-1);
  const episodes = useRef([]);
  const mounted = useRef(false);
  const click = useRef(false);
  const [script, setScript] = useState('');
  const [title, setTitle] = useState('');
  const scriptClicked = useRef(false);

  const cors_url = 'https://cors-anywhere.herokuapp.com/';
  const bnn_url =
    'https://www.springfieldspringfield.co.uk/episode_scripts.php?tv-show=brooklyn-nine-nine';
  const scriptUrl =
    'https://www.springfieldspringfield.co.uk/view_episode_scripts.php?tv-show=brooklyn-nine-nine&episode=';

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

      for (let a = 1; a < cnt_seasons + 1; a++) {
        const name_season = $(`#season${a}`)
          .text()
          .trim();
        const e = $(`#season${a} ~ a`);
        newSeasons.push(name_season);

        const cntEpisode = e.length;
        const eachEpisodes = [];
        for (let b = 0; b < cntEpisode; b++) {
          eachEpisodes.push(e[b].children[0].data);
        }
        episodes.current.push(eachEpisodes);
      }
      setSeasons(prevSeasons => [...prevSeasons, ...newSeasons]);
    } catch (error) {
      console.error(error);
    }
  };

  const clickSeason = e => {
    console.log('clickSeason');
    click.current = true;
    const idx = e.target.name - 1;

    setSeasonIdx(idx + 1);

    setEpisodeNow(episodes.current[idx]);
    setEpisodeIdx(-1);

    scriptClicked.current = false;
    setTitle('');
    setScript('');
  };

  const clickEpisode = e => {
    setEpisodeIdx(e.target.name);
  };

  // 임의의 script, title을 가져오는 함수
  const getScripts = async () => {
    setTitle('');
    let info = 's';
    seasonIdx > 9 ? (info += seasonIdx) : (info += '0' + seasonIdx);
    info = info + 'e';
    episodeIdx > 9 ? (info += episodeIdx) : (info += '0' + episodeIdx);

    try {
      const html = await axios.get(cors_url + scriptUrl + info, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });

      const str = html.data.replace(/<br> /g, '\n');
      let $ = cheerio.load(str);
      const title = $('h3')
        .text()
        .trim();
      const scripts = $('div.scrolling-script-container')
        .text()
        .trim();

      setTitle(title);
      setScript(scripts);
    } catch (error) {
      console.error(error);
    }
  };

  const clickDownload = () => {};

  useEffect(() => {
    if (episodeIdx > 0) {
      getScripts();
    }
  }, [episodeIdx]);

  useEffect(() => {
    scriptClicked.current = true;
  }, [seasonIdx]);

  useEffect(() => {
    if (!mounted.current) {
      // componentDidMount
      mounted.current = true;
      getSeasons();
    } else {
      // componentDidUpdate
    }
  }, [seasons]);
  return (
    <>
      {episodes.current.length < 1 ? (
        <StyledH1>Loading...</StyledH1>
      ) : (
        <div>
          {/*{episodeIdx > 0 && <p className="info">You choose the {seasonIdx}-{episodeIdx}</p>}*/}
          <h2>Seasons</h2>
          <h3>
            {seasons.map(v => {
              return (
                <button className="season" name={/\d+/.exec(v)} onClick={clickSeason}>
                  {v}
                </button>
              );
            })}
          </h3>
        </div>
      )}

      {click.current && (
        <div>
          <h2>Episodes</h2>
          {episodeNow.map(v => {
            return (
              <li>
                <button className="episode" name={/^\d+/.exec(v)} onClick={clickEpisode}>
                  {v}
                </button>
              </li>
            );
          })}
        </div>
      )}

      {scriptClicked.current &&
        click.current &&
        (title.length < 2 ? (
          <h4 className="loadingScript">
            S{seasonIdx}-E{episodeIdx} script is loading...
          </h4>
        ) : (
          <div className="scriptPart">
            <pre className="title">{title}</pre>
            <button className="download" onClick={clickDownload}>
              download
            </button>
            <pre className="script">{script}</pre>
          </div>
        ))}
    </>
  );
};

export default Scripts;
