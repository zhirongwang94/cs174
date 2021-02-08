function draw(speed){ //yt
  //http://www.knowstack.com/html5-canvas-speedometer/
  var  canvas = document.getElementById("speed").getElementsByClassName("mycanvas")[0]; //
  var  context = canvas.getContext("2d");
  //context.clearRect(0,0,canvas.width, canvas.height);
  var centerX = canvas.width / 2;
  var centerY = canvas.height-15; //
  var radius = canvas.height-5; //

  context.beginPath();
  context.arc(centerX, centerY, radius, Math.PI*0.10, Math.PI*-1.1, true);

  var gradience = context.createRadialGradient(centerX, centerY, radius-radius/2, centerX, centerY, radius-radius/8);
  gradience.addColorStop(0, '#0ff000'); //
  gradience.addColorStop(1, '#000000');

  context.fillStyle = gradience;
  context.fill();
  context.closePath();
  context.restore();

  context.beginPath();
  context.strokeStyle = '#ffff00';
  context.translate(centerX,centerY);
  var increment = 1;
  context.font="13px Helvetica"; //
  for (var i=-18; i<=18; i++)
  {
    angle = Math.PI/30*i;
    sineAngle = Math.sin(angle);
    cosAngle = -Math.cos(angle);

    
    if (i % 5 == 0) {
    context.lineWidth = 5; //
    iPointX = sineAngle *(radius -radius/4);
    iPointY = cosAngle *(radius -radius/4);
    oPointX = sineAngle *(radius -radius/7);
    oPointY = cosAngle *(radius -radius/7);

    wPointX = sineAngle *(radius -radius/2.5);
    wPointY = cosAngle *(radius -radius/2.5);
    context.fillText((i+18)*increment,wPointX-2,wPointY+4);
    }
    else
    {
    context.lineWidth = 1; 			//
    iPointX = sineAngle *(radius -radius/5.5);
    iPointY = cosAngle *(radius -radius/5.5);
    oPointX = sineAngle *(radius -radius/7);
    oPointY = cosAngle *(radius -radius/7);
    }
    context.beginPath();
    context.moveTo(iPointX,iPointY);
    context.lineTo(oPointX,oPointY);
    context.stroke();
    context.closePath();
  }
  var numOfSegments = speed/increment;
  numOfSegments = numOfSegments-13;  //
  angle = Math.PI/30*numOfSegments;
  sineAngle = Math.sin(angle);
  cosAngle = -Math.cos(angle);
  pointX = sineAngle *(3/4*radius);
  pointY = cosAngle *(3/4*radius);

  context.beginPath();
  context.strokeStyle = '#000000';
  context.arc(0, 0, 19, 0, 2*Math.PI, true);
  context.fill();
        context.closePath();

  context.beginPath();    	
  context.lineWidth=6;
  context.moveTo(0,0);
        context.lineTo(pointX,pointY);
        context.stroke();
        context.closePath();
        context.restore();
        context.translate(-centerX,-centerY);
} //yt


var inited=false; //yt

window.Final_Project_Scene = window.classes.Final_Project_Scene =
class Final_Project_Scene extends Scene_Component
  { 
    constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 
          //look_at (eye,at, up)

/*
          this.eye = Vec.of(0,5,15);
          this.at = Vec.of(0,5,0);
          this.up = Vec.of(0,1,0);
          context.globals.graphics_state.camera_transform = Mat4.look_at( this.eye, this.at, this.up );
*/
          //checking 

          this.eye = Vec.of(50,600,100);
          this.at = Vec.of(50,-600,90);
          this.up = Vec.of(0,1,0);
          context.globals.graphics_state.camera_transform = Mat4.look_at( this.eye, this.at, this.up );

          this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { torus:  new Torus( 15, 15 ),
                         box: new Cube(), 
                         rect: new Rectangle(),       
                         torus2: new ( Torus.prototype.make_flat_shaded_version() )( 15, 15 ),
                         planet: new Subdivision_Sphere (4),
                         square: new Square(),
                         sky:  new Subdivision_Sphere (4),
                         trape: new Trapezoid(),
                         car: new Shape_From_File("assets/car2.obj"),
                         tree: new Shape_From_File("assets/tree.obj"),
                         power: new Shape_From_File("assets/heart.obj"),
                         house: new Shape_From_File("assets/cabin.obj"),
                         skyc1: new Shape_From_File("assets/skyc1.obj"),
                         skyc2: new Shape_From_File("assets/skyc2.obj"),
                       }

        this.submit_shapes( context, shapes );

        this.go = 0; 
        this.speed = 1; 
        this.turn = 0; 
        this.gameStart = false;
        this.gameOver = true;
        this.wall_hit =0;
        this.power =0;
        this.power_hit = false;
        this.wall_hit =5;
        this.bgmon = false;

        this.s = new Audio("car1.mp3");
        this.s.loop = false;


        this.car_model_transform = Mat4.identity().times(Mat4.translation( Vec.of(0,1,0)  ));  
        this.car_model_transform = this.car_model_transform.times(Mat4.scale( Vec.of(2,2,2))); 
        this.car_location = this.car_model_transform.times(Vec.of(0,0,0,1));  
        this.car_model_transform = this.car_model_transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0) )); 
        this.car_location = this.car_model_transform.times(Vec.of(0,0,0,1));  

        
        this.shadow_model_transform = Mat4.identity().times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0) ));
        this.shadow_model_transform = this.shadow_model_transform.times(Mat4.translation( Vec.of(0,1,0)  ));
        this.shadow_model_transform =  this.shadow_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
        this.shadow_model_transform = this.shadow_model_transform.times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0) )); 
        this.map_model_transform = Mat4.identity();
        this.sky_model_transform = Mat4.identity();
        this.road_model_transform = Mat4.identity();
        this.skyc1_model_transform = Mat4.identity(); //yt
        this.skyc2_model_transform = Mat4.identity(); //yt

        this.road_mt_stack = [];
        this.power_stack =[];

    
        this.materials =
          {  grasses: context.get_instance( Phong_Shader ).material( (Color.of( 0,0,0,1 ) ),{ambient: 1, texture: context.get_instance( "assets/grass.png", false )}) ,
             phong1: context.get_instance( Phong_Shader ).material( (Color.of( 0,0,0,1 ) ),{ambient: 1, texture: context.get_instance( "assets/eye.png", false )}) ,
             white: context.get_instance( Phong_Shader ).material( (Color.of( 0,0,0,1 ) ),{ambient: 1, texture: context.get_instance( "assets/fav.ico", false )}) ,
             phong2: context.get_instance( Phong_Shader ).material( (Color.of( 0,0,0,1 ) ),{ambient: 1, texture: context.get_instance( "assets/meteor.png", false )}) ,
             phong3: context.get_instance( Phong_Shader ).material( (Color.of( 0,0,0,1 ) ),{ambient: 1, texture: context.get_instance( "assets/crab_nebular.png", false )}) ,   
             sky: context.get_instance( Phong_Shader ).material( (Color.of( 0,0,0,1 ) ),{ambient: 1, texture: context.get_instance( "assets/sky.png", false )}) ,   
             road: context.get_instance( Phong_Shader ).material( (Color.of( 0,0,0,1 ) ),{ambient: 1, texture: context.get_instance( "assets/road1.png", false )}) ,   
            
            sun:      context.get_instance( Phong_Shader ).material( Color.of( 1 ,0, 1 ,1 ), { ambient: 1 } ),
            planet1:  context.get_instance( Phong_Shader ).material( Color.of( 218/225, 228/225, 222/225, 1 ),{ambient: 0}, {diffusivity: .1}),
            planet2:  context.get_instance( Phong_Shader ).material( Color.of( 163/225, 174/225, 126/225, 1 ),{ambient: 0}, {diffusivity: .1}, {specularity: 1} ),
            planet2_gourad:  context.get_instance( Phong_Shader ).material( Color.of( 163/225, 174/225, 126/225, 1 ),{ambient: 0}, {diffusivity: .1}, {specularity: 1}, {gourad: 1} ),            
            planet3:  context.get_instance( Phong_Shader ).material( Color.of( 169/255, 132/255, 79/255, 1), {ambient: 0}, {diffusivity: 1}, {specularity: 1} ),
            planet4:  context.get_instance( Phong_Shader ).material( Color.of( 173/255, 216/255, 230/255, 1), {ambient: 0}, {specularity: .9} ),
            moon:     context.get_instance( Phong_Shader ).material( Color.of( 218/225, 228/225, 222/225, 1 ),{ambient: 0}, {diffusivity: .1}),
            car: context.get_instance( Phong_Shader ).material(Color.of( 218/225, 228/225, 222/225, 1 ),{ambient: 0}, {diffusivity: .1}),
            tree: context.get_instance( Phong_Shader ).material(Color.of( 0,0,0,1 ),{ambient: 0.8, texture: context.get_instance( "/assets/leaves.png", false )}),
            power: context.get_instance( Phong_Shader ).material( Color.of( 1 ,0, 1 ,1 ), { ambient: 1 } ),
            skyc1: context.get_instance( Phong_Shader ).material( Color.of( 125/225, 220/225, 150/225, 1 ),{ambient: 0}, {diffusivity: .1} ), //yt
            skyc2: context.get_instance( Phong_Shader ).material( Color.of( 255/255, 10/255, 247/255, 1 ), { ambient: 0 } , {diffusivity: .1}), //yt
            green: context.get_instance( Phong_Shader ).material( Color.of( 0,1,0, 1 ), { ambient: 1, texture: context.get_instance( "assets/green.png", false )}), //yt
            red: context.get_instance( Phong_Shader ).material( Color.of( 1,0,0, 1 ), { ambient: 1, texture: context.get_instance( "assets/red.png", false )}),  //yt
            shadow:  context.get_instance( Phong_Shader).material(Color.of( 0,0,0,1 ),{ambient: 1, texture: context.get_instance( "/assets/leaves.png", true )}),
            house:  context.get_instance( Phong_Shader ).material(Color.of( 1,1,1, 1 ),{ambient: 1}, {diffusivity: 1}),
          } 

        this.lights = [ new Light( Vec.of( 0, 10, 6 ,1 ), Color.of( 1, 1, 1, 1 ), 1000 ) ];
        this.test_falg = 0;
      }


      make_control_panel() {
        this.key_triggered_button ("Go", ["i"], () => { 
            this.go = 1;
            this.speed += 0.15;
            this.turn=0;
           this.s.play();
            
             
        });
            
        this.key_triggered_button ("Break", ['k'], () => {
            this.speed -= 0.15; } );

        this.key_triggered_button ("Turn Left", ["j"], () => {if(this.speed != 0)this.turn += 0.1;} );
        this.key_triggered_button ("Turn Right", ["l"], () => {if(this.speed != 0)this.turn -= 0.1;} );
        this.new_line();

        this.key_triggered_button ("Emergency Stop", ["u"], () => { 
            
            this.speed = 0; 
            this.turn =0;
        });
        this.key_triggered_button ("test" , ["t"], () => {   this.test_falg = 1;
           // console.log(this.road_mt_stack[0]);

        } );
        this.new_line();
        this.key_triggered_button( "Start the game", ["r"], () => {this.restart(), this.go=1});
        this.key_triggered_button( "Restart (when dead)", ["v"], () => {this.start()});
        this.new_line();
        this.key_triggered_button ("BGM", ["1"], () => {        this.audio = new Audio("bgm.mp3")
        this.audio.loop = true
        this.audio.volume = 0.5
	this.audio.play()} );
	     this.key_triggered_button( "Turn off BGM", ["2"], () => {this.audio.volume = 0;});
	     this.key_triggered_button( "Turn off Engine sound", ["3"], () => {this.s.volume = 0;});   
      }
        
       

    //inRegion(location, region_x, region_z)
    collision(){
        //function setRegion_square( location, road_mt_stack )
        if (inRegion_square(this.car_location, this.road_mt_stack) == false ){

            this.speed *= -1.1;
            //this.wall_hit = this.wall_hit +1;
            this.wall_hit = this.wall_hit -1;
        }else{
            this.speed = this.speed;
        }
    }
    draw_green(graphics_state){ //yt
      this.green_model_transform=Mat4.identity();
      this.green_model_transform=this.green_model_transform.times(Mat4.translation(Vec.of(5,10,20)));
      this.green_model_transform = this.green_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
      this.shapes.green.draw(graphics_state,this.green_model_transform, this.materials.green);
    }
    draw_red(graphics_state){  //yt
      this.red_model_transform=Mat4.identity();
      this.red_model_transform=this.red_model_transform.times(Mat4.translation(Vec.of(5,10,20)));
      this.red_model_transform = this.red_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
      this.shapes.red.draw(graphics_state,this.red_model_transform, this.materials.red);
    }

  draw_skyc(graphics_state){ //yt
    this.skyc1_model_transform=Mat4.identity();
    this.skyc1_model_transform=this.skyc1_model_transform.times(Mat4.translation(Vec.of(-10,0,40)));
    this.skyc1_model_transform = this.skyc1_model_transform.times(Mat4.scale( Vec.of(8,8,8)));
    this.shapes.skyc1.draw(graphics_state,this.skyc1_model_transform, this.materials.skyc1);

    this.skyc2_model_transform=Mat4.identity();
    this.skyc2_model_transform=this.skyc2_model_transform.times(Mat4.translation(Vec.of(15,0,50)));
    this.skyc2_model_transform = this.skyc2_model_transform.times(Mat4.scale( Vec.of(8,8,8)));
    this.shapes.skyc2.draw(graphics_state,this.skyc2_model_transform, this.materials.skyc2);

    this.skyc1_model_transform=Mat4.identity();
    this.skyc1_model_transform=this.skyc1_model_transform.times(Mat4.translation(Vec.of(-5,0,90)));
    this.skyc1_model_transform = this.skyc1_model_transform.times(Mat4.scale( Vec.of(8,8,8)));
    this.shapes.skyc1.draw(graphics_state,this.skyc1_model_transform, this.materials.skyc1);

    this.skyc1_model_transform=Mat4.identity();
    this.skyc1_model_transform=this.skyc1_model_transform.times(Mat4.translation(Vec.of(0,0,100)));
    this.skyc1_model_transform = this.skyc1_model_transform.times(Mat4.scale( Vec.of(8,8,8)));
    this.shapes.skyc1.draw(graphics_state,this.skyc1_model_transform, this.materials.skyc1);

    this.skyc2_model_transform=Mat4.identity();
    this.skyc2_model_transform=this.skyc2_model_transform.times(Mat4.translation(Vec.of(60,0,80)));
    this.skyc2_model_transform = this.skyc2_model_transform.times(Mat4.scale( Vec.of(8,8,8)));
    this.shapes.skyc2.draw(graphics_state,this.skyc2_model_transform, this.materials.skyc2);

    this.skyc1_model_transform=Mat4.identity();
    this.skyc1_model_transform=this.skyc1_model_transform.times(Mat4.translation(Vec.of(25,0,170)));
    this.skyc1_model_transform = this.skyc1_model_transform.times(Mat4.scale( Vec.of(8,8,8)));
    this.shapes.skyc1.draw(graphics_state,this.skyc1_model_transform, this.materials.skyc1);

    this.skyc2_model_transform=Mat4.identity();
    this.skyc2_model_transform=this.skyc2_model_transform.times(Mat4.translation(Vec.of(40,0,120)));
    this.skyc2_model_transform = this.skyc2_model_transform.times(Mat4.scale( Vec.of(8,8,8)));
    this.shapes.skyc2.draw(graphics_state,this.skyc2_model_transform, this.materials.skyc2);

    this.skyc1_model_transform=Mat4.identity();
    this.skyc1_model_transform=this.skyc1_model_transform.times(Mat4.translation(Vec.of(110,0,90)));
    this.skyc1_model_transform = this.skyc1_model_transform.times(Mat4.scale( Vec.of(8,8,8)));
    this.shapes.skyc1.draw(graphics_state,this.skyc1_model_transform, this.materials.skyc1);

    this.skyc2_model_transform=Mat4.identity();
    this.skyc2_model_transform=this.skyc2_model_transform.times(Mat4.translation(Vec.of(90,0,170)));
    this.skyc2_model_transform = this.skyc2_model_transform.times(Mat4.scale( Vec.of(8,8,8)));
    this.shapes.skyc2.draw(graphics_state,this.skyc2_model_transform, this.materials.skyc2);

    this.skyc1_model_transform=Mat4.identity();
    this.skyc1_model_transform=this.skyc1_model_transform.times(Mat4.translation(Vec.of(70,0,3)));
    this.skyc1_model_transform = this.skyc1_model_transform.times(Mat4.scale( Vec.of(8,8,8)));
    this.shapes.skyc1.draw(graphics_state,this.skyc1_model_transform, this.materials.skyc1);

    this.skyc1_model_transform=Mat4.identity();
    this.skyc1_model_transform=this.skyc1_model_transform.times(Mat4.translation(Vec.of(40,0,40)));
    this.skyc1_model_transform = this.skyc1_model_transform.times(Mat4.scale( Vec.of(8,8,8)));
    this.shapes.skyc1.draw(graphics_state,this.skyc1_model_transform, this.materials.skyc2);

    this.skyc1_model_transform=Mat4.identity();
    this.skyc1_model_transform=this.skyc1_model_transform.times(Mat4.translation(Vec.of(55,0,70)));
    this.skyc1_modsel_transform = this.skyc1_model_transform.times(Mat4.scale( Vec.of(8,8,8)));
    this.shapes.skyc1.draw(graphics_state,this.skyc1_model_transform, this.materials.skyc1);
  }

  
  draw_tree(graphics_state){

  this.house_model_transform = Mat4.identity();
  this.house_model_transform = this.house_model_transform.times(Mat4.translation( Vec.of(198,3, 310)));
  this.house_model_transform  = this.house_model_transform.times(Mat4.scale( Vec.of(10,10,10)));
  this.shapes.house.draw(graphics_state,this.house_model_transform,this.materials.house);
    

  this.tree_model_transform = Mat4.identity();
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(-7,5, 0)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
  this.tree_location = this.tree_model_transform.times(Vec.of(0,0,0,1)); 
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.tree);
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.shadow);
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(-1,0, 8)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.tree);
 
 
  this.tree_model_transform = Mat4.identity();
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(-7,5, 0)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(25,0, 25)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.tree);
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.shadow);

  this.tree_model_transform = Mat4.identity();
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(-7,5, 0)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(35,0, 25)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.tree);
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.shadow);

  this.tree_model_transform = Mat4.identity();
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(-7,5, 0)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(45,0, 25)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.tree);
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.shadow);

  this.tree_model_transform = Mat4.identity();
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(-7,5, 0)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(45,0, 15)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.tree);
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.shadow);

  this.tree_model_transform = Mat4.identity();
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(-7,5, 0)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(45,0, 10)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.tree);
this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.shadow);

  this.tree_model_transform = Mat4.identity();
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(-7,5, 0)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(45,0, 5)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.tree);
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.shadow);

  this.tree_model_transform = Mat4.identity();
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(-7,5, 0)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(38,0, 25)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.tree);
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.shadow);

  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(45,0, 20)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.tree);
  this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.shadow);

  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(-7,5, 0)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,0, 10)));
  this.tree_model_transform = this.tree_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
  //this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.shadow);

  this.tree_model_transform = Mat4.identity();
  for(var i = 1; i< 10; i++)
  {
    for(var k = 0; k< 10; k++)
    {
      this.tree_model_transform = Mat4.identity();
      this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(45*i,5, 45*k)));
      if (i == 1 && k==6 )
      {
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,-4, 0)));
        this.power_stack.push( this.tree_model_transform);
        this.shapes.power.draw(graphics_state, this.tree_model_transform, this.materials.power);
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,4, 0)));
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,0, 10)));
      }
      if(i == 3 && k == 0)
      {
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,-4, 0)));
        this.power_stack.push( this.tree_model_transform);
        this.shapes.power.draw(graphics_state, this.tree_model_transform, this.materials.power);
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,4, 0)));
      }

      if(k==0)
      {
         //this.shapes.power.draw(graphics_state, this.tree_model_transform, this.materials.power);
         this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,0, -10)));
      }
 
       if (i == 2 && k==2 )
      {
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,-4, 0)));
        this.power_stack.push( this.tree_model_transform);
        this.shapes.power.draw(graphics_state, this.tree_model_transform, this.materials.power);
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,4, 0)));
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(10,0, 0)));
      }
       if (i == 3 && k==5 )
      {
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,-4, 0)));
        this.power_stack.push( this.tree_model_transform);
        this.shapes.power.draw(graphics_state, this.tree_model_transform, this.materials.power);
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,4, 0)));
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,0, 10)));
      }
       if (i == 4 && k==2 )
      {
       this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,-4, 0)));
        this.power_stack.push( this.tree_model_transform);
        this.shapes.power.draw(graphics_state, this.tree_model_transform, this.materials.power);
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,4, 0)));
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,0, -15)));
      }
       if (i == 4 && k==5 )
      {
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,-4, 0)));
        this.power_stack.push( this.tree_model_transform);
        this.shapes.power.draw(graphics_state, this.tree_model_transform, this.materials.power);
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,4, 0)));
        this.tree_model_transform = this.tree_model_transform.times(Mat4.translation( Vec.of(0,0, -10)));
      }


        this.tree_model_transform = this.tree_model_transform.times(Mat4.scale( Vec.of(2,2,2)));
        this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.tree);
      //this.shapes.tree.draw(graphics_state, this.tree_model_transform, this.materials.shadow);

    }
    
  }
  
}

    draw_box(graphics_state, dt)
    {
      //this.car_model_transform = this.car_model_transform.times(Mat4.rotation(Math.PI/2, Vec.of(1,1,0) ));
       if(this.go == 1){
                this.collision();
                this.power_collision();
                var distance = dt * -1 * this.speed;
                
                this.car_model_transform = this.car_model_transform.times(Mat4.rotation(dt * this.turn, Vec.of(0,1,0)  ));
                this.car_model_transform = this.car_model_transform.times(Mat4.translation( [distance,0,0 ]));

                this.shadow_model_transform = this.shadow_model_transform.times(Mat4.rotation(dt * this.turn, Vec.of(0,1,0)  ));
                this.shadow_model_transform = this.shadow_model_transform.times(Mat4.translation( [distance,0,0 ]));
                //this.car_model_transform = this.car_model_transform.times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0) ));

                //catch the camera 
                var desired = Mat4.inverse(this.car_model_transform.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0) ))
                                                                   .times(Mat4.translation([0,2.5,10])) );
                graphics_state.camera_transform = desired;

            }

      //update the car location 
      //this.car_model_transform = Mat4.identity();
    
      //this.car_model_transform = this.car_model_transform.times(Vec.of(0,0,0,1));
      this.car_location = this.car_model_transform.times(Vec.of(0,0,0,1)); 
      this.shapes.car.draw(graphics_state, this.car_model_transform, this.materials.car);
      //this.shapes.car.draw(graphics_state,this.car_model_transform,this.materials.shadow);
   
      
    }

    draw_map(graphics_state)
    {
      this.map_model_transform = Mat4.identity().times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0) ))
                                                .times(Mat4.scale(Vec.of(40,40,40)));
      for (var v=0; v<34; v++){
          for (var h=0; h<34; h++){
              this.shapes.square.draw(graphics_state, this.map_model_transform, this.materials.grasses);    
              this.map_model_transform = this.map_model_transform.times(Mat4.translation(Vec.of(2,0,0) ));
              
          }
          this.map_model_transform = this.map_model_transform.times(Mat4.translation(Vec.of(-2*h,2,0) ));
      }
    }

    draw_road(graphics_state)
    {
      this.road_mt_stack = [];
      this.road_model_transform = Mat4.identity().times(Mat4.translation(Vec.of(1,0,1)));
      this.road_model_transform = this.road_model_transform                                                                                               
                                                .times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0) ))        
                                                .times(Mat4.scale(Vec.of(8,8,1)))
                                                .times(Mat4.rotation(Math.PI/-2, Vec.of(0,0,1)))
                                             //   .times(Mat4.rotation(Math.PI/12, Vec.of(0,0,1)))
                                                .times(Mat4.translation(Vec.of(0,0,-0.1)))  
                                                ;                        
      
      this.road_model_transform = this.road_model_transform
                                                 .times(Mat4.rotation(Math.PI/-2, Vec.of(0,0,1) ));
      
                                              
    
      for (var h=0; h<5; h++){
          //this.shapes.power.draw(graphics_state, this.road_model_transform, this.materials.power);
          this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);
          this.road_model_transform = this.road_model_transform.times(Mat4.translation(Vec.of(0,-2,0) ));   
      }
        
            
      this.road_model_transform = this.road_model_transform
                                            .times(Mat4.translation(Vec.of(-0.5,0,0)))
                                            .times(Mat4.shear(Vec.of(0,0.5,0), Vec.of(0,0,0), Vec.of(0,0,0)))                                              
                                            ;  
      this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
      this.road_mt_stack.push(this.road_model_transform);
      

      this.road_model_transform = this.road_model_transform
                                    .times(Mat4.translation(Vec.of(0,-2,0)))
                                    .times(Mat4.translation(Vec.of(-0.2,0,0)))
                                    .times(Mat4.shear(Vec.of(0,0.2,0), Vec.of(0,0,0), Vec.of(0,0,0)))                                              
                                    ;  
      this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
      this.road_mt_stack.push(this.road_model_transform);


      this.road_model_transform = this.road_model_transform
                                    .times(Mat4.translation(Vec.of(0,-2,0)))
                                    .times(Mat4.translation(Vec.of(0.7,0,0)))
                                    .times(Mat4.shear(Vec.of(0,-0.7,0), Vec.of(0,0,0), Vec.of(0,0,0)))                                              
                                    ;  
      this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
      this.road_mt_stack.push(this.road_model_transform);

     
     // drawing tunning, TOFIX, replave rectangle region with the trape region 

      for (var i=1; i<=9; i++){
          this.road_model_transform = this.road_model_transform
                                .times(Mat4.translation(Vec.of(0,-2,0)))
                                .times(Mat4.translation(Vec.of(0,1,0)))
                                .times(Mat4.rotation( i==1? -0.2 : -0.4,Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,-1,0)))

                                ;  
          this.shapes.trape.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);
      }

      // straight road again 
      this.road_model_transform = this.road_model_transform
                            .times(Mat4.translation(Vec.of(0,-2,0)))
                            .times(Mat4.translation(Vec.of(0,1,0)))
                            .times(Mat4.rotation( i= -0.2,Vec.of(0,0,1)))
                            .times(Mat4.translation(Vec.of(0,-1,0)))
                        ;

      this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
      this.road_mt_stack.push(this.road_model_transform);

      for (var i=0; i<2; i++){
            this.road_model_transform = this.road_model_transform
                        .times(Mat4.translation(Vec.of(0,-2,0)))
                    ;

          this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

    //tunning again 

      for (var i=1; i<=1; i++){
          this.road_model_transform = this.road_model_transform
                                .times(Mat4.translation(Vec.of(0,i==1? -2 : 2,0)))
                                .times(Mat4.rotation(Math.PI, Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,-1,0)))
                                .times(Mat4.rotation( i==1? 0.2 : 0.4,Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,1,0)))

                                ;  
          this.shapes.trape.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

      for (var i=2; i<=5; i++){
          this.road_model_transform = this.road_model_transform
                                .times(Mat4.translation(Vec.of(0,i==1? -2 : 2,0)))
                              //  .times(Mat4.rotation(Math.PI, Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,-1,0)))
                                .times(Mat4.rotation( i==1? 0.2 : 0.4,Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,1,0)))

                                ;  
          this.shapes.trape.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }


    // straight again
      this.road_model_transform = this.road_model_transform
                            .times(Mat4.translation(Vec.of(0,2,0)))
                            .times(Mat4.translation(Vec.of(0,-1,0)))
                            .times(Mat4.rotation( i= 0.2,Vec.of(0,0,1)))
                            .times(Mat4.translation(Vec.of(0,1,0)))
                        ;

      this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
      this.road_mt_stack.push(this.road_model_transform);

      for (var i=0; i<2; i++){
            this.road_model_transform = this.road_model_transform
                        .times(Mat4.translation(Vec.of(0,2,0)))
                    ;

          this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

      //turn again 
      for (var i=1; i<=5; i++){
          this.road_model_transform = this.road_model_transform
                                .times(Mat4.translation(Vec.of(0,2,0)))
                         //       .times(Mat4.rotation(Math.PI, Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,-1,0)))
                                .times(Mat4.rotation( i==1? 0.2 : 0.4,Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,1,0)))

                                ;  
          this.shapes.trape.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

       //straight again 
      this.road_model_transform = this.road_model_transform
                            .times(Mat4.translation(Vec.of(0,2,0)))
                            .times(Mat4.translation(Vec.of(0,-1,0)))
                            .times(Mat4.rotation( i= 0.2,Vec.of(0,0,1)))
                            .times(Mat4.translation(Vec.of(0,1,0)))
                        ;

      this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
      this.road_mt_stack.push(this.road_model_transform);

      for (var i=0; i<2; i++){
            this.road_model_transform = this.road_model_transform
                        .times(Mat4.translation(Vec.of(0,2,0)))
                    ;

          this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

      //turn again 
            for (var i=1; i<=1; i++){
          this.road_model_transform = this.road_model_transform
                                .times(Mat4.translation(Vec.of(0,2,0)))
                         //       .times(Mat4.rotation(Math.PI, Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,-1,0)))
                                .times(Mat4.rotation( i==1? 0.2 : 0.4,Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,1,0)))

                                ;  
          this.shapes.trape.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

             //straight again 
      this.road_model_transform = this.road_model_transform
                            .times(Mat4.translation(Vec.of(0,2,0)))
                            .times(Mat4.translation(Vec.of(0,-1,0)))
                            .times(Mat4.rotation( i= 0.2,Vec.of(0,0,1)))
                            .times(Mat4.translation(Vec.of(0,1,0)))
                        ;

      this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
      this.road_mt_stack.push(this.road_model_transform);

      for (var i=0; i<5; i++){
            this.road_model_transform = this.road_model_transform
                        .times(Mat4.translation(Vec.of(0,2,0)))
                    ;

          this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

      //turn again 
            for (var i=1; i<=2; i++){
          this.road_model_transform = this.road_model_transform
                                .times(Mat4.translation(Vec.of(0,2,0)))
                         //       .times(Mat4.rotation(Math.PI, Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,-1,0)))
                                .times(Mat4.rotation( i==1? 0.2 : 0.4,Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,1,0)))

                                ;  
          this.shapes.trape.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

             //straight again 
      this.road_model_transform = this.road_model_transform
                            .times(Mat4.translation(Vec.of(0,2,0)))
                            .times(Mat4.translation(Vec.of(0,-1,0)))
                            .times(Mat4.rotation( i= 0.2,Vec.of(0,0,1)))
                            .times(Mat4.translation(Vec.of(0,1,0)))
                        ;

      this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
      this.road_mt_stack.push(this.road_model_transform);

      for (var i=0; i<2; i++){
            this.road_model_transform = this.road_model_transform
                        .times(Mat4.translation(Vec.of(0,2,0)))
                    ;

          this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

      //turn again 
            for (var i=1; i<=1; i++){
          this.road_model_transform = this.road_model_transform
                                .times(Mat4.translation(Vec.of(0,2,0)))
                                .times(Mat4.rotation(Math.PI, Vec.of(0,0,1)))
                            //    .times(Mat4.rotation(Math.PI, Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,1,0)))
                                .times(Mat4.rotation( i==1? -0.2 : -0.4,Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,-1,0)))

                                ;  
          this.shapes.trape.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

            for (var i=2; i<=9; i++){
          this.road_model_transform = this.road_model_transform
                                .times(Mat4.translation(Vec.of(0,-2,0)))
                            //    .times(Mat4.rotation(Math.PI, Vec.of(0,0,1)))
                            //    .times(Mat4.rotation(Math.PI, Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,1,0)))
                                .times(Mat4.rotation( i==1? -0.2 : -0.4,Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,-1,0)))

                                ;  
          this.shapes.trape.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

             //straight again 
      this.road_model_transform = this.road_model_transform
                            .times(Mat4.translation(Vec.of(0,-2,0)))
                            .times(Mat4.translation(Vec.of(0,1,0)))
                            .times(Mat4.rotation( i= -0.2,Vec.of(0,0,1)))
                            .times(Mat4.translation(Vec.of(0,-1,0)))
                        ;

      this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
      this.road_mt_stack.push(this.road_model_transform);

      for (var i=0; i<6; i++){
            this.road_model_transform = this.road_model_transform
                        .times(Mat4.translation(Vec.of(0,-2,0)))
                    ;

          this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }


        //turn again 
      for (var i=1; i<=1; i++){
          this.road_model_transform = this.road_model_transform
                                .times(Mat4.translation(Vec.of(0,-2,0)))
                                .times(Mat4.rotation(Math.PI, Vec.of(0,0,1)))
                            //    .times(Mat4.rotation(Math.PI, Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,-1,0)))
                                .times(Mat4.rotation( i==1? 0.2 : 0.4,Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,1,0)))

                                ;  
          this.shapes.trape.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

                  //turn again 
    for (var i=2; i<=5; i++){
          this.road_model_transform = this.road_model_transform
                                .times(Mat4.translation(Vec.of(0,2,0)))
                            //    .times(Mat4.rotation(Math.PI, Vec.of(0,0,1)))
                            //    .times(Mat4.rotation(Math.PI, Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,-1,0)))
                                .times(Mat4.rotation( i==1? 0.2 : 0.4,Vec.of(0,0,1)))
                                .times(Mat4.translation(Vec.of(0,1,0)))

                                ;  
          this.shapes.trape.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

       //straight again 
      this.road_model_transform = this.road_model_transform
                            .times(Mat4.translation(Vec.of(0,2,0)))
                            .times(Mat4.translation(Vec.of(0,-1,0)))
                            .times(Mat4.rotation( i= 0.2,Vec.of(0,0,1)))
                            .times(Mat4.translation(Vec.of(0,1,0)))
                        ;

      this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
      this.road_mt_stack.push(this.road_model_transform);

      this.power_model_transform= Mat4.identity().times(Mat4.translation( Vec.of(0,2, 35)));
      this.power_model_transform= this.power_model_transform.times(Mat4.scale( Vec.of(1,1,1))).times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
      this.shapes.power.draw(graphics_state, this.power_model_transform, this.materials.power);
      this.shapes.power.draw(graphics_state, this.power_model_transform, this.materials.shadow);
      this.power_stack.push(this.power_model_transform);

      for (var i=0; i<2; i++){
            this.road_model_transform = this.road_model_transform
                        .times(Mat4.translation(Vec.of(0,2,0)))
                    ;
                    this.power_model_transform= Mat4.identity().times(Mat4.translation( Vec.of(4,2, 15)));
                    this.power_model_transform= this.power_model_transform.times(Mat4.scale( Vec.of(1,1,1))).times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
                    this.shapes.power.draw(graphics_state, this.power_model_transform, this.materials.power);
                    this.power_stack.push(this.power_model_transform);
          this.shapes.square.draw(graphics_state, this.road_model_transform, this.materials.road);
          this.road_mt_stack.push(this.road_model_transform);

      }

    

    }
    

    draw_sky(graphics_state)
    {

      this.sky_model_transform = Mat4.identity().times(Mat4.scale(Vec.of(470,470,470)));
      //this.sky_model_transform = this.sky_model_transform.times(Vec.of(0,0,0,1));
      this.shapes.sky.draw(graphics_state, this.sky_model_transform, this.materials.sky);

      // this.sky_model_transform = Mat4.identity()
      //                                           .times(Mat4.translation(Vec.of(0, 20, 0)))
      //                                           .times(Mat4.rotation(Math.PI/2, Vec.of(1,0,0) ))
      //                                           .times(Mat4.scale(Vec.of(50,50,10)))
      //                                           ;
      // for (var v=0; v<10; v++){
      //     for (var h=0; h<10; h++){
      //         this.shapes.square.draw(graphics_state, this.sky_model_transform, this.materials.sky);    
      //         this.sky_model_transform = this.sky_model_transform.times(Mat4.translation(Vec.of(2,0,0) ));
      //     }
      //     this.sky_model_transform = this.sky_model_transform.times(Mat4.translation(Vec.of(-2*h,2,0) ));
      // }
    }
    power_collision(){
        //function setRegion_square( location, road_mt_stack )
       //function setRegion_square( location, road_mt_stack )
       if (this.inRegion_power(this.car_location, this.power_stack) == true ){

        this.power += 1;
        return;
        
    }else{
        this.power = this.power;
    }

    }

    inRegion_power( location, road_mt_stack ){
      for (var i=0; i<road_mt_stack.length; i++){
        var point = Mat4.inverse(road_mt_stack[i]).times(location);
        var x = point[2];
        var y = point[0];
        if (!( x < -1 || x > 1 ||  y < -1.1 || y > 1.1 )){ //not outside the square, inside the square
          return true;
        }
        if (i == road_mt_stack.length){
          return false;
        } 
      }   
      return false; 
    }
    
  draw_power(){

}


    display( graphics_state )
      {

        graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;


        this.draw_sky(graphics_state);  
        this.draw_map(graphics_state);  
        this.draw_box(graphics_state, dt);   
        this.draw_tree(graphics_state);
        this.draw_road(graphics_state);
        this.displayUI();
        this.draw_skyc(graphics_state);
        //this.draw_power(graphics_state);
        draw(Math.abs(this.speed));

      }
      
      start(){
          var element = document.getElementById("startScreen");
             element. parentNode.removeChild(element);
             this.go = 1;
            //this.speed += 0.3; 
      }
      restart(){
        if(this.wall_hit<=0){
        sessionStorage.setItem("reloading", "true");
       location.reload();
       this.start();
        }
        
      
      
      
      }

      displayUI()
      {
            var score = document.getElementById("score");
             score.innerHTML = this.wall_hit;
           // var speed = document.getElementById("health");
           // for (var i=120; i>0; i=i-5){
           // var temp = Math.abs(Math.round(this.speed) +i);
           // speed.innerHTML =  Math.min(120, Math.max(0, temp));
          
          //}
                     
          
          var temp = Math.abs(Math.round(this.wall_hit));
          var power = document.getElementById("power");
            power.innerHTML = this.power;
            
             var gameOver = document.getElementById("gameover");
           if(this.wall_hit<=0){
             this.wall_hit=0;
             score.innerHTML = 0;
             this.turn=0;
             this.speed=0;
             gameOver.innerHTML = "Game Over. Press (r) to restart";
           }
           else
           {
              gameOver.innerHTML = "";
           }
           // var gameOver = document.getElementById("gameover");
           // var health = document.getElementById("health");
           // health.style.color = "#FF0000";
          //  health.innerHTML = '<img src="assets/img/full_heart.png"> </img>'.repeat(this.health);
          //  health.innerHTML += '<img src="assets/img/empty_heart.png"> </img>'.repeat(3-this.health);
            //if(this.gameOver)
          //  {
                  
               //   gameOver.innerHTML = "Game Over. Press (p) to restart";
        //    }
        //    else
        //    {
                //  gameOver.innerHTML = "";
        //    }

      }


      
  }

  
