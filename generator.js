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
            arrayContainer.className = 'category indent';
            arrayContainer.style.marginLeft = `${indentLevel * 20}px`;

            const label = document.createElement('label');
            label.textContent = `${parentKey}[${index}]`;
            arrayContainer.appendChild(label);

            createFields(arrayContainer, item, `${parentKey}[${index}]`, indentLevel + 1);
            container.appendChild(arrayContainer);
        });
    } else if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'category indent';
            fieldDiv.style.marginLeft = `${indentLevel * 20}px`;

            const label = document.createElement('label');
            label.textContent = key;
            fieldDiv.appendChild(label);

            if (typeof data[key] === 'object' && data[key] !== null) {
                createFields(fieldDiv, data[key], `${parentKey ? `${parentKey}.` : ''}${key}`, indentLevel + 1);
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
        fieldDiv.className = 'field';
        fieldDiv.style.marginLeft = `${indentLevel * 20}px`;

        const label = document.createElement('label');
        label.textContent = parentKey;
        fieldDiv.appendChild(label);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = parentKey;
        input.value = data;
        fieldDiv.appendChild(input);

        container.appendChild(fieldDiv);
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
                const key = label.textContent.split('.').pop();
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