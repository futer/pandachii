var GameState={
  preload: function()
  {

    this.game.load.image('backyard','img/backyard.png');
    this.game.load.image('food_backgrounds', 'img/food_backgrounds.png');
    this.game.load.image('cloths_background', 'img/cloths_background.png');
    this.game.load.image('shop_background', 'img/shop_background.png');
    this.game.load.image('games_background', 'img/games_background.png');

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


    this.load.spritesheet('pet1', 'img/pet.png', 115, 140, 5);
    this.load.spritesheet('pet_black_hat', 'img/pet_black_hat.png', 115, 173, 5);
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
    this.pet.customParams = {health: 100, fun: 100, coin: 0};

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



    //decrease health and fun every 10 seconds
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

 	pickItem: function(sprite, event) 
  	{
    if(!this.uiBlocked) 
    	{
	      //clear other buttons
	      this.clearSelection();

	      //alpha to indicate selection
	      //sprite.alpha = 0.4;

	      //save selection so we can place an item
	      this.selectedItem = sprite;
    	}
  	},

	placeItem: function(sprite, event) 
	{
	    if(this.selectedItem && !this.uiBlocked) {
	      //position of the user input
	      var x = event.position.x;
	      var y = event.position.y;

	      //create element in this place
	      var newItem = this.game.add.sprite(x, y, this.selectedItem.key);
	      newItem.anchor.setTo(0.5);
	      newItem.customParams = this.selectedItem.customParams;

	      //the pet will move to grab the item
	      this.uiBlocked = true;
	      var petMovement = game.add.tween(this.pet);
	      petMovement.to({x: x, y: y}, 700);
	      petMovement.onComplete.add(function(){
	        this.uiBlocked = false;

	        //destroy item
	        newItem.destroy();

	        //animate pet
	        this.pet.animations.play('eating');

	        //update pet stats
	        var stat;
	        for(stat in newItem.customParams) {
	          //make sure the property belongs to the object and not the prototype
	          if(newItem.customParams.hasOwnProperty(stat)) {
	            this.pet.customParams[stat] += newItem.customParams[stat];
	          }
	        }
	        
	        //show updated stats
	        this.refreshStats();

	        //clear selection
	        this.clearSelection();
	      }, this);
	      petMovement.start();      
	    }
	  },

	clearSelection: function() 
	{
	    //set alpha to 1
	    this.buttons.forEach(function(element){element.alpha = 1});

	    //clear selection
	    this.selectedItem = null;
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

	      this.game.time.events.add(2000, this.gameOver, this);
	    }

	},
	
	gameOver: function() 
	{    
    this.game.state.restart();
    },


	clickOnActionFood: function()
	{
		if(this.food3.clicked)
		{
    		this.food_background.destroy();
    		this.food3.clicked = false;
    		
    		this.foodicon = [this.apple, this.banana, this.bambooshoot, this.lettuce];
    		this.foodtext = [this.appleText, this.bananaText, this.bambooshootText, this.lettuceText];
    		this.pcfood = [this.PriceappleText,this.PricebananaText, this.PricebambooshootText, this.PricelettuceText];

    		for (i = 0; i < 4; i++) 
    		{ 
    			this.foodicon[i].destroy();
    			this.foodtext[i].destroy();
    			this.pcfood[i].destroy();
			}

		}
		else
		{
	 		this.food_background = this.game.add.sprite(180,495,'food_backgrounds');
	    	this.food_background.anchor.setTo(0.5);
	    	this.food3.clicked = true; 

	    	    this.apple = this.game.add.sprite(80, 480, 'apple');
			    this.apple.anchor.setTo(0.5);
			    this.apple.customParams = {health: 20, coin: -50};
			    this.apple.inputEnabled = true;
			    this.apple.events.onInputDown.add(this.pickItem, this);	

			    this.banana = this.game.add.sprite(135,480, 'banana');
			    this.banana.anchor.setTo(0.5);
			    this.banana.customParams = { health: 15, coin: -40};
			    this.banana.inputEnabled = true;
			    this.banana.events.onInputDown.add(this.pickItem, this);

			    this.bambooshoot = this.game.add.sprite(200,480, 'bambooshoot');
			    this.bambooshoot.anchor.setTo(0.5);
			    this.bambooshoot.customParams = { health: 10, coin: -30 };
			    this.bambooshoot.inputEnabled = true;
			    this.bambooshoot.events.onInputDown.add(this.pickItem, this);

			    this.lettuce = this.game.add.sprite(270, 480, 'lettuce');
			    this.lettuce.anchor.setTo(0.5);
			    this.lettuce.customParams = {health: 50, coin: -60};
			    this.lettuce.inputEnabled = true;
			    this.lettuce.events.onInputDown.add(this.pickItem, this);


			    var foodstyle = { font: "10px Arial", fill: "#000"};

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

	clickOnActionCloths: function()
	{
		if(this.cloths.clicked)
		{
			this.cloths_background.destroy();
			this.cloths.clicked = false;

			this.clothsButton = [this.black_hat];
			this.clothsText = [this.black_hatText];

			for (i = 0; i < 4; i++) 
    		{ 
    			this.clothsButton[i].destroy();
    			this.clothsText[i].destroy();
			}


		}
		else
		{
			this.cloths_background = this.game.add.sprite(180,495,'cloths_background');
			this.cloths_background.anchor.setTo(0.5);
			this.cloths.clicked = true;

				this.black_hat = this.game.add.sprite(80, 480, 'black_hat');
			    this.black_hat.anchor.setTo(0.5);

			    this.black_hat.inputEnabled = true;
			    this.black_hat.events.onInputDown.add(this.clickOnActionClothsChange,this);
			    this.black_hat.clicked = false;


			    var hatstyle = { font: "10px Arial", fill: "#000"};

			    this.black_hatText = this.game.add.text(66, 500, "Hat", hatstyle);


		}
	},
	
	clickOnActionShop: function()
	{
		if(this.shop.clicked)
		{
			this.shop_background.destroy();
			this.shop.clicked = false;
		}
		else
		{
			this.shop_background = this.game.add.sprite(180,495,'shop_background');
			this.shop_background.anchor.setTo(0.5);
			this.shop.clicked = true;
		}
	},

	clickOnActionGames: function()
	{
		if(this.games.clicked)
		{
			this.games_background.destroy();
			this.games.clicked = false;

			this.tictactoe.destroy();
			this.tictactoeText.destroy();
			this.PointtictactoeText.destroy();
		}
		else
		{
			this.games_background = this.game.add.sprite(180,495,'games_background');
			this.games_background.anchor.setTo(0.5);
			this.games.clicked = true;

				this.tictactoe = this.game.add.sprite(80, 480, 'tictactoe');
			    this.tictactoe.anchor.setTo(0.5);
			    this.tictactoe.inputEnabled = true;
			    //this.tictactoe.events.onInputDown.add(this, this);	

			    var gamestyle = { font: "10px Arial", fill: "#000"};

			    this.tictactoeText = this.game.add.text(58, 500, "TicTacToe", gamestyle);
			    this.PointtictactoeText = this.game.add.text(63, 510, "", gamestyle);
		}
	},

	clickOnActionClothsChange: function()
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

};

var game = new Phaser.Game(360,640,Phaser.AUTO);
game.state.add('GameState',GameState);
game.state.start('GameState');