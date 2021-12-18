// Pathfinding using A* algorithm

let aStarDetails = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));

// Node object
function AStarNode(gCost, hCost, fCost, xPos, yPos)
{
    this.gCost = gCost;
    this.hCost = hCost;
    this.fCost = fCost;
    this.xPos = xPos;
    this.yPos = yPos;
}

// Function for finding the smallest F node (its index)
function FindLeastF(node)
{
    let least = node[0].fCost;
    let leastIndex = 0;

    for (let i = 0; i < node.length; i++)
        if(node[i].fCost < least)
        {
            least = node[i].fCost;
            leastIndex = i;
        }
    return leastIndex;
}

// A function to create nodes adjacent to the master node
function CreateNeighbourAStar(xPos, yPos, neighbourX, neighbourY)
{
    let g = Math.abs(neighbourX - startX) + Math.abs(neighbourY - startY);
    let h = Math.abs(neighbourX - endX) + Math.abs(neighbourY - endY);

    if(aStarDetails[neighbourX][neighbourY] == null)
        aStarDetails[neighbourX][neighbourY] = new DetailNode(neighbourX, neighbourY, xPos, yPos);
    else if(aStarDetails[neighbourX][neighbourY].parentX != neighbourX && aStarDetails[neighbourX][neighbourY].parentY != neighbourY)
        aStarDetails[neighbourX][neighbourY] = new DetailNode(neighbourX, neighbourY, xPos, yPos);
    if(nodes[neighbourX][neighbourY].className == 'wall')
        return null;

    return new AStarNode(g, h, g+h, neighbourX, neighbourY);
}

// Function for finding the shortest path with A* algorithm
async function AStar(delay)
{
    // Setting everything (Deleting Track + Standby Off)
    if(!ready)
        return;
    ClearPath();
    ready = false;

    // Open nodes
    openNodes = new Array();
    openNodes.push(new AStarNode(Infinity, Infinity, Infinity, startX, startY));

    // Closed nodes
    closedNodes = new Array();

    while(openNodes.length != 0)
    {
        // Finding lowest F in opened nodes
        let leastFIndex = FindLeastF(openNodes);
        let leastFNode = openNodes[leastFIndex];

        // Checking if node F is the end node
        if(leastFNode.xPos == endX && leastFNode.yPos == endY)
        {
            // Creating path
            TracePath(aStarDetails, delay);
            return;
        }

        // Stoping the algorithm if window size is changed
        if(stopAlgorithms == true)
            return;

        // Changing colors of nodes with lowest F
        if(nodes[leastFNode.xPos][leastFNode.yPos].className == '')
            ColorChange(leastFNode.xPos, leastFNode.yPos, 'neighbour'); // A function that changes the color of a node

        openNodes.splice(leastFIndex, 1);

        // Creating neighbours for lowest F node
        let neighbours = new Array(4);
        if(leastFNode.xPos > 0)
            neighbours.push(CreateNeighbourAStar(leastFNode.xPos, leastFNode.yPos, leastFNode.xPos-1, leastFNode.yPos, endX, endY));
        if(leastFNode.yPos > 0)
            neighbours.push(CreateNeighbourAStar(leastFNode.xPos, leastFNode.yPos, leastFNode.xPos, leastFNode.yPos-1, endX, endY));
        if(leastFNode.yPos < nodes[leastFNode.xPos].length - 1)
            neighbours.push(CreateNeighbourAStar(leastFNode.xPos, leastFNode.yPos, leastFNode.xPos, leastFNode.yPos+1, endX, endY));
        if(leastFNode.xPos < nodes.length - 1)
            neighbours.push(CreateNeighbourAStar(leastFNode.xPos, leastFNode.yPos, leastFNode.xPos+1, leastFNode.yPos, endX, endY));

        // Waiting a moment before executing the next line of code
        if(delay)
            await wait(false);

        for (let i = 0; i < neighbours.length; i++) 
            if(neighbours[i] != null)
            {
                if(FindInArray(openNodes, neighbours[i]))
                    continue;
                if(FindInArray(closedNodes, neighbours[i]))
                    continue;
                else
                    openNodes.push(neighbours[i]);
            }
        closedNodes.push(leastFNode);
    }

    ready = true;
}


// Pathfinding using Dijsktra algorithm

let dijsktraDetails = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));

// A function to create nodes adjacent to the master node
function CreateNeighbourDijsktra(parentX, parentY, neighbourX, neighbourY)
{
    if(nodes[neighbourX][neighbourY].className != 'wall')
    {
        if(nodes[neighbourX][neighbourY].className == '')
            nodes[neighbourX][neighbourY].className = 'neighbour';  // A function that changes the color of a node
        if(dijsktraDetails[neighbourX][neighbourY] == null)
            dijsktraDetails[neighbourX][neighbourY] = new DetailNode(neighbourX, neighbourY, parentX, parentY);
        else if(dijsktraDetails[neighbourX][neighbourY].parentX != neighbourX && dijsktraDetails[neighbourX][neighbourY].parentY != neighbourY)
            dijsktraDetails[neighbourX][neighbourY] = new DetailNode(neighbourX, neighbourY, parentX, parentY);
        return new NormalNode(neighbourX, neighbourY);
    }
    return null;
}

function Shuffle(arr) 
{
    let shuffled = new Array();
    while(arr.length > 0)
    {
        let index = Math.floor(Math.random() * arr.length);
        shuffled.push(arr[index]);
        arr.splice(index, 1)
    }
    return shuffled;
};

// Function used for finding the shortest path using Dijkstra algorithm
async function Dijsktra(delay)
{
    // Setting everything (Deleting Track + Standby Off)
    if(!ready)
        return;
    ClearPath();
    ready = false;

    // Main nodes
    let dijsktraNodes = new Array();
    dijsktraNodes.push(new NormalNode(startX, startY));
    
    // Closed nodes
    let closedNodes = new Array();

    while (dijsktraNodes.length != 0) 
    {
        dijsktraNodes = Shuffle(dijsktraNodes);
        for (let len = dijsktraNodes.length; len > 0; len--) 
        {
            // Waiting a moment before executing the next line of code
            if(delay)
                await wait(false);
    
            // Stoping the algorithm if window size is changed
            if(stopAlgorithms == true)
                return;

            // Create nodes adjacent to an open node
            let neighbours = new Array(4);
            if(dijsktraNodes[0].xPos > 0)
                neighbours.push(CreateNeighbourDijsktra(dijsktraNodes[0].xPos, dijsktraNodes[0].yPos, dijsktraNodes[0].xPos-1, dijsktraNodes[0].yPos));
            if(dijsktraNodes[0].yPos < nodes[0].length - 1)
                neighbours.push(CreateNeighbourDijsktra(dijsktraNodes[0].xPos, dijsktraNodes[0].yPos, dijsktraNodes[0].xPos, dijsktraNodes[0].yPos+1));
            if(dijsktraNodes[0].xPos < nodes.length - 1)
                neighbours.push(CreateNeighbourDijsktra(dijsktraNodes[0].xPos, dijsktraNodes[0].yPos, dijsktraNodes[0].xPos+1, dijsktraNodes[0].yPos));
            if(dijsktraNodes[0].yPos > 0)
                neighbours.push(CreateNeighbourDijsktra(dijsktraNodes[0].xPos, dijsktraNodes[0].yPos, dijsktraNodes[0].xPos, dijsktraNodes[0].yPos-1));

            for (let i = 0; i < neighbours.length; i++)
            {
                if(neighbours[i] != null)
                {
                    if(nodes[neighbours[i].xPos][neighbours[i].yPos].className == 'end')
                    {
                        // Creating path
                        TracePath(dijsktraDetails, delay);
                        return;
                    }
                    if(FindInArray(closedNodes, neighbours[i]))
                        continue;
                    if(FindInArray(dijsktraNodes, neighbours[i]))
                        continue;
                    dijsktraNodes.push(neighbours[i]);
                }
            }
            closedNodes.push(dijsktraNodes.shift());
        }
    }

    ready = true;
}


// Pathfinding using Greedy best-first search algorithm

let greedyDetails = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));

function CreateNeighbourGreedy(neighbourX, neighbourY, parentX, parentY)
{
    if(greedyDetails[neighbourX][neighbourY] == null)
        greedyDetails[neighbourX][neighbourY] = new DetailNode(neighbourX, neighbourY, parentX, parentY);
    else if(greedyDetails[neighbourX][neighbourY].parentX != neighbourX && greedyDetails[neighbourX][neighbourY].parentY != neighbourY)
        greedyDetails[neighbourX][neighbourY] = new DetailNode(neighbourX, neighbourY, parentX, parentY);
    if(nodes[neighbourX][neighbourY].className != 'wall')
        return new NormalNode(neighbourX, neighbourY);
    return null;
}

function FindClosest(open)
{
    let smallest = Math.abs(open[0].xPos - endX) + Math.abs(open[0].yPos - endY);
    let smallestIndex = 0;
    for (let i = 0; i < open.length; i++) 
        if(Math.abs(open[i].xPos - endX) + Math.abs(open[i].yPos - endY) < smallest)
        {
            smallest = Math.abs(open[i].xPos - endX) + Math.abs(open[i].yPos - endY);
            smallestIndex = i;
        }
    return smallestIndex;
}

// Function used for finding the shortest path using Greedy best-first search algorithm
async function Greedy(delay)
{
    // Setting everything (Deleting Track + Standby Off)
    if(!ready)
        return;
    ClearPath();
    ready = false;

    // Closed nodes
    let closed = new Array();
    closed.push(new NormalNode(startX, startY));
    
    // Queued nodes
    let queue = new Array();
    queue.push(new NormalNode(startX, startY));

    while(queue.length != 0)
    {
        let current = queue[FindClosest(queue)];
        queue.splice(FindClosest(queue), 1);

        if(nodes[current.xPos][current.yPos].className == '')
            nodes[current.xPos][current.yPos].className = 'neighbour';  // A function that changes the color of a node

        // Waiting a moment before executing the next line of code
        if(delay)
            await wait(false);

        // Stoping the algorithm if window size is changed
        if(stopAlgorithms == true)
            return;

        // Creating nodes adjacent to the closest node
        neighbours = new Array(4);
        if(current.xPos > 0)
            neighbours.push(CreateNeighbourGreedy(current.xPos-1, current.yPos, current.xPos, current.yPos))
        if(current.yPos < nodes[0].length - 1)
            neighbours.push(CreateNeighbourGreedy(current.xPos, current.yPos+1, current.xPos, current.yPos))
        if(current.xPos < nodes.length - 1)
            neighbours.push(CreateNeighbourGreedy(current.xPos+1, current.yPos, current.xPos, current.yPos))
        if(current.yPos > 0)
            neighbours.push(CreateNeighbourGreedy(current.xPos, current.yPos-1, current.xPos, current.yPos))

        for (let i = 0; i < neighbours.length; i++) 
        {
            if(neighbours[i] != null && !FindInArray(closed, neighbours[i]))
            {
                if(neighbours[i].xPos == endX && neighbours[i].yPos == endY)
                {
                    // Creating path
                    TracePath(greedyDetails, delay);
                    return;
                }
                closed.push(neighbours[i]);
                queue.push(neighbours[i]);
            }
        }
    }

    ready = true;
}



// Pathfinding using Breadth-First Search algorithm

let breadthDetails = CreateMultiArray(Math.floor((window.innerHeight - 220) / 27), Math.floor(window.innerWidth / 27));

// A function to create nodes adjacent to the master node
function CreateNeighbourBreadth(neighbourX, neighbourY, parentX, parentY)
{
    if(nodes[neighbourX][neighbourY].className != 'wall')
    {
        if(nodes[neighbourX][neighbourY].className == '')
            nodes[neighbourX][neighbourY].className = 'neighbour';  // A function that changes the color of a node
        if(breadthDetails[neighbourX][neighbourY] == null)
            breadthDetails[neighbourX][neighbourY] = new DetailNode(neighbourX, neighbourY, parentX, parentY);
        return new NormalNode(neighbourX, neighbourY);
    }
    return null;
}

// Function used for finding the shortest path using Breadth-First Search algorithm
async function Breadth(delay)
{
    // Setting everything (Deleting Track + Standby Off)
    if(!ready)
        return;
    ClearPath();
    ready = false;

    // Queued nodes
    let queue = new Array();
    queue.push(new NormalNode(startX, startY));

    // Closed nodes
    let closed = new Array();

    while(queue.length != 0)
    {
        // Waiting a moment before executing the next line of code
        if(delay)
            await wait(false);

        // Stoping the algorithm if window size is changed
        if(stopAlgorithms == true)
            return;

        // Creating nodes adjacent to the first node in queue
        neighbours = new Array(4);
        if(queue[0].xPos > 0)
            neighbours.push(CreateNeighbourBreadth(queue[0].xPos-1, queue[0].yPos, queue[0].xPos, queue[0].yPos))
        if(queue[0].yPos < nodes[0].length - 1)
            neighbours.push(CreateNeighbourBreadth(queue[0].xPos, queue[0].yPos+1, queue[0].xPos, queue[0].yPos))
        if(queue[0].xPos < nodes.length - 1)
            neighbours.push(CreateNeighbourBreadth(queue[0].xPos+1, queue[0].yPos, queue[0].xPos, queue[0].yPos))
        if(queue[0].yPos > 0)
            neighbours.push(CreateNeighbourBreadth(queue[0].xPos, queue[0].yPos-1, queue[0].xPos, queue[0].yPos))

        queue.shift();

        for (let i = 0; i < neighbours.length; i++) 
        {
            if(neighbours[i] != null && !FindInArray(closed, neighbours[i]))
            {
                if(neighbours[i].xPos == endX && neighbours[i].yPos == endY)
                {
                    // Creating path
                    TracePath(breadthDetails, delay);
                    return;
                }
                closed.push(neighbours[i]);
                queue.push(neighbours[i]);
            }
        }
    }

    ready = true;
}