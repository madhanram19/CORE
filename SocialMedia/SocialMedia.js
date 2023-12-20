import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react'
import {
  CBreadcrumb,
  CBreadcrumbItem,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CLink,
} from '@coreui/react'
import siteSettingsImage from '../../../assets/images/avatars/siteSettingsImage.webp';
import { FaFacebook, FaWhatsapp, FaTelegram, FaInstagram } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import {
  useGetSiteSettingsURLMutation,
  useHandleSiteSettinsURLUpdateMutation,
} from '../../../redux/services/adminAPI'

const schema = yup.object().shape({
  faceBookUrl: yup
    .string()
    .required('Facebook URL Required!')
    .matches(
      /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i,
      'Please Enter Valid URL',
    ),
  whatsAppUrl: yup
    .string()
    .required('WhatsApp URL Required!')
    .matches(
      /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i,
      'Please Enter Valid URL',
    ),
  telegramUrl: yup
    .string()
    .required('Telegram URL Required!')
    .matches(
      /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i,
      'Please Enter Valid URL',
    ),
  instagramUrl: yup
    .string()
    .required('InstaGram URL Required!')
    .matches(
      /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i,
      'Please Enter Valid URL',
    ),
})

const SocialMedia = () => {
  const naviagte = useNavigate()
  // RTK
  const [updateURL] = useHandleSiteSettinsURLUpdateMutation()

  const [getSiteSettingsData] = useGetSiteSettingsURLMutation()

  // State

  const [siteSettingURL, setSiteSettingURL] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  useEffect(() => {
    const fetchSiteSetting = async () => {
      const response = await getSiteSettingsData()
      console.log(response)
      if (response.error) {
        return toast.error('URL Fetching Error', {
          position: toast.POSITION.TOP_CENTER,
        })
      }
      const URL = response.data.siteSettingsResponse
      if (!(URL === null)) {
        reset({
          faceBookUrl: URL.faceBookUrl,
          whatsAppUrl: URL.whatsAppUrl,
          telegramUrl: URL.telegramUrl,
          instagramUrl: URL.instagramUrl,
        })
        return
      }
    }
    fetchSiteSetting()
  }, [])

  const handelURLUpdate = async (siteURL) => {
    try {
      const response = await updateURL({ siteURL })
      if (response.error) {
        return toast.error('URL updated Error', {
          position: toast.POSITION.TOP_CENTER,
        })
        reset();
      }
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_CENTER,
      })


      setTimeout(()=>{
        naviagte('/dashBoard')
      },3000)
    
    } catch (error) {
      console.log(error.message)
    }
  }

 
  return (
    <CRow className="justify-content-center">
      <CCol xs={8} md={8} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>
              <strong >SITE_SETTINGS</strong>
          </CCardHeader>
          <CCardBody style={{backgroundColor:'black'}}>
          <CCol xs={4} md={8} lg={6}>
          <img src={siteSettingsImage} alt="Site Settings" style={{width: '100%', marginLeft:'170px', height: '50%' }} />
            </CCol>
            <form onSubmit={handleSubmit(handelURLUpdate)}>
              <div className="input-group mb-3" style={{ maxWidth: '500px', margin: 'auto' }}>
                <span className="input-group-text" id="basic-addon1">
                  <FaFacebook />
                </span>
                <input 
                style={{backgroundColor:'black', color:'wheat'}}
                  type="url"
                  name="faceBookUrl"
                  className={`form-control ${errors.faceBookUrl ? 'is-invalid' : ''}`}
                  {...register('faceBookUrl')}
                  placeholder="Facebook Url"
                />
                 <ToastContainer />
                <div className="invalid-feedback">{errors.faceBookUrl?.message}</div>
              </div>

              <div className="input-group mb-3" style={{ maxWidth: '500px', margin: 'auto' }}>
                <span className="input-group-text" id="basic-addon1">
                  <FaWhatsapp />
                </span>
                <input
                style={{backgroundColor:'black', color:'wheat'}}
                  type="url"
                  name="whatsAppUrl"
                  className={`form-control ${errors.whatsAppUrl ? 'is-invalid' : ''}`}
                  {...register('whatsAppUrl')}
                  placeholder="Whatsapp Url"
                />
                <div className="invalid-feedback">{errors.whatsAppUrl?.message}</div>
              </div>

              <div className="input-group mb-3" style={{ maxWidth: '500px', margin: 'auto' }}>
                <span className="input-group-text" id="basic-addon1">
                  <FaTelegram />
                </span>
                <input
                  type="url"
                  style={{backgroundColor:'black', color:'wheat'}}
                  name="telegramUrl"
                  className={`form-control ${errors.telegramUrl ? 'is-invalid' : ''}`}
                  {...register('telegramUrl')}
                  placeholder="Telegram Url"
                />
                <div className="invalid-feedback">{errors.telegramUrl?.message}</div>
              </div>

              <div className="input-group mb-3" style={{ maxWidth: '500px', margin: 'auto' }}>
                <span className="input-group-text" id="basic-addon1">
                  <FaInstagram />
                </span>
                <input
                  type="url"
                  style={{backgroundColor:'black', color:'wheat'}}
                  name="instagramUrl"
                  className={`form-control ${errors.instagramUrl ? 'is-invalid' : ''}`}
                  {...register('instagramUrl')}
                  placeholder="Instagram Url"
                />
                <div className="invalid-feedback">{errors.instagramUrl?.message}</div>
              </div>
              <div className="d-grid mt-3">
                <button className="btn btn-primary">Submit</button>
              </div>
             
            </form>
  
          
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}

export default SocialMedia;
