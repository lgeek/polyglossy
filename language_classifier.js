markov = require ('./markov.js')

exports.Classifier = function() {
  this.chains = []
  // this.chains.length is always 0 for some reason, so I use this variable instead
  this.chain_no = 0

  this.train = function (label, string) {
    if (this.chains[label] == undefined) {
      this.chains[label] = new markov.Markov()
      this.chain_no++
    }
    this.chains[label].train(string)
  }
  
  this.classify = function(string) {
    words = string.trim().split(/\s+/)

    match_count = []
    prob_total = []
    
    for (word in words) {
      max_label = "unknown"
      max_value = 0

      for (label in this.chains) {
        probability = this.chains[label].probability(words[word])
        if (probability > max_value) {
          max_label = label
          max_value = probability
        }
        
        if (prob_total[label] == undefined) {
          prob_total[label] = probability
        } else {
          prob_total[label] += probability
        }
      }
      
      if (match_count[max_label]) {
        match_count[max_label]++
      } else {
        match_count[max_label] = 1
      }
    }
    
    max_label = "unknown"
    max_count = 0
    max_prob = 0
    
    // We don't want to consider the unknown classification
    for (label in this.chains) {
      if (match_count[label] > max_count || (match_count[label] == max_count && prob_total[label] > max_prob)) {
        max_label = label
        max_count = match_count[label]
        max_prob = prob_total[label]
      }
    }
    
    confidence = max_count / words.length
    return [max_label, confidence]
  }
  
  this.load = function(data) {
    this.chains = []
    for (label in data) {
      this.chains[label] = new markov.Markov()
      this.chains[label].load(data[label])
      this.chain_no++
    }
  }
}
