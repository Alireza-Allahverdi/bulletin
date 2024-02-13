import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { fetchApi } from '../../../api/FetchApi'
import AppBar from '../../../components/appBar/AppBar'
import InputComp from '../../../components/inputs/InputComp'
import { setPageLoader } from '../../../redux/loaders/loaderActions'
import Lottie from 'react-lottie-player'
import * as buttonLoader from "../../../assets/gifs/instead-btn-loader.json"
import { ClipLoader } from 'react-spinners'
import { Icon } from '@iconify/react'

function NewDoc({ loader, groupName, closeModal, onCreate }) {

  const UPLOAD_IMAGE = "user/img/s3"

  const dispatch = useDispatch()

  const ref = useRef()
  const [docTitle, setDocTitle] = useState("")
  const [callbackUrl, setCallbackUrl] = useState("")
  const [check, setCheck] = useState(false)
  const [uploadLoader, setUploadLoader] = useState(false)

  const uploadAndGetUrl = (e) => {
    setUploadLoader(true)
    let formData = new FormData()
    formData.append("file", e.target.files[0])
    fetchApi(UPLOAD_IMAGE, formData, true)
      .then((res) => {
        if (res.data.status_code === 200) {
          setUploadLoader("success")
          setCallbackUrl(res.data.link)
        }
        else if (res.data.status_code === 401) {
          setUploadLoader("fail")
          toast.error(res.data.description)
        }
        else if (res.data.status_code === 402) {
          setUploadLoader("fail")
          toast.error(res.data.description)
        }
      })
      .catch((err) => {
        setUploadLoader("fail")
        toast.error("Something went wrong")
        console.error(err)
      })
  }

  const validateAndAccept = () => {
    if (!docTitle || !callbackUrl) {
      setCheck(true)
      return
    }
    let data = {
      title: docTitle,
      docLink: callbackUrl
    }
    onCreate(data)
  }

  return (
    <div className="newDocComp">
      <AppBar innerText={"Documents"} onlyCall={closeModal} />
      <h2>{groupName}</h2>
      <p className='title'>Documents</p>
      <div className="docForm">
        <InputComp labelInnerText={"Name"} inputType={"text"} onChangeHandler={(e) => setDocTitle(e.target.value)} />
        {
          check && !docTitle ?
            <p className="error">you need to assing a name to yuor document</p>
            : ""
        }
        <div className="container">
          <label className="browseFiles">Browse</label>
          <p className="browseCont" onClick={() => ref.current.click()}>
            <div className="uploadedFile">
              <span>
                {callbackUrl.split("/")[callbackUrl.split("/").length - 1]}
              </span>
              {
                uploadLoader === true ?
                  <ClipLoader color="#0071BC" size={25} />
                  :
                  uploadLoader === "success" ?
                    <Icon icon="clarity:success-standard-line" color='green' />
                    :
                    uploadLoader === "fail" ?
                      <Icon icon="system-uicons:cross-circle" color='red' />
                      : null
              }
            </div>
            {
              check && !callbackUrl ?
                <p className="error">you need to upload your file</p>
                : ""
            }
          </p>
          <input type="file" ref={ref} onChange={uploadAndGetUrl} style={{ display: "none" }} />
        </div>
      </div>
      <div className="newDocActions">
        {loader ?
          <Lottie
            play
            loop
            animationData={buttonLoader}
            style={{ height: '100px', width: '100%' }}
          />
          :
          <>
            <button onClick={closeModal}>Cancel</button>
            <button onClick={validateAndAccept}>Send</button>
          </>
        }
      </div>
    </div>
  )
}

export default NewDoc