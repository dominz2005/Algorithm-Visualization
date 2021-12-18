// Changing the tutorial window
function PreviousSkip()
{
    // Getting the current index
    let current = parseInt(tutorial.querySelector('.count').innerText.split('/')[0]);

    current--;
    if(current == 0)
    {
        tutorial.className = 'tutorialClosed';
        return;
    }  
    if(current == 1)
        tutButtons[0].innerText = 'SKIP TUTORIAL';
    else
        tutButtons[1].innerText = 'NEXT';
        
    // Changing texts
    tutorial.querySelector('.left').innerHTML = `<img src="img/Pathfinding/${srcs[current - 1]}" alt="${alts[current - 1]}">`;
    tutorial.querySelector('h2').innerText = titles[current - 1];
    tutorial.querySelector('h3').innerText = text[current - 1];
    tutorial.querySelector('p').innerHTML = subText[current - 1];
    tutorial.querySelector('.count').innerText = `${current}/9`;
    tutButtons[1].innerText = 'NEXT';

}
function NextFinish()
{
    // Getting the current index
    let current = parseInt(tutorial.querySelector('.count').innerText.split('/')[0]);

    current++;
    if(current == 10)
    {
        tutorial.className = 'tutorialClosed';
        return;
    }
    if(current == 9)
    {
        tutorial.querySelector('.left').innerHTML = `<a href="index.html"><img src="img/Pathfinding/${srcs[current - 1]}" alt="${alts[current - 1]}"></a>`;
        tutButtons[1].innerText = 'FINISH';
    }
    else
    {
        tutorial.querySelector('.left').innerHTML = `<img src="img/Pathfinding/${srcs[current - 1]}" alt="${alts[current - 1]}">`;
        tutButtons[0].innerText = 'PREVIOUS';
    }

    // Changing texts
    tutorial.querySelector('h2').innerText = titles[current - 1];
    tutorial.querySelector('h3').innerText = text[current - 1];
    tutorial.querySelector('p').innerHTML = subText[current - 1];
    tutorial.querySelector('.count').innerText = `${current}/9`;
}
tutButtons[0].addEventListener('click', PreviousSkip);
tutButtons[1].addEventListener('click', NextFinish);

// Position and quantity in the slider window / Renaming the Select
setInterval(() => 
{
    radios.forEach(element =>
    {
        if(element.checked)
            document.querySelector(`[for=${element.id}]`).className = 'current';
        else
            document.querySelector(`[for=${element.id}]`).className = '';
    });

    sliderDivs.forEach(element => 
    {
        sliderVal = element.querySelector('input[type=range]').value;
        element.querySelector('.rangeInformation').innerHTML = sliderVal;
        element.querySelector('.rangeInformation').style.transform = `translateX(${((sliderVal - element.querySelector('input[type=range]').min)/(element.querySelector('input[type=range]').max - element.querySelector('input[type=range]').min) * 220)}px)`;
    });
    customSectionPath.querySelectorAll('input[type=radio]').forEach(element => 
    {
        if(element.checked)
            switch (element.value) 
            {
                case 'aStar':
                    customSectionPath.querySelector('h3').innerText = 'A* ALGORITHM';
                break;
                case 'dijkstra':
                    customSectionPath.querySelector('h3').innerText = 'DIJKSTRA ALGORITHM';
                break;
                case 'greedy':
                    customSectionPath.querySelector('h3').innerText = 'GREEDY BEST-FIRST SEARCH';
                break;
                case 'breadth':
                    customSectionPath.querySelector('h3').innerText = 'BREADTH-FIRST SEARCH';
                break;
            }
    });
    customSectionMaze.querySelectorAll('input[type=radio]').forEach(element => 
    {
        if(element.checked)
            switch (element.value) 
            {
                case 'random':
                    customSectionMaze.querySelector('h3').innerText = 'RANDOM MAZE';
                break;
                case 'depthFirst':
                    customSectionMaze.querySelector('h3').innerText = 'DEPTH-FIRST SEARCH MAZE';
                break;
                case 'recursive':
                    customSectionMaze.querySelector('h3').innerText = 'RECURSIVE-DIVISION MAZE';
                break;
                case 'prims':
                    customSectionMaze.querySelector('h3').innerText = "PRIM'S ALGORITHM MAZE";
                break;
                case 'tree':
                    customSectionMaze.querySelector('h3').innerText = 'BINARY TREE MAZE';
                break;
                case 'cells':
                    customSectionMaze.querySelector('h3').innerText = 'CELLULAR AUTOMATA';
                break;
            }
    });
}, 10);

// Opening and closing the Select
let isOpenedPath = true;
customSectionPath.addEventListener('click', (event)=>
{
    isOpenedPath = !isOpenedPath;

    if(isOpenedPath)
        customSectionPath.querySelector('ul').className = 'closed';
    else
        customSectionPath.querySelector('ul').className = 'opened';
});
customSectionPath.querySelectorAll('input[type=radio]').forEach(element => 
{
    element.addEventListener('click', ()=>
    {
        customSectionPath.querySelector('ul').className = 'closed';
        isOpenedPath = false;
    });
});

// Opening and closing the Select
isOpenedMaze = true;
customSectionMaze.addEventListener('click', (event)=>
{
    isOpenedMaze = !isOpenedMaze;

    if(isOpenedMaze)
        customSectionMaze.querySelector('ul').className = 'closed';
    else
        customSectionMaze.querySelector('ul').className = 'opened';
});
customSectionMaze.querySelectorAll('input[type=radio]').forEach(element => 
{
    element.addEventListener('click', ()=>
    {
        customSectionMaze.querySelector('ul').className = 'closed';
        isOpenedMaze = false;
    });
});

menuSwitch.addEventListener('click', ()=>
{
    if(form.className == 'formOpened')
        form.className = 'formClosed';
    else
        form.className = 'formOpened';
});

// Make an element drag-enabled
DragElement(celularAutomataMore);

// A function that allows the user to move an item
function DragElement(elem) 
{
    let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
    elem.querySelector('.dragable').addEventListener('mousedown', DragMouseDown);

    function DragMouseDown() 
    {
        // Variable to get the mouse position
        let mouseE = window.event;
    
        mouseX = mouseE.clientX;
        mouseY = mouseE.clientY;
        document.addEventListener('mouseup', CloseDragElement);
        document.addEventListener('mousemove', ElementDrag);
    }

    function ElementDrag() 
    {
        // Variable to get the mouse position
        let mouseE = window.event;
    
        let body = document.querySelector('body');

        // Sourcing all the positions needed
        posX = mouseX - mouseE.clientX;
        posY = mouseY - mouseE.clientY;
        mouseX = mouseE.clientX;
        mouseY = mouseE.clientY;

        // 4 booleans needed for the correct positioning of the element
        let fConditionT = elem.offsetTop >= 0 || posY < 0, sConditionT = elem.offsetTop < body.clientHeight - 250 || posY > 0;
        let fConditionL = elem.offsetLeft - 200 >= 0 || posX < 0, sConditionL = elem.offsetLeft - 200 <= body.clientWidth - 400 || posX > 0;

        // Position the element relative to the mouse
        if(fConditionT && sConditionT)
            elem.style.top = `${elem.offsetTop - posY}px`;
        if(fConditionL && sConditionL)
            elem.style.left = `${elem.offsetLeft - posX}px`;

        // Checking if the element does not go outside the screen and if it goes out of the way, setting it in the correct position
        if(elem.offsetLeft - 200 < 0)
            elem.style.left = `200px`;
        if(elem.offsetTop < 0)
            elem.style.top = `0px`;
        if(elem.offsetLeft - 200 > body.clientWidth - 400)
            elem.style.left = `${body.clientWidth - 200}px`;
        if(elem.offsetTop > body.clientHeight - 250)
            elem.style.top = `${body.clientHeight - 250}px`;
    }

    function CloseDragElement()
    {
        // Removing event listenerss to prevent bugs
        document.removeEventListener('mouseup', CloseDragElement);
        document.removeEventListener('mousemove', ElementDrag);
    }
}