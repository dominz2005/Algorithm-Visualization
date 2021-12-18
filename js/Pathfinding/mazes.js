// Creating maze using randomness

// Function for finding random position
function RandomPosition()
{
    let randomX = Math.floor(Math.random() * ((nodes.length - 1) - 1)) + 1;
    let randomY = Math.floor(Math.random() * ((nodes[0].length - 1) - 1)) + 1;

    while(nodes[randomX][randomY].className == 'wall')
    {
        randomX = Math.floor(Math.random() * ((nodes.length - 1) - 1)) + 1;
        randomY = Math.floor(Math.random() * ((nodes[0].length - 1) - 1)) + 1;
    }

    return new NormalNode(randomX, randomY);
}

// Function for creating a random maze
async function RandomMazeGenerator()
{
    // Setting everything (Deleting Track + Standby Off)
    if(!ready)
        return;
    ClearWalls();
    ClearPath();
    ready = false;

    await SpawnWalls(); // Function for creating side walls

    // Amount of places
    let size = Math.floor(((nodes.length - 2) * (nodes[0].length - 2)) * .25);

    for (let i = 0; i < size; i++)
    {
        // Stoping the algorithm if window size is changed
        if(stopAlgorithms == true)
            return;

        let position = RandomPosition(); // Random position
        if(nodes[position.xPos][position.yPos].className != 'start' && nodes[position.xPos][position.yPos].className != 'end')
            ColorChange(position.xPos, position.yPos, 'wall'); // A function that changes the color of a node

        await wait(true); // Waiting a moment before executing the next line of code
    }
    ready = true;
}



// Creating maze using Depth-first search algorithm

let depthFirstHelp = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));

// Possible nodes object
function PosibilityNode(posX, posY, posibilityNeighbour)
{
    this.posX = posX;
    this.posY = posY;
    this.posibilityNeighbour = posibilityNeighbour;
}

// A function to create possible neighbors
function GetPossibleNeighbours(posX, posY)
{
    let posibilityNeighbour = new Array();

    if(posX-2 > 0 && depthFirstHelp[posX - 2][posY])
    {
        posibilityNeighbour.push(new DetailNode(posX - 2, posY, posX - 1, posY));
        depthFirstHelp[posX - 2][posY] = false;
    }
    if(posY+2 < nodes[0].length && depthFirstHelp[posX][posY + 2])
    {
        posibilityNeighbour.push(new DetailNode(posX, posY + 2, posX, posY + 1));
        depthFirstHelp[posX][posY + 2] = false;
    }
    if(posX+2 < nodes.length && depthFirstHelp[posX + 2][posY])
    {
        posibilityNeighbour.push(new DetailNode(posX + 2, posY, posX + 1, posY));
        depthFirstHelp[posX + 2][posY] = false;
    }
    if(posY-2 > 0 && depthFirstHelp[posX][posY - 2])
    {
        posibilityNeighbour.push(new DetailNode(posX, posY - 2, posX, posY - 1));
        depthFirstHelp[posX][posY - 2] = false;
    }
    
    if(posibilityNeighbour.length != 0)
        return new PosibilityNode(posX, posY, posibilityNeighbour);
    return null;
}

// Function for creating a maze with Depth-first search algorithm
async function DepthFirstSearch()
{
    // Setting everything (Deleting Track + Standby Off)
    if(!ready)
        return;
    ClearWalls();
    ClearPath();
    ready = false;

    await SpawnWalls(); // Function for creating side walls
    FillMaze(depthFirstHelp); // Function for filling the maze

    // Stoping the algorithm if window size is changed
    if(stopAlgorithms == true)
        return;

    // Possible positions
    let posibilityPositions = new Array();
    posibilityPositions.push(GetPossibleNeighbours(1, 1));

    let randomIndex = Math.floor(Math.random() * posibilityPositions[0].posibilityNeighbour.length - 1);
    let current = posibilityPositions[0].posibilityNeighbour.splice(randomIndex, 1);
    
    while(posibilityPositions.length != 0)
    {
        // Stoping the algorithm if window size is changed
        if(stopAlgorithms == true)
            return;

        let newPosibilities = GetPossibleNeighbours(current[0].xPos, current[0].yPos);
        if(nodes[current[0].parentX][current[0].parentY].className != 'start' && nodes[current[0].parentX][current[0].parentY].className != 'end')
            ColorChange(current[0].parentX, current[0].parentY, ''); // A function that changes the color of a node
        if(nodes[current[0].xPos][current[0].yPos].className != 'start' && nodes[current[0].xPos][current[0].yPos].className != 'end')
            ColorChange(current[0].xPos, current[0].yPos, ''); // A function that changes the color of a node

        if(newPosibilities != null)
        {
            randomIndex = Math.floor(Math.random() * newPosibilities.posibilityNeighbour.length - 1);
            current = newPosibilities.posibilityNeighbour.splice(randomIndex, 1);
            posibilityPositions.push(newPosibilities);
            while(posibilityPositions[0] != undefined && posibilityPositions[0].posibilityNeighbour.length == 0)
                posibilityPositions.shift();
        }
        else
        {
            randomIndex = Math.floor(Math.random() * posibilityPositions[0].posibilityNeighbour.length - 1);
            current = posibilityPositions[0].posibilityNeighbour.splice(randomIndex, 1);
            while(posibilityPositions[0] != undefined && posibilityPositions[0].posibilityNeighbour.length == 0)
                posibilityPositions.shift();
        }
        
        await wait(false); // Waiting a moment before executing the next line of code
    }

    ready = true;
}





// Creating maze using Recursive-devision algorithm

// Function that generates a random number
function RandomNumber(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function for creating a maze with Recursive-devision algorithm
async function RecursiveDevision()
{
    // Setting everything (Deleting Track + Standby Off)
    if(!ready)
        return;
    ClearWalls();
    ClearPath();
    ready = false;

    await SpawnWalls(); // Function for creating side walls
    
    // Function for building the maze
    await Divide(true, 1, 1, nodes.length - 1, nodes[0].length - 1);

    // Stoping the algorithm if window size is changed
    if(stopAlgorithms == true)
        return;

    // Cleaning up disturbing classes
    for (let x = 0; x < nodes.length; x++) 
        for (let y = 0; y < nodes[x].length; y++)
            if(nodes[x][y].className == ' ')
                ColorChange(x, y, '');

    ready = true;
}

// A function that correctly places walls
async function Divide(orientation, minX, minY, maxX, maxY)
{
    // Stoping the algorithm if window size is changed
    if(stopAlgorithms == true)
        return;

    if (orientation) 
    {
        // If the space is too small, the allocation of walls ends
        if (maxX - minX < 2 || maxY - minY < 2)
            return;

        let y = Math.floor(RandomNumber(minY, maxY)/2)*2;

        // A function that puts a wall + a hole in it
        await GenerateHorizontalWall(minX, maxX, y);

        // Calling the function for new spaces
        await Divide(!orientation, minX, minY, maxX, y);
        await Divide(!orientation, minX, y + 1, maxX, maxY);
    } 
    else 
    {
        // If the space is too small, the allocation of walls ends
        if (maxX - minX < 2 || maxY - minY < 2)
            return;

        let x = Math.floor(RandomNumber(minX, maxX)/2)*2;
        
        // A function that puts a wall + a hole in it
        await GenerateVerticalWall(minY, maxY, x);

        // Calling the function for new spaces
        await Divide(!orientation, minX, minY, x, maxY);
        await Divide(!orientation, x + 1, minY, maxX, maxY);
    }
}

// A function for creating walls horizontally
async function GenerateHorizontalWall(minX, maxX, y) 
{
    // Stoping the algorithm if window size is changed
    if(stopAlgorithms == true)
        return;

    // If it goes outside the area, it does not generate a wall
    if(y == 0 || y == nodes[0].length - 1)
        return;

    // The position of the hole in the wall
    let hole = Math.floor(RandomNumber(minX, maxX-1)/2)*2;
    if(hole >= maxX-1)
        hole--;
    else
        hole++;

    for (let i = minX; i < maxX; i++) 
    {
        // Stoping the algorithm if window size is changed
        if(stopAlgorithms == true)
            return;

        if(nodes[i][y].className != '' && nodes[i][y].className != 'start' && nodes[i][y].className != 'end')
            return;
        if(nodes[i][y].className == 'start' || nodes[i][y].className == 'end')
            continue;

        if (i == hole) 
            ColorChange(i, y, ' ');
        else if(nodes[i][y].className == '')
            ColorChange(i, y, 'wall');
            
        await wait(true); // Waiting a moment before executing the next line of code
    }
}

// A function for creating walls verticly
async function GenerateVerticalWall(minY, maxY, x) 
{
    // Stoping the algorithm if window size is changed
    if(stopAlgorithms == true)
        return;

    // If it goes outside the area, it does not generate a wall
    if(x == 0 || x == nodes.length - 1)
        return;

    // The position of the hole in the wall
    let hole = Math.floor(RandomNumber(minY, maxY-1)/2)*2;
    if(hole >= maxY-1)
        hole--;
    else
        hole++;
        
    for (let i = minY; i < maxY; i++) 
    {
        // Stoping the algorithm if window size is changed
        if(stopAlgorithms == true)
            return;

        if(nodes[x][i].className != '' && nodes[x][i].className != 'start' && nodes[x][i].className != 'end')
            return;
        if(nodes[x][i].className == 'start' || nodes[x][i].className == 'end')
            continue;

        if (i == hole) 
            ColorChange(x, i, ' ');
        else if(nodes[x][i].className == '')
            ColorChange(x, i, 'wall');
        
        await wait(true); // Waiting a moment before executing the next line of code
    }
}




// Creating maze using Prim's algorithm

let primsHelp = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));

// A function for creating possible neighbour nodes
function GetPossiblePrimNeighbours(posX, posY)
{
    let posibilityNeighbour = new Array();
    if(posX-2 > 0 && primsHelp[posX - 2][posY])
    {
        posibilityNeighbour.push(new DetailNode(posX - 2, posY, posX - 1, posY));
        primsHelp[posX - 2][posY] = false;
    }
    if(posY+2 < nodes[0].length && primsHelp[posX][posY + 2])
    {
        posibilityNeighbour.push(new DetailNode(posX, posY + 2, posX, posY + 1));
        primsHelp[posX][posY + 2] = false;
    }
    if(posX+2 < nodes.length && primsHelp[posX + 2][posY])
    {
        posibilityNeighbour.push(new DetailNode(posX + 2, posY, posX + 1, posY));
        primsHelp[posX + 2][posY] = false;
    }
    if(posY-2 > 0 && primsHelp[posX][posY - 2])
    {
        posibilityNeighbour.push(new DetailNode(posX, posY - 2, posX, posY - 1));
        primsHelp[posX][posY - 2] = false;
    }

    if(posibilityNeighbour.length != 0)
        return posibilityNeighbour;
    return null;
}

// Function for creating a maze with Prim's algorithm
async function PrimsAlgorithm()
{
    // Setting everything (Deleting Track + Standby Off)
    if(!ready)
        return;
    ClearWalls();
    ClearPath();
    ready = false;

    await SpawnWalls(); // Function for creating side walls
    FillMaze(primsHelp); // Function for filling the maze
    
    // Stoping the algorithm if window size is changed
    if(stopAlgorithms == true)
        return;

    // Possible descents
    let queue = new Array();
    queue.push(new NormalNode(Math.floor((nodes.length - 1) / 2), Math.floor((nodes[0].length - 1) / 2)));

    while(queue.length != 0)
    {
        let randomIndex = Math.floor(Math.random() * queue.length);

        // Adjacent descents relative to a randomly selected one
        let neighbours = GetPossiblePrimNeighbours(queue[randomIndex].xPos, queue[randomIndex].yPos);

        queue.splice(randomIndex, 1);

        if(neighbours != null)
            for (let i = 0; i < neighbours.length; i++) 
            {
                // Stoping the algorithm if window size is changed
                if(stopAlgorithms == true)
                    return;

                if(nodes[neighbours[i].xPos][neighbours[i].yPos].className != 'start' && nodes[neighbours[i].xPos][neighbours[i].yPos].className != 'end')
                    ColorChange(neighbours[i].xPos, neighbours[i].yPos, ''); // A function that changes the color of a node
                if(nodes[neighbours[i].parentX][neighbours[i].parentY].className != 'start' && nodes[neighbours[i].parentX][neighbours[i].parentY].className != 'end')
                    ColorChange(neighbours[i].parentX, neighbours[i].parentY, ''); // A function that changes the color of a node
                
                queue.push(neighbours[i]);
                
                await wait(false); // Waiting a moment before executing the next line of code
            }
    }
    ready = true;
}



// Creating maze using Binary tree algorithm

let treeHelp = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));

// Function for creating a maze with Binary tree algorithm
async function BinaryTree()
{
    // Setting everything (Deleting Track + Standby Off)
    if(!ready)
        return;
    ClearWalls();
    ready = false;

    await SpawnWalls(); // Function for creating side walls
    FillMaze(treeHelp); // Function for filling the maze

    for (let i = 1; i < nodes.length - 1; i++) 
    {
        for (let j = 1; j < nodes[i].length - 1; j++) 
        {
            // Stoping the algorithm if window size is changed
            if(stopAlgorithms == true)
                return;
        
            if(i % 2 != 0 && j % 2 != 0)
            {
                let direction = Math.round(Math.random());
                if(j == nodes[i].length - 2 && i != nodes.length - 2 && nodes[i][j].className != 'start' && nodes[i][j].className != 'end')
                    ColorChange(i + 1, j, ''); // A function that changes the color of a node
                else if(i == nodes.length - 2 && j != nodes[i].length - 2 && nodes[i][j].className != 'start' && nodes[i][j].className != 'end')
                    ColorChange(i, j + 1, ''); // A function that changes the color of a node
                else if(direction == 0)
                    treeHelp[i + 1][j] = false;
                else
                    treeHelp[i][j + 1] = false;
                if(nodes[i][j].className != 'start' && nodes[i][j].className != 'end')
                    ColorChange(i, j, ''); // A function that changes the color of a node
                await wait(false); // Waiting a moment before executing the next line of code
            }
            else if(treeHelp[i][j] != true)
            {
                if(nodes[i][j].className != 'start' && nodes[i][j].className != 'end')
                    ColorChange(i, j, ''); // A function that changes the color of a node
                await wait(false); // Waiting a moment before executing the next line of code
            }
        }
    }
    
    ready = true;
}



// Creating maze using Cellular Automata

// Variables used to end or pause the script
let pauseAutomata = false;
let continueAutomata = true;

// Pausing the script
celularAutomataMore.querySelector('.stop').addEventListener('click', ()=>{pauseAutomata = !pauseAutomata});

// Ending the script
celularAutomataMore.querySelector('.finish').addEventListener('click', ()=>
{
    continueAutomata = false;
    celularAutomataMore.className = 'cellularAutomataMore closedOptionMore';
});

// Showing error during validation
function ShowError(form, inputIndex, errorIndex, showAlert)
{
    let errors = ["Wpisz numery oddzielone od siebie spacją", "Wpisz numery mniejsze niż 9 oddzielone od siebie spacją", "Wpisz numery większe niż -1 oddzielone od siebie spacją"];
    form.querySelectorAll('input')[inputIndex].className = 'errorInput';
    
    if(showAlert)
        alert(errors[errorIndex]);
}

// Checking if the user has filled in all the fields correctly
function CheckForm(form)
{
    let bVal = (form.querySelector('#Bval').value).split(' ');
    let sVal = (form.querySelector('#Sval').value).split(' ');

    errorExists = false;
    for (let i = 0; i < bVal.length; i++) 
    {
        if(isNaN(bVal[i]))
        {
            ShowError(form, 0, 0, !errorExists);
            errorExists = true;
        }
        if(bVal[i] > 8)
        {
            ShowError(form, 0, 1, !errorExists);
            errorExists = true;
        }
        if(bVal[i] < 0)
        {
            ShowError(form, 0, 2, !errorExists);
            errorExists = true;
        }
    }
    for (let i = 0; i < sVal.length; i++) 
    {
        if(isNaN(sVal[i]))
        {
            ShowError(form, 1, 0, !errorExists);
            errorExists = true;
        }
        if(sVal[i] > 8)
        {
            ShowError(form, 1, 1, !errorExists);
            errorExists = true;
        }
        if(sVal[i] < 0)
        {
            ShowError(form, 1, 2, !errorExists);
            errorExists = true;
        }
    }
    return !errorExists;
}

function ChangeNode(xPos, yPos, changeClass)
{
    this.xPos = xPos;
    this.yPos = yPos;
    this.changeClass = changeClass;
}

async function CelularWindow()
{
    // Setting everything (Standby Off)
    if(!ready)
        return;
    ready = false;
    continueAutomata = true;
    pauseAutomata = false;

    celularAutomataOpt.className = 'cellularAutomata';

    await celularAutomataOpt.querySelector('form').addEventListener('submit', async (event)=>
    {
        event.preventDefault();

        celularAutomataOpt.querySelector('#Bval').className = '';
        celularAutomataOpt.querySelector('#Sval').className = '';

        if(CheckForm(celularAutomataOpt.querySelector('form')))
        {
            celularAutomataOpt.className = 'cellularAutomata closedOption';
            celularAutomataMore.className = 'cellularAutomataMore'; // Opening a window with the ability to stop and terminate the script

            let bVal = (celularAutomataOpt.querySelector('#Bval').value).split(' '); // Getting B value
            let sVal = (celularAutomataOpt.querySelector('#Sval').value).split(' '); // Getting S value
            await CelularAutomata(bVal, sVal); // Starting the script
        }
    });
}

// A function for counting neighbors
function CountNeighbours(xPos, yPos)
{
    let neighbours = 0;
    if(xPos > 0)
    {
        if(yPos > 0)
            if(nodes[xPos - 1][yPos - 1].className == 'wall')
                neighbours++;
        if(nodes[xPos - 1][yPos].className == 'wall')
            neighbours++;
        if(yPos + 1 < nodes[xPos].length)
            if(nodes[xPos - 1][yPos + 1].className == 'wall')
                neighbours++;
    }
    if(yPos > 0)
        if(nodes[xPos][yPos - 1].className == 'wall')
            neighbours++;
    if(yPos + 1 < nodes[xPos].length)
        if(nodes[xPos][yPos + 1].className == 'wall')
            neighbours++;
    if(xPos + 1 < nodes.length)
    {
        if(yPos > 0)
            if(nodes[xPos + 1][yPos - 1].className == 'wall')
                neighbours++;
        if(nodes[xPos + 1][yPos].className == 'wall')
            neighbours++;
        if(yPos + 1 < nodes[xPos].length)
            if(nodes[xPos + 1][yPos + 1].className == 'wall')
                neighbours++;
    }

    return neighbours;
}

function CheckArray(posX, posY, arr)
{
    for (let i = 0; i < arr.length; i++)
        if(CountNeighbours(posX, posY) == parseInt(arr[i]))
            return true;
    return false;
}

// Function for creating a maze with Cellular Automata
async function CelularAutomata(bVal, sVal)
{
    while(continueAutomata)
    {
        if(!pauseAutomata || stopAlgorithms)
        {
            let toChange = new Array();
            let waitOrNot = false;
            for (let i = 0; i < nodes.length; i++) 
            {
                for (let j = 0; j < nodes[i].length; j++) 
                {
                    // Counting neighbors and taking the appropriate action
                    if(CheckArray(i, j, bVal) && nodes[i][j].className != 'start' && nodes[i][j].className != 'end')
                    {
                        toChange.push(new ChangeNode(i, j, 'wall'));
                        waitOrNot = true;
                    }
                    if(nodes[i][j].className == 'wall' && !CheckArray(i, j, sVal) || nodes[i][j].className == 'wall' && !CheckArray(i, j, sVal))
                    {
                        toChange.push(new ChangeNode(i, j, ''));
                        waitOrNot = true;
                    }
                }
            }
            for (let i = 0; i < toChange.length; i++) 
                ColorChange(toChange[i].xPos, toChange[i].yPos, toChange[i].changeClass); // A function that changes the color of a node
            if(waitOrNot)
                await wait(false); // Waiting a moment before executing the next line of code
        }
        await wait(false); // Waiting a moment before executing the next line of code
    }

    ready = true;
}