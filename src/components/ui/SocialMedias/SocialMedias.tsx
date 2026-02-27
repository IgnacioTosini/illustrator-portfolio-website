import { CiInstagram } from 'react-icons/ci'
import { FaBehance } from 'react-icons/fa'
import './_socialMedias.scss'

export const SocialMedias = () => {
    return (
        <div className='socialMedias'>
            <a href="https://www.instagram.com/alukkart/" target='_blank'>
            <CiInstagram className='icon' />
            </a>
            <FaBehance className='icon' />
        </div>
    )
}
