import './_processCard.scss'

interface Props {
  number: string;
  title: string;
  description: string;
  icon: React.ReactElement;
}

export const ProcessCard = ({ number, title, description, icon }: Props) => {
  return (
    <div className='processCard'>
      <div className='processCardHeader'>
        <div className='processIcon'>
          {icon}
        </div>
        <p>{number}</p>
      </div>
      <div className='processCardContent'>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}
