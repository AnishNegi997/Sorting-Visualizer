let array = [];
let arrayBars = [];
let isSorting = false;
let animationSpeed = 50;
let arraySize = 50;

// DOM Elements
const generateBtn = document.getElementById('generate');
const sortBtn = document.getElementById('sort');
const speedSlider = document.getElementById('speed');
const sizeSlider = document.getElementById('size');
const algorithmSelect = document.getElementById('algorithm');
const arrayContainer = document.getElementById('array-container');

// Event Listeners
generateBtn.addEventListener('click', generateNewArray);
sortBtn.addEventListener('click', startSorting);
speedSlider.addEventListener('input', updateSpeed);
sizeSlider.addEventListener('input', updateSize);

// Initialize
generateNewArray();

function generateNewArray() {
    if (isSorting) return;
    
    array = [];
    arrayContainer.innerHTML = '';
    
    // Get array size from the input field
    arraySize = parseInt(sizeSlider.value);
    if (isNaN(arraySize) || arraySize < 5) {
        arraySize = 5;
        sizeSlider.value = 5;
    }
    if (arraySize > 100) {
        arraySize = 100;
        sizeSlider.value = 100;
    }
    
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    
    displayArray();
}

function displayArray() {
    arrayContainer.innerHTML = '';
    arrayBars = [];
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        
        // Create value display
        const valueDisplay = document.createElement('div');
        valueDisplay.className = 'array-value';
        valueDisplay.textContent = value;
        
        // Set height based on value (scaled for visualization)
        const height = (value / 100) * 300 + 10; // Scale to max height of 300px + min height
        bar.style.height = `${height}px`;
        
        bar.appendChild(valueDisplay);
        arrayContainer.appendChild(bar);
        arrayBars.push(bar);
    });
}

async function startSorting() {
    if (isSorting) return;
    
    const algorithm = algorithmSelect.value;
    isSorting = true;
    sortBtn.disabled = true;
    generateBtn.disabled = true;
    sizeSlider.disabled = true;
    algorithmSelect.disabled = true;
    
    // Reset classes for all elements
    arrayBars.forEach(element => {
        element.classList.remove('sorted', 'comparing', 'pivot', 'merge', 'insertion', 'bubble');
    });

    // Give time to render the reset state
    await new Promise(resolve => setTimeout(resolve, 50));
    
    switch (algorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'quick':
            await quickSort(0, array.length - 1);
            break;
        case 'merge':
            await mergeSort(0, array.length - 1);
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'selection':
            await selectionSort();
            break;
    }
    
    // Mark all as sorted after sorting is complete
    arrayBars.forEach(element => element.classList.add('sorted'));
    
    isSorting = false;
    sortBtn.disabled = false;
    generateBtn.disabled = false;
    sizeSlider.disabled = false;
    algorithmSelect.disabled = false;
}

async function swap(el1, el2, array, index1, index2) {
    // Swap heights for visual representation
    const height1 = el1.style.height;
    const height2 = el2.style.height;
    el1.style.height = height2;
    el2.style.height = height1;

    // Swap text content for visual representation
    const text1 = el1.querySelector('.array-value').textContent;
    const text2 = el2.querySelector('.array-value').textContent;
    el1.querySelector('.array-value').textContent = text2;
    el2.querySelector('.array-value').textContent = text1;

    // Swap values in the underlying array for correct logic
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;

    await new Promise(resolve => setTimeout(resolve, animationSpeed));
}

async function bubbleSort() {
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            arrayBars[j].classList.add('comparing');
            arrayBars[j + 1].classList.add('comparing');
            
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            
            if (array[j] > array[j + 1]) {
                // Add bubble animation class before swap
                arrayBars[j].classList.add('bubble');
                arrayBars[j + 1].classList.add('bubble');

                await swap(arrayBars[j], arrayBars[j + 1], array, j, j + 1);
                
                // Remove bubble animation class after swap animation completes
                // The animation duration is 0.5s, wait for it to finish
                await new Promise(resolve => setTimeout(resolve, 500));
                arrayBars[j].classList.remove('bubble');
                arrayBars[j + 1].classList.remove('bubble');
            }
            
            arrayBars[j].classList.remove('comparing');
            arrayBars[j + 1].classList.remove('comparing');
        }
        arrayBars[n - i - 1].classList.add('sorted');
    }
    // Mark the first element as sorted after the loops
     arrayBars[0].classList.add('sorted');
}

async function highlightRange(low, high, className) {
    for (let i = 0; i < arrayBars.length; i++) {
        if (i >= low && i <= high) {
            arrayBars[i].classList.add(className);
        } else {
            arrayBars[i].classList.remove(className);
        }
    }
    await new Promise(resolve => setTimeout(resolve, animationSpeed));
}

async function removeHighlightRange(low, high, className) {
    for (let i = low; i <= high; i++) {
        arrayBars[i].classList.remove(className);
    }
}

async function quickSort(low, high) {
    if (low < high) {
        await highlightRange(low, high, 'comparing'); // Highlight the current partition
        const pivotIndex = await partition(low, high);
        await removeHighlightRange(low, high, 'comparing');
        
        // Recursively sort elements before pivot
        await quickSort(low, pivotIndex - 1);
        // Recursively sort elements after pivot
        await quickSort(pivotIndex + 1, high);
    }
     // Mark single element partitions as sorted
    if (low === high) {
        arrayBars[low].classList.add('sorted');
    }
}

async function partition(low, high) {
    const pivot = array[high];
    const pivotElement = arrayBars[high];
    pivotElement.classList.add('pivot');
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        const currentElement = arrayBars[j];
        currentElement.classList.add('comparing');
        
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        
        if (array[j] < pivot) {
            i++;
            const iElement = arrayBars[i];
            await swap(iElement, currentElement, array, i, j);
        }
        
        currentElement.classList.remove('comparing');
    }
    
    // Swap pivot to its correct position
    const iPlusOneElement = arrayBars[i + 1];
    await swap(iPlusOneElement, pivotElement, array, i + 1, high);

    pivotElement.classList.remove('pivot');
    iPlusOneElement.classList.add('sorted'); // Mark pivot as sorted
    
    return i + 1;
}

async function mergeSort(low, high) {
    if (low < high) {
        const mid = Math.floor((low + high) / 2);
        await highlightRange(low, high, 'merge'); // Highlight the current merge range
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        await removeHighlightRange(low, high, 'merge');

        await mergeSort(low, mid);
        await mergeSort(mid + 1, high);
        await merge(low, mid, high);
    }
}

async function merge(low, mid, high) {
    const tempArray = [];
    const leftArray = array.slice(low, mid + 1);
    const rightArray = array.slice(mid + 1, high + 1);
    
    let i = 0, j = 0, k = low;
    
    // Copy elements to tempArray in sorted order
    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
            tempArray.push(leftArray[i]);
            i++;
        } else {
            tempArray.push(rightArray[j]);
            j++;
        }
    }
    
    while (i < leftArray.length) {
        tempArray.push(leftArray[i]);
        i++;
    }
    
    while (j < rightArray.length) {
        tempArray.push(rightArray[j]);
        j++;
    }

    // Copy tempArray back to original array and update elements visually with animation
    for(let l = 0; l < tempArray.length; l++){
        array[low + l] = tempArray[l];
        const bar = arrayBars[low + l];
        const value = tempArray[l];

        // Update height and text content
        const height = (value / 100) * 300 + 10;
        bar.style.height = `${height}px`;
        bar.querySelector('.array-value').textContent = value;

        // Add merge animation class and then sorted class
        bar.classList.add('merge');
        await new Promise(resolve => setTimeout(resolve, animationSpeed / tempArray.length)); // Stagger the animation
        bar.classList.remove('merge');
        bar.classList.add('sorted');
    }
}

async function insertionSort() {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        const key = array[i];
        const keyElement = arrayBars[i];
        let j = i - 1;
        
        keyElement.classList.add('insertion');
        await new Promise(resolve => setTimeout(resolve, animationSpeed));

        while (j >= 0 && array[j] > key) {
            const currentElement = arrayBars[j];
            const nextElement = arrayBars[j + 1];

            currentElement.classList.add('comparing');
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            
            // Shift element to the right visually and in array
            array[j + 1] = array[j];
            // Animate the shift right by swapping visual properties
            nextElement.style.height = currentElement.style.height;
            nextElement.querySelector('.array-value').textContent = array[j];
            
            currentElement.classList.remove('comparing');
            j--;
        }
        
        // Insert the key in the correct position visually and in array
        array[j + 1] = key;
        const targetElement = arrayBars[j + 1];
        const targetHeight = (key / 100) * 300 + 10;
        targetElement.style.height = `${targetHeight}px`;
        targetElement.querySelector('.array-value').textContent = key;

        keyElement.classList.remove('insertion');
        targetElement.classList.add('sorted'); // Mark inserted element as sorted
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }
    // Mark all as sorted at the end
    arrayBars.forEach(element => element.classList.add('sorted'));
}

async function selectionSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        const iElement = arrayBars[i];
        
        iElement.classList.add('comparing');
        
        for (let j = i + 1; j < n; j++) {
            const jElement = arrayBars[j];
            const minElement = arrayBars[minIdx];

            jElement.classList.add('comparing');
            // Only highlight the current min element if it's not the outer loop's starting element
            if(minIdx !== i) { 
                 minElement.classList.add('comparing');
            }
            
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            
            if (array[j] < array[minIdx]) {
                 // Remove comparing from the old minElement if it was highlighted
                if(minIdx !== i) {
                     minElement.classList.remove('comparing');
                }
                minIdx = j;
            }
             // Remove comparing from the current jElement after comparison
            jElement.classList.remove('comparing');
        }
        
        // Remove comparing from the element at the old minIdx if it was highlighted and not the final minIdx
         if(minIdx !== i && arrayBars[minIdx].classList.contains('comparing')){
             arrayBars[minIdx].classList.remove('comparing');
         }
         // Remove comparing from the outer loop's starting element
         iElement.classList.remove('comparing');

        if (minIdx !== i) {
            const minElement = arrayBars[minIdx];
            // Swap heights and text content
            const height1 = iElement.style.height;
            const height2 = minElement.style.height;
            iElement.style.height = height2;
            minElement.style.height = height1;

            const text1 = iElement.querySelector('.array-value').textContent;
            const text2 = minElement.querySelector('.array-value').textContent;
            iElement.querySelector('.array-value').textContent = text2;
            minElement.querySelector('.array-value').textContent = text1;

            // Swap values in the underlying array
            const temp = array[i];
            array[i] = array[minIdx];
            array[minIdx] = temp;
             // Await after the visual swap
            await new Promise(resolve => setTimeout(resolve, animationSpeed));

        }
        
        arrayBars[i].classList.add('sorted'); // Mark the element at the current position as sorted
    }
     arrayBars[n - 1].classList.add('sorted'); // Mark the last element as sorted
}

function updateSpeed() {
    animationSpeed = (101 - speedSlider.value) * 5; // Multiply to make it slower
}

function updateSize() {
    // Get array size from input field and regenerate array
    generateNewArray();
} 