import './_processCard.scss'

interface Props {
  number: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  active?: boolean;
}

export const ProcessCard = ({ number, title, description, icon, active = false }: Props) => {
  return (
    <div className={`processCard${active ? ' is-active' : ''}`}>
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
