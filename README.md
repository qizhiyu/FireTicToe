# FireTicToe
A game for me and my kids who are currently 10417 kilometres from me

Design
--------------------------------------

Backend:	AngularFire<br />
Server:		Azure<br />
Frontend:	Bootstrap<br />

Function
--------------------------------------

1. 2 players play Tic-Toe game
2. Everyone gets a move each turn
3. When someone makes a line of three, he/she wins
4. When all positions are occupied, game due

Use cases
--------------------------------------

0. UI

Screen is a big area, nearly 100% of the browser window, with 3 x 3 = 9 grids;  
right 3/12 is information area, where player/game information is displayed. 

1. Create game

Only two players are allowed, and uncompleted game is reloaded at the beginning;  

2. Play game

There is a sign indicating whom has the turn, and the symbol (X/O);  
Current player clicks in an empty grid to set a symbol; 
  If the grid is not empty, nothing happens;  
  when it's the last grid, game over;
  
