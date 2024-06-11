async function fetchJsonData() {
    try {
        const response = await fetch('default.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const jsonData = await response.json();
        createEditor(jsonData);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function createEditor(jsonData) {
    const editorDiv = document.getElementById('editor');
    editorDiv.innerHTML = ''; // Clear previous content if any
    createFields(editorDiv, jsonData);
}

function createFields(container, data, parentKey = '', indentLevel = 0) {
    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            const arrayContainer = document.createElement('div');
            arrayContainer.className = 'category indent nested-${indentLevel}';
            arrayContainer.style.marginLeft = `${(indentLevel * 10) + 5}px`;

            const label = document.createElement('label');
            label.className = 'key-label';
            label.textContent = `[${index}]`;
            arrayContainer.appendChild(label);

            createFields(arrayContainer, item, `${parentKey}[${index}]`, indentLevel + 1);
            container.appendChild(arrayContainer);
        });
    } else if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'category indent nested-${indentLevel}';
            fieldDiv.style.marginLeft = `${(indentLevel * 10) + 5}px`;

            const label = document.createElement('label');
            label.className = 'key-label';
            label.textContent = `${key}: `;
            fieldDiv.appendChild(label);

            if (typeof data[key] === 'object' && data[key] !== null) {
                const categoryToggle = document.createElement('span');
                categoryToggle.className = 'toggle';
                categoryToggle.textContent = ' [-]';
                label.appendChild(categoryToggle);
                createFields(fieldDiv, data[key], `${parentKey ? `${parentKey}.` : ''}${key}`, indentLevel + 1);
                categoryToggle.addEventListener('click', () => {
                    toggleVategory(categoryToggle);
                })
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.id = `${parentKey ? `${parentKey}.` : ''}${key}`;
                input.value = data[key];
                fieldDiv.appendChild(input);
            }

            container.appendChild(fieldDiv);
        }
    } else {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = `field nested-${indentLevel}`;
        fieldDiv.style.marginLeft = `${(indentLevel * 10) + 5}px`;

        const label = document.createElement('label');
        label.className = 'key-label';
        const keyParts = parentKey.split('.');
        label.textContent = `${keyParts[keyParts.length - 1]}: `;
        fieldDiv.appendChild(label);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = parentKey;
        input.value = data;
        fieldDiv.appendChild(input);

        container.appendChild(fieldDiv);
    }
}

function toggleCategory(toggle) {
    const category = toggle.parentElement.nextElementSibling;
    if (category.style.display === 'none' || category.style.display === '') {
        category.style.display = 'block';
        toggle.textContent = ' [-]';
    } else {
        category.style.display = 'none';
        toggle.textContent = ' [+]';
    }
}


function saveJson() {
    const editorDiv = document.getElementById('editor');
    const newJsonData = collectFields(editorDiv);
    const jsonDataString = JSON.stringify(newJsonData, null, 4);
    
    // Create a Blob object from the JSON string
    const blob = new Blob([jsonDataString], { type: 'application/json' });
    
    // Create a temporary anchor element
    const anchor = document.createElement('a');
    anchor.download = 'garbagepack.json'; // Set the download attribute with the desired file name
    anchor.href = URL.createObjectURL(blob);
    
    // Trigger the download
    anchor.click();
}

function collectFields(container) {
    const result = {};

    for (const fieldDiv of container.children) {
        const label = fieldDiv.querySelector('label');
        const input = fieldDiv.querySelector('input');

        if (label && input) {
            const keys = label.textContent.replace(/:$/, '').split('.').map(key => key.replace(/\[.*\]$/, ''));
            setValue(result, keys, input.value);
        } else {
            const nestedResult = collectFields(fieldDiv);
            if (Object.keys(nestedResult).length) {
                const key = label.textContent.replace(/:$/, '').split('.').pop();
                result[key] = nestedResult;
            }
        }
    }

    return result;
}

function setValue(obj, keys, value) {
    const lastKey = keys.pop();
    const nestedObj = keys.reduce((acc, key) => {
        if (!acc[key]) acc[key] = {};
        return acc[key];
    }, obj);
    nestedObj[lastKey] = value;
}

// Initialize the editor by fetching JSON data
document.addEventListener('DOMContentLoaded', fetchJsonData);