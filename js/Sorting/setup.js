// All DOM Elements
const container = document.querySelector('.container');

const form = document.querySelector('form');
const sliderDivs = document.querySelectorAll('.slider');
const customSelection = document.querySelector('.customSection');
const menuSwitch = document.querySelector('.options').firstElementChild;

const sizeInput = document.querySelector('#amount');
const speedInput = document.querySelector('#speed');

// Tutorial variables
const tutorial = document.querySelector('.tutorial');
const tutButtons = tutorial.querySelector('.right').querySelector('.buttons').querySelectorAll('button');
let srcs = ['notSorted.jpg', 'sorted.jpg', 'algorithms.jpg', 'more.jpg', 'button.jpg', 'link.jpg'];
let alts = ['Image of not sorted blocks', 'Image of sorted blocks', 'Image showing possible algorithms', 'Image showing more customization options', 'Image showing button with text "SUBMIT"', 'Clickable Text "Algorithm Visualization"'];
let titles = ['WELCOME TO THE SORTING ALGORITHMS!', 'WHAT SORTING ALGORITHMS ARE?', 'CHOSING AN ALGORITHM!', 'MORE HELPFUL OPTIONS!', 'STARTING THE VISUALIZATION!', 'ENJOY AND HAVE FUN!'];
let text = ['You will see a quick tutorial that will show you how to use this tool.', 'As the name suggests sorting Algorithms are methods of number of items into some specific order such as highest to lowest.', 'If you want to choose an algorithm you need to press the “Sorting algorithm” drop-down menu.', 'You can change the amount of blocks by moving the slider “Blocks amount”, you can also change the speed of the algorithms by moving the slider “Time interval”.', 'If you have set everything up press “SORT” button to start the visualization of the algorithm.', 'Now that you know how to use this tool you can play with it and have fun.'];
let subText = ['If you want you can skip it by pressing the “Skip Tutorial” button. Otherwise, press “Next”.', 'All of the algorithms here are made to sort blocks from lowest to highest without the possibility of changing the order.', 'Note that some of the algorithms are faster than the others.', 'Lover time interval values means faster execution of the code.', 'You don’t need to refresh the website to start other algorithm visualization.', 'If you want to check the code you can visit my <a href="#">github</a>.'];

// All needed variables
let size = sizeInput.value;
let started = false;

// Function that creates blocks 
function CreateBlocks()
{
    let array = new Array();

    // Creating an array with the sizes of blocks 
    for (let i = 2; i <= 102; i+=100/size) 
        array.push(i);

    // Function for taking a random number and removing it from the table
    function GetNumber()
    {
        let randomIndex = Math.floor(Math.random() * (array.length - 1 + 1));
        let randomNumber = array[randomIndex];
        array.splice(randomIndex, 1)

        return Math.floor(randomNumber);
    }

    // Creates randomly sized blocks
    for (let i = 0; i < size; i++) 
    {
        let heightOffset = GetNumber();
        const div = document.createElement('div');
        div.setAttribute("style", `height: ${heightOffset}%;`);
        container.appendChild(div);
    }
}
CreateBlocks();

form.addEventListener('submit', (event)=>
{
    // Preventing the page from being reset when submitting the form 
    event.preventDefault();

    if(!started)
    {
        size = sizeInput.value;

        // Removing all descendants of the container element (to prevent an increase in the number of blocks) 
        while (container.firstChild)
            container.removeChild(container.lastChild);

        CreateBlocks();

        document.querySelectorAll('input[type=radio]').forEach(element => 
        {
            if(element.checked)
                switch (element.value) 
                {
                    case 'bubble':
                        started = true;
                        BubbleSort();
                    break;
                    case 'select':
                        started = true;
                        SelectSort();
                    break;
                    case 'insertion':
                        started = true;
                        InsertionSort();
                    break;
                    case 'bucket':
                        started = true;
                        BuckedSort();
                    break;
                    case 'merge':
                        started = true;
                        MergeSort(0, size - 1);
                    break;
                    case 'quick':
                        started = true;
                        QuickSort(0, size - 1);
                    break;
                }
        });
    }
});

// Function for changing the color of the blocks 
function ColorChange(index, colorClassName)
{
    container.children[index].className = colorClassName;
}

// Function for changing the size of the blocks
function HeightChange(index, heightAmount)
{
    container.children[index].setAttribute("style", `height: ${heightAmount};`);
}

// Function for waiting a given number of miliseconds
function wait(isFinisher) 
{
    if(!isFinisher)
        return new Promise((resolve) => setTimeout(resolve, speedInput.value));

    return new Promise((resolve) => setTimeout(resolve, speedInput.value * (6 / 10)));
}