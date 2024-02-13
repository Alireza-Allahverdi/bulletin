import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ButtonComp from '../button/ButtonComp';


function ImageCropModal({ imageSrc, handleCroppedImage, modalCloser }) {


    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({
        x: 0,
        y: 0,
        unit: 'px', // Can be 'px' or '%'
        width: 250,
        height: 250
    });
    const [image, setImage] = useState(null);

    const selectImage = (file) => {
        setSrc(URL.createObjectURL(file));
    };

    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab], { type: mimeString });
        return blob;
    }

    function blobToFile(theBlob) {
        const randomNumber = Math.random()
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        return new File([theBlob], `${randomNumber}.jpg`, { lastModifiedDate: new Date().getTime(), type: theBlob.type });
    }

    const cropImageNow = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );

        // Converting to base64
        const base64Image = canvas.toDataURL('image/jpeg');
        let changeToBlob = dataURItoBlob(base64Image)
        let file = blobToFile(changeToBlob)
        handleCroppedImage(file)
        modalCloser()
    };

    const onImageLoad = (e) => {
        setImage(e.target)
    }

    useEffect(() => {
        selectImage(imageSrc)
    }, [])

    return (
        <div className="imageCropModal">
            {src && (
                <div className="imageCropContainer">
                    <ReactCrop
                        crop={crop}
                        onChange={c => setCrop(c)}
                        maxHeight={200}
                        locked>
                        <img src={src} onLoad={onImageLoad} alt={src} />
                    </ReactCrop>
                    <div className='imageCropActions'>
                        <ButtonComp innerText={"Done"} onClickHandler={cropImageNow} />
                        <ButtonComp innerText={"Cancel"} onClickHandler={modalCloser} cancel />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageCropModal