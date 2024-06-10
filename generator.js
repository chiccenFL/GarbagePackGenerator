const jsonData = {
    "BeforeAll": {
        "task1": "Setup environment",
        "task2": "Install dependencies"
    },
    "AfterAll": {
        "task1": "Cleanup environment",
        "task2": "Remove temporary files"
    },
    "GarbageCans": {
        "can1": "Recycle bin",
        "can2": "Trash bin",
        "can3": "Compost bin",
        "can4": "Glass bin",
        "can5": "Plastic bin",
        "can6": "Metal bin",
        "can7": "Paper bin",
        "can8": "E-waste bin",
        "can9": "Hazardous waste bin"
    }
};

function createEditor(jsonData) {
    const editorDiv = document.getElementById('editor');
    for (const category in jsonData) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category;
        categoryDiv.appendChild(categoryTitle);

        for (const key in jsonData[category]) {
            const fieldDiv = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = key;
            const textarea = document.createElement('textarea');
            textarea.id = `${category}_${key}`;
            textarea.value = jsonData[category][key];
            fieldDiv.appendChild(label);
            fieldDiv.appendChild(textarea);
            categoryDiv.appendChild(fieldDiv);
        }

        editorDiv.appendChild(categoryDiv);
    }
}

function saveJson() {
    const newJsonData = {};
    for (const category in jsonData) {
        newJsonData[category] = {};
        for (const key in jsonData[category]) {
            const textarea = document.getElementById(`${category}_${key}`);
            newJsonData[category][key] = textarea.value;
        }
    }
    console.log('Saved JSON:', newJsonData);
    alert('JSON saved successfully!');
}

createEditor(jsonData);