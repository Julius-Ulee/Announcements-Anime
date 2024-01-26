const fs = require('fs');
const Parser = require('rss-parser');

const parser = new Parser();

function splitDescription(description) {
  const words = description.split(' ');
  const chunkSize = 10;
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }

  return chunks.join('<br>');
}

async function getLatestAnimeData() {
  try {
    const feed = await parser.parseURL('https://feeds.feedburner.com/crunchyroll/rss/anime');
    return feed.items.map(item => ({
      title: item.title,
      thumb: item.enclosure.url,
      date: new Date(item.isoDate).toLocaleDateString(),
      time: new Date(item.isoDate).toLocaleTimeString('en-US', { timeZone: 'UTC', timeStyle: 'medium' }),
      link: item.link,
      description: splitDescription(item.contentSnippet),
    }));
  } catch (error) {
    console.error('Error fetching feed:', error);
    return [];
  }
}

async function updateReadmeWithAnimeData() {
  try {
    const animeData = await getLatestAnimeData();
    const truncatedAnimeData = animeData.slice(0, 20);
    const currentDate = new Date().toLocaleDateString('en-US', {
      timeZone: 'Asia/Jakarta'
    });
    const currentDateTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Jakarta',
      dateStyle: 'medium',
      timeStyle: 'medium'
    });

    let readmeContent = `<p align="center"><a href=""><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=FFDA5D&center=true&vCenter=true&repeat=false&width=435&lines=Latest+Anime+List" alt="Typing SVG" /></a></p>\n\n`;
    readmeContent += `<p align="center"><em>Updated on: ${currentDateTime}</em></p>\n\n`;
    readmeContent += `<p align="center"><img src="img/news.png" height="100"></p>`;
    readmeContent += `<p align="center">This script aims to automate the process of updating the latest anime information, so that users do not need to do it manually. This makes it easier for users to know what anime are newly released and makes it easier for them to access more information.</p>`;
    readmeContent += `<p align="center">
    <img align="center" src="https://img.shields.io/github/contributors/Julius-Ulee/Announcements-Anime"> 
    <img align="center" src="https://img.shields.io/github/issues/Julius-Ulee/Announcements-Anime"> 
    <img align="center" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=shields"> 
    <img align="center" src="https://img.shields.io/github/issues-pr/Julius-Ulee/Announcements-Anime"> 
    <a href="https://github.com/Julius-Ulee/Announcements-Anime/blob/master/LICENSE"><img align="center" src="https://img.shields.io/badge/License-MIT-yellow.svg"></a>
    <img align="center" src="https://img.shields.io/github/commit-activity/m/Julius-Ulee/Announcements-Anime"> 
    <img align="center" src="https://github.com/Julius-Ulee/github-profile-views-counter/blob/master/svg/738176371/badge.svg"> 
    <img align="center" height='20' src="https://github.com/Julius-Ulee/github-profile-views-counter/blob/master/graph/738176371/small/week.png"><br>
    <img align="center" src="https://img.shields.io/maintenance/yes/2024"></p>`;
    readmeContent += `<p align="center"><b>Display GitHub Action Badge</b> <a href="https://github.com/Julius-Ulee/Announcements-Anime/actions/workflows/black.yml"><img align="center" src="https://github.com/Julius-Ulee/Announcements-Anime/actions/workflows/black.yml/badge.svg"></a> <a href="https://github.com/Julius-Ulee/Announcements-Anime/actions/workflows/jekyll.yml"><img align="center" src="https://github.com/Julius-Ulee/Announcements-Anime/actions/workflows/jekyll.yml/badge.svg"></a></p>`;
    readmeContent += `<p align="center"><a href="https://github.com/Julius-Ulee/Announcements-Anime/blob/master/README.md">Readme</a> • <a href="https://github.com/Julius-Ulee/Announcements-Anime/blob/master/.github/workflows/black.yml">Actions-YML</a> • <a href="https://github.com/Julius-Ulee/Announcements-Anime/blob/master/.gitignore">Gitignore</a> • <a href="https://github.com/Julius-Ulee/Announcements-Anime/blob/master/LICENSE">License</a> • <a href="https://github.com/Julius-Ulee/Announcements-Anime/blob/master/update-readme.js">Update-readme</a> • <a href="https://github.com/Julius-Ulee/Announcements-Anime/blob/master/package.json">Package</a></p>`;

    truncatedAnimeData.forEach(anime => {
      readmeContent += `<table align="center">\n`;
      readmeContent += `<tr>\n`;
      readmeContent += `<th><h3 align="center">${anime.title}</h3></th>\n`;
      readmeContent += `</tr>\n`;
      readmeContent += `<tr>\n`;
      readmeContent += `<td>\n`;
      readmeContent += `<p align="center">\n`;
      readmeContent += `<img src="${anime.thumb}" height="256">\n`;
      readmeContent += `</p>\n`;
      readmeContent += `</td>\n`;
      readmeContent += `</tr>\n`;
      readmeContent += `<tr>\n`;
      readmeContent += `<td>\n`;
      readmeContent += `<table align="center">\n`;
      readmeContent += `<tr>\n`;
      readmeContent += `<td>📔 Publish Date :</td>\n`;
      readmeContent += `<td align="center">${anime.date}</td>\n`;
      readmeContent += `</tr>\n`;
      readmeContent += `<tr>\n`;
      readmeContent += `<td>📕 Link :</td>\n`;
      readmeContent += `<td align="center"><a href="${anime.link}">Anime Information</a></td>\n`;
      readmeContent += `</tr>\n`;
      readmeContent += `<tr>\n`;
      readmeContent += `<td colspan="2">📙 Description :</td>`;
      readmeContent += `</tr>\n`;
      readmeContent += `<tr>\n`;
      readmeContent += `<td colspan="2">\n`;
      readmeContent += `<p align="center">${anime.description}</p>\n`; 
      readmeContent += `</td>\n`;
      readmeContent += `</tr>\n`;
      readmeContent += `</table>\n`;
      readmeContent += `</td>\n`;
      readmeContent += `</tr>\n`;
      readmeContent += `</table>\n\n`;
    });

    fs.writeFileSync('README.md', readmeContent);
    console.log('README.md updated successfully with latest anime data and date!');
  } catch (error) {
    console.error('Error updating README.md:', error);
  }
}

updateReadmeWithAnimeData().catch(error => console.error('Error:', error));
