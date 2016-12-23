// Pokedex Class
var Pokedex = function(brain){
	this.data = [];
	this.net = new brain.NeuralNetwork();
};

// Pokedex input method
Pokedex.prototype.input = function(samples){
	var samples = samples;
	var $this = this;
	var recursive = function(i, resolve, reject){
		var i = i || 0;
		var sample = samples[i];
		if(sample){
			if(sample.decoded && sample.id){
				var sampler = { input : sample.decoded, output : {} };
				sampler.output[sample.id] = 1;
				var trainingUnit = new Input(sampler);
				$this.data.push(trainingUnit);
				i++;
				if(i != (samples.length - 1)){
					recursive(i, resolve, reject);
				}else{
					resolve();
				}
			};
		};
	};
	return new Promise(function(resolve, reject){
		try{
			recursive(0, resolve, reject);
		}catch(err){
			reject(err);
		}
	});
};

// Pokedex train method
Pokedex.prototype.train = function(){
	console.log('Pokedex training started...');
	var $this = this;
	return new Promise(function(resolve, reject){
		try{
			console.log($this.data.length);
			$this.net.train($this.data, {
					  errorThresh: 0.00005,  // error threshold to reach
					  iterations: 20000,   // maximum training iterations
					  log: true,           // console.log() progress periodically
					  logPeriod: 1,       // number of iterations between logging
					  learningRate: 0.5   // learning rate
					});
			resolve();
		}catch(err){
			reject(err);
		}
	});	
	console.log('Pokedex training complete.');
};

// Pokedex reset method
Pokedex.prototype.reset = function(){
	console.log('Pokedex reset started...')
	this.data = [];
	this.net = new brain.NeuralNetwork();
	console.log('Pokedex reset complete.')
};

// Pokedex analyze method
Pokedex.prototype.analyze = function(sample){
	console.log('Pokedex analysis started...');
		var $this = this;
		return new Promise(function(resolve, reject){
			try{
				setTimeout(function(){
					resolve($this.net.run(sample));
				}, 8000);
			}catch(err){
				reject(err);
			}
		});	
};