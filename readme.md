Crawler
  .find()
  - It checks if there are any folders on the /samples directory and populates a samples array in the form of [ Sample ], as well as a db array in the form of [ "foldername" ];
  .normalize();
  - Runs the .normalize() method for for each sample including test subject, which is a resized and cropped version of the same picture.

Sample
  .normalize()
  - Generates a "*-normalized" file for the sample, which is a resized and cropped version of the same picture.
  .decode()
  - Generates an array containing each pixels rgb values for the sample.

Pokedex
  .input();
  Translates a Sample into Input, pushes to .data.
  .train()
  Takes .data and trains the neural network at .net.