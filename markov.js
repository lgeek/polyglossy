/*  Polyglossy is a language detection web API.
    Copyright (C) 2010 Cosmin Gorgovan <cosmin AT linux-geek.org>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

exports.Markov = function() {
  this.translations = []

  this.train = function(string) {
    if (string.length < 2) {
      throw ("TooShortStringException")
    }
    for (i = 2; i < string.length; i++) {
      if (this.translations[string[i-2]] == undefined) {
        this.translations[string[i-2]] = []
      }
      if (this.translations[string[i-2]][string[i-1]+string[i]] == undefined) {
        this.translations[string[i-2]][string[i-1]+string[i]] = 2
      } else {
        this.translations[string[i-2]][string[i-1]+string[i]]++
      }
    }
  }
  
  this.probability = function(string) {      
    probability = 1
    for (i = 2; i < string.length; i++) {
      try {
        count = this.translations[string[i-2]][string[i-1] + string[i]]
      } catch (e){
        count = 1 / this.count_all()
      }
      
      if (count == undefined)
        count = 1 / this.count_all()

      total = this.get_total(string[i-2])
      if (!total || total == 0)
        total = this.count_all()

      probability *= count / total;
    }

    return probability
  }
  
  this.get_total = function(from) {
    sum = 0
    for (translation in this.translations[from]) {
      sum += this.translations[from][translation]
    }
    
    return sum
  }
  
  this.count_all = function() {
    sum = 0
    for (from in this.translations) {
      sum += this.get_total(from)
    }
    return sum
  }
  
  this.load = function(translations) {
    this.translations = translations
  }
  
  // JSON.stringify doesn't work okay on this.translations, so no exporting yet
  /*this.export = function() {
    return this.translations
  }*/
}

