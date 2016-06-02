var text;
var count;

var mainState = {  

    preload: function() 
    {  
    	game.load.image('background', 'img/brick-destro/background.png');
    	game.load.image('paddle', 'img/brick-destro/paddle.png');
    	game.load.image('brick', 'img/brick-destro/brick.png');  
    	game.load.image('ball', 'img/brick-destro/ball.png'); 
    	game.load.image('score_bg','img/brick-destro/score_background.png');
    	game.load.image('restartBackgrund', 'img/restert_background.png');



    },

    create: function() 
    {  
    	game.add.sprite(0,0, 'background');
    	//game.stage.backgroundColor = '#ffffff';
    	game.physics.startSystem(Phaser.Physics.ARCADE);
		game.world.enableBody = true;

		this.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	    this.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

	    // Add the paddle at the bottom of the screen
	    this.paddle = game.add.sprite(200, 610, 'paddle');

	    // Make sure the paddle won't move when it hits the ball
	    this.paddle.body.immovable = true;

	    // Make sure the paddle won't go outside stage
	    this.paddle.body.collideWorldBounds = true;


	    // Create a group that will contain all the bricks
		    this.bricks = game.add.group();  

		    // Add 25 bricks to the group (5 columns and 5 lines)
		    for (var i = 0; i < 5; i++) {
		        for (var j = 0; j < 5; j++) {
		            // Create the brick at the correct position
		            var brick = game.add.sprite(40+i*60, 80+j*35, 'brick');

		            // Make sure the brick won't move when the ball hits it
		            brick.body.immovable = true;

		            // Add the brick to the group
		            this.bricks.add(brick);
		        }
		    }

		// Add the ball 
		    this.ball = game.add.sprite(200, 300, 'ball');  

		    // Give the ball some initial speed
		    this.ball.body.velocity.x = 200;
		    this.ball.body.velocity.y = 200;

		    // Make sure the ball will bounce when hitting something
		    this.ball.body.bounce.setTo(1); 
		    this.ball.body.collideWorldBounds = true;

		    this.game.add.sprite(10,10, 'score_bg');

			count = 0;

			    text = game.add.text(25, 20, "Point: 0", 
			    {
			        font: "bold 12px Arial",
			        fill: "#446f31",
			        stroke: "#ffffff",
			        strokeThickness: 2
			    });
    },

    update: function() 
    {  
    	//game.input.onDown.addOnce(this.updateText, this);

    	
	    if (this.left.isDown) this.paddle.body.velocity.x = -300;
	    else if (this.right.isDown) this.paddle.body.velocity.x = 300; 

	    // Stop the paddle when no key is pressed
	    else this.paddle.body.velocity.x = 0;     

	    // Add collisions between the paddle and the ball
		    game.physics.arcade.collide(this.paddle, this.ball);

		    // Call the 'hit' function when the ball hits a brick
		    game.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this);

		    // Restart the game if the ball is below the paddle
		    if (this.ball.y > this.paddle.y)
		    {
		     	var rbd = game.add.sprite(82,220, 'restartBackgrund');
		     	if(rbd = true ) 
		     	{		
		     		this.game.state.stop();
				}
		        //game.state.restart();  
		    }

	},

	hit: function(ball, brick) 
	{  
    brick.kill();
    count = count + 10;

	    text.setText("Point: " + count);
	},

};

// Initialize the game and start our state
var game = new Phaser.Game(360,640,Phaser.AUTO);
game.state.add('main', mainState);  
game.state.start('main');