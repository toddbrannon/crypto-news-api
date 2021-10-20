const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const PORT = 8000

const app = express()

const news_sites = [
    {
        name:'Coindesk',
        address: 'https://www.coindesk.com/',
        base: ''
    },
    {
        name:'Coin Telegraph',
        address: 'https://cointelegraph.com/',
        base: ''
    },
    {
        name:'Decrypt',
        address: 'https://decrypt.co/',
        base: 'https://decrypt.co'
    },
]

const articles = []

news_sites.forEach(news_site => {
    axios.get(news_site.address)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("crypto")', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: news_site.base + url,
                    source: news_site.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Crypto News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))