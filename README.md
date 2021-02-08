### To run
`./host.bat` or `./host.command`


### 1. Description
The project "Drunk Driving" is a driving simulator game where the player is supposed to drive the car with somewhat difficult control while
touching the hearts to gain points and avoiding hitting the edges of the road. This is not a racing game and a player wins the game by reaching the destination before dead. 

Basic car movements are as follows: 
Forward - I, Reverse - K, Left - J, Right - L, Emergency Stop - U, 
Start - V, Restart - R,BGM - 1, Turn off the BGM/speeding sound -2/3

### 2. Contributions
Zhirong Wang
Contributions:
1. Car movement mechanics
2. Collision system
3. Camera Placement
4. Road 

Kaisha Maimaitiyimingjiang
Contributions:
1. Implement Trees,houses, and Power start objects,texture mapping the world
2. Background music,and other sound effect
3. fixed the control
4. html text
5. tried to add EventListener and shadow but failed

Karim Benlghalia:
1.	Updated the grass texture and implemented the sky. (used matrices transformations)
2.	Implemented the code of Shape_File_From that can render .obj files.
3.	Added 3D trees and car .obj files. (used matrices transformations)
4.	Created the start page.
5.	Implemented the wall hits points and the game over feature with the restart game option.
6.	Fixed the buggy bouncing car when it hits the walls. 
7.	Implemented the heart objects with collision detection and points collection. (used matrices transformation)
I also put so much time on working on shadow mapping but unfortunately, I failed.
8.I also put so much time on working on shadow mapping but unfortunately, I failed.

Yitao Zhang
Contributions:
1. Speedometer 
I found a instance of speedometer online, and used it as a template and adjusted its UI and changed the scale to fit our game. Because canvas is used to graph the speedometer so I had to change some code in html as well.
2. Buildings and houses, texture mapping the world
3. traffic light 
I tried to use a wain-in function to create a traffic light which was supposed to be at the beginning of the road and turn from red to green to hint the player the starting of the game. But the waitin function could not work properly. Although the light changes its color in the beginning
but the car is also free to drive before the traffic light turns green. 


### 3. Details on how to run
On windows computer, open `./host.bat`, or open `./host.command` if on windows.
Afterwards, open a browser (Google Chrome recommended) and navigate to `http://localhost:8000`.
Press V to start the game

### 4. Extra:
Our group invested a lot of time into creating shadow, but we did not figure out the proper way of doing it and the shadow looked wired so we decided to not include shadow. 

Cited website:
speedometer:https://codepen.io/lossan/pen/GmzPWY
obj loader: https://free3d.com/3d-models/obj