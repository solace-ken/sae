// -----------------------------------
// dcb - dog | cat | bird - templates
//
// dogs are default
// -----------------------------------

// Dogs
const dogs_topbtns = `
	<button class="topbtn active">Dogs</button>
	<button onclick="showCats()" class="topbtn">Cats</button>
	<button onclick="showBirds()" class="topbtn">Birds</button>
`;

const dogs_view = `
<img src="pics/dogs_image0.jpg" title="Awwwwwww!"/>
`;

const dogs_navbtns = `
	<h4>View Dogs</h4>
	<button id="dogs_image1" class="navbtn" onclick="showImg(this)">Picture 1</button>
	<button id="dogs_image2" class="navbtn" onclick="showImg(this)">Picture 2</button>
	<button id="dogs_image3" class="navbtn" onclick="showImg(this)">Picture 3</button>
	<p id="ss"></p>
	<img src="/lib/img/1x1.png" onload="showScreenSize()">
`;

const dogs_content = `
	<h2>Dog Pics</h2>
	<p>Click the buttons to view some dog pics!</p>
	<p>The dog or domestic dog (Canis familiaris or Canis lupus familiaris) is a domesticated descendant of the wolf, characterized by an upturning tail. The dog is derived from an ancient, extinct wolf, and the modern wolf is the dog's nearest living relative. The dog was the first species to be domesticated, by hunter–gatherers over 15,000 years ago, before the development of agriculture. Due to their long association with humans, dogs have expanded to a large number of domestic individuals and gained the ability to thrive on a starch-rich diet that would be inadequate for other canids.</p>
	<p>The dog has been selectively bred over millennia for various behaviors, sensory capabilities, and physical attributes.Dog breeds vary widely in shape, size, and color. They perform many roles for humans, such as hunting, herding, pulling loads, protection, assisting police and the military, companionship, therapy, and aiding disabled people. Over the millennia, dogs became uniquely adapted to human behavior, and the human-canine bond has been a topic of frequent study. This influence on human society has given them the sobriquet of "man's best friend".</p>
	<br><br><br>
`;

// Cats:
const cats_topbtns = `
	<button onclick="showDogs()" class="topbtn">Dogs</button>
	<button class="topbtn active">Cats</button>
	<button onclick="showBirds()" class="topbtn">Birds</button>
`;

const cats_view = `
<img src="pics/cats_image0.jpg" title="Awwwwwww!"/>
`;

const cats_navbtns = `
	<h4>View Cats</h4>
	<button id="cats_image1" class="navbtn" onclick="showImg(this)">Picture 1</button>
	<button id="cats_image2" class="navbtn" onclick="showImg(this)">Picture 2</button>
	<button id="cats_image3" class="navbtn" onclick="showImg(this)">Picture 3</button>
	<p id="ss"></p>
	<img src="/lib/img/1x1.png" onload="showScreenSize()">
`;

const cats_content = `
	<h2>Cat Pics</h2>
	<p>Click the buttons to view some cat pics!</p>
	<p>The cat (Felis catus) is a domestic species of small carnivorous mammal. It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it from the wild members of the family. A cat can either be a house cat, a farm cat, or a feral cat; the latter ranges freely and avoids human contact. Domestic cats are valued by humans for companionship and their ability to kill rodents. About 60 cat breeds are recognized by various cat registries.</p>
	<p>The cat is similar in anatomy to the other felid species: it has a strong flexible body, quick reflexes, sharp teeth, and retractable claws adapted to killing small prey. Its night vision and sense of smell are well developed. Cat communication includes vocalizations like meowing, purring, trilling, hissing, growling, and grunting as well as cat-specific body language. A predator that is most active at dawn and dusk (crepuscular), the cat is a solitary hunter but a social species. It can hear sounds too faint or too high in frequency for human ears, such as those made by mice and other small mammals. Cats also secrete and perceive pheromones.</p>
	<p>The domestic cat was the second most popular pet in the United States, with 95.6 million cats owned.</p>
	<p>42 million households in America owned at least one cat.</p>
	<br><br><br>
`;


// Birds:
const birds_topbtns = `
	<button onclick="showDogs()" class="topbtn">Dogs</button>
	<button onclick="showCats()" class="topbtn">Cats</button>
	<button class="topbtn active">Birds</button>
`;

const birds_view = `
<img src="pics/birds_image0.jpg" title="Awwwwwww!"/>
`;

const birds_navbtns = `
	<h4>View Birds</h4>
	<button id="birds_image1" class="navbtn" onclick="showImg(this)">Picture 1</button>
	<button id="birds_image2" class="navbtn" onclick="showImg(this)">Picture 2</button>
	<button id="birds_image3" class="navbtn" onclick="showImg(this)">Picture 3</button>
	<p id="ss"></p>
	<img src="/lib/img/1x1.png" onload="showScreenSize()">
`;

const birds_content = `
	<h2>Bird Pics</h2>
	<p>Click the buttons to view some bird pics!</p>
	<p>Birds are a group of warm-blooded vertebrates constituting the class Aves, characterised by feathers, toothless beaked jaws, the laying of hard-shelled eggs, a high metabolic rate, a four-chambered heart, and a strong yet lightweight skeleton. Birds live worldwide and range in size from the 2.2 in. bee hummingbird to the 9 ft. 2 in. ostrich. There are about ten thousand living species, more than half of which are passerine, or "perching" birds.</p> 
	<p>Birds have been domesticated by humans both as pets and for practical purposes. Colourful birds, such as parrots and mynas, are bred in captivity or kept as pets. Falcons and cormorants have long been used for hunting and fishing, respectively. Birds have featured in culture and art since prehistoric times, when they were represented in early cave paintings.</p>
	<p>Amateur bird enthusiasts (called birdwatchers, twitchers or, more commonly, birders) number in the millions. Many homeowners erect bird feeders near their homes to attract various species. An estimated 75% of households in Britain provide food for birds at some point during the winter. Recreational birdwatching is an important part of the ecotourism industry.</p> 
	<br><br><br>
`;