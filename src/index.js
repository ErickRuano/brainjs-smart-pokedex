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