var number_of_apple = 0;
var number_of_banana = 1;
var number_of_bamboshoot = 1;
var number_of_lettuce = 1;

var GameState={

  preload: function()
  {

    this.game.load.image('backyard','img/backyard.png');
    this.game.load.image('food_backgrounds', 'img/food_backgrounds2.png');
    this.game.load.image('cloths_background', 'img/cloths_background.png');
    this.game.load.image('shop_background', 'img/shop_background.png');
    this.game.load.image('games_background', 'img/games_background.png');
    this.game.load.image('restartBackgrund', 'img/restert_background.png');

    this.game.load.image('panda','img/panda_small.gif');
    this.game.load.image('hearth','img/hearth.png');
    this.game.load.image('game_pad', 'img/game_pad.png');
    this.game.load.image('coin', 'img/panda_coin.png');
    this.game.load.image('food', 'img/food.png');
    this.game.load.image('shop', 'img/shop.png');
    this.game.load.image('cloths','img/cloths.png');
    this.game.load.image('game_icon', 'img/game.png');
    this.game.load.image('apple', 'img/apple.png');
    this.game.load.image('banana', 'img/banana.png');
    this.game.load.image('bambooshoot', 'img/bambooshoot.png');
    this.game.load.image('lettuce', 'img/lettuce.png');
    this.game.load.image('tictactoe', 'img/tictactoe.png');
    this.game.load.image('black_hat', 'img/black_hat.png');
    this.game.load.image('blue_pants', 'img/blue_pants.png');
    this.game.load.image('blue_shirt', 'img/blue_shirt.png');
    this.game.load.image('blue_tie', 'img/blue_tie.png');

    this.game.load.image('apple_count', 'img/apple_count.png');
    this.game.load.image('bambooshoot_count', 'img/bambooshoot_count.png');
    this.game.load.image('banana_count', 'img/banana_count.png');
    this.game.load.image('lettuce_count', 'img/lettuce_count.png');

    this.load.spritesheet('pet1', 'img/pet.png', 115, 140, 5);
    this.load.spritesheet('pet_black_hat', 'img/pet_black_hat.png', 115, 173, 5);
    this.load.spritesheet('pet_blue_pants', 'img/pet_blue_pants.png', 115, 140, 5);
    this.load.spritesheet('pet_blue_tie', 'img/pet_blue_tie.png', 115, 140, 5);
    this.load.spritesheet('pet_blue_tshirt', 'img/pet_blue_tshirt.png', 115, 140, 5);
  },

  create: function()
  {
   	this.background = this.game.add.sprite(0,0, 'backyard');
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.placeItem, this);

    this.pet = this.game.add.sprite(180, 380, 'pet1',0);
    this.pet.animations.add('funnyfaces', [0, 1, 2, 3, 2, 1, 0], 7, false);
    this.pet.animations.add('eating', [0,1,0,1,0,1,0], 7, false);
    this.pet.anchor.setTo(0.5);

    //custom properties of the pet
    this.pet.customParams = {health: 100, fun: 100, coin: 800};

    //draggable pet
    this.pet.inputEnabled = true;
    this.pet.input.enableDrag();
	    	
    this.food3 = this.game.add.sprite(72,570,'food');
    this.food3.anchor.setTo(0.5);
    this.food3.inputEnabled = true;
    this.food3.events.onInputDown.add(this.clickOnActionFood,this);
    this.food3.clicked = false;


    //buttons

    this.cloths = this.game.add.sprite(144, 570, 'cloths');
    this.cloths.anchor.setTo(0.5);
    this.cloths.inputEnabled = true;
    this.cloths.events.onInputDown.add(this.clickOnActionCloths, this);
    this.cloths.clicked = false;



    this.shop = this.game.add.sprite(216, 570, 'shop');
    this.shop.anchor.setTo(0.5);
    this.shop.inputEnabled = true;
    this.shop.events.onInputDown.add(this.clickOnActionShop, this);
    this.shop.clicked = false;

    this.games = this.game.add.sprite(288, 570, 'game_icon');
    this.games.anchor.setTo(0.5);
    this.games.inputEnabled = true;
    this.games.events.onInputDown.add(this.clickOnActionGames, this);
    this.games.clicked = false;

    this.buttons = [this.food3, this.cloths, this.shop, this.games];

    //nothing selected
    this.selectedItem = null;

    //stats
    var style = { font: "16px Forte", fill: "#000"};

    this.hearth = this.game.add.sprite(45,10, 'hearth');
    //this.game.add.text(10, 20, "Health:", style);
    this.game_pad = this.game.add.sprite(145,10, 'game_pad');
    //this.game.add.text(140, 20, "Fun:", style);
    this.coin = this.game.add.sprite(235,10, 'coin');


    this.healthText = this.game.add.text(95, 20, "", style);
    this.funText = this.game.add.text(195, 20, "", style);
    this.coinText = this.game.add.text(285, 20, "", style);
    this.refreshStats();



    //decrease health and fun every 1 seconds
    this.statsDecreaser = this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.reduceProperties, this);


    this.statsDecreaser.timer.start();
    
    this.uiBlocked = false;


    },

	reduceProperties: function() 
	{
	    this.pet.customParams.health = Math.max(0, this.pet.customParams.health - 10);
	    this.pet.customParams.fun = Math.max(0, this.pet.customParams.fun - 10);
	    this.refreshStats();
	},

	refreshStats: function() 
	{
	    this.healthText.text = this.pet.customParams.health;
	    this.funText.text = this.pet.customParams.fun;
	    this.coinText.text = this.pet.customParams.coin;

	},

	placeItem: function() 
	{

	        
	        //show updated stats
	        this.refreshStats();

	},


	update: function() 
	{ 
	    if(this.pet.customParams.health <= 80 || this.pet.customParams.fun <= 80)
	    {
	    	this.pet.frame = 1;
	    }

	    if(this.pet.customParams.health <= 60 || this.pet.customParams.fun <= 60)
	    {
	    	this.pet.frame = 2;
	    }

	    if(this.pet.customParams.health <= 20 || this.pet.customParams.fun <= 20)
	    {
	    	this.pet.frame = 3;
	    }

	    if(this.pet.customParams.health <= 0 || this.pet.customParams.fun <= 0) 
	    {
	     	this.pet.customParams.health = 0;
	    	this.pet.customParams.fun = 0;
	    	this.pet.frame = 4;
	    	this.uiBlocked = true;

	    	this.restartBackgrund = this.game.add.sprite(82,220, 'restartBackgrund');
			this.restartBackgrund.clicked = false;
			this.restartBackgrund.inputEnabled = true;
	    	this.restartBackgrund.events.onInputDown.add(this.gameOver,this);
	    }
	},
	
	gameOver: function() 
	{    

		if(!this.restartBackgrund.clicked)
		{
			this.game.state.restart();
		}

    },


    clickOnActionFood_destroy: function()
    {
    		this.food_background.destroy();
    		this.food3.clicked = false;
    		
    		this.foodicon = [this.apple_count, this.banana_count, this.bambooshoot_count, this.lettuce_count];
    		this.foodtext = [this.appleText_count, this.bananaText_count, this.bambooshootText_count, this.lettuceText_count];
    		this.numberCountText = [this.number_of_apple_text, this.number_of_banana_text, this.number_of_bamboshoot_text, this.number_of_lettuce_text]
    		for (i = 0; i < 4; i++) 
    		{ 
    			this.foodicon[i].destroy();
    			this.foodtext[i].destroy();
    			this.numberCountText[i].destroy();
			}
    },


	clickOnActionFood: function()
	{
		if(this.food3.clicked)
		{
			this.clickOnActionFood_destroy();
		}
		else
		{
			this.clickOnAction_destroy_all();


	 		this.food_background = this.game.add.sprite(180,495,'food_backgrounds');
	    	this.food_background.anchor.setTo(0.5);
	    	this.food3.clicked = true; 

				var countnuberstyle = { font: "bold 8pt Arial", fill: "#000"};
			     	countnuberstyle.stroke = "#fff";
    			 	countnuberstyle.strokeThickness = 2;

				var countnuberstyle_number = { font: "bold 8pt Arial", fill: "#000"};

	    	    this.apple_count = this.game.add.sprite(80, 480, 'apple_count');
			    this.apple_count.anchor.setTo(0.5);
			    this.apple_count.inputEnabled = true;
			    this.apple_count.clicked = false;
			    this.apple_count.events.onInputDown.add(this.use_apple, this);	

			    this.banana_count = this.game.add.sprite(135,480, 'banana_count');
			    this.banana_count.anchor.setTo(0.5);
			    this.banana_count.inputEnabled = true;
			    this.banana_count.events.onInputDown.add(this.use_banana, this);

			    this.bambooshoot_count = this.game.add.sprite(200,480, 'bambooshoot_count');
			    this.bambooshoot_count.anchor.setTo(0.5);
			    this.bambooshoot_count.customParams = { health: 10, coin: -30 };
			    this.bambooshoot_count.inputEnabled = true;
			    this.bambooshoot_count.events.onInputDown.add(this.use_bambooshoot, this);

			    this.lettuce_count = this.game.add.sprite(270, 480, 'lettuce_count');
			    this.lettuce_count.anchor.setTo(0.5);
			    this.lettuce_count.customParams = {health: 50, coin: -60};
			    this.lettuce_count.inputEnabled = true;
			    this.lettuce_count.events.onInputDown.add(this.use_lettuce, this);



  				this.number_of_apple_text = this.game.add.text(84,480, "" + number_of_apple, countnuberstyle_number);
  				this.number_of_banana_text = this.game.add.text(139,481, "" + number_of_banana, countnuberstyle_number);
  				this.number_of_bamboshoot_text = this.game.add.text(204,481, "" + number_of_bamboshoot, countnuberstyle_number);
  				this.number_of_lettuce_text = this.game.add.text(274,481, "" + number_of_lettuce, countnuberstyle_number);

			    var foodstyle = { font: "bold 8pt Arial", fill: "#000"};
			     	foodstyle.stroke = "#fff";
    			 	foodstyle.strokeThickness = 2;

			    this.appleText_count = this.game.add.text(66, 500, "Apple", foodstyle);
			    this.bananaText_count = this.game.add.text(115,500, "Banana", foodstyle);
			    this.bambooshootText_count = this.game.add.text(170,500, "Bamboo Shoot", foodstyle);
			    this.lettuceText_count = this.game.add.text(255,500, "Lettuce", foodstyle);
		}
	},

	clickOnActionCloths_destroy : function()
	{
			this.cloths_background.destroy();
			this.cloths.clicked = false;

			this.clothsButton = [this.black_hat, this.blue_pants, this.blue_tie, this.blue_shirt];
			this.clothsText = [this.black_hatText, this.blue_pantsText, this.blue_tieText, this.blue_shirtText];

			for (i = 0; i < 4; i++) 
    		{ 
    			this.clothsButton[i].destroy();
    			this.clothsText[i].destroy();
			}
	},

	clickOnActionCloths: function()
	{
		if(this.cloths.clicked)
		{
			this.clickOnActionCloths_destroy();
		}
		else
		{

			this.clickOnAction_destroy_all();


			this.cloths_background = this.game.add.sprite(180,495,'cloths_background');
			this.cloths_background.anchor.setTo(0.5);
			this.cloths.clicked = true;

			var clothstyle = { font: "10px Arial", fill: "#000"};

				//Black Hat

				this.black_hat = this.game.add.sprite(80, 480, 'black_hat');
			    this.black_hat.anchor.setTo(0.5);

			    this.black_hat.inputEnabled = true;
			    this.black_hat.events.onInputDown.add(this.clickOnActionClothsChangeHat,this);
			    this.black_hat.clicked = false;

			    this.black_hatText = this.game.add.text(70, 500, "Hat", clothstyle);

			    //Blue Pants

			    this.blue_pants = this.game.add.sprite(135,480, 'blue_pants');
			    this.blue_pants.anchor.setTo(0.5);

			    this.blue_pants.inputEnabled = true;
			    this.blue_pants.events.onInputDown.add(this.clickOnActionClothsChangePants, this);
			    this.blue_pants.clicked = false;

			    this.blue_pantsText = this.game.add.text(110,500, 'Blue Pants', clothstyle);

			    //Blue Tie

			    this.blue_tie = this.game.add.sprite(200,480, 'blue_tie');
			    this.blue_tie.anchor.setTo(0.5);

			    this.blue_tie.inputEnabled = true;
			    this.blue_tie.events.onInputDown.add(this.clickOnActionClothsChangeTie, this);
			    this.blue_tie.clicked = false;

			    this.blue_tieText = this.game.add.text(180,500, 'Blue Tie', clothstyle);

			    //Blue T-Shirt

			    this.blue_shirt = this.game.add.sprite(270, 480, 'blue_shirt');
			    this.blue_shirt.anchor.setTo(0.5);

			    this.blue_shirt.inputEnabled = true;
			    this.blue_shirt.events.onInputDown.add(this.clickOnActionClothsChangeTshirt,this);
			    this.blue_shirt.clicked = false;

			    this.blue_shirtText = this.game.add.text(245,500, 'Blue T-Shirt', clothstyle);


		}
	},
	

	clickOnActionShop_destroy: function()
	{
			this.shop_background.destroy();
			this.shop.clicked = false;

    		this.foodiconShop = [this.apple, this.banana, this.bambooshoot, this.lettuce];
    		this.foodtextShop = [this.appleText, this.bananaText, this.bambooshootText, this.lettuceText];
    		this.pcfoodShop = [this.PriceappleText,this.PricebananaText, this.PricebambooshootText, this.PricelettuceText];

    		for (i = 0; i < 4; i++) 
    		{ 
    			this.foodiconShop[i].destroy();
    			this.foodtextShop[i].destroy();
    			this.pcfoodShop[i].destroy();
			}
	},

	clickOnActionShop: function()
	{
		if(this.shop.clicked)
		{
			this.clickOnActionShop_destroy();
		}
		else
		{

			this.clickOnAction_destroy_all();

			this.shop_background = this.game.add.sprite(180,495,'shop_background');
			this.shop_background.anchor.setTo(0.5);
			this.shop.clicked = true;

				this.apple = this.game.add.sprite(80, 480, 'apple');
			    this.apple.anchor.setTo(0.5);
			    this.apple.inputEnabled = true;
			    this.apple.events.onInputDown.add(this.buyitems_apple, this);	

			    this.banana = this.game.add.sprite(135,480, 'banana');
			    this.banana.anchor.setTo(0.5);
			    this.banana.inputEnabled = true;
			    this.banana.events.onInputDown.add(this.buyitems_banana, this);

			    this.bambooshoot = this.game.add.sprite(200,480, 'bambooshoot');
			    this.bambooshoot.anchor.setTo(0.5);
			    this.bambooshoot.inputEnabled = true;
			    this.bambooshoot.events.onInputDown.add(this.buyitems_bambooshoot, this);

			    this.lettuce = this.game.add.sprite(270, 480, 'lettuce');
			    this.lettuce.anchor.setTo(0.5);
			    this.lettuce.inputEnabled = true;
			    this.lettuce.events.onInputDown.add(this.buyitems_lettuce, this);


			    var foodstyle = { font: "bold 8pt Arial", fill: "#000"};
			     	foodstyle.stroke = "#fff";
    			 	foodstyle.strokeThickness = 2;

			    this.appleText = this.game.add.text(66, 500, "Apple", foodstyle);
			    this.PriceappleText = this.game.add.text(63, 510, "PC: 50", foodstyle);

			    this.bananaText = this.game.add.text(115,500, "Banana", foodstyle);
			    this.PricebananaText = this.game.add.text(117, 510, "PC: 40", foodstyle);

			    this.bambooshootText = this.game.add.text(170,500, "Bamboo Shoot", foodstyle);
			    this.PricebambooshootText = this.game.add.text(185, 510, "PC: 30", foodstyle);

			    this.lettuceText = this.game.add.text(255,500, "Lettuce", foodstyle);
			    this.PricelettuceText = this.game.add.text(256,510, "PC: 60", foodstyle);

		}
	},

	buyitems_apple: function()
	{
		var buyitemsText = {font: "bold 16pt Arial", fill: "#fff"};
			buyitemsText.stroke = "#A4CED9";
			buyitemsText.strokeThickness = 5;

		if(this.pet.customParams.coin >= 50)
		{
			if(number_of_apple < 9)
			{
				this.pet.customParams.coin -= 50;

				number_of_apple++; 

				this.refreshStats();
			}
			else
			{
			
			this.buyitems_apple_error = this.game.add.text(35,100, "No slot in bag for buy Apple", buyitemsText);
				
				this.game.add.tween(this.buyitems_apple_error)
                .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 3000);
			}

		}
		else
		{

			this.PriceAppleBuyItems = this.game.add.text(80,100, "No coin for buy Apple", buyitemsText);

				this.game.add.tween(this.PriceAppleBuyItems)
                .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 3000);
		}

	},

	buyitems_banana: function()
	{
		if(this.pet.customParams.coin >= 40)
		{

			var buyitemsText = {font: "bold 16pt Arial", fill: "#fff"};
				buyitemsText.stroke = "#A4CED9";
				buyitemsText.strokeThickness = 5;

			if(number_of_banana < 9)
			{
				this.pet.customParams.coin -= 40;

				number_of_banana++;

				this.refreshStats();
			}
			else
			{
			
			this.buyitems_banana_error = this.game.add.text(24,100, "No slot in bag for buy Banana", buyitemsText);
				
				this.game.add.tween(this.buyitems_banana_error)
                .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 3000);
			}

		}
		else
		{
			var buyitemsText = {font: "bold 16pt Arial", fill: "#fff"};
				buyitemsText.stroke = "#A4CED9";
				buyitemsText.strokeThickness = 5;

			this.PriceBananaBuyItems = this.game.add.text(70,100, "No coin for buy Banana", buyitemsText);
				
				this.game.add.tween(this.PriceBananaBuyItems)
                .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 3000);

		}

	},

	buyitems_bambooshoot: function()
	{
		if(this.pet.customParams.coin >= 30)
		{
			var buyitemsText = {font: "bold 16pt Arial", fill: "#fff", align: "center"};
				buyitemsText.stroke = "#A4CED9";
				buyitemsText.strokeThickness = 5;

			if(number_of_bamboshoot < 9)
			{
				this.pet.customParams.coin -= 30;

				number_of_bamboshoot++;

				this.refreshStats();
			}
			else
			{
			
			this.buyitems_bambooshoot_error = this.game.add.text(80,100, "No slot in bag for\nbuy Bamboo Shoot", buyitemsText);
				
				this.game.add.tween(this.buyitems_bambooshoot_error)
                .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 3000);
			}

		}
		else
		{
			var buyitemsText = {font: "bold 16pt Arial", fill: "#fff"};
				buyitemsText.stroke = "#A4CED9";
				buyitemsText.strokeThickness = 5;

			this.PriceBambooshootBuyItems = this.game.add.text(30,100, "No coin for buy Bamboo Shoot", buyitemsText);

				this.game.add.tween(this.PriceBambooshootBuyItems)
                .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 3000);
		}

	},

	buyitems_lettuce: function()
	{
		if(this.pet.customParams.coin >= 60)
		{

			var buyitemsText = {font: "bold 16pt Arial", fill: "#fff"};
				buyitemsText.stroke = "#A4CED9";
				buyitemsText.strokeThickness = 5;

			if(number_of_lettuce < 9)
			{
				this.pet.customParams.coin -= 60;

				number_of_lettuce++;

				this.refreshStats();
			}
			else
			{
			
			this.buyitems_lettuce_error = this.game.add.text(30,100, "No slot in bag for buy Lettuce", buyitemsText);
				
				this.game.add.tween(this.buyitems_lettuce_error)
                .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 3000);
			}

		}
		else
		{
			var buyitemsText = {font: "bold 16pt Arial", fill: "#fff"};
				buyitemsText.stroke = "#A4CED9";
				buyitemsText.strokeThickness = 5;

			this.PriceLettuceBuyItems = this.game.add.text(70,100, "No coin for buy Lettuce", buyitemsText);


			this.game.add.tween(this.PriceLettuceBuyItems)
                .to({alpha: 0}, 1000, Phaser.Easing.Default, true, 3000);

		}

	},

	clickOnActionGames_destroy: function()
	{
			this.games_background.destroy();
			this.games.clicked = false;

			this.tictactoe.destroy();
			this.tictactoeText.destroy();
			this.PointtictactoeText.destroy();
	},

	clickOnActionGames: function()
	{
		if(this.games.clicked)
		{
			this.clickOnActionGames_destroy();
		}
		else
		{

			this.clickOnAction_destroy_all();

			this.games_background = this.game.add.sprite(180,495,'games_background');
			this.games_background.anchor.setTo(0.5);
			this.games.clicked = true;

				this.tictactoe = this.game.add.sprite(80, 480, 'tictactoe');
			    this.tictactoe.anchor.setTo(0.5);
			    this.tictactoe.inputEnabled = true;

			    var gamestyle = { font: "10px Arial", fill: "#000"};

			    this.tictactoeText = this.game.add.text(58, 500, "TicTacToe", gamestyle);
			    this.PointtictactoeText = this.game.add.text(63, 510, "", gamestyle);
		}
	},

	clickOnActionClothsChangeHat: function()
	{
		if(this.black_hat.clicked)
		{
			this.pet.loadTexture('pet1');
			this.black_hat.clicked = false;
		}
		else
		{
			this.pet.loadTexture('pet_black_hat');
			this.black_hat.clicked = true;
		}
	},

	clickOnActionClothsChangeTie: function()
	{
		if(this.blue_tie.clicked)
		{
			this.pet.loadTexture('pet1');
			this.blue_tie.clicked = false;
		}
		else
		{
			this.pet.loadTexture('pet_blue_tie');
			this.blue_tie.clicked = true;
		}
	},

	clickOnActionClothsChangePants: function()
	{
		if(this.blue_pants.clicked)
		{
			this.pet.loadTexture('pet1');
			this.blue_pants.clicked = false;
		}
		else
		{
			this.pet.loadTexture('pet_blue_pants');
			this.blue_pants.clicked = true;
		}
	},
	
	clickOnActionClothsChangeTshirt: function()
	{
		if(this.blue_shirt.clicked)
		{
			this.pet.loadTexture('pet1');
			this.blue_shirt.clicked = false;
		}
		else
		{
			this.pet.loadTexture('pet_blue_tshirt');
			this.blue_shirt.clicked = true;
		}
	},
	
	clickOnAction_destroy_all: function()
	{

		if(this.food3.clicked)
		{
			this.clickOnActionFood_destroy();
		}
		else if(this.cloths.clicked)
		{
			this.clickOnActionCloths_destroy();
		}
		else if(this.shop.clicked)
		{
			this.clickOnActionShop_destroy();
		}
		else if(this.games.clicked)
		{
			this.clickOnActionGames_destroy();
		}

	},

	use_apple: function()
	{
		if(!this.apple_count.clicked)
		{
			
			var buyitemsText = {font: "bold 16pt Arial", fill: "#fff"};
				buyitemsText.stroke = "#A4CED9";
				buyitemsText.strokeThickness = 5;

			if(number_of_apple > 0)
			{
				this.pet.customParams.health += 50;
				number_of_apple--;
				this.refreshStats();
				this.clickOnActionFood_destroy();
				this.clickOnActionFood();
			}
			else
			{

				this.use_apple_error = this.game.add.text(30,100, "You don't have enough apply", buyitemsText);
				
				this.game.add.tween(this.use_apple_error)
                	.to({alpha: 0}, 1000, Phaser.Easing.Default, true, 3000);
			}


		}
	},

	use_banana: function()
	{
		if(!this.banana_count.clicked)
		{
			
			var buyitemsText = {font: "bold 16pt Arial", fill: "#fff"};
				buyitemsText.stroke = "#A4CED9";
				buyitemsText.strokeThickness = 5;

			if(number_of_banana > 0)
			{
				this.pet.customParams.health += 40;
				number_of_banana--;
				this.refreshStats();
				this.clickOnActionFood_destroy();
				this.clickOnActionFood();
			}
			else
			{

				this.use_banana_error = this.game.add.text(25,100, "You don't have enough banana", buyitemsText);
				
				this.game.add.tween(this.use_banana_error)
                	.to({alpha: 0}, 1000, Phaser.Easing.Default, true, 3000);
			}


		}
	},

	use_bambooshoot: function()
	{
		if(!this.bambooshoot_count.clicked)
		{
			
			var buyitemsText = {font: "bold 16pt Arial", fill: "#fff", align: "center"};
				buyitemsText.stroke = "#A4CED9";
				buyitemsText.strokeThickness = 5;

			if(number_of_bamboshoot > 0)
			{
				this.pet.customParams.health += 30;
				number_of_bamboshoot--;
				this.refreshStats();
				this.clickOnActionFood_destroy();
				this.clickOnActionFood();
			}
			else
			{

				this.use_bambooshoot_error = this.game.add.text(60,100, "You don't have enough\n bamboo shoot", buyitemsText);
				
				this.game.add.tween(this.use_bambooshoot_error)
                	.to({alpha: 0}, 1000, Phaser.Easing.Default, true, 3000);
			}


		}
	},

	use_lettuce: function()
	{
		if(!this.lettuce_count.clicked)
		{
			
			var buyitemsText = {font: "bold 16pt Arial", fill: "#fff", align: "center"};
				buyitemsText.stroke = "#A4CED9";
				buyitemsText.strokeThickness = 5;

			if(number_of_lettuce > 0)
			{
				this.pet.customParams.health += 60;
				number_of_lettuce--;
				this.refreshStats();
				this.clickOnActionFood_destroy();
				this.clickOnActionFood();
			}
			else
			{

				this.use_lettuce_error = this.game.add.text(30,100, "You don't have enough lettuce", buyitemsText);
				
				this.game.add.tween(this.use_lettuce_error)
                	.to({alpha: 0}, 1000, Phaser.Easing.Default, true, 3000);
			}


		}
	},
};

var game = new Phaser.Game(360,640,Phaser.AUTO);
game.state.add('GameState',GameState);
game.state.start('GameState');



