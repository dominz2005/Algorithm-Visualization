// All DOM elements
const container = document.querySelector('.container');

const clearWalls = document.querySelector('.clearWalls');
const clearPath = document.querySelector('.clearPath');

const form = document.querySelector('.pathForm');
const speedInput = document.querySelector('#speed');
const sliderDivs = document.querySelectorAll('.slider');
const customSectionPath = document.querySelector('.customSectionPath');
const customSectionMaze = document.querySelector('.customSectionMaze');
const mazeButton = document.querySelector('.mazeButton');
const menuSwitch = document.querySelector('.options').firstElementChild;
const celularAutomataOpt = document.querySelector('.cellularAutomata');
const celularAutomataMore = document.querySelector('.cellularAutomataMore');

// Tutorial variables
const tutorial = document.querySelector('.tutorial');
const tutButtons = tutorial.querySelector('.right').querySelector('.tButtons').querySelectorAll('button');
let srcs = ['clearBoard.jpg', 'pathFinded.jpg', 'algorithms.jpg', 'more.png', 'keys.jpg', 'button.jpg', 'mazes.png', 'cells.jpg', 'link.jpg'];
let alts = ['Image of clear board', 'Image of board with finded path', 'Image showing possible algorithms', 'Image showing more customization options', 'Image showing keys', 'Image showing button with text "FIND PATH"', 'Image showing possible algorithms and button with text "CREATE MAZE"', 'Image showing window with form', 'Clickable Text "Algorithm Visualization"'];
let titles = ['WELCOME TO THE SORTING ALGORITHMS!', 'WHAT PATHFINDING ALGORITHMS ARE?', 'CHOSING AN ALGORITHM!', 'MORE HELPFUL OPTIONS!', 'PLACING AND EDITING NODES!', 'STARTING THE VISUALIZATION!', 'GENERATING MAZES WITH ALGORITHMS!', 'CELLULAR AUTOMATA?!', 'ENJOY AND HAVE FUN!'];
let text = ['You will see a quick tutorial that will show you how to use this tool.', 'Pathfinding is a method to find the shortest path between two points in a short time.', 'If you want to choose an algorithm you need to press the “Pathfinding algorithm” drop-down menu.', 'You can change the speed of the algorithms by moving the slider “Time interval”, you can clear all walls by pressing “CLEAR WALLS” button, or even you can clear the entire path by pressing “CLEAR PATH” button.', 'Click on the board to add a node. By pressing on the keys you can choose what node you want to place on the board. To toggle destroying walls mode you have to double click “WALL NODE” key.', 'If you have set everything up press “FIND PATH” button to start the visualization of the algorithm.', 'You don’t have to place walls by yourself, you can use an algorithm for it. You just need to press the “Maze creation” drop-down menu, and then “CREATE MAZE” button. ', 'Yes you can even play with cellular automata here, you can get it using “Maze creation” drop-down menu, and “CREATE MAZE” button.', 'Now that you know how to use this tool you can play with it and have fun.'];
let subText = ['If you want you can skip it by pressing the “Skip Tutorial” button. Otherwise, press “Next”.', 'Note that not all algorithms return the correct path, some of them may be wrong.', 'Note that some of the algorithms are faster than the others.', 'Lover time interval values means faster execution of the code.', 'You can place walls even if the algorithm is running, and also after the algorithm finishes you can move end node and start node to see some changes.', 'You don’t need to refresh the website to start other algorithm visualization.', 'Some of the maze generation may take some time or may get a bit laggy.', 'B means a number of living neighbors that cause a dead cell to come alive, and S means a list of all the numbers of live neighbors that cause a live cell to remain alive.', 'If you want to check the code you can visit my <a href="https://github.com/dominz2005/Algorithm-Visualization" target="_blank">github</a>.'];

const radios = document.querySelectorAll('[name=block]');
const wallLabel = document.querySelector('[for=wall]').firstChild;

let ready = true;
let stopAlgorithms = false;

// Checking if mouse was clicked
let isMousePressed = false;
window.onmousedown = ()=> { isMousePressed = true; }
window.onmouseup = ()=> { isMousePressed = false; }

let buildWall = true;
wallLabel.ondblclick = function()
{
    buildWall = !buildWall;
    if(buildWall)
        wallLabel.innerText = '- WALL NODE';
    else
        wallLabel.innerText = '- DESTROY WALLS';
};

// A function that creates a 2D table
function CreateMultiArray(len1, len2)
{
    let arr = new Array(len1);
    for (let i = 0; i < len1; i++) 
        arr[i] = new Array(len2);

    return arr;
}

// Checking who has the turn and running the appropriate script
let turn = '';

function CheckTurn()
{
    switch (turn) 
    {
        case 'aStar':
            AStar(false);
            turn = 'aStar';
        break;
        case 'dijkstra':
            Dijsktra(false);
            turn = 'dijkstra';
        break;
        case 'greedy':
            Greedy(false);
            turn = 'greedy';
        break;
        case 'breadth':
            Breadth(false);
            turn = 'breadth';
        break;
    }
}

// Creating all blocks (nodes)
let nodes = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));
let startX, startY, endX, endY;
function CreateBoard()
{
    nodes = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));

    for (let row = 0; row < nodes.length; row++)
    {
        const tr = document.createElement('tr');
        for (let col = 0; col < nodes[row].length; col++)
        {
            const td = document.createElement('td');
            td.addEventListener('mousemove', ()=>
            {
                if(isMousePressed)
                    if(radios[1].checked)
                    {
                        if(buildWall && td.className == '')
                            td.className = 'wall';
                        else if(!buildWall && td.className == 'wall')
                            td.className = '';
                    }
            });
            td.addEventListener('mousedown', ()=>
            {
                if(radios[0].checked && td.className != 'end' && ready)
                {
                    if(startX != null)
                        nodes[startX][startY].className = '';
                    startX = row;
                    startY = col;
                    td.className = 'start';
                    CheckTurn();
                }
                if(radios[2].checked && td.className != 'start' && ready)
                {
                    if(endX != null)
                        nodes[endX][endY].className = '';
                    endX = row;
                    endY = col;
                    td.className = 'end';
                    CheckTurn();
                }
            });
            tr.appendChild(td);
            nodes[row][col] = td;
        }
        container.appendChild(tr);
    }

    // Starting position
    startX = Math.floor((nodes.length - 1) / 2);
    startY = 1;
    
    // Ending position
    endX = Math.floor((nodes.length - 1) / 2);
    endY = nodes[0].length - 2;

    nodes[startX][startY].className = 'start';
    
    nodes[endX][endY].className = 'end';
}
CreateBoard();

function ClearPath()
{
    if(ready)
    {
        for (let i = 0; i < nodes.length; i++) 
        {
            for (let j = 0; j < nodes[i].length; j++) 
            {
                if(nodes[i][j].className == 'neighbour' || nodes[i][j].className == 'path')
                    nodes[i][j].className = '';
            }
        }
        aStarDetails = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));
        dijsktraDetails = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));
        greedyDetails = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));
        breadthDetails = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));

        turn = '';
    }
}
function ClearWalls()
{
    if(ready)
    {
        for (let i = 0; i < nodes.length; i++) 
        {
            for (let j = 0; j < nodes[i].length; j++) 
            {
                if(nodes[i][j].className == 'wall')
                    nodes[i][j].className = '';
            }
        }
        depthFirstHelp = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));
        primsHelp = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));
        treeHelp = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));
    }
}

clearWalls.addEventListener('click', ClearWalls);

clearPath.addEventListener('click', ClearPath);

window.addEventListener('resize', async () => 
{
    container.innerHTML = '';
    stopAlgorithms = true;
    CreateBoard();
    ClearPath();
    ClearWalls();
    ready = true;
    await wait(true);
    stopAlgorithms = false;
});

// Function for changing the color of the blocks
function ColorChange(col, row, colorClassName)
{
    nodes[col][row].className = colorClassName;
}

// Function for waiting a given number of miliseconds
function wait(isFinisher) 
{
    if(!isFinisher)
        return new Promise((resolve) => setTimeout(resolve, speedInput.value));

    return new Promise((resolve) => setTimeout(resolve, speedInput.value * (6 / 10)));
}

// An object that holds position information
function NormalNode(xPos, yPos)
{
    this.xPos = xPos;
    this.yPos = yPos;
}
// An object that holds position and parent information
function DetailNode(xPos, yPos, parentX, parentY)
{
    this.xPos = xPos;
    this.yPos = yPos;
    this.parentX = parentX;
    this.parentY = parentY;
}




// SETUP FOR PATHFINDING

form.addEventListener('submit', (event)=>
{
    // Preventing the page from being reset when submitting the form
    event.preventDefault();

    customSectionPath.querySelectorAll('input[type=radio]').forEach(element => 
    {
        if(element.checked)
            switch (element.value) 
            {
                case 'aStar':
                    AStar(true);
                    turn = 'aStar'
                break;
                case 'dijkstra':
                    Dijsktra(true);
                    turn = 'dijkstra'
                break;
                case 'greedy':
                    Greedy(true);
                    turn = 'greedy'
                break;
                case 'breadth':
                    Breadth(true);
                    turn = 'breadth'
                break;
            }
    });
});
mazeButton.addEventListener('click', (event)=>
{
    customSectionMaze.querySelectorAll('input[type=radio]').forEach(element => 
    {
        if(element.checked)
            switch (element.value) 
            {
                case 'random':
                    RandomMazeGenerator();
                break;
                case 'depthFirst':
                    DepthFirstSearch();
                break;
                case 'recursive':
                    RecursiveDevision();
                break;
                case 'prims':
                    PrimsAlgorithm();
                break;
                case 'tree':
                    BinaryTree();
                break;
                case 'cells':
                    CelularWindow();
                break;
            }
    });
});

// Function for checking whether a given node is already in the list (searching for position X + positionY)
function FindInArray(main, checker)
{
    for (let i = 0; i < main.length; i++) 
    {
        if(main[i].xPos == checker.xPos && main[i].yPos == checker.yPos)
            return true;
    }
    return false;
}

// The function for creating the final path 
async function TracePath(details, delay)
{
    row = endX;
    col = endY;

    // If the end is next, the function ends
    if(nodes[details[row][col].parentX][details[row][col].parentY].className == 'start')
    {
        ready = true;
        return;
    }

    // A array that is the final path
    path = new Array();

    while (!(details[row][col].parentX == row && details[row][col].parentY == col)) 
    {
        if(nodes[details[row][col].xPos][details[row][col].yPos].className != 'end')
            path.push(new DetailNode(row, col, 0, 0));

        let bonusCol = details[row][col].parentY;
        row = details[row][col].parentX;
        col = bonusCol;

        // If it hits the beginning, it stops the loop
        if(nodes[details[row][col].parentX][details[row][col].parentY].className == 'start')
            break;
    }

    path.push(new DetailNode(row, col, 0, 0));

    // Path appearing
    while (path.length != 0)
    {
        if(nodes[path[path.length - 1].xPos][path[path.length - 1].yPos].className != 'end')
            ColorChange(path[path.length - 1].xPos, path[path.length - 1].yPos, 'path'); // A function that changes the color of a node
        path.pop();

        if(delay)
            await wait(true); // Waiting a moment before executing the next line of code
    }
    
    ready = true;
}




// SETUP FOR MAZES

// Function for creating side walls
async function SpawnWalls()
{
    let toBottom = 0; // From the start to the end
    let toTop = nodes.length - 1; // From the end to the begining
    for (let i = 0; i < nodes.length; i++)
    {
        // Stop the algorithm if the window size has been changed
        if(stopAlgorithms == true)
            return;

        ColorChange(toBottom, 0, 'wall'); // A function that changes the color of a node
        ColorChange(toTop, nodes[0].length - 1, 'wall'); // A function that changes the color of a node
        
        await wait(true); // Waiting a moment before executing the next line of code

        toBottom++;
        toTop--;
    }
    
    let toRight = 1; // Od początku do końca
    let toLeft = nodes[0].length - 1; // Od końca do początku
    for (let i = 1; i < nodes[0].length; i++) 
    {
        // Stop the algorithm if the window size has been changed
        if(stopAlgorithms == true)
            return;

        ColorChange(0, toLeft, 'wall'); // A function that changes the color of a node
        ColorChange(nodes.length - 1, toRight, 'wall'); // A function that changes the color of a node
        
        await wait(true); // Waiting a moment before executing the next line of code

        toRight++;
        toLeft--;
    }
}

// This function is needed when the entire maze must be filled at the beginning
function FillMaze(helpArr)
{
    let topX = 1;
    let topY = 1;
    let bottomX = helpArr.length - 2;
    let bottomY = helpArr[0].length - 2;

    for (let i = 0; i < (helpArr.length - 2) / 2; i++) 
    {
        for (let y = 0; y < helpArr[0].length - 2; y++)
        {
            // Stop the algorithm if the window size has been changed
            if(stopAlgorithms == true)
                return;

            helpArr[topX][topY] = true;
            helpArr[bottomX][bottomY] = true;
            if(nodes[topX][topY].className != 'start' && nodes[topX][topY].className != 'end')
                ColorChange(topX, topY, 'wall'); // A function that changes the color of a node
            if(nodes[bottomX][bottomY].className != 'start' && nodes[bottomX][bottomY].className != 'end')
                ColorChange(bottomX, bottomY, 'wall'); // A function that changes the color of a node

            topY++;
            bottomY--;
        }
        topY = 1;
        bottomY = helpArr[0].length - 2;
        topX++;
        bottomX--;
    }
}