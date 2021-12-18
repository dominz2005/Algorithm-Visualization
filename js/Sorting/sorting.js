// Bubble sorting function
async function BubbleSort()
{
    for (let i = 0; i < container.children.length; i++) 
    {
        let sorted = true;
        for (let j = 0; j < container.children.length - 1; j++)
        {
            let firstHeight = container.children[j].style.height;
            
            // Changing the color of the blocks
            ColorChange(j, 'checking');
            ColorChange(j + 1, 'checking');

            if(parseInt(firstHeight) > parseInt(container.children[j + 1].style.height))
            {
                // Changing the size of the blocks
                HeightChange(j, container.children[j + 1].style.height);
                HeightChange(j + 1, firstHeight);

                await wait(false); // Waiting a moment before executing the next line of code
                sorted = false;
            }

            // Reseting blocks color
            ColorChange(j, null);
            ColorChange(j + 1, null);
        }
        if(sorted)
        {
            for (let j = 0; j < container.children.length; j++)
            {
                // Change the colors of the blocks
                ColorChange(j, 'checked');
                if(j + 1 < container.children.length)
                    ColorChange(j + 1, 'checking');

                await wait(true); // Waiting a moment before executing the next line of code
            }
            started = false;
            break;
        }
    }
}


// ------------------------------------------------------------------------------------------------------------- \\


// Function sorting blocks by selection 
async function SelectSort()
{
    for (let i = 0; i < size - 1; i++) 
    {
        let min = i;
        for (let j = i + 1; j < size; j++) 
        {
            // Change the colors of the blocks
            ColorChange(min, 'saved');
            ColorChange(j, 'checking');

            if(parseInt(container.children[j].style.height) < parseInt(container.children[min].style.height))
            {
                // Reseting blocks color
                ColorChange(min, null);

                min = j;
            }
            await wait(false); // Waiting a moment before executing the next line of code
            
            // Reseting blocks color
            ColorChange(j, null);
        }

        // Reseting blocks color
        ColorChange(min, null);

        let firstHeight = container.children[min].style.height;

        // Changing the size of the blocks
        HeightChange(min, container.children[i].style.height);
        HeightChange(i, firstHeight);

        await wait(false); // Waiting a moment before executing the next line of code
    }
    
    for (let i = 0; i < container.children.length; i++)
    {
        // Change the colors of the blocks
        ColorChange(i, 'checked');
        if(i + 1 < container.children.length)
            ColorChange(i + 1, 'checking');
            
        await wait(true); // Waiting a moment before executing the next line of code
    }
    started = false;
}


// ------------------------------------------------------------------------------------------------------------- \\


// Function for sorting blocks by insertion
async function InsertionSort()
{
    for (i = 1; i < size; i++)
    { 
        let firstHeight = container.children[i].style.height;
        
        // Change the colors of the blocks
        ColorChange(i, 'saved');

        j = i - 1;
        while (j >= 0 && parseInt(container.children[j].style.height) > parseInt(firstHeight))
        { 
            // Change the colors of the blocks
            ColorChange(j, 'checking');
            if(j - 1 >= 0)
                ColorChange(j - 1, 'checking');

            HeightChange(j + 1, container.children[j].style.height);

            await wait(false); // Waiting a moment before executing the next line of code
            
            // Reseting blocks color
            ColorChange(j, null);
            if(j - 1 >= 0)
                ColorChange(j - 1, null);

            j--; 
        } 
        // Changing the size of the blocks
        HeightChange(j + 1, firstHeight);

        await wait(false); // Waiting a moment before executing the next line of code
        
        // Reseting blocks color
        ColorChange(i, null);
    } 
    
    for (let i = 0; i < container.children.length; i++)
    {
        // Change the colors of the blocks
        ColorChange(i, 'checked');
        if(i + 1 < container.children.length)
            ColorChange(i + 1, 'checking');

        await wait(true); // Waiting a moment before executing the next line of code
    }
    started = false;
}



// ------------------------------------------------------------------------------------------------------------- \\



// Finding biggest block (needed for bucket sort)
function FindBiggest()
{
    let arr = new Array();
    for (let i = 0; i < size; i++) 
        arr[i] = parseInt(container.children[i].style.height);

    return Math.max.apply(Math, arr);
}

// The function of sorting blocks using the bucket method 
async function BuckedSort()
{
    let min = 1;
    let max = FindBiggest();
    
    let tab = new Array();

    for (let i = min; i <= max; i++)
        tab[i - min] = 0

    for (let i = 0; i < size; i++)
    {
        // Change the colors of the blocks
        ColorChange(i, 'saved');

        tab[parseInt(container.children[i].style.height) - min]++;
        
        await wait(false); // Waiting a moment before executing the next line of code
    }

    j = 0;
    for(i = min; i <= max; i++) 
        while(tab[i - min])
        {
            // Change the colors of the blocks
            ColorChange(j, 'checking');

            // Changing the size of the blocks
            HeightChange(j, `${i}%`);
            
            await wait(false); // Waiting a moment before executing the next line of code

            // Reseting blocks color
            ColorChange(j, null);

            j++;

            tab[i - min]--;
        }

        for (let i = 0; i < container.children.length; i++)
        {
            // Change the colors of the blocks
            ColorChange(i, 'checked');
            if(i + 1 < container.children.length && container.children[i + 1].className != 'checked')
                ColorChange(i + 1, 'checking');
                
            await wait(true); // Waiting a moment before executing the next line of code
        }
    started = false;
}


// ------------------------------------------------------------------------------------------------------------- \\


// Merge blocks (needed for merge sort) 
async function Merge(left, pivot, right)
{
    let sorted = true;

    let leftEnd = pivot - left + 1;
    let rightEnd = right - pivot;

    let leftArray = new Array();
    let rightArray = new Array();
  
    for (let i = 0; i < leftEnd; i++)
    {
        // Change the colors of the blocks
        ColorChange(left + i, 'checking');
        ColorChange(pivot + i, 'checking');

        leftArray[i] = parseInt(container.children[left + i].style.height);

        await wait(false); // Waiting a moment before executing the next line of code

        // Reseting blocks color
        ColorChange(left + i, null);
        ColorChange(pivot + i, null);
    }
    for (let i = 0; i < rightEnd; i++)
        rightArray[i] = parseInt(container.children[pivot + 1 + i].style.height);
  
    let firstEl = 0;
    let secondEl = 0;

    let k = left;
    
    while (firstEl < leftEnd && secondEl < rightEnd) 
    {
        // Change the colors of the blocks
        ColorChange(k, 'checked');

        if (leftArray[firstEl] <= rightArray[secondEl]) 
        {
            // Changing the size of the blocks
            HeightChange(k, `${leftArray[firstEl]}%`);
            firstEl++;
        }
        else 
        {
            // Changing the size of the blocks
            HeightChange(k, `${rightArray[secondEl]}%`);
            secondEl++;
        }

        await wait(true); // Waiting a moment before executing the next line of code

        // Reseting blocks color
        ColorChange(k, null);

        k++;
    }
    
    for (let i = firstEl; i < leftEnd; i++) 
    {
        // Changing the size of the blocks
        HeightChange(k, `${leftArray[i]}%`);
        k++;
    }

    for (let i = secondEl; i < rightEnd; i++) 
    {
        // Changing the size of the blocks
        HeightChange(k, `${rightArray[i]}%`);
        k++;
    }

    for (let i = 0; i < container.children.length - 1; i++)
        if(parseInt(container.children[i].style.height) > parseInt(container.children[i + 1].style.height))
            sorted = false;
    if(sorted)
    {
        for (let i = 0; i < container.children.length; i++)
        {
            // Change the colors of the blocks
            ColorChange(i, 'checked');
            if(i + 1 < container.children.length && container.children[i + 1].className != 'checked')
                ColorChange(i + 1, 'checking');
                
            await wait(true); // Waiting a moment before executing the next line of code
        }
        started = false;
        return;
    }
}

// A function that sorts blocks by Merge
async function MergeSort(left, right)
{
    if(left >= right)
        return;
        
    let pivot = left + parseInt((right - left) / 2);

    await MergeSort(left, pivot);
    await MergeSort(pivot + 1, right);
    await Merge(left, pivot, right);
}


// ------------------------------------------------------------------------------------------------------------- \\


// A function that sorts blocks using the QuickSort method 
async function QuickSort(left, right)
{
    let sorted = true;
    let i = Math.floor((left + right) / 2);

    let pivot = container.children[i].style.height;
    
    // Change the colors of the blocks
    ColorChange(i, 'checked');
    
    // Changing the size of the blocks
    HeightChange(i, container.children[right].style.height);

    let j = left;
    for(i = left; i < right; i++)
    {
        // Change the colors of the blocks
        ColorChange(i, 'checking');
        ColorChange(j, 'saved');
        
        if(parseInt(container.children[i].style.height) < parseInt(pivot))
        {
            let firstHeight = container.children[i].style.height;
            
            // Changing the size of the blocks
            HeightChange(i, container.children[j].style.height);
            HeightChange(j, firstHeight);
            
            await wait(false); // Waiting a moment before executing the next line of code
            
            // Reseting blocks color
            ColorChange(j, null);
            
            j++;
        }

        await wait(false); // Waiting a moment before executing the next line of code
        
        // Reseting blocks color
        ColorChange(j, null);
        ColorChange(i, null);
    }

    // Changing the size of the blocks
    HeightChange(right, container.children[j].style.height);
    HeightChange(j, pivot);
    
    await wait(false); // Waiting a moment before executing the next line of code

    // Sprawdzanie czy słupki zostały posortowane
    for (let i = 0; i < parseInt(container.children.length) - 1; i++)
        if(parseInt(container.children[i].style.height) > parseInt(container.children[i + 1].style.height))
            sorted = false;
    if(sorted)
    {
        for (let i = 0; i < container.children.length; i++)
        {
            // Change the colors of the blocks
            ColorChange(i, 'checked');
            if(i + 1 < container.children.length && container.children[i + 1].className != 'checked')
                ColorChange(i + 1, 'checking');
                
            await wait(true); // Waiting a moment before executing the next line of code
        }
        started = false;
        return;
    }

    if(left < j - 1)
        QuickSort(left, j - 1);
    if(j + 1 < right)
        QuickSort(j + 1, right);
}