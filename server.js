// Settings go here
var port_no = 8431
var language_models = './data_2nd_order.json'
// End of settings


var http = require('http');
var fs = require('fs');
var classifier = require ('./language_classifier.js')
var url = require('url')
var querystring = require('querystring')

var lang_classifier = new classifier.Classifier()

// Loads language models into the classifier
saved_data = JSON.parse(fs.readFileSync(language_models, 'ascii'))
lang_classifier.load(saved_data)

http.createServer(function (request, response) {
  try {
    request_url = url.parse(request.url)
    
    // TODO: Check HTTP request type
    if ((/^\/classify(\.|$)/).test(request_url.pathname)) {
      parameters = request_url.search
      parameters = parameters.substring(1, parameters.length)
      text = querystring.parse(parameters).text
  
      result = lang_classifier.classify(text)
      format = request_url.pathname.split('.')[1]

      switch(format) {
        case undefined:
          response.writeHead(200, {'Content-Type': 'text/plain', 'Connection': 'close'})
          response.end(result[0] + ' ' + result[1])
          break
        case 'xml':
          xml = '<?xml version="1.0" encoding="UTF-8"?>'
          xml += '<classification>'
          xml += '<language>' + result[0] + '</language>'
          xml += '<confidence>' + result[1] + '</confidence>'
          xml += '</classification>'

          response.writeHead(200, {'Content-Type': 'application/xml', 'Connection': 'close'})
          response.end(xml)
          break;
        case 'json':
          json = '{\n'
          json += '\t"classification" : {\n'
          json += '\t\t"language" : "' + result[0] +  '",\n'
          json += '\t\t"confidence" : ' + result[1] +  '\n'
          json += '\t}\n'
          json += '}'
          
          response.writeHead(200, {'Content-Type': 'application/json', 'Connection': 'close'})
          response.end(json)
          break;
        default:
          error(response, 404)
      }
    } else {
      error(response, 404)
    }
  } catch (exception) {
    error(response, 500)
  }
}).listen(port_no);

console.log('Server up on port ' + port_no)

function error(response, code) {
  response.writeHead(code, {'Connection': 'close'})
  
  switch(code) {
    case 404:
      response.end('404 File not found')
      break;
    default:
      response.end()
  }
}
