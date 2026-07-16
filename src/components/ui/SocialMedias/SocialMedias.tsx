import { CiInstagram } from 'react-icons/ci'
import { FaBehance } from 'react-icons/fa'
import './_socialMedias.scss'

export const SocialMedias = () => {
    return (
        <div className='socialMedias'>
            <a href="https://www.instagram.com/alukkart/" target='_blank' rel="noreferrer" aria-label="Instagram">
                <CiInstagram className='icon' />
            </a>
            <a href="https://www.behance.net/alukkart" target='_blank' rel="noreferrer" aria-label="Behance">
                <FaBehance className='icon' />
            </a>
        </div>
    )
}
