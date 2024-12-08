const uploadSingleImage = (req, res, next) => {

    if (!req.file) {
        res.status(500).json({ errorMessage: 'Error cargando el archivo' })
        return
    }

    res.json({ cloudinary_url: req.file.path })
}

const uploadMultipleImage = (req, res, next) => {

    if (!req.files) {
        res.status(500).json({ errorMessage: 'Error cargando el archivo' })
        return
    }

    const pathArr = req.files.map(elm => {
        return elm.path
    })

    res.json({ cloudinary_url: pathArr })
}

const uploadTracks = (req, res, next) => {

    if (!req.files) {
        res.status(500).json({ errorMessage: 'Error cargando el archivo' })
        return
    }

    const pathArr = req.files.map(elm => {
        return elm.path
    })

    res.json({ cloudinary_url: pathArr })

}

module.exports = { uploadSingleImage, uploadMultipleImage, uploadTracks }