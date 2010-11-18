Polyglossy
==========

About
-----
Polyglossy is a language detection web API. This means you feed it some text and it will return the language of the text and its confidence in the classification. You can give it a try [here](http://polyglossy.com/).

How does it work?
-----------------
Polyglossy uses probabilistic models of languages. Each word from the text to be classified is piped through each Markov chain (representing a language model). This gives the fastest increase in accuracy as the length of the text grows. It peaks very closely to 100% accuracy.

Other ideas I've tried:
* piping the whole text through the Markov chain in a single go
* classifying directly the whole text based on the sum of the results obtained by passing each word through the Markov chain
* classifying directly the whole text based on the sum of the normalized results obtained by passing each word through the Markov chain
* including markers for the first and last letter from each word in the model

I'm using a kind of second order Markov chain. I'm modelling the translation from a letter x to the next two letters - yz.

Provided language models
------------------------

The file `data_2nd_order.json` contains models for English, French and German. These models aren't great! I've built them from the training data I've obtained while at Leeds Hack Day and working on the first Polyglossy build; it definitely needs some cleaning up.

Generating language models
--------------------------

The language models are loaded from a JSON file with the following structure: `{ 'language_label' => {'x' = > { 'yz' => count}} }`. Feel free to generate your own, but at the moment I haven't published my build script.

How to get it running
---------------------
Polyglossy is built on top of [node.js](http://nodejs.org/). I've only tested it with node v0.2.4. No other dependencies.

You can change two options in the server.js file: the listening port and the language model file.
