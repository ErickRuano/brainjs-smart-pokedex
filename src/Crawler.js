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