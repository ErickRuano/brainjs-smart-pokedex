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