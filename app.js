var config = require('./config.json')
var express = require('express')
var request = require('request')
var _ = require('underscore')
var compression = require('compression')
var app = express()
var bodyParser = require('body-parser')
var fetch = require('node-fetch')
var expressLiquid = require('express-liquid')
var minify = require('express-minify')
var moment = require('moment')
var fs = require('fs')
var jsonfile = require('jsonfile')
var capitalize = require('capitalize')
var axios = require('axios')

//var sent = JSON.parse(fs.readFileSync('./src/json/sent.json', 'utf8'))
app.use(compression())
app.use('/dist', express.static(__dirname + '/dist'))
app.use('/src', express.static(__dirname + '/src'))
app.use('/fonts', express.static(__dirname + '/fonts'))
app.set('view engine', 'liquid')
app.engine('liquid', expressLiquid())
app.set('views', 'src/views')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressLiquid.middleware)

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

/*
 * App listen on port 3000
 *
 */
app.listen(3000, function() {
  console.log('listening on port 3000...')
})




/*
 * Route: Front
 * =============================================================================
 */
app.get('/', function(req, res) {
 getFrontPage().then((data) => {
   res.render('front', {
     config: data.config[0],
     content: data.content,
     issues: data.issues
   })
  })
})

async function getFrontPage() {
  var frontPageConfig = await getFrontPageConfig()
  var frontPageContent = await getArticles()
  var frontPageIssues = await getIssues()
  return {
    config: frontPageConfig,
    content: frontPageContent,
    issues: frontPageIssues
  }
}

function getFrontPageConfig() {
  return new Promise(function(resolve, reject) {
  console.log('getting config...')
  var endpoint = config.apiUrl + '/page/47'
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   if (!error && response.statusCode === 200) {
     resolve(content)
   } else {
     console.log(error)
   }
 })
})
}

function getPodcast() {
  return new Promise(function(resolve, reject) {
  console.log('getting podcast...')
  console.log(config.apiUrl)
  var endpoint = config.apiUrl + '/front-podcast'
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   if (!error && response.statusCode === 200) {
     resolve(content)
   }
 })
})
}

function getArticles() {
  return new Promise(function(resolve, reject) {
  console.log('getting content...')
  console.log(config.apiUrl)
  var endpoint = config.apiUrl + '/front'
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   if (!error && response.statusCode === 200) {
     resolve(content)
   }
 })
})
}

function getIssues() {
  return new Promise(function(resolve, reject) {
  console.log('getting issues...')
  console.log(config.apiUrl)
  var endpoint = config.apiUrl + '/issues'
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   if (!error && response.statusCode === 200) {
     resolve(content)
   }
 })
})
}

/*
 * Route: Issue
 * =============================================================================
 */
app.get('/issue/:id', async function(req, res) {
  const id = req.params.id
  var issueContent = await getIssueContent(id)
  var extraContent = await getExtraContent(id)
  var alumniNotes = await getAlumniNotes(id)
    res.render('issue', {
      content: issueContent,
      extras: extraContent,
      notes: alumniNotes
    })
})


function getIssueContent(id) {
  return new Promise(function(resolve, reject) {
    let param = '/issue/'
    if (!Number(id)) {
      param = '/issue-slug/'
    }
    var endpoint = config.apiUrl + param + id
     request({
     url: endpoint,
     json: true
    }, function(error, response, content) {
     if (!error && response.statusCode === 200) {
       console.log(content)
       resolve(content)
     }
  })
 })
}

function getExtraContent(id) {
  return new Promise(function(resolve, reject) {
    let param = '/issue/'
    if (!Number(id)) {
      param = '/issue-slug/'
    }
    var endpoint = config.apiUrl + param + id
     request({
     url: endpoint,
     json: true
    }, function(error, response, content) {
     if (!error && response.statusCode === 200) {
       resolve(content)
     }
   })
  })
 }

 function getAlumniNotes(id) {
  return new Promise(function(resolve, reject) {
    var endpoint = config.apiUrl + '/issue-alumni-notes/' + id
     request({
     url: endpoint,
     json: true
    }, function(error, response, content) {
     if (!error && response.statusCode === 200) {
       resolve(content)
     }
   })
  })
 }

/*
 * Route: Issues
 * =============================================================================
 */
app.get('/issues', function(req, res) {
  var endpoint = config.apiUrl + '/issues'
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   console.log(content)
   if (!error && response.statusCode === 200) {
        res.render('issues', { content: content })
       }
     })
})



/*
 * Route: Category
 * =============================================================================
 */
 app.get('/authors/:id/:name', function(req, res) {
   const id = req.params.id
   const name = req.params.name
   axios.all([
     axios.get(`${config.apiUrl}/categories/${id}`),
     axios.get(`${config.apiUrl}/term-detail/${id}`),
   ]).then((data) => {
     console.log(data)
     res.render('author', { content: data[0].data, term: data[1].data[0], category: name })
   }).catch((err) => {
     console.log(err)
   })
 })

 app.get('/translators/:id/:name', function(req, res) {
   const id = req.params.id
   const name = req.params.name
   axios.all([
     axios.get(`${config.apiUrl}/categories/${id}`),
     axios.get(`${config.apiUrl}/term-detail/${id}`),
   ]).then((data) => {
     console.log(data)
     res.render('author', { content: data[0].data, term: data[1].data[0], category: name })
   }).catch((err) => {
     console.log(err)
   })
 })


app.get('/essays', function(req, res) {
  var endpoint = config.apiUrl + '/categories/2'
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   console.log(content)
   if (!error && response.statusCode === 200) {
        res.render('category', { content: content, category: "Essays" })
       }
     })
})

app.get('/profiles', function(req, res) {
  var endpoint = config.apiUrl + '/categories/1'
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   console.log(content)
   if (!error && response.statusCode === 200) {
        res.render('category', { content: content, category: "Profiles" })
       }
     })
})

app.get('/interviews', function(req, res) {
  var endpoint = config.apiUrl + '/categories/3'
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   console.log(content)
   if (!error && response.statusCode === 200) {
        res.render('category', { content: content, category: "Interviews" })
       }
     })
})

app.get('/spotlights', function(req, res) {
  var endpoint = config.apiUrl + '/categories/5'
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   console.log(content)
   if (!error && response.statusCode === 200) {
        res.render('category', { content: content, category: "Spotlights" })
       }
     })
})

app.get('/alumni-notes', function(req, res) {
  var endpoint = config.apiUrl + '/notes'
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   if (!error && response.statusCode === 200) {
        res.render('notes', { content: content, category: "Alumni Notes" })
       }
     })
})

/*
 * Route: Article
 * =============================================================================
 */
app.get('/article/:id', function(req, res) {
  const id = req.params.id
  let param = '/article/'
  if (!Number(id)) {
    param = '/article-slug/'
  }
  var endpoint = config.apiUrl + param + id
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   if (!error && response.statusCode === 200) {
     if (content[0]) {
       content[0].body = content[0].body.replace(/\/sites\/default\/files/g, 'https://api.magazine.harriman.danmccarey.com/sites/default/files')
     }
        res.render('article', { content: content[0] })
       }
     })

})


/*
 * Route: Alumni note
 * =============================================================================
 */
app.get('/note/:id', function(req, res) {
  var id = req.params.id
  let param = '/note/'
  if (!Number(id)) {
    param = '/note-slug/'
  }
  var endpoint = config.apiUrl + param + id
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   if (!error && response.statusCode === 200) {
     if (content[0]) {
       content[0].body = content[0].body.replace(/\/sites\/default\/files/g, 'https://api.magazine.harriman.danmccarey.com/sites/default/files')
     }
     console.log(content)
        res.render('article', { content: content[0] })
       }
     })

})


/*
 * Route: about
 * =============================================================================
 */
app.get('/about', function(req, res) {
  var nid = req.params.nid
  var endpoint = config.apiUrl + '/page/106'
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   if (!error && response.statusCode === 200) {
     if (content[0]) {
       content[0].body = content[0].body.replace(/\/sites\/default\/files/g, 'https://api.magazine.harriman.danmccarey.com/sites/default/files')
     }
        res.render('article', { content: content[0] })
       }
     })
})


/*
 * Route: about
 * =============================================================================
 */
app.get('/contact', function(req, res) {
  var nid = req.params.nid
  var endpoint = config.apiUrl + '/page/107'
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   if (!error && response.statusCode === 200) {
     if (content[0]) {
       content[0].body = content[0].body.replace(/\/sites\/default\/files/g, 'https://api.magazine.harriman.danmccarey.com/sites/default/files')
     }
        res.render('article', { content: content[0] })
       }
     })
})



/*
 * Route: search
 * =============================================================================
 */
app.get('/search', function(req, res) {
  res.render('search')
})



/*
 * Route: search query
 * =============================================================================
 */
app.get('/search/:query', function(req, res) {
  var query = req.params.query
  var endpoint = config.apiUrl + '/search/?search=' + query + '&title=' + query
   request({
   url: endpoint,
   json: true
 }, function(error, response, content) {
   if (!error && response.statusCode === 200) {
      res.render('search', { content: content })
    }
  })
})
