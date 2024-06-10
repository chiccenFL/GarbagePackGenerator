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

function createFields(container, data, parentKey = '') {
    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            createFields(container, item, `${parentKey}[${index}]`);
        });
    } else if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'field';
            const label = document.createElement('label');
            label.textContent = `${parentKey ? `${parentKey}.` : ''}${key}`;
            fieldDiv.appendChild(label);

            if (typeof data[key] === 'object' && data[key] !== null) {
                createFields(fieldDiv, data[key], `${parentKey ? `${parentKey}.` : ''}${key}`);
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
        const input = document.createElement('input');
        input.type = 'text';
        input.id = parentKey;
        input.value = data;
        container.appendChild(input);
    }
}

function saveJson() {
    const editorDiv = document.getElementById('editor');
    const newJsonData = collectFields(editorDiv);
    console.log('Saved JSON:', newJsonData);
    alert('JSON saved successfully!');
}

function collectFields(container) {
    const result = {};

    for (const fieldDiv of container.children) {
        const label = fieldDiv.querySelector('label');
        const input = fieldDiv.querySelector('input');

        if (label && input) {
            const keys = label.textContent.split('.').map(key => key.replace(/\[.*\]$/, ''));
            setValue(result, keys, input.value);
        } else {
            const nestedResult = collectFields(fieldDiv);
            if (Object.keys(nestedResult).length) {
                const key = fieldDiv.querySelector('label').textContent.split('.').pop();
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