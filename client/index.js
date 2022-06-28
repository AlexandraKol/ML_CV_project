const imgUpload = document.querySelector('#image_uploads')
const preview = document.querySelector('.preview')
const resultInfo = document.querySelector('#result')

imgUpload.style.display = 'none'

imgUpload.addEventListener('change', updateImageDisplay)

//'post' prediction
async function onPredict() {
    const file =  imgUpload.files[0]
    let formData = new FormData()
    formData.append("file", file)
    try {
        const response = await fetch('http://127.0.0.1:8000/prediction/', {
            method: 'POST',
            body: formData
        })
        const result = await response.json()
        const info = document.createElement('h1')
        info.textContent = `Класс: ${result.likely_class}`
        while (resultInfo.firstChild)
            resultInfo.removeChild(resultInfo.firstChild)
        resultInfo.appendChild(info)
        console.log('Успех:', JSON.stringify(result))
    } catch (error) {
        console.error('Ошибка:', error)
    }
}

//'post' segmentation
async function onSegment() {
    const file =  imgUpload.files[0]

    let formData = new FormData()
    formData.append("file", file)
    try {
        const response = (await fetch('http://127.0.0.1:8000/segmintation/', {
            method: 'POST',
            body: formData
        }))
        while (resultInfo.firstChild)
            resultInfo.removeChild(resultInfo.firstChild)
        const image = document.createElement('img')
        image.src = URL.createObjectURL(file)
        image.classList.add("image")
        resultInfo.appendChild(image)

        const result = await response.blob()
        const imageObjectURL = URL.createObjectURL(result)
        const imageResult = document.createElement('img')
        imageResult.src = imageObjectURL
        imageResult.classList.add("image", "withOpacity")

        resultInfo.appendChild(imageResult)
    } catch (error) {
        console.error('Ошибка:', error)
    }
}

//Загружаем изображение
function updateImageDisplay() {
    while (preview.firstChild)
        preview.removeChild(preview.firstChild)

    const file = imgUpload.files[0]
    if (!file) {
        const info = document.createElement('p')
        info.textContent = 'Нет выбранного файла для отправки'
        preview.appendChild(info)
    } else {
        const info = document.createElement('p')

        if (isValidType(file)) {
            info.textContent = `Файл: ${file.name}`
            const image = document.createElement('img')
            image.src = URL.createObjectURL(file)
            preview.appendChild(info)
            preview.appendChild(image)
            document.querySelectorAll('button').forEach(button => button.disabled = false)
        } else {
            info.textContent = `Неподерживаемый тип файла`
            preview.appendChild(info)
        }
    }
}

const fileTypes = [
    'image/jpeg',
    'image/png',
]

function isValidType(file) {
    return fileTypes.includes(file.type)
}
