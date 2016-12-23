// Load libraries
var brain = require('brain');
var easyimg = require('easyimage');
var PNG = require('png-js');
var fs = require('fs');
path = require('path');
// Input Class
var Input = function(input){
	this.input = input.input || 0;
	this.output = input.output || 0;
};
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
// Crawler Class
var Crawler = function(input){
	this.samples = [];
	this.subject = [];
	this.db = [];
};

// Crawler scan method
Crawler.prototype.scan = function(){
	console.log('Crawler scan started...');
	var $this = this;
	return new Promise(function(resolve, reject){
		try{
			srcpath = "./samples/";
			console.log('Scanning folders...');
			var folders = [];
			var samples = [];
			fs.readdirSync(srcpath).filter(function(folder) {
				if(fs.statSync(path.join(srcpath, folder)).isDirectory()){
					console.log(folder);
					folders.push(folder);
				};
			});
			for(i = 0; i < folders.length; i ++){
				console.log((i+1)/folders.length*100+'%');
				console.log(srcpath+folders[i]+"/");
				var sample = {};
				sample.id = folders[i];

				fs.readdirSync(srcpath+folders[i]+"/").filter(function(file) {
						sample.name = file;
						sample.url = srcpath+folders[i]+"/"+file;
						console.log(file);
						samples.push(new Sample(sample));
				});

				if(i == (folders.length -1)){

					console.log('Crawler scan completed.');
					$this.samples = samples;
					$this.subject = new Sample({ name : 'subject', url : './samples/subject.png', id : 'subject' })
					resolve(samples);
				}
			};
		}catch(err){
			reject(err);
		}
	});
};

// Crawler normalize method
Crawler.prototype.normalize = function(){
	console.log('Crawler normalization started...');
	var $this = this;
	var recursive = function(i, resolve, reject){
		$this.samples[i].normalize().then(function(){
			if(i == ($this.samples.length - 1)){ //end
				$this.subject.normalize().then(function(){
					$this.subject.decode().then(function(){
						resolve($this);
						console.log('Crawler normalization completed');	
					});
				});
			}else{
				$this.samples[i].decode();
				i++;
				recursive(i, resolve, reject);
			}
		});
	};

	return new Promise(function(resolve, reject){
		try{
			// for(i = 0; i < $this.samples.length; i++){
				recursive(0, resolve, reject);
			// }
		}catch(err){
			reject(err);
		}
	});
};
// Sample Class
var Sample = function(input){
	this.name = input.name || "";
	this.url = input.url || "";
	this.id = input.id || id;
	this.decoded = [];
};

// Sample normalize method
Sample.prototype.normalize = function(){
	console.log('Sample normalize started...')
	var $this = this;
	return new Promise(function(resolve, reject){
		var src = $this.url;
		var dst = "."+$this.url.split('.')[1]+'-normalized.png';
		console.log(src);
		console.log(dst);
		easyimg.rescrop({
		     src:src, dst: dst,
		     width:24, height:24,
		     cropwidth:24, cropheight:24,
		     x:0, y:0
		  }).then(
		  function(image) {
		     console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
		     resolve(dst);
		  },
		  function (err) {
		    console.log(err);
		    reject(err);
		  }
		);
	});
};

// Sample decode method
Sample.prototype.decode = function(){
	var $this = this;
	console.log('Sample decoding started...');
	return new Promise(function(resolve, reject){
		try{
			$this.decoded = [];
			PNG.decode($this.url.split('.png')[0]+'-normalized.png', function(pixels) {
			    for(pixel = 0 ; pixel < pixels.length ; pixel ++){
			    	$this.decoded.push(parseFloat("0."+pixels[pixel]));
			    	if(pixel == (pixels.length - 1)){
			    		console.log('---------------------------------')
			    		console.log($this.decoded.length);
			    		$this.decoded = $this.decoded.splice(0, 800);
			    		console.log('Sample decoded successfully: '+$this.decoded.toString());
			    		console.log('delete normalized file');
			    		fs.unlink($this.url.split('.png')[0]+'-normalized.png');
			    		resolve($this.decoded);
			    	}
			    }
			});
		}catch(err){
			reject(err);
		}
	});
};
var pokedex = new Pokedex(brain);
var crawler = new Crawler();

crawler.scan().then(function(){
	crawler.normalize().then(function(results){
		pokedex.input(results.samples).then(function(){

			setTimeout(function(){
				pokedex.train().then(function(){
					setTimeout(function(){
						pokedex.analyze(results.subject.decoded).then(function(result){
							console.log('Pokedex analysis completed successfully');
							console.log('Best match is:');
							console.log(result);
							var matchList = [];

							for(row in result){
								matchList.push(result[row]);
							};

							console.log(matchList);

							for(match in result){
								if(result[match] == Math.max.apply(null, matchList)){
									console.log(match);
								}
							}
						});
					}, 2000);
				});
			}, 2000);


		});
	});
	
});