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
    tutorial.querySelector('.left').innerHTML = `<img src="img/Sorting/${srcs[current - 1]}" alt="${alts[current - 1]}">`;
    tutorial.querySelector('h2').innerText = titles[current - 1];
    tutorial.querySelector('h3').innerText = text[current - 1];
    tutorial.querySelector('p').innerHTML = subText[current - 1];
    tutorial.querySelector('.count').innerText = `${current}/6`;
    tutButtons[1].innerText = 'NEXT';

}
function NextFinish()
{
    // Getting the current index
    let current = parseInt(tutorial.querySelector('.count').innerText.split('/')[0]);

    current++;
    if(current == 7)
    {
        tutorial.className = 'tutorialClosed';
        return;
    }
    if(current == 6)
    {
        tutorial.querySelector('.left').innerHTML = `<a href="pathfinding.html"><img src="img/Sorting/${srcs[current - 1]}" alt="${alts[current - 1]}"></a>`;
        tutButtons[1].innerText = 'FINISH';
    }
    else
    {
        tutorial.querySelector('.left').innerHTML = `<img src="img/Sorting/${srcs[current - 1]}" alt="${alts[current - 1]}">`;
        tutButtons[0].innerText = 'PREVIOUS';
    }

    // Changing texts
    tutorial.querySelector('h2').innerText = titles[current - 1];
    tutorial.querySelector('h3').innerText = text[current - 1];
    tutorial.querySelector('p').innerHTML = subText[current - 1];
    tutorial.querySelector('.count').innerText = `${current}/6`;
}
tutButtons[0].addEventListener('click', PreviousSkip);
tutButtons[1].addEventListener('click', NextFinish);

// Position and quantity in the slider window / Renaming a selector 
setInterval(() => 
{
    sliderDivs.forEach(element => 
    {
        sliderVal = element.querySelector('input[type=range]').value;
        element.querySelector('.rangeInformation').innerHTML = sliderVal;
        element.querySelector('.rangeInformation').style.transform = `translateX(${((sliderVal - element.querySelector('input[type=range]').min)/(element.querySelector('input[type=range]').max - element.querySelector('input[type=range]').min) * 220)}px)`;
    });
    document.querySelectorAll('input[type=radio]').forEach(element => 
    {
        if(element.checked)
            switch (element.value) 
            {
                case 'bubble':
                    customSelection.querySelector('h3').innerText = 'BUBBLE SORT';
                break;
                case 'select':
                    customSelection.querySelector('h3').innerText = 'SELECT SORT';
                break;
                case 'insertion':
                    customSelection.querySelector('h3').innerText = 'INSERTION SORT';
                break;
                case 'bucket':
                    customSelection.querySelector('h3').innerText = 'BUCKET SORT';
                break;
                case 'merge':
                    customSelection.querySelector('h3').innerText = 'MERGE SORT';
                break;
                case 'quick':
                    customSelection.querySelector('h3').innerText = 'QUICK SORT';
                break;
            }
    });
}, 10);

// Opening and closing the select
let isOpenedSelection = true;
customSelection.addEventListener('click', (event)=>
{
    isOpenedSelection = !isOpenedSelection;

    if(isOpenedSelection)
        document.querySelector('.customSection').querySelector('ul').className = 'closed';
    else
        document.querySelector('.customSection').querySelector('ul').className = 'opened';
});
document.querySelectorAll('input[type=radio]').forEach(element => 
{
    element.addEventListener('click', ()=>
    {
        document.querySelector('.customSection').querySelector('ul').className = 'closed';
        isOpenedSelection = false;
    });
});

menuSwitch.addEventListener('click', ()=>
{
    if(form.className == 'formOpened')
        form.className = 'formClosed';
    else
        form.className = 'formOpened';
});